import React, { useState, useEffect } from "react";
import { Audience } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Target, Trash2 } from "lucide-react";

export default function AudienceManager() {
  const [audiences, setAudiences] = useState([]);
  const [newAudience, setNewAudience] = useState({ name: '', description: '', targeting_criteria: '' });

  useEffect(() => {
    loadAudiences();
  }, []);

  const loadAudiences = async () => {
    const data = await Audience.list();
    setAudiences(data);
  };

  const handleCreateAudience = async () => {
    if (!newAudience.name) return;
    await Audience.create(newAudience);
    setNewAudience({ name: '', description: '', targeting_criteria: '' });
    loadAudiences();
  };

  const handleDeleteAudience = async (id) => {
    await Audience.delete(id);
    loadAudiences();
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Audience Manager</h1>
        <p className="text-gray-500 mb-8">Create and manage your "Resonance Rings" for intentional targeting.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Audience List */}
          <div className="space-y-4">
            {audiences.map(audience => (
              <Card key={audience.id}>
                <CardHeader className="flex flex-row justify-between items-start">
                  <div>
                    <CardTitle>{audience.name}</CardTitle>
                    <CardDescription>{audience.description}</CardDescription>
                  </div>
                   <Button variant="ghost" size="icon" onClick={() => handleDeleteAudience(audience.id)}>
                    <Trash2 className="w-4 h-4 text-red-500"/>
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Targeting Notes</p>
                  <p className="text-sm text-gray-700">{audience.targeting_criteria}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* New Audience Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Resonance Ring</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="e.g., Curious Seekers" value={newAudience.name} onChange={(e) => setNewAudience({...newAudience, name: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Users new to the concept..." value={newAudience.description} onChange={(e) => setNewAudience({...newAudience, description: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="criteria">Targeting Criteria</Label>
                <Textarea id="criteria" placeholder="e.g., Interests: Mindfulness, Spirituality..." value={newAudience.targeting_criteria} onChange={(e) => setNewAudience({...newAudience, targeting_criteria: e.target.value})} />
              </div>
              <Button onClick={handleCreateAudience} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Create Audience
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}