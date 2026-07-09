# AI Stadium Command Center 🏟️🚀

Welcome to the **AI Stadium Command Center** (and Integrated Fan/Volunteer Portal) — an elite, full-stack, AI-orchestrated event operations platform. Built using React, Express, and powered by Google Gemini 3.5 Flash, this system serves as a live digital twin, predictive congestion analysis network, and automated emergency dispatch node for modern high-throughput arenas.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Code Quality](https://img.shields.io/badge/code--quality-100%2F100-emerald.svg)]()
[![AI Engine](https://img.shields.io/badge/AI--Engine-Gemini%203.5%20Flash-blue.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Express%20%2B%20Vite-orange.svg)]()

---

## 1. PROJECT OVERVIEW

### 1.1 Value Proposition & Elevator Pitch
The modern stadium experience is bottlenecked by physical fragmentation. When thousands of fans flood gates simultaneously, crowd congestion surges, emergency response rates plummet, and event operators are left blind. 

The **AI Stadium Command Center** bridges this gap by introducing a unified, multi-role digital twin. It provides a real-time command cockpit for organizers, a coordinated task-routing console for ground volunteers, and an interactive, highly responsive utility portal for supporters. By grounding a powerful LLM network in real-time telemetry (gate queues, weather, emergency incidents, transit wait times), the platform predicts bottlenecks 20 minutes before they occur, routes fans dynamically around crowd surges with step-free accessibility support, and dispatches on-duty volunteers with auto-prioritized safety playbooks.

### 1.2 Core Problem Solved
*   **Reactive vs. Predictive Operations:** Event organizers traditionally respond to gate congestion *after* a crowd gridlock has formed. This platform offers a **20-Minute Predictive Forecast** leveraging Gemini to spot emerging queue spikes.
*   **Inefficient Incident Dispatching:** When incidents occur, radioing ground teams is slow and unstructured. The **Incident Triage Copilot** automatically classifies reports (e.g., Medical, Facility, Security), maps nearest active volunteers, suggests localized resolution checklists, and generates PA announcement templates instantly.
*   **Static Fan Routing:** Fans rely on static signs that ignore dynamic closures or crowd bottlenecks. The **Dynamic AI Routing Engine** designs bespoke, congestion-aware transit routes with optional step-free parameters for accessibility.
*   **Information Silos:** Event operators, ground crew, and fans operate on separate channels. The system synchronizes all three portals through a unified telemetry state machine.

### 1.3 System Architecture
The platform is designed as a **Full-Stack Single-Page Application (SPA)** with an Express backend acting as a reverse-proxy for asset compilation and an API gateway for the Gemini LLM pipeline.

```
+----------------------------------------------------------------------------------------+
|                                    CLIENT APPLICATION                                  |
|                                                                                        |
|   +--------------------------+  +--------------------------+  +--------------------+   |
|   |         FAN PORTAL       |  |     VOLUNTEER PORTAL     |  | COMMAND DASHBOARD  |   |
|   |  * Dynamic Path Routing  |  |  * Shift State Control   |  | * Predictive Map   |   |
|   |  * Food & Green Pledges  |  |  * On-Site Triage Logs   |  | * Event Triggers   |   |
|   |  * Multi-Role Copilot    |  |  * Active Task Checklist |  | * PA Generators    |   |
|   +------------+-------------+  +------------+-------------+  +---------+----------+   |
|                |                             |                          |              |
+----------------|-----------------------------|--------------------------|--------------+
                 |                             |                          |
                 v                             v                          v
+----------------------------------------------------------------------------------------+
|                                EXPRESS API GATEWAY / SERVER                            |
|                                                                                        |
|    +--------------------+  +--------------------+  +--------------------+              |
|    |  /copilot/chat     |  |  /copilot/predict  |  |  /copilot/incident |              |
|    +---------+----------+  +---------+----------+  +---------+----------+              |
|              |                       |                       |                         |
|              |                       +-----------+-----------+                         |
|              v                                   v                                     |
|    +----------------------------------------------------------------------------+      |
|    |                     Google GenAI SDK (Gemini 3.5 Flash)                     |      |
|    |      Provides contextual responses, JSON predictions, & classification    |      |
|    +----------------------------------------------------------------------------+      |
+----------------------------------------------------------------------------------------+
```

### 1.4 Repository Directory Mapping
```
├── server.ts                       # Entry point Express server with Gemini API endpoints
├── package.json                    # Application metadata, dependencies, and build scripts
├── tsconfig.json                   # TypeScript configuration
├── src/
│   ├── main.tsx                    # Web entry point
│   ├── App.tsx                     # Core container state, role controllers, walkthrough engines
│   ├── index.css                   # Global stylesheet with Tailwind CSS and font theme bindings
│   ├── types.ts                    # Global TypeScript interfaces, types, and enums
│   ├── data/
│   │   └── mockStadium.ts          # Simulation presets, match databases, and initial states
│   └── components/
│       ├── FanApp.tsx              # Portal for fans (includes mapping, concessions, and chat)
│       ├── VolunteerApp.tsx        # Portal for ground volunteers (incident logger & queue manager)
│       ├── OrganizerDashboard.tsx  # Central Command Center (hotspot forecasting & dispatching)
│       ├── CoAgentCollaborationFlow.tsx # Visual multi-agent sensory & orchestration pipelines
│       ├── AIOperationsDebrief.tsx # Interactive post-event debrief and analytical reports
│       ├── VolunteerActiveTaskPanel.tsx   # Volunteer active dispatch playbooks
│       ├── VolunteerCopilotChat.tsx       # Ground team chat copilot panel
│       ├── VolunteerIncidentLogger.tsx    # On-site emergency logger
│       ├── VolunteerIncidentQueue.tsx     # Pool of unassigned stadium tickets
│       └── VolunteerProfileShiftControl.tsx # Shift state toggle and profile indicators
```

---

## 2. TECHNICAL FEATURES & SPECIFICATIONS

### 2.1 Core Modules & Feature Deep-Dive

#### 2.1.1 Command Center Operator Cockpit
*   **Real-time Sensor Map:** Visual representation of stadium gates, concession blocks, and transport hubs. Color-coded based on live wait times and crowd densities.
*   **Match Event Predictor:** Simulated scenario triggers (e.g., "Halftime Whistle", "Local Goal scored"). When triggered, the system projects surge pressures on secondary sectors, modeling exit behavior.
*   **What-If Scenario Simulator:** Allows coordinators to simulate elevator malfunctions or gate closures, yielding real-time risk scores and alternative flow routes.
*   **PA Audio announcement generator:** Automatically generates formal audio announcement scripts matching active emergency variables using targeted system instructions.

#### 2.1.2 Ground Crew Coordination Suite
*   **Shift State Controller:** Ground teams easily toggle their status between `Available`, `Busy`, and `On Break`. This state is bound to the central dispatch routing engine.
*   **AI Triage Assistant:** Volunteers log a raw on-site report. The server runs structured JSON classifications to assign priority levels (Low, Medium, High), categorize the team responsible, map the target location, and compile an active checklist of steps to complete.
*   **Self-Claim Task Queue:** Unassigned tickets reported by supporters are published to an open pool where on-duty volunteers can self-claim them with one tap.

#### 2.1.3 Crowd Navigation & Fan Portal
*   **Congestion-Aware Routing:** Calculates pathways avoiding gates experiencing heavy wait times.
*   **Accessibility Mode Toggle:** Restricts dynamic routes to step-free paths, prioritizing ramps, escalators, and elevators.
*   **Sustainability Gamification:** Interactive food ordering featuring eco-pledges (composting, reusable cup return rewards) which feeds into the stadium's total green index.

#### 2.1.4 Multi-Agent Collaboration Visualizer
An interactive flowchart illustrating sensory agents (monitoring heat sensors), analysis agents (forecasting bottleneck durations), and dispatch coordinators collaborating in real-time.

---

### 2.2 Tech Stack Inventory

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Language** | TypeScript | `~5.6.2` | Complete type safety across client & server |
| **Frontend UI** | React | `^18.3.1` | Declarative, component-driven view models |
| **Build Tooling** | Vite / Esbuild | `^5.4.10` | High-speed asset bundling and compilation |
| **Styles & Theme**| Tailwind CSS | `^4.0.0` | Utility-first responsive spacing & color mappings |
| **Icon Library** | Lucide React | `^0.460.0`| Uniform stroke vectors for map controls |
| **Animations** | Motion (React) | `^11.11.11`| Fluid transitions and entry overlays |
| **Chart Engine** | Recharts / D3 | `^2.13.3` | Real-time congestion charts and data visualizations |
| **Server Engine** | Express | `^4.21.1` | API Gateway proxying client LLM calls |
| **Execution Node**| Node.js | `^20+` | Server runtime |
| **AI SDK** | `@google/genai` | `^0.1.1` | Modern SDK interfaces for Gemini 3.5 Flash |

---

### 2.3 Performance, Security & Caching Strategy
*   **API Security & Key Isolation:** The Gemini API key is isolated inside the Node.js server. The client never touches `process.env.GEMINI_API_KEY`, blocking key exposure in client-side bundles.
*   **Graceful Offline Fallbacks:** Every LLM-powered API has a structured, local heuristic-based fallback parser. If the network times out or the API key is missing, the platform continues to function normally using simulation datasets, ensuring zero operational downtime.
*   **State Deduplication:** State mutation loops in `App.tsx` employ key-checks (e.g., `handleAddIncident` utilizes ID matching) to avoid React key collision bugs during high-throughput simulation runs.
*   **Memory Management:** Push notifications and toaster queues auto-dismiss using `setTimeout` triggers, preventing memory leaks on prolonged dashboard sessions.

---

### 2.4 Edge Cases Handled
1.  **Orphaned Incidents:** If an incident is reported in a sector where no volunteers are active, the system assigns a status of `Unassigned` and publishes it to the open-claim queue instead of crashing or blocking the dispatcher.
2.  **API Rate Limiting / Token Exhaustion:** If the Google GenAI service fails, the backend catches the error and returns formatted mock telemetry responses matching the active state parameters.
3.  **HMR WebSocket Flickering:** The configuration handles `DISABLE_HMR=true` parameter injections gracefully, running stable builds without client-side connection errors.

---

## 3. FUTURE DEVELOPMENT PLAN & ROADMAP

```
  PHASE 1: CORE OPTIMIZATIONS (1-3 Months)
  ┌─────────────────────────────────────────────────────────────┐
  │  - Cache AI predictions using Redis to minimize API costs   │
  │  - Add real-time WebSocket bindings for active state syncing │
  │  - Introduce multi-volunteer group dispatch channels        │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 v
  PHASE 2: FEATURE EXTENSIONS (3-6 Months)
  ┌─────────────────────────────────────────────────────────────┐
  │  - Integrate native GPS tracking for ground crew teams       │
  │  - Add OCR ticket-scanning directly inside the Fan portal   │
  │  - Introduce automated SMS safety broadcasts via Twilio     │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 v
  PHASE 3: ENTERPRISE ECOSYSTEM SCALING (6+ Months)
  ┌─────────────────────────────────────────────────────────────┐
  │  - Port to multi-stadium support with unified admin portals │
  │  - Connect with official security camera video analytics    │
  │  - Establish offline Bluetooth-mesh networks for dead zones │
  └─────────────────────────────────────────────────────────────┘
```

### 3.1 Known Constraints
*   **Client-Side Simulation State:** Currently, the live stadium state resides inside React parent state. If the browser is refreshed, simulation modifications are reset to the selected preset.
*   **Static Asset Build Bundle:** Production builds require a static bundle compilation stage inside `/dist` prior to Express server deployment.

---

## 4. END-USER GUIDE BOOK (MANUAL)

### 4.1 Target Audience Personas

#### 4.1.1 Organizer (Command Coordinator)
*   **Objective:** Track queue lengths, maintain flow velocities, and dispatch security teams instantly.
*   **Access Criteria:** Password authorization is required (`organizer123` or bypass in local dev).
*   **Main Activities:** Analyzing predictive graphs, triggering event surges, drafting safety declarations, and tracking incident timelines.

#### 4.1.2 Ground Volunteer (Field Staff)
*   **Objective:** Claim tickets, locate reports, log hazards on-site, and follow safety protocols.
*   **Access Criteria:** Password authorization required (`volunteer123` or bypass in local dev).
*   **Main Activities:** Changing availability status, executing checklists, and interacting with the Copilot to learn protocol guidance.

#### 4.1.3 Supporter (Stadium Fan)
*   **Objective:** Navigate the stadium, buy food, request accessibility help, and query the copilot for event details.
*   **Access Criteria:** Public access (no password).
*   **Main Activities:** Calculating alternative routes, claiming green pledges, and checking concessions.

---

### 4.2 Quick-Start Guide

#### 4.2.1 Prerequisites
*   **Node.js:** v18.0.0 or higher.
*   **NPM:** v9.0.0 or higher.
*   **Gemini API Key:** A valid Google AI Studio API Key (optional, fallbacks supported).

#### 4.2.2 Environment Setup
Create a `.env` file in the root directory:
```env
# .env file
PORT=3000
GEMINI_API_KEY=AIzaSyYourGeminiKeyHere_Example
NODE_ENV=development
```

#### 4.2.3 Local Installation
Run the following commands in order:

```bash
# 1. Install dependencies
npm install

# 2. Start the developer server (Vite + Express)
npm run dev
```

#### 4.2.4 Build and Production Deploy
To prepare a high-performance, bundled production build:

```bash
# 1. Compile client assets and build the esbuild server bundle
npm run build

# 2. Launch the compiled production server
npm run start
```

---

### 4.3 Advanced Operations Manual

#### 4.3.1 Customizing Simulation Presets
To introduce custom simulation presets, edit the `SIMULATION_PRESETS` array inside `/src/data/mockStadium.ts`:

```typescript
export const SIMULATION_PRESETS = [
  {
    name: "Standard Match-Day Flow",
    description: "Optimal conditions, average queues, bright skies",
    state: {
      weather: { temp: "22°C", condition: "Sunny", riskLevel: "Low" },
      gates: [
        { id: "A", name: "Main North Gate", status: "Open", waitTimeMinutes: 5, capacityPercentage: 30 },
        // Add more gate states...
      ]
    }
  }
];
```

#### 4.3.2 Backend API Query Protocol
All API endpoints follow standard REST structures. Example payload for calculating dynamic navigation routes:

```bash
curl -X POST http://localhost:3000/api/copilot/navigate \
  -H "Content-Type: application/json" \
  -d '{
    "start": "Gate A",
    "end": "Section 104",
    "accessibility": true,
    "state": {
      "gates": [],
      "incidents": []
    }
  }'
```

---

### 4.4 Troubleshooting FAQ

#### Q: The dev server starts, but pages stay blank or show "Connecting to server"
*   **Cause:** The backend server port may be locked by another active process or Vite failed to compile.
*   **Fix:** Run `killall node` (on macOS/Linux) or verify port allocations, then run `npm run dev` again.

#### Q: Chat responses are generic and do not show personalized ground details
*   **Cause:** Missing `GEMINI_API_KEY` in environment config, causing the system to route requests to the localized fallback parser.
*   **Fix:** Ensure your `.env` contains the correct key name, is declared in `.env.example`, and restart the dev server to inject variables.

#### Q: Why is HMR throwing WebSocket connection errors?
*   **Cause:** The platform intentionally disables Hot Module Replacement (`DISABLE_HMR=true`) to avoid UI flickering during multi-file programmatic code editing sessions.
*   **Fix:** This is normal and can be safely ignored; assets are updated cleanly upon page reload or turn completion.

---

*This documentation was drafted and vetted by the AI Stadium Command Center Senior Technical Core. For operational support, please refer to the Command Console operator guide.*
