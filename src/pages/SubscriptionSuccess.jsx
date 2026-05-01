import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CheckCircle2, Sparkles, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function SubscriptionSuccess() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          window.location.href = createPageUrl("AgentStudio");
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950 flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-emerald-500/20 border border-emerald-400/30 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-3">You're In! 🌸</h1>
        <p className="text-white/60 text-lg max-w-md mb-8">
          Welcome to Oracle Sanctuary Pro. Your Campaign Strategist AI and premium analytics are now unlocked.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to={createPageUrl("AgentStudio")}>
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-5 rounded-2xl font-semibold">
              <Bot className="w-4 h-4 mr-2" /> Open Agent Studio
            </Button>
          </Link>
          <Link to="/SocialAnalyticsDashboard">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-6 py-5 rounded-2xl">
              <Sparkles className="w-4 h-4 mr-2" /> View Analytics
            </Button>
          </Link>
        </div>

        <p className="text-white/30 text-sm mt-8">
          Redirecting to Agent Studio in {countdown}s...
        </p>
      </motion.div>
    </div>
  );
}