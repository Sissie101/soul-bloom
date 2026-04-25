import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Heart } from 'lucide-react';
import { format, subDays, parseISO, startOfDay } from 'date-fns';

const MOOD_ORDER = ['searching', 'flowing', 'peaceful', 'grateful', 'transforming', 'radiant'];
const MOOD_SCORE = { searching: 1, flowing: 2, peaceful: 3, grateful: 4, transforming: 5, radiant: 6 };
const MOOD_COLORS = {
  radiant: '#D4AF37',
  peaceful: '#9CAF88',
  searching: '#a78bfa',
  flowing: '#60a5fa',
  grateful: '#f97316',
  transforming: '#ec4899',
};

const CustomMoodTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const score = payload[0]?.value;
  const moodName = MOOD_ORDER[score - 1] || '';
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-2 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-purple-600 capitalize">Mood: <span className="font-bold">{moodName}</span></p>
    </div>
  );
};

const CustomHeartsTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-2 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-amber-500">❤️ Hearts: <span className="font-bold">{payload[0]?.value}</span></p>
    </div>
  );
};

export default function DashboardCharts({ entries }) {
  const last30Days = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: 30 }, (_, i) => {
      const date = subDays(today, 29 - i);
      return { date, label: format(date, 'MMM d'), dateStr: format(date, 'yyyy-MM-dd') };
    });
  }, []);

  const moodData = useMemo(() => {
    return last30Days.map(({ label, dateStr }) => {
      const entry = entries.find(e => {
        const d = format(parseISO(e.created_date), 'yyyy-MM-dd');
        return d === dateStr;
      });
      return {
        date: label,
        moodScore: entry?.mood ? MOOD_SCORE[entry.mood] : null,
        mood: entry?.mood || null,
      };
    }).filter(d => d.moodScore !== null);
  }, [entries, last30Days]);

  const heartsData = useMemo(() => {
    // Group by week for readability
    const weeks = [];
    for (let i = 0; i < 30; i += 7) {
      const weekEntries = entries.filter(e => {
        try {
          const d = parseISO(e.created_date);
          const daysAgo = Math.floor((Date.now() - d.getTime()) / 86400000);
          return daysAgo >= i && daysAgo < i + 7;
        } catch { return false; }
      });
      const totalHearts = weekEntries.reduce((sum, e) => sum + (e.hearts_received || 0), 0);
      const label = i === 0 ? 'This week'
        : i === 7 ? '2 wks ago'
        : i === 14 ? '3 wks ago'
        : '4 wks ago';
      weeks.unshift({ week: label, hearts: totalHearts });
    }
    return weeks;
  }, [entries]);

  const moodCounts = useMemo(() => {
    const counts = {};
    entries.forEach(e => {
      if (e.mood) counts[e.mood] = (counts[e.mood] || 0) + 1;
    });
    return MOOD_ORDER.filter(m => counts[m]).map(m => ({ mood: m, count: counts[m], color: MOOD_COLORS[m] }));
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
      {/* Mood Trend Chart */}
      <Card className="bg-gradient-to-br from-white/90 to-violet-50/40 border-violet-200/30 sacred-glow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-gray-800 text-base font-semibold">
            <TrendingUp className="w-4 h-4 text-violet-500" />
            Mood Trend — Last 30 Days
          </CardTitle>
          <p className="text-xs text-gray-500">Your spiritual mood journey over time</p>
        </CardHeader>
        <CardContent>
          {moodData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={moodData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} interval="preserveStartEnd" />
                  <YAxis
                    domain={[1, 6]}
                    ticks={[1, 2, 3, 4, 5, 6]}
                    tickFormatter={(v) => MOOD_ORDER[v - 1]?.slice(0, 4) || ''}
                    tick={{ fontSize: 9, fill: '#9ca3af' }}
                  />
                  <Tooltip content={<CustomMoodTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="moodScore"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
              {/* Mood legend */}
              <div className="flex flex-wrap gap-2 mt-3">
                {moodCounts.map(({ mood, count, color }) => (
                  <span key={mood} className="flex items-center gap-1 text-xs bg-white/70 px-2 py-1 rounded-full border border-gray-100">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />
                    <span className="capitalize text-gray-600">{mood}</span>
                    <span className="font-semibold text-gray-800">{count}</span>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400 text-center py-12">No mood data yet — start journaling!</p>
          )}
        </CardContent>
      </Card>

      {/* Hearts Chart */}
      <Card className="bg-gradient-to-br from-white/90 to-rose-50/40 border-rose-200/30 sacred-glow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-gray-800 text-base font-semibold">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-300" />
            Gratitude Hearts — Weekly
          </CardTitle>
          <p className="text-xs text-gray-500">Hearts received from the community each week</p>
        </CardHeader>
        <CardContent>
          {heartsData.some(d => d.hearts > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={heartsData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} />
                <Tooltip content={<CustomHeartsTooltip />} />
                <Bar dataKey="hearts" fill="#fbbf24" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Heart className="w-8 h-8 text-rose-200 mb-2" />
              <p className="text-sm text-gray-400">No hearts received yet.</p>
              <p className="text-xs text-gray-400 mt-1">Share a Blessing Thread to start receiving hearts!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}