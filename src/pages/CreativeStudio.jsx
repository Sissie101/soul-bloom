import React, { useState, useEffect } from "react";
import { Creative, Campaign, Audience, User } from "@/entities/all";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AIAssistPanel from "@/components/creative/AIAssistPanel";
import { Toaster } from "@/components/ui/sonner";

export default function CreativeStudio() {
  const navigate = useNavigate();
  const [creative, setCreative] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [audiences, setAudiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const urlParams = new URLSearchParams(window.location.search || '');
        const creativeId = urlParams.get('id');
        const campaignId = urlParams.get('campaign_id');
        const audienceId = urlParams.get('audience_id');
        
        const campData = await Campaign.list();
        const audData = await Audience.list();
        setCampaigns(campData);
        setAudiences(audData);

        if (creativeId && creativeId.trim() !== '') { // Fix applied here
          const creativeData = await Creative.get(creativeId);
          setCreative(creativeData || {}); // Ensure creativeData is an object
          setImagePreview(creativeData?.image_url || ''); // Safely access image_url
        } else {
          setCreative({
            campaign_id: campaignId || '',
            audience_id: audienceId || '',
            status: 'draft',
            type: 'image'
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Initialize creative to default state on error
        setCreative({
          campaign_id: '',
          audience_id: '',
          status: 'draft',
          type: 'image'
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setCreative(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsSaving(true);
      const { file_url } = await UploadFile({ file });
      handleInputChange('image_url', file_url);
      setImagePreview(file_url);
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    if (creative.id) {
      await Creative.update(creative.id, creative);
    } else {
      await Creative.create(creative);
    }
    setIsSaving(false);
    navigate(createPageUrl(`CampaignDetails?id=${creative.campaign_id}`));
  };

  return (
    <>
    <Toaster position="top-center" richColors />
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-8">
            <Link to={createPageUrl("CampaignDashboard")}>
              <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Creative Studio</h1>
              <p className="text-gray-500">Design and manage your ad creatives.</p>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label htmlFor="title">Creative Title</Label>
                <Input id="title" value={creative.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="e.g., Soul Sister Echo Post 1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="campaign">Campaign</Label>
                  <Select value={creative.campaign_id || ''} onValueChange={(val) => handleInputChange('campaign_id', val)}>
                    <SelectTrigger><SelectValue placeholder="Select a campaign..." /></SelectTrigger>
                    <SelectContent>{campaigns.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="audience">Audience (Resonance Ring)</Label>
                  <Select value={creative.audience_id || ''} onValueChange={(val) => handleInputChange('audience_id', val)}>
                    <SelectTrigger><SelectValue placeholder="Select an audience..." /></SelectTrigger>
                    <SelectContent>{audiences.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="copy">Ad Copy</Label>
                <Textarea id="copy" value={creative.copy || ''} onChange={(e) => handleInputChange('copy', e.target.value)} placeholder="You felt the first ripple—ready to ride the next?" rows={6}/>
              </div>

              <div>
                <Label htmlFor="image">Image</Label>
                <Input id="image" type="file" onChange={handleFileChange} className="w-full" />
                <p className="text-xs text-gray-500 mt-1">Upload an image for your ad.</p>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" value={creative.notes || ''} onChange={(e) => handleInputChange('notes', e.target.value)} placeholder="e.g., Gracie-inspired, for retargeting" />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Creative'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI + Preview */}
        <div className="lg:col-span-1 space-y-6">
          <AIAssistPanel
            creative={creative}
            onApplyCopy={(copy) => handleInputChange('copy', copy)}
            onApplyImage={(url) => { handleInputChange('image_url', url); setImagePreview(url); }}
          />
          <div className="sticky top-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Eye className="w-5 h-5"/> Live Preview</h2>
            <Card className="overflow-hidden">
              <CardHeader className="bg-white p-3 border-b flex flex-row items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div>
                  <p className="font-semibold text-sm">Your Brand</p>
                  <p className="text-xs text-gray-500">Sponsored</p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="p-3 text-sm">{creative.copy || "Your ad copy will appear here."}</p>
                {imagePreview && <img src={imagePreview} alt="Ad preview" className="w-full aspect-video object-cover"/>}
              </CardContent>
              <div className="p-3 bg-gray-50 border-t flex justify-between items-center">
                <span className="text-xs uppercase font-semibold text-gray-500">yourbrand.com</span>
                <Button size="sm" variant="secondary" className="text-xs">Learn More</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}