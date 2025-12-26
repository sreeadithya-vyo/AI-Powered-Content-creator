export enum View {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  IDEAS = 'IDEAS',
  CAPTIONS = 'CAPTIONS',
  HASHTAGS = 'HASHTAGS',
  CALENDAR = 'CALENDAR',
  REPURPOSE = 'REPURPOSE',
  BRAND_VOICE = 'BRAND_VOICE',
  ANALYTICS = 'ANALYTICS',
  SETTINGS = 'SETTINGS',
}

export interface ContentIdea {
  title: string;
  hook: string;
  format: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
}

export interface HashtagGroup {
  name: string;
  tags: string[];
  relevance: number;
  competition: 'Low' | 'Medium' | 'High';
}

export interface Project {
  id: string;
  title: string;
  type: 'Idea' | 'Caption' | 'Repurpose' | 'Calendar';
  platform: string;
  status: 'Draft' | 'Scheduled' | 'Published';
  createdAt: string;
  content?: string;
}

export interface BrandVoice {
  name: string;
  description: string;
  keywords: string[];
  toneSample: string;
}

export interface BrandVoiceAnalysis {
  descriptors: string[];
  styleGuide: string;
  dos: string[];
  donts: string[];
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  title: string;
  platform: 'Instagram' | 'LinkedIn' | 'Twitter' | 'YouTube' | 'TikTok';
  status: 'Draft' | 'Scheduled' | 'Published';
}

export interface AnalyticsInsight {
  type: 'Growth' | 'Engagement' | 'Trend';
  title: string;
  description: string;
  actionableTip: string;
}
