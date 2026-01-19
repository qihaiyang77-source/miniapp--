export interface Coordinates {
  x: number; // Percentage (0-100)
  y: number; // Percentage (0-100)
}

export enum AppRoute {
  DASHBOARD = 'DASHBOARD',
  SETTINGS = 'SETTINGS',
  PROFILE = 'PROFILE',
}

export interface UserSessionState {
  currentRoute: AppRoute;
  lastClick: Coordinates | null;
  isAdminGuiding: boolean;
  formValues: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  role: 'admin' | 'user' | 'system';
  text: string;
  timestamp: Date;
}