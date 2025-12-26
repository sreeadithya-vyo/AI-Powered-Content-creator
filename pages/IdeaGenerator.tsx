import React, { useState } from 'react';
import { Card, Button, Input, Select, Badge } from '../components/UI';
import { Sparkles, Copy, RefreshCw, Bookmark } from 'lucide-react';
import { generateContentIdeas } from '../services/geminiService';
import { ContentIdea } from '../types';

export const IdeaGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [formData, setFormData] = useState({
    niche: '',
    platform: 'Instagram',
    goal: 'Engagement',
    tone: 'Professional',
  });

  const handleGenerate = async () => {
    if (!formData.niche) return;
    setLoading(true);
    const results = await generateContentIdeas(formData.niche, formData.platform, formData.goal, formData.tone);
    setIdeas(results);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="text-indigo-600" /> Content Idea Generator
          </h1>
          <p className="text-slate-500">Never run out of ideas again. Powered by Gemini.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <Card className="p-6 h-fit lg:sticky lg:top-8 space-y-6">
          <h2 className="font-semibold text-slate-800">Configuration</h2>
          <div className="space-y-4">
            <Input 
              label="Your Niche / Topic" 
              placeholder="e.g., Digital Marketing, Vegan Cooking"
              value={formData.niche}
              onChange={(e) => setFormData({...formData, niche: e.target.value})}
            />
            
            <Select 
              label="Platform"
              options={[
                { label: 'Instagram', value: 'Instagram' },
                { label: 'TikTok', value: 'TikTok' },
                { label: 'LinkedIn', value: 'LinkedIn' },
                { label: 'YouTube', value: 'YouTube' },
                { label: 'Twitter (X)', value: 'Twitter' },
              ]}
              value={formData.platform}
              onChange={(e) => setFormData({...formData, platform: e.target.value})}
            />

            <Select 
              label="Goal"
              options={[
                { label: 'Engagement', value: 'Engagement' },
                { label: 'Sales / Conversion', value: 'Sales' },
                { label: 'Brand Awareness', value: 'Awareness' },
                { label: 'Education', value: 'Education' },
              ]}
              value={formData.goal}
              onChange={(e) => setFormData({...formData, goal: e.target.value})}
            />

             <Select 
              label="Tone"
              options={[
                { label: 'Professional', value: 'Professional' },
                { label: 'Casual & Fun', value: 'Casual' },
                { label: 'Inspirational', value: 'Inspirational' },
                { label: 'Controversial', value: 'Controversial' },
                { label: 'Humorous', value: 'Humorous' },
              ]}
              value={formData.tone}
              onChange={(e) => setFormData({...formData, tone: e.target.value})}
            />

            <Button 
              className="w-full mt-4" 
              size="lg" 
              onClick={handleGenerate} 
              isLoading={loading}
              disabled={!formData.niche}
            >
              Generate Ideas
            </Button>
          </div>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {ideas.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <Sparkles className="text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-medium">Enter your niche and click generate to see magic.</p>
            </div>
          )}

          {loading && (
             <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium animate-pulse">Brainstorming viral concepts...</p>
             </div>
          )}

          {ideas.map((idea, idx) => (
            <Card key={idx} className="p-6 group hover:border-indigo-200 transition-all">
              <div className="flex justify-between items-start mb-3">
                <Badge variant={idea.difficulty === 'Easy' ? 'success' : idea.difficulty === 'Medium' ? 'info' : 'warning'}>
                  {idea.difficulty} Difficulty
                </Badge>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" title="Save to Projects">
                    <Bookmark size={18} />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors" title="Copy">
                    <Copy size={18} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">{idea.title}</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">{idea.description}</p>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="mb-2">
                   <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Hook</span>
                   <p className="text-slate-800 font-medium mt-1">"{idea.hook}"</p>
                </div>
                <div>
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Format</span>
                   <p className="text-slate-600 text-sm mt-1">{idea.format}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
