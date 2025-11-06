import Dashboard from './pages/Dashboard';
import TodaysSeed from './pages/TodaysSeed';
import SoulBuddy from './pages/SoulBuddy';
import CampaignDashboard from './pages/CampaignDashboard';
import CampaignDetails from './pages/CampaignDetails';
import CreativeStudio from './pages/CreativeStudio';
import AudienceManager from './pages/AudienceManager';
import Analytics from './pages/Analytics';
import TrackingSetup from './pages/TrackingSetup';
import StrategicActionCenter from './pages/StrategicActionCenter';
import LandingPageOptimizer from './pages/LandingPageOptimizer';
import AgentStudio from './pages/AgentStudio';
import Community from './pages/Community';
import MyJournal from './pages/MyJournal';
import SacredSoundscapes from './pages/SacredSoundscapes';
import Home from './pages/Home';
import Terms from './pages/Terms';
import Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "TodaysSeed": TodaysSeed,
    "SoulBuddy": SoulBuddy,
    "CampaignDashboard": CampaignDashboard,
    "CampaignDetails": CampaignDetails,
    "CreativeStudio": CreativeStudio,
    "AudienceManager": AudienceManager,
    "Analytics": Analytics,
    "TrackingSetup": TrackingSetup,
    "StrategicActionCenter": StrategicActionCenter,
    "LandingPageOptimizer": LandingPageOptimizer,
    "AgentStudio": AgentStudio,
    "Community": Community,
    "MyJournal": MyJournal,
    "SacredSoundscapes": SacredSoundscapes,
    "Home": Home,
    "Terms": Terms,
}

export const pagesConfig = {
    mainPage: "AudienceManager",
    Pages: PAGES,
    Layout: Layout,
};