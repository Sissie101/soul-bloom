import { useEffect } from 'react';
import { AnalyticsEvent } from '@/entities/all';

export default function TrackingPixel({ 
  eventType, 
  creativeId, 
  campaignId, 
  audienceId, 
  platform = 'website',
  metadata = {},
  revenue = 0 
}) {
  useEffect(() => {
    const trackEvent = async () => {
      try {
        await AnalyticsEvent.create({
          event_type: eventType,
          creative_id: creativeId,
          campaign_id: campaignId,
          audience_id: audienceId,
          platform,
          metadata: {
            referrer: document.referrer,
            device: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
            location: window.location.href,
            ...metadata
          },
          revenue
        });
      } catch (error) {
        console.error('Tracking error:', error);
      }
    };

    trackEvent();
  }, [eventType, creativeId, campaignId, audienceId, platform, metadata, revenue]);

  return null; // This component doesn't render anything
}