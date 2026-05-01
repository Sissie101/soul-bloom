import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createCheckoutSession } from "@/functions/createCheckoutSession";
import { getSubscriptionStatus } from "@/functions/getSubscriptionStatus";
import { createPortalSession } from "@/functions/createPortalSession";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Crown } from "lucide-react";

const PRICES = {
  monthly: "price_1TS68pA9AtqAl2HtkuhfkiGC",
  annual: "price_1TS68pA9AtqAl2HtY6SlkjNP",
};

const FEATURES = [
  "Campaign Strategist AI (unlimited sessions)",
  "Premium Social Analytics Dashboard",
  "TikTok & Multi-platform Sync",
  "AI-Powered Insights & Recommendations",
  "Newsletter & Content Generator",
  "Predictive Analytics",
  "Sentiment Analysis",
  "Priority Support",
];

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setStatusLoading(true);
    const res = await getSubscriptionStatus({});
    setSubscription(res.data);
    setStatusLoading(false);
  };

  const handleSubscribe = async () => {
    // Block if running in iframe (editor preview)
    if (window.self !== window.top) {
      alert("Checkout only works from the published app, not the editor preview.");
      return;
    }

    setLoading(true);
    const res = await createCheckoutSession({ price_id: PRICES[billing] });
    if (res.data?.url) {
      window.location.href = res.data.url;
    }
    setLoading(false);
  };

  const handleManageBilling = async () => {
    if (window.self !== window.top) {
      alert("Billing portal only works from the published app.");
      return;
    }
    setLoading(true);
    const res = await createPortalSession({});
    if (res.data?.url) window.location.href = res.data.url;
    setLoading(false);
  };

  const isSubscribed = subscription?.subscribed;
  const annualSavings = Math.round((2900 * 12 - 24900) / 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950 flex flex-col items-center justify-center px-4 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-400/30 rounded-full px-4 py-1.5 text-violet-300 text-sm font-medium mb-4">
          <Crown className="w-4 h-4" /> Oracle Sanctuary Pro
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Unlock Your Full Potential
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">
          Gain access to the Campaign Strategist AI, premium analytics, and every advanced tool in Oracle Sanctuary.
        </p>
      </div>

      {/* Active subscription banner */}
      {!statusLoading && isSubscribed && (
        <div className="mb-8 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl px-6 py-4 text-center max-w-md w-full">
          <p className="text-emerald-300 font-semibold text-lg">✓ You're on the Pro plan ({subscription.plan})</p>
          <p className="text-emerald-200/70 text-sm mt-1">
            Renews {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
          </p>
          <Button
            onClick={handleManageBilling}
            disabled={loading}
            className="mt-4 bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            Manage Billing
          </Button>
        </div>
      )}

      {/* Billing Toggle */}
      {!isSubscribed && (
        <>
          <div className="flex items-center gap-3 mb-8 bg-white/5 border border-white/10 rounded-full p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                billing === "monthly"
                  ? "bg-violet-600 text-white shadow-lg"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                billing === "annual"
                  ? "bg-violet-600 text-white shadow-lg"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Annual
              <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save ${annualSavings}
              </span>
            </button>
          </div>

          {/* Pricing Card */}
          <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-bold text-white">
                {billing === "monthly" ? "$29" : "$249"}
              </span>
              <span className="text-white/50 mb-2">
                / {billing === "monthly" ? "month" : "year"}
              </span>
            </div>
            {billing === "annual" && (
              <p className="text-emerald-400 text-sm mb-4">
                That's just $20.75/month — save ${annualSavings} vs monthly
              </p>
            )}

            <ul className="space-y-3 mb-8 mt-6">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-white/80 text-sm">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              onClick={handleSubscribe}
              disabled={loading || statusLoading}
              className="w-full py-6 text-base font-semibold rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-violet-900/50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Get Pro — {billing === "monthly" ? "$29/mo" : "$249/yr"}
                </span>
              )}
            </Button>

            <p className="text-white/30 text-xs text-center mt-4">
              Cancel anytime. Billed securely via Stripe.
            </p>
          </div>
        </>
      )}
    </div>
  );
}