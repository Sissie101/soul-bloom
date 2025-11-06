import React, { useState, useEffect } from "react";
import { ConversionGoal } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Trash2, Code, Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TrackingSetup() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    name: '',
    description: '',
    value: 0,
    category: 'awareness'
  });
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    const data = await ConversionGoal.list();
    setGoals(data);
  };

  const handleCreateGoal = async () => {
    if (!newGoal.name) return;
    await ConversionGoal.create(newGoal);
    setNewGoal({ name: '', description: '', value: 0, category: 'awareness' });
    loadGoals();
  };

  const handleDeleteGoal = async (id) => {
    await ConversionGoal.delete(id);
    loadGoals();
  };

  const trackingCodeExample = `
// Basic tracking example
import { useConversion } from '@/components/ConversionTracker';

const { trackConversion } = useConversion();

// Track when someone signs up for Sacred Seeds
const handleSignup = async () => {
  await trackConversion({
    goalName: 'Sacred Seeds Signup',
    creativeId: 'creative_123',
    campaignId: 'campaign_fase44',
    audienceId: 'aud_seekers',
    revenue: 49.99
  });
};
`;

  const pixelCodeExample = `
// Automatic page view tracking
import TrackingPixel from '@/components/TrackingPixel';

<TrackingPixel 
  eventType="view"
  creativeId="creative_123"
  campaignId="campaign_fase44"
  audienceId="aud_seekers"
  platform="website"
/>
`;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tracking Setup</h1>
        <p className="text-gray-500 mb-8">Configure conversion goals and implement tracking for authentic connections.</p>
        
        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList>
            <TabsTrigger value="goals">Conversion Goals</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Goals List */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Sacred Conversion Goals</h2>
                <div className="space-y-4">
                  {goals.map(goal => (
                    <Card key={goal.id}>
                      <CardHeader className="flex flex-row justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{goal.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary" className="capitalize">
                              {goal.category}
                            </Badge>
                            <Badge variant="outline">
                              ${goal.value}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500"/>
                        </Button>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>

              {/* New Goal Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Create New Goal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Goal Name</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g., Sacred Seeds Signup" 
                      value={newGoal.name} 
                      onChange={(e) => setNewGoal({...newGoal, name: e.target.value})} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="What this conversion represents..." 
                      value={newGoal.description} 
                      onChange={(e) => setNewGoal({...newGoal, description: e.target.value})} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="value">Value ($)</Label>
                      <Input 
                        id="value" 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        value={newGoal.value} 
                        onChange={(e) => setNewGoal({...newGoal, value: parseFloat(e.target.value)})} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={newGoal.category} 
                        onValueChange={(val) => setNewGoal({...newGoal, category: val})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="awareness">Awareness</SelectItem>
                          <SelectItem value="engagement">Engagement</SelectItem>
                          <SelectItem value="conversion">Conversion</SelectItem>
                          <SelectItem value="retention">Retention</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleCreateGoal} className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Create Goal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="implementation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Conversion Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Track meaningful user actions like signups, purchases, or deep engagement.
                  </p>
                  <div className="bg-gray-900 rounded-lg p-4 text-green-400 text-xs font-mono overflow-x-auto">
                    <pre>{trackingCodeExample}</pre>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => navigator.clipboard.writeText(trackingCodeExample)}
                  >
                    <Copy className="w-3 h-3 mr-1" /> Copy Code
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Page View Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Automatically track when users view content from specific campaigns.
                  </p>
                  <div className="bg-gray-900 rounded-lg p-4 text-green-400 text-xs font-mono overflow-x-auto">
                    <pre>{pixelCodeExample}</pre>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => navigator.clipboard.writeText(pixelCodeExample)}
                  >
                    <Copy className="w-3 h-3 mr-1" /> Copy Code
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>UTM Parameter Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Use these URL parameters to track traffic sources and campaign performance:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <p><code className="bg-white px-2 py-1 rounded">utm_source</code> = linkedin, facebook, email</p>
                  <p><code className="bg-white px-2 py-1 rounded">utm_medium</code> = paid, organic, social</p>
                  <p><code className="bg-white px-2 py-1 rounded">utm_campaign</code> = fase44-launch, soul-sister-summer</p>
                  <p><code className="bg-white px-2 py-1 rounded">utm_content</code> = creative-id (for A/B testing)</p>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Example: <code>yourdomain.com?utm_source=linkedin&utm_campaign=fase44-launch&utm_content=gracie-snippet</code>
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}