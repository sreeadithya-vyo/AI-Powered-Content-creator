import React from 'react';
import { 
  LayoutDashboard, 
  Lightbulb, 
  PenTool, 
  Hash, 
  Calendar, 
  Repeat, 
  Settings, 
  LogOut,
  Zap,
  BarChart2,
  Mic2
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
  onLogout: () => void;
  userPlan?: 'Free' | 'Pro';
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onLogout, userPlan = 'Free' }) => {
  
  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.IDEAS, label: 'Idea Generator', icon: Lightbulb },
    { id: View.CAPTIONS, label: 'Captions & AI Writer', icon: PenTool },
    { id: View.HASHTAGS, label: 'Hashtag Assistant', icon: Hash },
    { id: View.CALENDAR, label: 'Content Calendar', icon: Calendar },
    { id: View.REPURPOSE, label: 'Repurpose Content', icon: Repeat },
    { id: View.BRAND_VOICE, label: 'Brand Voice', icon: Mic2 },
    { id: View.ANALYTICS, label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 h-screen fixed left-0 top-0 flex flex-col z-10 shadow-sm">
      <div className="p-6 border-b border-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">CreatorFlow</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2">Workspace</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
              {item.label}
            </button>
          );
        })}

        <div className="mt-8">
           <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Settings</p>
           <button
              onClick={() => onChangeView(View.SETTINGS)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentView === View.SETTINGS
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Settings size={18} className={currentView === View.SETTINGS ? 'text-indigo-600' : 'text-slate-400'} />
              Preferences
            </button>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-50 bg-slate-50/50">
        {userPlan === 'Free' && (
          <div className="mb-4 p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
            <h4 className="font-semibold text-sm mb-1">Upgrade to Pro</h4>
            <p className="text-xs text-indigo-100 mb-3 opacity-90">Unlock unlimited AI generations and analytics.</p>
            <button className="w-full py-1.5 bg-white text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-50 transition-colors">
              Upgrade Now
            </button>
          </div>
        )}
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">Jane Doe</p>
            <p className="text-xs text-slate-500 truncate">jane@creator.com</p>
          </div>
          <button onClick={onLogout} className="text-slate-400 hover:text-rose-500 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
