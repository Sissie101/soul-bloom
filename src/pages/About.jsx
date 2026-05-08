import React from "react";
import { Link } from "react-router-dom";
import { Flower2, Heart, Sparkles, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen p-8 md:p-16 bg-gradient-to-br from-divine-light via-pearl-white to-gentle-lavender">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-warm-gold to-sacred-sage rounded-full flex items-center justify-center">
            <Flower2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-sacred-sage font-medium text-sm uppercase tracking-widest">Our Story</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-8 leading-tight">
          About Sacred Seeds
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-xl leading-relaxed text-gray-600">
            Sacred Seeds is a 30-day spiritual reflection journey designed to help women slow down, go inward, and cultivate a deeper relationship with themselves and their community.
          </p>
          <p className="leading-relaxed">
            Each day, you receive a thoughtfully crafted "seed" — a prompt, a question, or a gentle challenge — that invites you to journal, reflect, record a voice note, or share a blessing with others. Over 30 days, these seeds grow into a living record of your inner world: your patterns, your growth, your light.
          </p>
          <p className="leading-relaxed">
            Sacred Seeds is built for soul-led women who are ready to stop rushing and start listening — to themselves, to their intuition, and to the quiet wisdom that already lives within them. Whether you are navigating a transition, seeking clarity, or simply craving more meaning in your daily life, this journey meets you exactly where you are.
          </p>
          <p className="leading-relaxed">
            The platform also features a Soul Sister matching system, which pairs you with a fellow journeyer whose themes and emotional rhythms resonate with yours. Together, you share blessings, exchange hearts of gratitude, and witness each other's transformation.
          </p>
          <p className="leading-relaxed">
            Sacred Seeds is built and maintained by a small, passionate team dedicated to blending spiritual depth with thoughtful technology — creating a sanctuary that is beautiful, private, and genuinely nourishing.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Flower2, label: "30-Day Journey", desc: "Daily seeds of wisdom and reflection" },
            { icon: Users, label: "Soul Sisters", desc: "AI-matched spiritual companions" },
            { icon: Heart, label: "Community", desc: "Blessing threads & gratitude hearts" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="p-5 bg-white/70 rounded-2xl border border-sage-200/30 text-center">
              <Icon className="w-6 h-6 text-sacred-sage mx-auto mb-2" />
              <p className="font-semibold text-gray-800 text-sm">{label}</p>
              <p className="text-gray-500 text-xs mt-1">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link to="/Contact" className="inline-flex items-center gap-2 text-sacred-sage font-medium hover:underline">
            <Sparkles className="w-4 h-4" /> Get in touch with us →
          </Link>
        </div>
      </div>
    </div>
  );
}