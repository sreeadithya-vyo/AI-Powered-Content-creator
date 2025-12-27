import React, { useState } from 'react';
import { Card, Button, TextArea, Select, Badge } from '../components/UI';
import { Repeat, ArrowRight, Copy, Check, Sparkles } from 'lucide-react';
import { repurposeContent } from '../services/geminiService';

export const RepurposeContent = () => {
  const [sourceText, setSourceText] = useState('');
  const [sourceType, setSourceType] = useState('Blog Post');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});
  const [selectedTargets, setSelectedTargets] = useState<string[]>(['Twitter', 'LinkedIn']);

  const targets = ['Twitter', 'LinkedIn', 'Instagram Caption', 'TikTok Script', 'Newsletter'];

  const toggleTarget = (target: string) => {
    if (selectedTargets.includes(target)) {
      setSelectedTargets(selectedTargets.filter(t => t !== target));
    } else {
      setSelectedTargets([...selectedTargets, target]);
    }
  };

  const handleRepurpose = async () => {
    if (!sourceText || selectedTargets.length === 0) return;
    setLoading(true);
    const output = await repurposeContent(sourceText, sourceType, selectedTargets);
    setResults(output);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Repeat className="text-indigo-600" /> Content Repurposing Engine
        </h1>
        <p className="text-slate-500">Turn one piece of content into a month's worth of posts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="p-6 space-y-6 h-fit">
          <div>
            <h2 className="font-bold text-slate-800 mb-4">1. Source Content</h2>
            <div className="mb-4">
              <Select 
                label="Source Type" 
                options={[
                  { label: 'Blog Post', value: 'Blog Post' },
                  { label: 'YouTube Script', value: 'YouTube Script' },
                  { label: 'Long Caption', value: 'Long Caption' },
                  { label: 'Meeting Notes', value: 'Meeting Notes' },
                ]}
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
              />
            </div>
            <TextArea 
              label="Paste Content Here" 
              className="min-h-[300px] font-mono text-sm"
              placeholder="Paste your article, script, or notes..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            />
          </div>

          <div>
             <h2 className="font-bold text-slate-800 mb-3">2. Target Platforms</h2>
             <div className="flex flex-wrap gap-2">
               {targets.map(target => (
                 <button 
                   key={target}
                   onClick={() => toggleTarget(target)}
                   className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                     selectedTargets.includes(target) 
                       ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                       : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                   }`}
                 >
                   {target}
                 </button>
               ))}
             </div>
          </div>

          <Button 
            size="lg" 
            className="w-full" 
            onClick={handleRepurpose} 
            isLoading={loading}
            disabled={!sourceText || selectedTargets.length === 0}
          >
            <Sparkles size={18} className="mr-2" /> Repurpose Content
          </Button>
        </Card>

        {/* Output Section */}
        <div className="space-y-6">
           {loading && (
             <div className="flex flex-col items-center justify-center h-[500px] bg-white rounded-2xl border border-slate-100">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium">Adapting content for multiple platforms...</p>
             </div>
           )}

           {!loading && Object.keys(results).length === 0 && (
             <div className="flex flex-col items-center justify-center h-[500px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
               <Repeat size={48} className="mb-4 opacity-50" />
               <p>Generated content will appear here.</p>
             </div>
           )}

           {!loading && Object.entries(results).map(([platform, content]) => (
             <Card key={platform} className="p-6 relative group">
               <div className="flex items-center justify-between mb-3">
                 <Badge variant="info">{platform}</Badge>
                 <button 
                  onClick={() => navigator.clipboard.writeText(String(content))}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Copy"
                 >
                   <Copy size={16} />
                 </button>
               </div>
               <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap">
                 {String(content)}
               </div>
             </Card>
           ))}
        </div>
      </div>
    </div>
  );
};