import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Select, Input } from '../components/UI';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Instagram, Linkedin, Twitter, Youtube, Video, X, Filter, Bell, Clock } from 'lucide-react';
import { CalendarEvent } from '../types';

// Mock Data
const initialEvents: CalendarEvent[] = [
  { id: '1', date: '2024-05-15', time: '09:00', title: 'Product Launch Teaser', platform: 'Instagram', status: 'Published' },
  { id: '2', date: '2024-05-18', time: '14:30', title: 'Industry Insights Thread', platform: 'Twitter', status: 'Scheduled' },
  { id: '3', date: '2024-05-20', title: 'Weekly Vlog', platform: 'YouTube', status: 'Draft' },
  { id: '4', date: '2024-05-22', time: '10:00', title: 'CEO Interview Clip', platform: 'LinkedIn', status: 'Scheduled' },
  { id: '5', date: '2024-05-25', title: 'Summer Sale Announcement', platform: 'Instagram', status: 'Draft' },
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'Instagram': return <Instagram size={14} className="text-pink-600" />;
    case 'LinkedIn': return <Linkedin size={14} className="text-blue-700" />;
    case 'Twitter': return <Twitter size={14} className="text-zinc-800" />;
    case 'YouTube': return <Youtube size={14} className="text-red-600" />;
    case 'TikTok': return <Video size={14} className="text-zinc-900" />;
    default: return <CalendarIcon size={14} className="text-zinc-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Published': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'Scheduled': return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'Draft': return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    default: return 'bg-zinc-50';
  }
};

