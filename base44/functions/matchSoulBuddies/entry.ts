import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Admin-only
  const user = await base44.auth.me();
  if (user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const asAdmin = base44.asServiceRole;

  // 1. Fetch all users, journal entries, and existing soul buddy pairs
  const [allUsers, allEntries, existingBuddies, existingOptIns] = await Promise.all([
    asAdmin.entities.User.list(),
    asAdmin.entities.JournalEntry.list('-created_date', 500),
    asAdmin.entities.SoulBuddy.list(),
    asAdmin.entities.BuddyOptIn.list(),
  ]);

  // Only match users who have opted in
  const optedInEmails = new Set(existingOptIns.map(o => o.created_by));

  // Users already paired
  const pairedEmails = new Set();
  existingBuddies.forEach(b => {
    pairedEmails.add(b.created_by);
    pairedEmails.add(b.buddy_user_email);
  });

  // Eligible users: opted in and not yet paired
  const eligible = allUsers.filter(u =>
    optedInEmails.has(u.email) && !pairedEmails.has(u.email)
  );

  if (eligible.length < 2) {
    return Response.json({ message: 'Not enough eligible users to match', matched: 0 });
  }

  // 2. Build mood & theme profile per user
  const profiles = eligible.map(u => {
    const userEntries = allEntries.filter(e => e.created_by === u.email);
    const moodCounts = {};
    const reflections = [];
    userEntries.forEach(e => {
      if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
      if (e.written_reflection) reflections.push(e.written_reflection.substring(0, 200));
    });
    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'searching';
    return {
      email: u.email,
      name: u.full_name || u.email.split('@')[0],
      dominantMood,
      reflectionSample: reflections.slice(0, 3).join(' | '),
      entryCount: userEntries.length,
    };
  });

  // 3. Use AI to generate matches with reasons
  const profileSummaries = profiles.map(p =>
    `User: ${p.email} | Name: ${p.name} | Dominant mood: ${p.dominantMood} | Entries: ${p.entryCount} | Sample: "${p.reflectionSample.substring(0, 150)}"`
  ).join('\n');

  let aiMatches = [];
  try {
    const aiResult = await asAdmin.integrations.Core.InvokeLLM({
      prompt: `You are a spiritual matchmaker for a soul journaling app called Sacred Seeds. 
Your task is to pair users into "Soul Buddy" partnerships based on their mood trends and journal themes.

Here are the eligible users:
${profileSummaries}

Create the best possible pairs. Each user can only be in one pair. 
Return JSON with an array of pairs. For each pair include:
- user1_email
- user2_email  
- match_reason (1-2 warm, spiritual sentences explaining why they're a good match)

Only pair users who complement each other (e.g., someone "searching" with someone "radiant" who can inspire, or two "grateful" souls to amplify each other).`,
      response_json_schema: {
        type: 'object',
        properties: {
          pairs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                user1_email: { type: 'string' },
                user2_email: { type: 'string' },
                match_reason: { type: 'string' },
              }
            }
          }
        }
      }
    });
    aiMatches = aiResult?.pairs || [];
  } catch (err) {
    console.error('AI matching error:', err);
    // Fallback: simple sequential pairing
    for (let i = 0; i < profiles.length - 1; i += 2) {
      aiMatches.push({
        user1_email: profiles[i].email,
        user2_email: profiles[i + 1].email,
        match_reason: 'Two souls on a sacred journey, ready to support each other.',
      });
    }
  }

  // 4. Create SoulBuddy records + notifications for each pair
  const matchedCount = { count: 0 };
  const today = new Date().toISOString().split('T')[0];

  for (const pair of aiMatches) {
    const { user1_email, user2_email, match_reason } = pair;

    // Validate both users are actually in our eligible list
    const u1 = profiles.find(p => p.email === user1_email);
    const u2 = profiles.find(p => p.email === user2_email);
    if (!u1 || !u2) continue;

    // Create SoulBuddy record (created_by = user1, buddy = user2)
    let buddyRecord;
    try {
      buddyRecord = await asAdmin.entities.SoulBuddy.create({
        buddy_user_email: user2_email,
        connection_date: today,
        connection_strength: 'budding',
      });
    } catch (err) {
      console.error('SoulBuddy create error:', err);
      continue;
    }

    // Create notifications for both users
    await Promise.all([
      asAdmin.entities.SoulBuddyNotification.create({
        recipient_email: user1_email,
        matched_with_email: user2_email,
        matched_with_name: u2.name,
        match_reason,
        is_read: false,
        soul_buddy_id: buddyRecord.id,
      }),
      asAdmin.entities.SoulBuddyNotification.create({
        recipient_email: user2_email,
        matched_with_email: user1_email,
        matched_with_name: u1.name,
        match_reason,
        is_read: false,
        soul_buddy_id: buddyRecord.id,
      }),
    ]);

    matchedCount.count++;
    console.log(`Matched: ${user1_email} <-> ${user2_email}`);
  }

  return Response.json({
    message: `Successfully matched ${matchedCount.count} Soul Buddy pairs`,
    matched: matchedCount.count,
  });
});