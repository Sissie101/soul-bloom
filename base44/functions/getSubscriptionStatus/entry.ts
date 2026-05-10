import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Search for customer by email
    // 14-day free trial from account creation date
    const createdDate = new Date(user.created_date || Date.now());
    const trialDays = 14;
    const trialEnds = new Date(createdDate.getTime() + trialDays * 24 * 60 * 60 * 1000);
    if (new Date() < trialEnds) {
      const daysLeft = Math.ceil((trialEnds - new Date()) / (1000 * 60 * 60 * 24));
      return Response.json({ subscribed: true, plan: 'trial', trial: true, trial_days_left: daysLeft });
    }

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (!customers.data.length) {
      return Response.json({ subscribed: false, plan: null });
    }

    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });

    if (!subscriptions.data.length) {
      return Response.json({ subscribed: false, plan: null });
    }

    const sub = subscriptions.data[0];
    const interval = sub.items.data[0]?.plan?.interval;

    return Response.json({
      subscribed: true,
      plan: interval === 'year' ? 'annual' : 'monthly',
      status: sub.status,
      current_period_end: sub.current_period_end,
      subscription_id: sub.id,
    });
  } catch (error) {
    console.error('Subscription status error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});