export const ContentCalendar = () => {
  // State
  const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 1)); // Fixed May 2024 for demo
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);
  
  // Filters
  const [platformFilter, setPlatformFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form State
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    platform: 'Instagram',
    date: '',
    time: '',
    status: 'Draft'
  });

  // --- Notifications ---
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const triggerNotification = (title: string, date: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification("Content Scheduled", {
        body: `"${title}" is scheduled for ${date}`,
        icon: '/favicon.ico'
      });
    }
  };

  // --- Calendar Logic ---
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDay }, (_, i) => i);

  const handleMonthChange = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  // --- CRUD Operations ---
  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.platform) return;
    
    const event: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      platform: newEvent.platform as any,
      status: newEvent.status as any,
    };

    setEvents([...events, event]);
    setIsModalOpen(false);
    
    // Reset Form
    setNewEvent({ title: '', platform: 'Instagram', date: '', time: '', status: 'Draft' });

    if (event.status === 'Scheduled') {
      triggerNotification(event.title, event.date);
    }
  };

  const openModal = (date?: string) => {
    if (date) {
      setNewEvent(prev => ({ ...prev, date }));
    } else {
      // Default to today/current selection
      const todayStr = new Date().toISOString().split('T')[0];
      setNewEvent(prev => ({ ...prev, date: todayStr }));
    }
    setIsModalOpen(true);
  };

  // --- Drag & Drop ---
  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedEventId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    if (!draggedEventId) return;

    const updatedEvents = events.map(ev => 
      ev.id === draggedEventId ? { ...ev, date: dateStr } : ev
    );
    
    setEvents(updatedEvents);
    setDraggedEventId(null);
  };

  // --- Filtering ---
  const filteredEvents = events.filter(ev => {
    const matchPlatform = platformFilter === 'All' || ev.platform === platformFilter;
    const matchStatus = statusFilter === 'All' || ev.status === statusFilter;
    return matchPlatform && matchStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 relative">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <CalendarIcon className="text-zinc-900" /> Content Calendar
          </h1>
          <p className="text-zinc-500">Plan, schedule, and organize your social strategy.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           {/* Filters */}
           <div className="flex items-center gap-2 mr-2">
             <Filter size={16} className="text-zinc-400" />
             <select 
               className="bg-white border border-zinc-200 text-zinc-700 text-sm rounded-lg px-2.5 py-2 outline-none focus:border-zinc-800"
               value={platformFilter}
               onChange={(e) => setPlatformFilter(e.target.value)}
             >
               <option value="All">All Platforms</option>
               <option value="Instagram">Instagram</option>
               <option value="Twitter">Twitter</option>
               <option value="LinkedIn">LinkedIn</option>
               <option value="YouTube">YouTube</option>
               <option value="TikTok">TikTok</option>
             </select>
             
             <select 
               className="bg-white border border-zinc-200 text-zinc-700 text-sm rounded-lg px-2.5 py-2 outline-none focus:border-zinc-800"
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
             >
               <option value="All">All Status</option>
               <option value="Draft">Draft</option>
               <option value="Scheduled">Scheduled</option>
               <option value="Published">Published</option>
             </select>
           </div>

           <Button variant="black" onClick={() => openModal()}>
             <Plus size={16} className="mr-2"/> Add Event
           </Button>
        </div>
      </div>

      <Card className="p-6">
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-800">
            {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={() => handleMonthChange(-1)} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => () => setCurrentDate(new Date())} className="text-xs font-semibold px-3 py-1 hover:bg-zinc-100 rounded-md transition-colors">
              Today
            </button>
            <button onClick={() => handleMonthChange(1)} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 border border-zinc-200 rounded-xl overflow-hidden shadow-sm bg-zinc-50">
          {/* Day Names */}
          {daysOfWeek.map((day) => (
            <div key={day} className="p-3 bg-white border-b border-r border-zinc-100 font-semibold text-zinc-400 text-xs uppercase tracking-wider text-center last:border-r-0">
              {day}
            </div>
          ))}

          {/* Padding Days */}
          {paddingDays.map((_, idx) => (
             <div key={`padding-${idx}`} className="bg-zinc-50/50 border-b border-r border-zinc-100 min-h-[140px] last:border-r-0"></div>
          ))}

          {/* Actual Days */}
          {calendarDays.map((day) => {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = filteredEvents.filter(e => e.date === dateStr);
            
            // Highlight today
            const isToday = new Date().toDateString() === new Date(dateStr + 'T00:00:00').toDateString();

            return (
              <div 
                key={day} 
                className={`bg-white p-2 border-b border-r border-zinc-100 min-h-[140px] relative hover:bg-zinc-50 transition-colors group last:border-r-0 ${isToday ? 'bg-zinc-50/80' : ''}`}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, dateStr)}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-medium block mb-2 w-7 h-7 leading-7 text-center rounded-full ${isToday ? 'bg-zinc-900 text-white' : 'text-zinc-700'}`}>
                    {day}
                  </span>
                </div>
                
                <div className="space-y-1.5">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id} 
                      draggable
                      onDragStart={(e) => onDragStart(e, event.id)}
                      className={`p-2 rounded-lg border text-xs font-medium cursor-grab active:cursor-grabbing shadow-sm hover:opacity-80 transition-all ${getStatusColor(event.status)}`}
                    >
                       <div className="flex items-center gap-1.5 mb-1">
                         {getPlatformIcon(event.platform)}
                         <span className="truncate flex-1 opacity-75">{event.time || ''}</span>
                       </div>
                       <p className="truncate text-zinc-900 font-semibold leading-tight">{event.title}</p>
                    </div>
                  ))}
                </div>
                
                {/* Quick Add Button (Hover) */}
                <button 
                  onClick={() => openModal(dateStr)}
                  className="absolute bottom-2 right-2 p-1.5 text-zinc-300 hover:text-zinc-900 hover:bg-zinc-200 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Add Event on this day"
                >
                  <Plus size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* --- Add Event Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <CalendarIcon size={20} /> Schedule Post
            </h2>

            <div className="space-y-4">
              <Input 
                label="Post Title" 
                placeholder="e.g. New Feature Announcement"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                autoFocus
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  label="Platform"
                  options={[
                    { label: 'Instagram', value: 'Instagram' },
                    { label: 'Twitter (X)', value: 'Twitter' },
                    { label: 'LinkedIn', value: 'LinkedIn' },
                    { label: 'YouTube', value: 'YouTube' },
                    { label: 'TikTok', value: 'TikTok' },
                  ]}
                  value={newEvent.platform}
                  onChange={(e) => setNewEvent({...newEvent, platform: e.target.value as any})}
                />
                
                <Select 
                  label="Status"
                  options={[
                    { label: 'Draft', value: 'Draft' },
                    { label: 'Scheduled', value: 'Scheduled' },
                    { label: 'Published', value: 'Published' },
                  ]}
                  value={newEvent.status}
                  onChange={(e) => setNewEvent({...newEvent, status: e.target.value as any})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Date</label>
                    <input 
                      type="date"
                      className="px-3 py-2.5 rounded-lg border border-zinc-200 focus:border-zinc-800 focus:ring-0 outline-none transition-all bg-white text-zinc-900"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    />
                 </div>
                 <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Time</label>
                    <input 
                      type="time"
                      className="px-3 py-2.5 rounded-lg border border-zinc-200 focus:border-zinc-800 focus:ring-0 outline-none transition-all bg-white text-zinc-900"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    />
                 </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="black" className="flex-1" onClick={handleSaveEvent} disabled={!newEvent.title || !newEvent.date}>
                  {newEvent.status === 'Scheduled' ? 'Schedule Post' : 'Save Draft'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
