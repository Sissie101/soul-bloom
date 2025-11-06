
import React, { useState, useEffect } from "react";
import { Campaign, Creative, Audience } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Plus, Target, BarChart, Edit, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CampaignDetails() {
  const [campaign, setCampaign] = useState(null);
  const [creatives, setCreatives] = useState([]);
  const [audiences, setAudiences] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Fix: Ensure window.location.search is a string for URLSearchParams
      const urlParams = new URLSearchParams(window.location.search || '');
      const campaignId = urlParams.get('id');

      if (campaignId && campaignId.trim() !== '') { // Modified line
        const campData = await Campaign.get(campaignId);
        setCampaign(campData);

        const creativeData = await Creative.filter({ campaign_id: campaignId });
        setCreatives(creativeData);

        const audData = await Audience.list();
        const audMap = audData.reduce((map, aud) => {
          map[aud.id] = aud;
          return map;
        }, {});
        setAudiences(audMap);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);
  
  const creativesByAudience = creatives.reduce((acc, creative) => {
    const audienceId = creative.audience_id || 'unassigned';
    if (!acc[audienceId]) {
      acc[audienceId] = [];
    }
    acc[audienceId].push(creative);
    return acc;
  }, {});
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  if (!campaign) {
    return <div className="text-center p-8">Campaign not found.</div>;
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("CampaignDashboard")}>
            <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
            <Badge className="mt-1 capitalize">{campaign.status}</Badge>
          </div>
        </div>

        {/* This directly implements the "Resonance Rings" strategy */}
        {Object.entries(creativesByAudience).map(([audienceId, creativeList]) => (
          <div key={audienceId} className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500"/>
                {audiences[audienceId]?.name || "Unassigned Audience"}
              </h2>
              <Link to={createPageUrl(`CreativeStudio?campaign_id=${campaign.id}&audience_id=${audienceId}`)}>
                <Button variant="secondary"><Plus className="w-4 h-4 mr-2"/> Add Creative</Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creativeList.map(creative => (
                <Card key={creative.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-base">{creative.title}</CardTitle>
                    {creative.notes?.toLowerCase().includes("gracie") && 
                      <Badge variant="secondary" className="mt-2 w-fit"><Sparkles className="w-3 h-3 mr-1"/>Gracie-Inspired</Badge>
                    }
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <img src={creative.image_url || 'https://via.placeholder.com/300x200?text=No+Image'} alt={creative.title} className="rounded-md mb-4 aspect-video object-cover"/>
                    <p className="text-sm text-gray-600 line-clamp-3">{creative.copy}</p>
                    {/* This visualizes the "Ripple Map Experiments" by showing variants */}
                    {creative.variant_of && <p className="text-xs text-indigo-600 mt-2">Test Variant</p>}
                  </CardContent>
                  <div className="p-4 border-t">
                     <div className="flex justify-between text-xs text-gray-500">
                      <span>Clicks: <b>{creative.clicks}</b></span>
                      <span>Conversions: <b>{creative.conversions}</b></span>
                    </div>
                    <Link to={createPageUrl(`CreativeStudio?id=${creative.id}`)} className="mt-3 block">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-3 h-3 mr-2" /> Edit Creative
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
