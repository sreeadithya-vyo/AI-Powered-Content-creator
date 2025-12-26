import React from 'react';
import { Card, Button, Badge } from '../components/UI';
import { TrendingUp, FileText, Calendar, Zap, ArrowRight, Plus, Lightbulb, PenTool } from 'lucide-react';
import { View, Project } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

const mockData = [
  { name: 'Mon', engagement: 4000 },
  { name: 'Tue', engagement: 3000 },
  { name: 'Wed', engagement: 2000 },
  { name: 'Thu', engagement: 2780 },
  { name: 'Fri', engagement: 1890 },
  { name: 'Sat', engagement: 2390 },
  { name: 'Sun', engagement: 3490 },
];

const recentProjects: Project[] = [
  { id: '1', title: 'Summer Collection Launch', type: 'Caption', platform: 'Instagram', status: 'Draft', createdAt: '2 mins ago' },
  { id: '2', title: 'Tech Review Script', type: 'Idea', platform: 'YouTube', status: 'Scheduled', createdAt: '4 hours ago' },
  { id: '3', title: 'Monday Motivation', type: 'Calendar', platform: 'LinkedIn', status: 'Published', createdAt: '1 day ago' },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, Jane! 👋</h1>
          <p className="text-slate-500 mt-1">Here's what's happening in your workspace today.</p>
        </div>
        <Button onClick={() => onNavigate(View.IDEAS)}>
          <Plus size={18} className="mr-2" /> New Project
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: '124', change: '+12%', icon: FileText, color: 'bg-blue-100 text-blue-600' },
          { label: 'Avg. Engagement', value: '4.8%', change: '+0.4%', icon: TrendingUp, color: 'bg-emerald-100 text-emerald-600' },
          { label: 'Scheduled', value: '8', change: 'This week', icon: Calendar, color: 'bg-violet-100 text-violet-600' },
          { label: 'AI Credits', value: '850', change: 'Refills soon', icon: Zap, color: 'bg-amber-100 text-amber-600' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="p-5 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                <span className="text-xs font-medium text-emerald-600 mt-1 block">{stat.change}</span>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.color}`}>
                <Icon size={20} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800">Engagement Overview</h3>
              <select className="text-xs border-none bg-slate-50 rounded-lg px-2 py-1 outline-none text-slate-600 font-medium">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="engagement" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
             <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Recent Projects</h3>
              <Button variant="ghost" size="sm" className="text-indigo-600">View All</Button>
            </div>
            <div className="divide-y divide-slate-50">
              {recentProjects.map((project) => (
                <div key={project.id} className="py-3 flex items-center justify-between group cursor-pointer hover:bg-slate-50 -mx-6 px-6 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all`}>
                      {project.type === 'Idea' && <LightbulbIcon size={18} />}
                      {project.type === 'Caption' && <PenIcon size={18} />}
                      {project.type === 'Calendar' && <CalendarIcon size={18} />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm group-hover:text-indigo-700 transition-colors">{project.title}</h4>
                      <p className="text-xs text-slate-500">{project.platform} • {project.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <Badge variant={project.status === 'Published' ? 'success' : project.status === 'Scheduled' ? 'warning' : 'neutral'}>
                        {project.status}
                     </Badge>
                     <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-400" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-none shadow-xl shadow-indigo-200">
             <div className="flex items-start justify-between mb-4">
               <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                 <Zap className="text-yellow-300" size={24} />
               </div>
               <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded text-white">PRO TIP</span>
             </div>
             <h3 className="text-lg font-bold mb-2">Repurpose your viral hits!</h3>
             <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
               Your "Top 5 Tools" post on LinkedIn got 450% more engagement. Turn it into a Twitter thread now?
             </p>
             <Button variant="secondary" size="sm" className="w-full text-indigo-700" onClick={() => onNavigate(View.REPURPOSE)}>
               Try Repurposing
             </Button>
          </Card>

          <Card className="p-6">
             <h3 className="font-bold text-slate-800 mb-4">Quick Shortcuts</h3>
             <div className="grid grid-cols-2 gap-3">
               <button onClick={() => onNavigate(View.IDEAS)} className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-2 text-center group">
                  <Lightbulb size={20} className="text-indigo-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-slate-600">New Idea</span>
               </button>
               <button onClick={() => onNavigate(View.CAPTIONS)} className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-2 text-center group">
                  <PenIcon size={20} className="text-pink-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-slate-600">Caption</span>
               </button>
               <button onClick={() => onNavigate(View.HASHTAGS)} className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-2 text-center group">
                  <HashIcon size={20} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-slate-600">Hashtags</span>
               </button>
               <button onClick={() => onNavigate(View.CALENDAR)} className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-2 text-center group">
                  <CalendarIcon size={20} className="text-orange-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-slate-600">Schedule</span>
               </button>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const LightbulbIcon = ({ size, className }: { size?: number, className?: string }) => <Lightbulb size={size} className={className} />;
const PenIcon = ({ size, className }: { size?: number, className?: string }) => <PenTool size={size} className={className} />;
const CalendarIcon = ({ size, className }: { size?: number, className?: string }) => <Calendar size={size} className={className} />;
const HashIcon = ({ size, className }: { size?: number, className?: string }) => <React.Fragment><span className="font-bold text-lg leading-none">#</span></React.Fragment>;
