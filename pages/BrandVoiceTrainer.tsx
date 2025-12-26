import React, { useState } from 'react';
import { Card, Button, TextArea, Input, Badge } from '../components/UI';
import { Mic2, Zap, Save, CheckCircle2 } from 'lucide-react';
import { analyzeBrandVoice } from '../services/geminiService';
import { BrandVoiceAnalysis } from '../types';

export const BrandVoiceTrainer = () => {
  const [samples, setSamples] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<BrandVoiceAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!samples) return;
    setLoading(true);
    const result = await analyzeBrandVoice(samples);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Mic2 className="text-purple-600" /> Brand Voice Trainer
        </h1>
        <p className="text-slate-500">Train AI to write exactly like you by analyzing your past content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 space-y-6">
          <h2 className="font-bold text-slate-800">1. Provide Samples</h2>
          <p className="text-sm text-slate-500">Paste 3-5 of your best performing posts, emails, or articles here. The more you provide, the better the AI learns.</p>
          <TextArea 
            placeholder="Paste your best content here..."
            className="min-h-[300px] font-mono text-sm"
            value={samples}
            onChange={(e) => setSamples(e.target.value)}
          />
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleAnalyze} 
            isLoading={loading}
            disabled={!samples}
          >
            <Zap size={18} className="mr-2" /> Analyze Voice
          </Button>
        </Card>

        <div className="space-y-6">
          {loading && (
             <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 p-8">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium">Deconstructing your unique style...</p>
             </div>
          )}

          {!loading && !analysis && (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 p-8 text-center">
              <Mic2 size={48} className="mb-4 opacity-50" />
              <p>Analysis results will appear here.</p>
            </div>
          )}

          {!loading && analysis && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
              <Card className="p-6 bg-purple-50 border-purple-100">
                <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                   <CheckCircle2 size={18} /> Voice Detected
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {analysis.descriptors.map((desc, i) => (
                    <span key={i} className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm font-semibold border border-purple-200 shadow-sm">
                      {desc}
                    </span>
                  ))}
                </div>
                <p className="text-purple-800 text-sm leading-relaxed italic">
                  "{analysis.styleGuide}"
                </p>
              </Card>

              <Card className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-emerald-700 mb-3 text-sm uppercase tracking-wide">Do This</h4>
                    <ul className="space-y-2">
                      {analysis.dos.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-rose-700 mb-3 text-sm uppercase tracking-wide">Avoid This</h4>
                    <ul className="space-y-2">
                      {analysis.donts.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-rose-500 font-bold text-lg leading-none mt-[-2px] shrink-0">×</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              <Button variant="success" className="w-full">
                <Save size={18} className="mr-2" /> Save Voice Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
