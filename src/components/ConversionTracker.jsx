import React, { createContext, useContext, useCallback } from 'react';
import { AnalyticsEvent, User } from '@/entities/all';

const ConversionContext = createContext();

export const useConversion = () => {
  const context = useContext(ConversionContext);
  if (!context) {
    throw new Error('useConversion must be used within ConversionProvider');
  }
  return context;
};

export const ConversionProvider = ({ children }) => {
  const trackConversion = useCallback(async ({ 
    goalName, 
    creativeId, 
    campaignId, 
    audienceId, 
    platform = 'website',
    revenue = 0,
    metadata = {} 
  }) => {
    try {
      let userEmail = 'anonymous';
      try {
        const user = await User.me();
        userEmail = user.email;
      } catch {
        // User not logged in, keep anonymous
      }

      await AnalyticsEvent.create({
        event_type: 'conversion',
        creative_id: creativeId,
        campaign_id: campaignId,
        audience_id: audienceId,
        user_email: userEmail,
        platform,
        metadata: {
          goal_name: goalName,
          referrer: document.referrer,
          device: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          location: window.location.href,
          timestamp: new Date().toISOString(),
          ...metadata
        },
        revenue
      });
      
      console.log(`✨ Sacred conversion tracked: ${goalName}`);
    } catch (error) {
      console.error('Conversion tracking error:', error);
    }
  }, []);

  const trackClick = useCallback(async ({ 
    creativeId, 
    campaignId, 
    audienceId, 
    platform = 'website',
    metadata = {} 
  }) => {
    await AnalyticsEvent.create({
      event_type: 'click',
      creative_id: creativeId,
      campaign_id: campaignId,
      audience_id: audienceId,
      platform,
      metadata: {
        referrer: document.referrer,
        device: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        ...metadata
      }
    });
  }, []);

  const trackEngagement = useCallback(async ({
    creativeId,
    campaignId, 
    audienceId,
    sessionDuration,
    pagesViewed = 1,
    metadata = {}
  }) => {
    await AnalyticsEvent.create({
      event_type: 'engagement',
      creative_id: creativeId,
      campaign_id: campaignId,
      audience_id: audienceId,
      platform: 'website',
      metadata: {
        session_duration: sessionDuration,
        pages_viewed: pagesViewed,
        referrer: document.referrer,
        device: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        ...metadata
      }
    });
  }, []);

  return (
    <ConversionContext.Provider value={{ 
      trackConversion, 
      trackClick, 
      trackEngagement 
    }}>
      {children}
    </ConversionContext.Provider>
  );
};