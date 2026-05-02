import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Users, X, Sparkles } from 'lucide-react';

export default function SoulBuddyNotificationBanner({ userEmail }) {
  const [notification, setNotification] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!userEmail) return;
    loadNotification();
  }, [userEmail]);

  const loadNotification = async () => {
    const notifications = await base44.entities.SoulBuddyNotification.filter({
      recipient_email: userEmail,
      is_read: false,
    });
    if (notifications.length > 0) setNotification(notifications[0]);
  };

  const dismiss = async () => {
    if (notification) {
      await base44.entities.SoulBuddyNotification.update(notification.id, { is_read: true });
    }
    setDismissed(true);
  };

  if (!notification || dismissed) return null;

  return (
    <div className="mb-8 relative overflow-hidden rounded-2xl border border-warm-gold/30 bg-gradient-to-r from-warm-gold/10 via-sacred-sage/10 to-gentle-lavender/30 p-5 shadow-lg sacred-glow">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-warm-gold/10 to-transparent rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
      
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-white/40 min-h-0 min-w-0 w-7 h-7 flex items-center justify-center"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-4 pr-8">
        <div className="w-12 h-12 bg-gradient-to-br from-warm-gold to-sacred-sage rounded-full flex items-center justify-center shrink-0 shadow-md">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-warm-gold" />
            <span className="text-xs font-semibold text-warm-gold uppercase tracking-wider">Soul Buddy Match!</span>
          </div>
          <h3 className="font-serif font-bold text-gray-900 text-lg leading-tight mb-1">
            You've been matched with {notification.matched_with_name}
          </h3>
          {notification.match_reason && (
            <p className="text-gray-600 text-sm leading-relaxed mb-3 italic">
              "{notification.match_reason}"
            </p>
          )}
          <div className="flex gap-3 flex-wrap">
            <Link
              to={createPageUrl("SoulBuddy")}
              onClick={dismiss}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-warm-gold to-sacred-sage text-white text-sm font-medium hover:shadow-md transition-all duration-200 min-h-0"
            >
              <Users className="w-4 h-4" />
              Meet Your Soul Sister
            </Link>
            <button
              onClick={dismiss}
              className="inline-flex items-center px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-white/60 transition-colors min-h-0"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}