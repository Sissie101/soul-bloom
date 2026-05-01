import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MetricCard({ label, value, sub, trend, icon: Icon, color = 'violet' }) {
  const colorMap = {
    violet: 'from-violet-500/20 to-indigo-500/10 border-violet-400/20',
    rose:   'from-rose-500/20 to-pink-500/10 border-rose-400/20',
    emerald:'from-emerald-500/20 to-teal-500/10 border-emerald-400/20',
    amber:  'from-amber-500/20 to-yellow-500/10 border-amber-400/20',
    blue:   'from-blue-500/20 to-cyan-500/10 border-blue-400/20',
  };
  const iconColorMap = {
    violet: 'text-violet-300', rose: 'text-rose-300',
    emerald: 'text-emerald-300', amber: 'text-amber-300', blue: 'text-blue-300',
  };

  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-rose-400' : 'text-white/30';

  return (
    <div className={cn(
      'rounded-2xl border bg-gradient-to-br p-5 flex flex-col gap-3 backdrop-blur-sm',
      colorMap[color]
    )}>
      <div className="flex items-center justify-between">
        <span className="text-white/50 text-xs font-medium uppercase tracking-wider">{label}</span>
        {Icon && <Icon className={cn('w-4 h-4', iconColorMap[color])} />}
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="flex items-center gap-2">
        {trend !== undefined && (
          <span className={cn('flex items-center gap-0.5 text-xs font-semibold', trendColor)}>
            <TrendIcon className="w-3 h-3" />
            {Math.abs(trend)}%
          </span>
        )}
        {sub && <span className="text-white/30 text-xs">{sub}</span>}
      </div>
    </div>
  );
}