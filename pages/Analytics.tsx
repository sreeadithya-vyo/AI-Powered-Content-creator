import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { BarChart2, TrendingUp, Users, Eye, Lightbulb } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateAnalyticsInsights } from '../services/geminiService';
import { AnalyticsInsight } from '../types';

// Mock Data
const data = [
  { date: 'May 01', reach: 1200, engagement: 240, followers: 10500 },
  { date: 'May 05', reach: 1500, engagement: 300, followers: 10550 },
  { date: 'May 10', reach: 1100, engagement: 220, followers: 10600 },
  { date: 'May 15', reach: 2400, engagement: 680, followers: 10850 },
  { date: 'May 20', reach: 1800, engagement: 450, followers: 10920 },
  { date: 'May 25', reach: 3200, engagement: 890, followers: 11200 },
  { date: 'May 30', reach: 2900, engagement: 750, followers: 11350 },
];

export const Analytics = () => {
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate fetching insights on load
    const fetchInsights = async () => {
      setLoading(true);
      // In a real app, we'd pass real metrics. Here we pass a summary of the mock data.
      const summary = {
        totalFollowers: 11350,
        growthRate: '8%',
        avgEngagement: '5.2%',
        topPostType: 'Reels',
        recentTrend: 'Spike in engagement on May 25th due to viral reel.'
      };
      const result = await generateAnalyticsInsights(summary);
      setInsights(result);
      setLoading(false);
    };

    fetchInsights();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart2 className="text-blue-600" /> Analytics & Insights
        </h1>
        <p className="text-slate-500">Deep dive into your performance with AI-powered suggestions.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Followers</p>
            <h3 className="text-2xl font-bold text-slate-900">11,350</h3>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <TrendingUp size={12} className="mr-1" /> +8.2% this month
            </span>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
           <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <Eye size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Reach</p>
            <h3 className="text-2xl font-bold text-slate-900">14.1K</h3>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <TrendingUp size={12} className="mr-1" /> +12% this month
            </span>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
           <div className="p-3 bg-pink-100 text-pink-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Avg. Engagement</p>
            <h3 className="text-2xl font-bold text-slate-900">5.8%</h3>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <TrendingUp size={12} className="mr-1" /> +0.5% this month
            </span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-bold text-slate-800 mb-6">Growth Trajectory</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="reach" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorReach)" />
                <Area type="monotone" dataKey="engagement" stroke="#ec4899" strokeWidth={2} fillOpacity={0} fill="#ec4899" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Insights Panel */}
        <Card className="p-6 bg-gradient-to-b from-slate-50 to-white">
           <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
             <Lightbulb className="text-amber-500" size={20} /> AI Insights
           </h3>
           
           <div className="space-y-4">
             {loading ? (
               <div className="space-y-3">
                 <div className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
                 <div className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
                 <div className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
               </div>
             ) : (
               insights.map((insight, idx) => (
                 <div key={idx} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex justify-between items-start mb-2">
                     <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        insight.type === 'Growth' ? 'bg-emerald-100 text-emerald-700' : 
                        insight.type === 'Engagement' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                     }`}>
                       {insight.type}
                     </span>
                   </div>
                   <h4 className="font-bold text-slate-800 text-sm mb-1">{insight.title}</h4>
                   <p className="text-xs text-slate-500 mb-3">{insight.description}</p>
                   <div className="p-2 bg-slate-50 rounded text-xs text-slate-700 font-medium flex gap-2">
                      <span className="shrink-0">💡</span>
                      {insight.actionableTip}
                   </div>
                 </div>
               ))
             )}
             
             {!loading && insights.length === 0 && (
               <p className="text-sm text-slate-500 text-center py-10">No insights available yet.</p>
             )}
           </div>
        </Card>
      </div>
    </div>
  );
};
