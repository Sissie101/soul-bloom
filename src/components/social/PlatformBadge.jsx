import React from 'react';
import { cn } from '@/lib/utils';

const platformConfig = {
  tiktok:    { label: 'TikTok',    color: 'bg-black/40 border-white/20 text-white', dot: 'bg-white' },
  instagram: { label: 'Instagram', color: 'bg-pink-500/20 border-pink-400/30 text-pink-300', dot: 'bg-pink-400' },
  facebook:  { label: 'Facebook',  color: 'bg-blue-500/20 border-blue-400/30 text-blue-300', dot: 'bg-blue-400' },
  linkedin:  { label: 'LinkedIn',  color: 'bg-sky-500/20 border-sky-400/30 text-sky-300', dot: 'bg-sky-400' },
  organic:   { label: 'Organic',   color: 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300', dot: 'bg-emerald-400' },
};

export default function PlatformBadge({ platform, size = 'sm' }) {
  const cfg = platformConfig[platform] || platformConfig.organic;
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
      cfg.color
    )}>
      <span className={cn('rounded-full shrink-0', size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2', cfg.dot)} />
      {cfg.label}
    </span>
  );
}