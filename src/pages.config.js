/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AgentStudio from './pages/AgentStudio';
import Analytics from './pages/Analytics';
import AudienceManager from './pages/AudienceManager';
import CampaignDashboard from './pages/CampaignDashboard';
import CampaignDetails from './pages/CampaignDetails';
import Community from './pages/Community';
import CreativeStudio from './pages/CreativeStudio';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import LandingPageOptimizer from './pages/LandingPageOptimizer';
import MyJournal from './pages/MyJournal';
import NewsletterGenerator from './pages/NewsletterGenerator';
import PredictiveInsights from './pages/PredictiveInsights';
import SacredSoundscapes from './pages/SacredSoundscapes';
import SentimentAnalysis from './pages/SentimentAnalysis';
import SoulBuddy from './pages/SoulBuddy';
import StrategicActionCenter from './pages/StrategicActionCenter';
import Terms from './pages/Terms';
import TodaysSeed from './pages/TodaysSeed';
import TrackingSetup from './pages/TrackingSetup';
import ContentInsights from './pages/ContentInsights';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AgentStudio": AgentStudio,
    "Analytics": Analytics,
    "AudienceManager": AudienceManager,
    "CampaignDashboard": CampaignDashboard,
    "CampaignDetails": CampaignDetails,
    "Community": Community,
    "CreativeStudio": CreativeStudio,
    "Dashboard": Dashboard,
    "Home": Home,
    "LandingPageOptimizer": LandingPageOptimizer,
    "MyJournal": MyJournal,
    "NewsletterGenerator": NewsletterGenerator,
    "PredictiveInsights": PredictiveInsights,
    "SacredSoundscapes": SacredSoundscapes,
    "SentimentAnalysis": SentimentAnalysis,
    "SoulBuddy": SoulBuddy,
    "StrategicActionCenter": StrategicActionCenter,
    "Terms": Terms,
    "TodaysSeed": TodaysSeed,
    "TrackingSetup": TrackingSetup,
    "ContentInsights": ContentInsights,
}

export const pagesConfig = {
    mainPage: "AgentStudio",
    Pages: PAGES,
    Layout: __Layout,
};