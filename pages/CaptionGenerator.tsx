import React, { useState } from 'react';
import { Card, Button, Input, Select, TextArea } from '../components/UI';
import { PenTool, Copy, Check, Sliders } from 'lucide-react';
import { generateCaption } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export const CaptionGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    platform: 'Instagram',
    tone: 'Engaging',
    context: '',
  });

  const handleGenerate = async () => {
    if (!formData.topic) return;
    setLoading(true);
    setResult('');
    const text = await generateCaption(formData.topic, formData.platform, formData.tone, formData.context);
    setResult(text);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-2rem)] flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">
      
      {/* Left Panel: Inputs */}
      <Card className="w-full md:w-1/3 p-6 flex flex-col h-full overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
            <PenTool size={20} />
          </div>
          <h2 className="font-bold text-slate-900">Caption Writer</h2>
        </div>

        <div className="space-y-5 flex-1">
          <Input 
            label="What is this post about?" 
            placeholder="e.g. My morning routine, New product launch"
            value={formData.topic}
            onChange={(e) => setFormData({...formData, topic: e.target.value})}
          />
          
          <div className="grid grid-cols-2 gap-4">
             <Select 
              label="Platform"
              options={[
                { label: 'Instagram', value: 'Instagram' },
                { label: 'LinkedIn', value: 'LinkedIn' },
                { label: 'Twitter (X)', value: 'Twitter' },
                { label: 'YouTube Short', value: 'YouTube Shorts' },
                { label: 'Facebook', value: 'Facebook' },
              ]}
              value={formData.platform}
              onChange={(e) => setFormData({...formData, platform: e.target.value})}
            />
            
            <Select 
              label="Tone"
              options={[
                { label: 'Engaging', value: 'Engaging' },
                { label: 'Storytelling', value: 'Storytelling' },
                { label: 'Salesy', value: 'Sales-focused' },
                { label: 'Educational', value: 'Educational' },
              ]}
              value={formData.tone}
              onChange={(e) => setFormData({...formData, tone: e.target.value})}
            />
          </div>

          <TextArea 
            label="Additional Context (Optional)" 
            placeholder="Key points to include, CTAs, specific keywords..."
            className="h-32"
            value={formData.context}
            onChange={(e) => setFormData({...formData, context: e.target.value})}
          />
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleGenerate} 
            isLoading={loading}
            disabled={!formData.topic}
          >
            Write Caption
          </Button>
        </div>
      </Card>

      {/* Right Panel: Output */}
      <Card className="w-full md:w-2/3 flex flex-col h-full relative overflow-hidden bg-slate-50 border-slate-200 shadow-inner">
        <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
           <h3 className="font-semibold text-slate-700">Generated Output</h3>
           <div className="flex gap-2">
             <Button variant="secondary" size="sm" onClick={handleGenerate} disabled={loading || !formData.topic}>
               Regenerate
             </Button>
             <Button variant={copied ? 'success' : 'primary'} size="sm" onClick={handleCopy} disabled={!result}>
               {copied ? <><Check size={16} className="mr-2"/> Copied</> : <><Copy size={16} className="mr-2"/> Copy Text</>}
             </Button>
           </div>
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto">
          {loading ? (
             <div className="space-y-4 animate-pulse">
               <div className="h-4 bg-slate-200 rounded w-3/4"></div>
               <div className="h-4 bg-slate-200 rounded w-1/2"></div>
               <div className="h-4 bg-slate-200 rounded w-full"></div>
               <div className="h-4 bg-slate-200 rounded w-5/6"></div>
               <div className="h-32 bg-slate-200 rounded w-full mt-6"></div>
             </div>
          ) : result ? (
            <div className="prose prose-indigo max-w-none text-slate-800">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center mb-4">
                <PenTool size={32} className="opacity-50" />
              </div>
              <p>Ready to write your next viral post.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
