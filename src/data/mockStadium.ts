import { StadiumState, Volunteer, Incident } from "../types";

export const INITIAL_STADIUM_STATE: StadiumState = {
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
      info: "Running at max capacity. Scheduled every 3 minutes."
    },
    {
      id: "trans-shuttle",
      name: "Eco-Express Shuttles (East Loop)",
      status: "On Time",
      waitTimeMinutes: 5,
      info: "Direct transport to outer parking hub. Free with Match Ticket."
    },
    {
      id: "trans-ride",
      name: "Rideshare Hub (West Plaza)",
      status: "Delayed",
      waitTimeMinutes: 18,
      info: "High vehicle demand. 1.8x surge pricing in effect."
    }
  ],
  incidents: [
    {
      id: "inc-1",
      description: "Lost child crying near Sector 118 concourse. Wearing blue Argentina shirt.",
      location: "Sector North, Section 118",
      priority: "High",
      status: "Logged",
      assignedVolunteerId: null,
      timestamp: "19:25",
      category: "Lost & Found"
    },
    {
      id: "inc-2",
      description: "Broken handrail on row 8. Sharp edge exposure danger.",
      location: "Sector East, Section 204",
      priority: "Medium",
      status: "Dispatched",
      assignedVolunteerId: "vol-2",
      timestamp: "19:10",
      category: "Facility"
    }
  ],
  volunteers: [
    {
      id: "vol-1",
      name: "Carlos Ramos",
      status: "Available",
      location: "Gate C Entrance",
      assignedTaskId: null
    },
    {
      id: "vol-2",
      name: "Sarah Jenkins",
      status: "Busy",
      location: "Sector East Concourse",
      assignedTaskId: "inc-2"
    },
    {
      id: "vol-3",
      name: "Kenji Takahashi",
      status: "Available",
      location: "Gate A West Lobby",
      assignedTaskId: null
    },
    {
      id: "vol-4",
      name: "Amara Diop",
      status: "On Break",
      location: "Volunteer Hub (Room 21B)",
      assignedTaskId: null
    }
  ],
  sustainability: {
    co2SavedKg: 4280.4,
    wasteReducedKg: 894.2,
    waterSavedLiters: 14500
  },
  weather: {
    temp: 21,
    condition: "Clear",
    impact: "No immediate structural action needed."
  },
  simulatedTime: "19:35"
};

export const SIMULATION_PRESETS: { name: string; description: string; state: StadiumState }[] = [
  {
    name: "Pre-Match Rush (Current)",
    description: "Fans arriving in massive numbers. Gate A is highly congested, transit is running at peak capacity, weather is clear and pleasant.",
    state: INITIAL_STADIUM_STATE
  },
  {
    name: "Sudden Thunderstorm",
    description: "Heavy rain starting. Roof closure initiated, high demand for covered concourse areas, shuttle bus transit delayed, fans requesting medical blankets.",
    state: {
      ...INITIAL_STADIUM_STATE,
      weather: {
        temp: 14,
        condition: "Heavy Rain & Winds",
        impact: "Roof closing. Concourse sectors crowded as fans seek cover. Slippery walkways reported."
      },
      sectors: INITIAL_STADIUM_STATE.sectors.map(s => 
        s.id === 'sec-north' || s.id === 'sec-south' 
          ? { ...s, specialAlerts: [...s.specialAlerts, "Slippery entry stairways. Open emergency dry storage."] }
          : s
      ),
      transports: INITIAL_STADIUM_STATE.transports.map(t => 
        t.id === 'trans-shuttle' 
          ? { ...t, status: "Delayed", waitTimeMinutes: 15, info: "Speed reduced due to poor visibility on East loop road." }
          : t
      ),
      simulatedTime: "19:50"
    }
  },
  {
    name: "Halftime Food Rush",
    description: "Match is at break. High congestion in all concourse sectors. Concession queues exceeding 15 minutes. Volunteers need to redirect food traffic.",
    state: {
      ...INITIAL_STADIUM_STATE,
      sectors: INITIAL_STADIUM_STATE.sectors.map(s => ({
        ...s,
        currentCount: Math.floor(s.capacity * 0.95),
        crowdLevel: s.id === 'sec-west' ? 'Medium' : 'Critical',
        specialAlerts: s.id === 'sec-north' 
          ? ["Concession lines exceed 15 mins wait time. Counter 4 and 5 out of service."] 
          : ["High concourse flow. Direct supporters to East bathrooms."]
      })),
      gates: INITIAL_STADIUM_STATE.gates.map(g => ({
        ...g,
        queueLength: 50,
        waitTimeMinutes: 1,
        status: "Open"
      })),
      simulatedTime: "20:30"
    }
  },
  {
    name: "Post-Match Egress",
    description: "Match ended. Extreme crowd egress levels. Massive bottlenecks near Exit 7 and Metro Station entrance. Staggered departure advisory activated.",
    state: {
      ...INITIAL_STADIUM_STATE,
      sectors: INITIAL_STADIUM_STATE.sectors.map(s => ({
        ...s,
        currentCount: Math.floor(s.capacity * 0.4),
        crowdLevel: 'Low',
        specialAlerts: ["Egress in progress. Major corridor exits crowded."]
      })),
      gates: INITIAL_STADIUM_STATE.gates.map(g => ({
        ...g,
        queueLength: 2000,
        waitTimeMinutes: 25,
        status: g.id === 'gate-a' ? 'Congested' : 'Open'
      })),
      transports: [
        {
          id: "trans-metro",
          name: "Metro Line 1 (Stadium North Station)",
          status: "Delayed",
          waitTimeMinutes: 25,
          info: "Station platform queue metering in effect. Expect heavy queues."
        },
        {
          id: "trans-shuttle",
          name: "Eco-Express Shuttles (East Loop)",
          status: "On Time",
          waitTimeMinutes: 8,
          info: "Running 25 extra buses to speed up parking lot clear-out."
        },
        {
          id: "trans-ride",
          name: "Rideshare Hub (West Plaza)",
          status: "Delayed",
          waitTimeMinutes: 30,
          info: "Extremely high surge pricing. Long vehicle cues."
        }
      ],
      simulatedTime: "21:45"
    }
  }
];

export const ACCESS_STATION_LOCATIONS = [
  "Gate C (Accessible Lane)",
  "Sector South Elevator Deck",
  "Sector West Lobby",
  "Sector East Lift platform"
];
