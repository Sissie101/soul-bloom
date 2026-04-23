import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Target, BarChart2, Users, Megaphone, RefreshCw } from 'lucide-react';

const TEMPLATES = [
  {
    category: 'Strategy',
    icon: Target,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    badge: 'bg-indigo-100 text-indigo-700',
    items: [
      {
        title: 'Full Campaign Brief',
        prompt: 'Create a comprehensive campaign strategy brief for Soul Bloom, including target audience, key messaging pillars, channel mix, budget allocation recommendations, and success KPIs for the next 90 days.',
      },
      {
        title: 'Competitor Analysis',
        prompt: 'Analyze the competitive landscape for spiritual wellness and journaling apps. Identify our top 3 competitors, their positioning, weaknesses we can exploit, and differentiation opportunities for Soul Bloom.',
      },
    ],
  },
  {
    category: 'Audience',
    icon: Users,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    badge: 'bg-violet-100 text-violet-700',
    items: [
      {
        title: 'Audience Persona Deep Dive',
        prompt: 'Build a detailed persona for our ideal Soul Bloom user — include demographics, psychographics, spiritual journey stage, pain points, motivations, preferred content formats, and where they spend time online.',
      },
      {
        title: 'Resonance Ring Segmentation',
        prompt: 'Suggest 3–4 distinct audience segments (resonance rings) for our LinkedIn campaigns, with targeting criteria, messaging angles, and the most compelling value propositions for each group.',
      },
    ],
  },
  {
    category: 'Creative',
    icon: Sparkles,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-700',
    items: [
      {
        title: 'Ad Copy Variants',
        prompt: 'Write 5 compelling LinkedIn ad copy variants for Soul Bloom\'s Sacred Seeds 30-day journey. Each should have a unique hook, address a different emotional pain point, and include a clear call to action. Keep each under 150 words.',
      },
      {
        title: 'A/B Test Hypotheses',
        prompt: 'Generate 4 structured A/B test hypotheses for our current campaign creatives, each with: what we\'re testing, our hypothesis, expected outcome, and how we\'ll measure success.',
      },
    ],
  },
  {
    category: 'Analytics',
    icon: BarChart2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-700',
    items: [
      {
        title: 'Performance Review',
        prompt: 'Review our current campaign performance data and provide a structured analysis: what\'s working well, what\'s underperforming, root cause hypotheses, and 3 concrete optimization actions to take this week.',
      },
      {
        title: 'Funnel Drop-off Diagnosis',
        prompt: 'Diagnose our conversion funnel and identify the biggest drop-off points. For each leak, suggest a specific creative or messaging fix and estimate the potential uplift if resolved.',
      },
    ],
  },
  {
    category: 'Launch',
    icon: Megaphone,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    badge: 'bg-rose-100 text-rose-700',
    items: [
      {
        title: 'Launch Checklist',
        prompt: 'Generate a pre-launch campaign checklist for our next Soul Bloom campaign, covering creative approvals, targeting setup, tracking pixels, UTM parameters, budget pacing, and stakeholder sign-offs.',
      },
      {
        title: 'Post-Launch Report Template',
        prompt: 'Create a post-campaign report template for Soul Bloom that covers: executive summary, performance vs. KPIs, audience insights, creative learnings, budget efficiency, and recommendations for future campaigns.',
      },
    ],
  },
  {
    category: 'Iteration',
    icon: RefreshCw,
    color: 'text-sky-500',
    bg: 'bg-sky-50',
    badge: 'bg-sky-100 text-sky-700',
    items: [
      {
        title: 'Creative Refresh Ideas',
        prompt: 'Our current campaign has been running for 4 weeks. Suggest 5 creative refresh ideas to combat ad fatigue while maintaining brand consistency and campaign objectives for Soul Bloom.',
      },
      {
        title: 'Next Quarter Planning',
        prompt: 'Based on our learnings so far, help me plan next quarter\'s campaign roadmap for Soul Bloom. Include themes, timing, budget recommendations, new audiences to test, and one bold experimental idea.',
      },
    ],
  },
];

export default function TemplatesModal({ open, onClose, onSelect }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            Prompt Templates
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">Click any template to instantly insert it into the chat.</p>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {TEMPLATES.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.category}>
                <div className={`flex items-center gap-2 mb-2`}>
                  <GroupIcon className={`h-4 w-4 ${group.color}`} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{group.category}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.items.map((tpl) => (
                    <button
                      key={tpl.title}
                      onClick={() => { onSelect(tpl.prompt); onClose(); }}
                      onMouseEnter={() => setHoveredItem(tpl.title)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`text-left p-3 rounded-xl border transition-all duration-150 group ${
                        hoveredItem === tpl.title
                          ? `${group.bg} border-transparent shadow-sm`
                          : 'bg-white border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-800">{tpl.title}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${group.badge}`}>
                          {group.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{tpl.prompt}</p>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}