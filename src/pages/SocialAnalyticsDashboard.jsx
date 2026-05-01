import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { syncSocialAnalytics } from '@/functions/syncSocialAnalytics';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { RefreshCw, TrendingUp, Eye, MousePointer, Users, Zap, ShoppingCart } from 'lucide-react';
import { format, subDays } from 'date-fns';
import MetricCard from '../components/social/MetricCard';
import PlatformBadge from '../components/social/PlatformBadge';
import AIInsightsPanel from '../components/social/AIInsightsPanel';

const PLATFORM_COLORS = {
  tiktok: '#e2e8f0',
  instagram: '#f472b6',
  facebook: '#60a5fa',
  linkedin: '#38bdf8',
  organic: '#34d399',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs backdrop-blur-sm">
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function SocialAnalyticsDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [dateRange, setDateRange] = useState(7);

  useEffect(() => { loadData(); }, [dateRange]);

  const loadData = async () => {
    setLoading(true);
    const data = await base44.entities.SocialPerformance.list('-date', 200);
    setRecords(data);
    setLoading(false);
  };

  const handleSync = async () => {
    setSyncing(true);
    await syncSocialAnalytics({});
    await loadData();
    setSyncing(false);
  };

  // ── Aggregated totals ──────────────────────────────────────────────────
  const totals = useMemo(() => {
    const cutoff = format(subDays(new Date(), dateRange), 'yyyy-MM-dd');
    const filtered = records.filter(r => r.date >= cutoff);
    return filtered.reduce((acc, r) => ({
      reach:       acc.reach       + (r.reach || 0),
      impressions: acc.impressions + (r.impressions || 0),
      clicks:      acc.clicks      + (r.clicks || 0),
      engagement:  acc.engagement  + (r.engagement || 0),
      conversions: acc.conversions + (r.conversions || 0),
      spend:       acc.spend       + (r.spend || 0),
    }), { reach: 0, impressions: 0, clicks: 0, engagement: 0, conversions: 0, spend: 0 });
  }, [records, dateRange]);

  // ── Daily trend (all platforms combined) ──────────────────────────────
  const trendData = useMemo(() => {
    const cutoff = format(subDays(new Date(), dateRange), 'yyyy-MM-dd');
    const byDay = {};
    records.filter(r => r.date >= cutoff).forEach(r => {
      if (!byDay[r.date]) byDay[r.date] = { date: r.date, reach: 0, engagement: 0, conversions: 0, clicks: 0 };
      byDay[r.date].reach       += r.reach || 0;
      byDay[r.date].engagement  += r.engagement || 0;
      byDay[r.date].conversions += r.conversions || 0;
      byDay[r.date].clicks      += r.clicks || 0;
    });
    return Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date))
      .map(d => ({ ...d, date: format(new Date(d.date + 'T00:00:00'), 'MMM d') }));
  }, [records, dateRange]);

  // ── Platform breakdown ─────────────────────────────────────────────────
  const platformBreakdown = useMemo(() => {
    const cutoff = format(subDays(new Date(), dateRange), 'yyyy-MM-dd');
    const byPlatform = {};
    records.filter(r => r.date >= cutoff).forEach(r => {
      if (!byPlatform[r.platform]) byPlatform[r.platform] = { platform: r.platform, reach: 0, engagement: 0, conversions: 0, clicks: 0, spend: 0 };
      byPlatform[r.platform].reach       += r.reach || 0;
      byPlatform[r.platform].engagement  += r.engagement || 0;
      byPlatform[r.platform].conversions += r.conversions || 0;
      byPlatform[r.platform].clicks      += r.clicks || 0;
      byPlatform[r.platform].spend       += r.spend || 0;
    });
    return Object.values(byPlatform);
  }, [records, dateRange]);

  const engagementRate = totals.reach > 0 ? ((totals.engagement / totals.reach) * 100).toFixed(1) : '0.0';
  const ctr = totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen p-6 space-y-6" style={{
      background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 40%, #24243e 100%)'
    }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Social Analytics</h1>
          <p className="text-white/40 text-sm mt-0.5">Campaign performance across connected platforms</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Date range selector */}
          <div className="flex rounded-xl border border-white/10 overflow-hidden text-xs">
            {[7, 14, 30].map(d => (
              <button
                key={d}
                onClick={() => setDateRange(d)}
                className={`px-3 py-1.5 font-medium transition-colors ${dateRange === d ? 'bg-violet-600 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
              >
                {d}d
              </button>
            ))}
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-white/70 hover:text-white text-sm font-medium transition-all disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard label="Reach"        value={totals.reach.toLocaleString()}        icon={Eye}          color="violet" sub={`last ${dateRange}d`} />
        <MetricCard label="Impressions"  value={totals.impressions.toLocaleString()}  icon={TrendingUp}   color="blue"   sub={`last ${dateRange}d`} />
        <MetricCard label="Clicks"       value={totals.clicks.toLocaleString()}       icon={MousePointer} color="amber"  sub={`CTR ${ctr}%`} />
        <MetricCard label="Engagements"  value={totals.engagement.toLocaleString()}   icon={Zap}          color="rose"   sub={`Rate ${engagementRate}%`} />
        <MetricCard label="Conversions"  value={totals.conversions.toLocaleString()}  icon={ShoppingCart} color="emerald" sub={`last ${dateRange}d`} />
        <MetricCard label="Ad Spend"     value={`$${totals.spend.toLocaleString()}`}  icon={Users}        color="violet" sub={`last ${dateRange}d`} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Trend line chart */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
          <h2 className="text-white/80 font-semibold text-sm mb-4">Performance Trend</h2>
          {loading ? (
            <div className="h-56 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : trendData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-white/30 text-sm">No data — click Sync to pull latest metrics</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }} />
                <Line type="monotone" dataKey="reach"       stroke="#a78bfa" strokeWidth={2} dot={false} name="Reach" />
                <Line type="monotone" dataKey="engagement"  stroke="#f472b6" strokeWidth={2} dot={false} name="Engagement" />
                <Line type="monotone" dataKey="clicks"      stroke="#fbbf24" strokeWidth={2} dot={false} name="Clicks" />
                <Line type="monotone" dataKey="conversions" stroke="#34d399" strokeWidth={2} dot={false} name="Conversions" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Platform pie */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
          <h2 className="text-white/80 font-semibold text-sm mb-4">Reach by Platform</h2>
          {platformBreakdown.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-white/30 text-sm text-center px-4">No platform data yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={platformBreakdown} dataKey="reach" nameKey="platform" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                    {platformBreakdown.map((entry) => (
                      <Cell key={entry.platform} fill={PLATFORM_COLORS[entry.platform] || '#a78bfa'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {platformBreakdown.map(p => (
                  <div key={p.platform} className="flex items-center justify-between">
                    <PlatformBadge platform={p.platform} />
                    <span className="text-white/60 text-xs">{p.reach.toLocaleString()} reach</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Platform bar chart */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
        <h2 className="text-white/80 font-semibold text-sm mb-4">Engagement & Conversions by Platform</h2>
        {platformBreakdown.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-white/30 text-sm">No platform data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={platformBreakdown} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="platform" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }} />
              <Bar dataKey="engagement"  name="Engagement"  fill="#f472b6" radius={[4,4,0,0]} />
              <Bar dataKey="conversions" name="Conversions" fill="#34d399" radius={[4,4,0,0]} />
              <Bar dataKey="clicks"      name="Clicks"      fill="#fbbf24" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* AI Insights */}
      <AIInsightsPanel metrics={totals} platformBreakdown={platformBreakdown} />
    </div>
  );
}