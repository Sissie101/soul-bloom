import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Flower2, Mail, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.message) return;
    setLoading(true);
    await base44.integrations.Core.SendEmail({
      to: "hello@sacredseeds.com",
      subject: `Contact Form: ${form.name || form.email}`,
      body: `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
    });
    base44.analytics.track({ eventName: "contact_form_submitted", properties: { success: true } });
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 md:p-16 bg-gradient-to-br from-divine-light via-pearl-white to-gentle-lavender">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-warm-gold to-sacred-sage rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <span className="text-sacred-sage font-medium text-sm uppercase tracking-widest">Reach Out</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight">
          Contact Us
        </h1>
        <p className="text-gray-600 mb-10 text-lg">
          We'd love to hear from you. Send us a message and we'll get back to you within 1–2 business days.
        </p>

        {/* Direct email */}
        <div className="flex items-center gap-3 mb-8 p-4 bg-white/70 rounded-xl border border-sage-200/30">
          <Mail className="w-5 h-5 text-sacred-sage shrink-0" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Email us directly</p>
            <a href="mailto:hello@sacredseeds.com" className="text-sacred-sage font-medium hover:underline">
              hello@sacredseeds.com
            </a>
          </div>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle2 className="w-14 h-14 text-sacred-sage mb-4" />
            <h2 className="text-2xl font-serif font-semibold text-gray-800 mb-2">Message Received</h2>
            <p className="text-gray-500">Thank you for reaching out. We'll be in touch soon. 🌸</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Grace"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sacred-sage/40 bg-white/80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-400">*</span></label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sacred-sage/40 bg-white/80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-400">*</span></label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us how we can help..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sacred-sage/40 bg-white/80 resize-none"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sacred-sage to-warm-gold text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Message
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}