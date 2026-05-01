import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const results = { synced: [], errors: [] };

  // ── TikTok ──────────────────────────────────────────────────────────────
  try {
    const CONNECTOR_ID = '69f023e273564d9b3cfba1f5';
    const { accessToken } = await base44.asServiceRole.connectors.getCurrentAppUserConnection(CONNECTOR_ID);

    // Fetch advertiser list first
    const advRes = await fetch(
      'https://business-api.tiktok.com/open_api/v1.3/oauth2/advertiser/get/',
      { headers: { 'Access-Token': accessToken } }
    );
    const advData = await advRes.json();
    const advertiserId = advData?.data?.list?.[0]?.advertiser_id;

    if (advertiserId) {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 864e5).toISOString().split('T')[0];

      const insightRes = await fetch(
        `https://business-api.tiktok.com/open_api/v1.3/report/integrated/get/?advertiser_id=${advertiserId}&report_type=BASIC&dimensions=["stat_time_day"]&metrics=["reach","impressions","clicks","conversion","spend"]&start_date=${startDate}&end_date=${endDate}&page_size=7`,
        { headers: { 'Access-Token': accessToken } }
      );
      const insightData = await insightRes.json();
      const rows = insightData?.data?.list || [];

      for (const row of rows) {
        const date = row.dimensions?.stat_time_day?.split(' ')[0];
        const m = row.metrics || {};
        await base44.asServiceRole.entities.SocialPerformance.create({
          platform: 'tiktok',
          date,
          reach: Number(m.reach || 0),
          impressions: Number(m.impressions || 0),
          clicks: Number(m.clicks || 0),
          conversions: Number(m.conversion || 0),
          spend: Number(m.spend || 0),
          engagement: Number((m.likes || 0)) + Number((m.comments || 0)) + Number((m.shares || 0))
        });
        results.synced.push(`tiktok:${date}`);
      }
    }
  } catch (err) {
    results.errors.push({ platform: 'tiktok', error: err.message });
  }

  return Response.json(results);
});