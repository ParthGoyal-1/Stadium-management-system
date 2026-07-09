export type CrowdLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface StadiumSector {
  id: string;
  name: string;
  capacity: number;
  currentCount: number;
  crowdLevel: CrowdLevel;
  hasElevator: boolean;
  specialAlerts: string[];
}

export interface EntryGate {
  id: string;
  name: string;
  queueLength: number; // estimated people in line
  waitTimeMinutes: number;
  status: 'Open' | 'Closed' | 'Congested';
}

export interface TransportMode {
  id: string;
  name: string;
  status: 'On Time' | 'Delayed' | 'Suspended';
  waitTimeMinutes: number;
  info: string;
}

export interface Incident {
  id: string;
  description: string;
  location: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Logged' | 'Dispatched' | 'Resolved';
  assignedVolunteerId: string | null;
  timestamp: string;
  category: string;
  actionTaken?: string;
  reportSummary?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  status: 'Available' | 'Busy' | 'On Break';
  location: string;
  assignedTaskId: string | null;
  avatarUrl?: string;
}

export interface SustainabilityStats {
  co2SavedKg: number;
  wasteReducedKg: number;
  waterSavedLiters: number;
}

export interface StadiumState {
  sectors: StadiumSector[];
  gates: EntryGate[];
  transports: TransportMode[];
  incidents: Incident[];
  volunteers: Volunteer[];
  sustainability: SustainabilityStats;
  weather: {
    temp: number;
    condition: string;
    impact: string;
  };
  simulatedTime: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export type UserRole = 'fan' | 'volunteer' | 'organizer';
