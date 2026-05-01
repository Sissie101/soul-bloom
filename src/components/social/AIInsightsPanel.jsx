import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Sparkles, Loader2, Bot, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AIInsightsPanel({ metrics, platformBreakdown }) {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    setInsights('');
    const summary = `
Social Media Performance Summary (last 7 days):
- Total Reach: ${metrics.reach.toLocaleString()}
- Total Impressions: ${metrics.impressions.toLocaleString()}
- Total Clicks: ${metrics.clicks.toLocaleString()}
- Total Engagements: ${metrics.engagement.toLocaleString()}
- Total Conversions: ${metrics.conversions.toLocaleString()}
- Total Ad Spend: $${metrics.spend.toFixed(2)}
- Engagement Rate: ${metrics.reach > 0 ? ((metrics.engagement / metrics.reach) * 100).toFixed(2) : 0}%
- Click-Through Rate: ${metrics.impressions > 0 ? ((metrics.clicks / metrics.impressions) * 100).toFixed(2) : 0}%
- Conversion Rate: ${metrics.clicks > 0 ? ((metrics.conversions / metrics.clicks) * 100).toFixed(2) : 0}%

Platform Breakdown:
${platformBreakdown.map(p => `- ${p.platform}: Reach ${p.reach.toLocaleString()}, Engagement ${p.engagement.toLocaleString()}, Conversions ${p.conversions}`).join('\n')}
    `.trim();

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a Campaign Strategist AI for a spiritual wellness brand called Soul Bloom. Based on the following social media performance data, provide 3–5 specific, actionable optimization suggestions for the next campaign cycle. Focus on platform-specific tactics, content adjustments, and audience targeting improvements. Be direct and data-driven.\n\n${summary}`,
      model: 'claude_sonnet_4_6'
    });
    setInsights(result);
    setLoading(false);
  };

  return (
    <div className="rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-indigo-500/5 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Campaign Strategist AI</h3>
            <p className="text-white/40 text-[10px]">Data-driven optimization suggestions</p>
          </div>
        </div>
        <button
          onClick={generateInsights}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/80 hover:bg-violet-500/80 text-white text-xs font-medium transition-all disabled:opacity-50 border border-violet-400/30"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          {loading ? 'Analyzing...' : insights ? 'Re-analyze' : 'Analyze & Suggest'}
        </button>
      </div>

      {!insights && !loading && (
        <div className="text-center py-8 text-white/30 text-sm">
          <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-40" />
          Click "Analyze & Suggest" to get AI-powered recommendations based on your current performance data.
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 py-6 px-2">
          <Loader2 className="w-4 h-4 animate-spin text-violet-400 shrink-0" />
          <p className="text-white/50 text-sm">The oracle is analyzing your campaign data...</p>
        </div>
      )}

      {insights && !loading && (
        <ReactMarkdown
          className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 text-white/80"
          components={{
            p: ({ children }) => <p className="my-1.5 leading-relaxed text-white/80 text-sm">{children}</p>,
            ul: ({ children }) => <ul className="my-1.5 ml-4 list-disc text-white/70 text-sm">{children}</ul>,
            ol: ({ children }) => <ol className="my-1.5 ml-4 list-decimal text-white/70 text-sm">{children}</ol>,
            li: ({ children }) => <li className="my-1">{children}</li>,
            strong: ({ children }) => <strong className="text-violet-300 font-semibold">{children}</strong>,
            h3: ({ children }) => <h3 className="text-white font-semibold text-sm mt-3 mb-1">{children}</h3>,
          }}
        >
          {insights}
        </ReactMarkdown>
      )}
    </div>
  );
}