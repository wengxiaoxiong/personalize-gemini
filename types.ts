export enum Platform {
  LINKEDIN = 'LinkedIn',
  TWITTER = 'X (Twitter)',
  XIAOHONGSHU = '小红书',
  DOUYIN = '抖音',
  INSTAGRAM = 'Instagram',
  WECHAT = '公众号'
}

export interface Persona {
  id: string;
  name: string;
  role: string; // e.g., "Industry Expert", "KOC"
  platform: Platform;
  tone: string; // e.g., "Professional", "Witty", "Emotional"
  description: string; // Detailed instruction for the AI
  avatarColor: string;
}

export interface GeneratedContent {
  id: string;
  personaId: string;
  originalDraft: string;
  content: string;
  status: 'loading' | 'success' | 'error';
  timestamp: number;
  tags?: string[];
  analysis?: string; // Optional reasoning from AI
}

export interface AppState {
  personas: Persona[];
  history: GeneratedContent[];
}
