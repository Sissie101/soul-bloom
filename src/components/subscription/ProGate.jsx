import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSubscriptionStatus } from "@/functions/getSubscriptionStatus";
import { Crown, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Wrap any premium feature with <ProGate>.
 * Shows children if subscribed, otherwise shows an upgrade prompt.
 */
export default function ProGate({ children, featureName = "this feature" }) {
  const [status, setStatus] = useState(null); // null = loading
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getSubscriptionStatus({}).then((res) => {
      setStatus(res.data);
      setChecked(true);
    });
  }, []);

  if (!checked) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (status?.subscribed) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
      style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1a1040 40%, #24243e 100%)" }}>
      <div className="w-16 h-16 bg-violet-500/20 border border-violet-400/30 rounded-full flex items-center justify-center mb-5">
        <Lock className="w-8 h-8 text-violet-400" />
      </div>
      <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-400/30 rounded-full px-3 py-1 text-violet-300 text-xs font-medium mb-4">
        <Crown className="w-3 h-3" /> Pro Feature
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Unlock {featureName}</h2>
      <p className="text-white/50 text-sm max-w-sm mb-6">
        Subscribe to Oracle Sanctuary Pro to access the Campaign Strategist AI, premium analytics, and all advanced tools.
      </p>
      <Link to="/Pricing">
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-5 rounded-2xl font-semibold">
          <Sparkles className="w-4 h-4 mr-2" /> View Plans
        </Button>
      </Link>
    </div>
  );
}