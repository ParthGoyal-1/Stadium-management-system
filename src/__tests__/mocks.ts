import { vi } from 'vitest';
import { StadiumState, Volunteer, Incident } from '../types';

export const MOCK_STADIUM_STATE: StadiumState = {
  sectors: [
    {
      id: "sec-north",
      name: "North (Ultra End)",
      capacity: 15000,
      currentCount: 13800,
      crowdLevel: "High",
      hasElevator: false,
      specialAlerts: ["Concourse food stalls extremely congested."]
    },
    {
      id: "sec-east",
      name: "East (Family Stand)",
      capacity: 18000,
      currentCount: 14200,
      crowdLevel: "Medium",
      hasElevator: true,
      specialAlerts: []
    },
    {
      id: "sec-south",
      name: "South (Supporters Deck)",
      capacity: 14000,
      currentCount: 13500,
      crowdLevel: "High",
      hasElevator: true,
      specialAlerts: ["Active flares spotted in row 12. Security monitored."]
    },
    {
      id: "sec-west",
      name: "West (VIP & Suites)",
      capacity: 8000,
      currentCount: 4200,
      crowdLevel: "Low",
      hasElevator: true,
      specialAlerts: []
    }
  ],
  gates: [
    {
      id: "gate-a",
      name: "Gate A (Main North)",
      queueLength: 1250,
      waitTimeMinutes: 28,
      status: "Congested"
    },
    {
      id: "gate-b",
      name: "Gate B (South West)",
      queueLength: 740,
      waitTimeMinutes: 18,
      status: "Open"
    },
    {
      id: "gate-c",
      name: "Gate C (Accessible & East)",
      queueLength: 120,
      waitTimeMinutes: 4,
      status: "Open"
    },
    {
      id: "gate-d",
      name: "Gate D (Reserve West)",
      queueLength: 80,
      waitTimeMinutes: 2,
      status: "Open"
    }
  ],
  transports: [
    {
      id: "trans-metro",
      name: "Metro Line 1 (Stadium North Station)",
      status: "On Time",
      waitTimeMinutes: 3,
      info: "Running at max capacity."
    }
  ],
  incidents: [
    {
      id: "inc-1",
      description: "Water leak near section 12",
      location: "East Sector",
      priority: "Medium",
      status: "Logged",
      assignedVolunteerId: null,
      timestamp: "18:32",
      category: "Facility"
    }
  ],
  volunteers: [
    {
      id: "vol-1",
      name: "Carlos Ramos",
      status: "Available",
      location: "Gate C",
      assignedTaskId: null
    }
  ],
  sustainability: {
    co2SavedKg: 12.5,
    wasteReducedKg: 8.2,
    waterSavedLiters: 150
  },
  weather: {
    temp: 22,
    condition: "Sunny",
    impact: "No immediate threat"
  },
  simulatedTime: "18:45"
};

export const MOCK_VOLUNTEER: Volunteer = {
  id: "vol-1",
  name: "Carlos Ramos",
  status: "Available",
  location: "Gate C",
  assignedTaskId: null
};

export const MOCK_INCIDENT: Incident = {
  id: "inc-1",
  description: "Water leak near section 12",
  location: "East Sector",
  priority: "Medium",
  status: "Logged",
  assignedVolunteerId: null,
  timestamp: "18:32",
  category: "Facility"
};

// Global Fetch Mock helper
export function setupFetchMock(responseData: any, ok: boolean = true) {
  const fetchMock = vi.fn().mockImplementation(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(responseData),
    })
  );
  globalThis.fetch = fetchMock;
  return fetchMock;
}
