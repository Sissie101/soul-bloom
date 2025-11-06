import React, { useState, useEffect } from "react";
import { Campaign, Creative } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Megaphone, Target, BarChart, ExternalLink } from "lucide-react";

export default function CampaignDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({ totalCreatives: 0, totalClicks: 0, totalConversions: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const campData = await Campaign.list("-created_date");
      const creativeData = await Creative.list();
      
      const campaignWithStats = campData.map(campaign => {
        const creatives = creativeData.filter(c => c.campaign_id === campaign.id);
        const clicks = creatives.reduce((sum, c) => sum + (c.clicks || 0), 0);
        const conversions = creatives.reduce((sum, c) => sum + (c.conversions || 0), 0);
        return { ...campaign, creativeCount: creatives.length, clicks, conversions };
      });
      
      setCampaigns(campaignWithStats);
      setStats({
        totalCreatives: creativeData.length,
        totalClicks: creativeData.reduce((sum, c) => sum + (c.clicks || 0), 0),
        totalConversions: creativeData.reduce((sum, c) => sum + (c.conversions || 0), 0),
      });
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaign Dashboard</h1>
            <p className="text-gray-500">Your command center for marketing initiatives.</p>
          </div>
          <div className="flex gap-2">
            <Link to={createPageUrl("AudienceManager")}>
              <Button variant="outline"><Target className="w-4 h-4 mr-2" /> Manage Audiences</Button>
            </Link>
            <Link to={createPageUrl("CreativeStudio")}>
               <Button><Plus className="w-4 h-4 mr-2" /> New Creative</Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Total Creatives</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalCreatives}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalClicks}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Total Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalConversions}</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaign List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map(campaign => (
              <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{campaign.name}</CardTitle>
                      <CardDescription className="capitalize mt-1">{campaign.status}</CardDescription>
                    </div>
                    <Megaphone className="w-5 h-5 text-indigo-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Creatives</span>
                    <span className="font-medium">{campaign.creativeCount}</span>
                  </div>
                   <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Clicks</span>
                    <span className="font-medium">{campaign.clicks}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Conversions</span>
                    <span className="font-medium">{campaign.conversions}</span>
                  </div>
                  <Link to={createPageUrl(`CampaignDetails?id=${campaign.id}`)} className="mt-4 block">
                    <Button variant="outline" className="w-full">
                      View Details <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
             <Card className="border-2 border-dashed flex flex-col items-center justify-center text-center p-6 hover:border-indigo-500 transition-colors">
                <h3 className="text-lg font-medium text-gray-800">New Campaign</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">Launch your next big idea.</p>
                <Button variant="secondary" onClick={() => alert("New Campaign form would be here.")}>
                  <Plus className="w-4 h-4 mr-2" /> Create Campaign
                </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}