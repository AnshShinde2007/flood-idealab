export type WaterLevelStatus = 'normal' | 'rising' | 'danger' | 'critical';
export type ActionRequired = 'safe' | 'stay-alert' | 'evacuate';

export interface FloodUpdate {
  id: string;
  time: string;
  location: string;
  district: string;
  waterLevel: WaterLevelStatus;
  action: ActionRequired;
  details?: string;
  timestamp: Date;
}

export interface District {
  id: string;
  name: string;
  status: WaterLevelStatus;
  waterLevel?: number;
  lastUpdated: Date;
}

export interface AlertNotification {
  id: string;
  type: 'emergency' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  isActive: boolean;
}
