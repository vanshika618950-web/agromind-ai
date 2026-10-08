# 🌾 AgroMind AI — Agentic Crop Advisory & Decision Support System

> **"Intelligent Crop Decisions. Powered by AI Agents."**

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47a248.svg)](https://www.mongodb.com/atlas)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20(@google/genai)-orange.svg)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 Overview

**AgroMind AI** is an enterprise-grade Agentic AI web platform designed to empower farmers, agronomists, and agricultural extension professionals with autonomous, multi-stage decision intelligence.

Unlike simple single-turn chatbot interfaces, AgroMind AI coordinates **four specialized, autonomous AI agents** that observe agricultural inputs, extract symptoms, reason through crop and soil physiology, assess economic yield risk, and construct a prioritized **7-day chronological farm action plan**.

---

## 🚨 Problem Statement

> *"Farmers often make crop-management decisions using fragmented information, delayed expert assistance, and manual coordination. This can lead to incorrect decisions, inefficient resource usage, crop-health issues, and inconsistent outcomes. AgroMind AI addresses this problem by using multiple specialized AI agents that collaboratively analyze crop conditions, assess risk, and generate an actionable crop-management plan."*

---

## 💡 Solution

> *"AgroMind AI is an Agentic AI crop advisory platform that autonomously analyzes agricultural problems through a coordinated pipeline of specialized AI agents. A Problem Analyzer identifies potential causes, a Crop Reasoning Agent generates crop-specific recommendations, a Risk Assessment Agent evaluates severity and urgency, and an Action Planner converts the analysis into a prioritized timeline. The system uses Google Gemini for reasoning and MongoDB Atlas for persistent advisory and agent-execution history."*

---

## 🤖 Agentic AI Architecture

AgroMind AI implements a deterministic, auditable multi-agent pipeline governed by a central **Agent Orchestrator**:

```
                              [ Farmer / User ]
                                     │
                             (React 19 Frontend)
                                     │
                             (Express REST API)
                                     │
                            [ JWT Authentication ]
                                     │
                           [ Zod Input Validation ]
                                     │
                        ┌────────────────────────────┐
                        │     Agent Orchestrator     │
                        └─────────────┬──────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
   ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
   │     AGENT 01     │ ───► │     AGENT 02     │ ───► │     AGENT 03     │
   │ Problem Analyzer │      │  Crop Reasoning  │      │ Risk Assessment  │
   └────────┬─────────┘      └────────┬─────────┘      └────────┬─────────┘
            │                         │                         │
            ▼                         ▼                         ▼
     [ AgentLog #1 ]           [ AgentLog #2 ]           [ AgentLog #3 ]
            │                         │                         │
            └─────────────────────────┼─────────────────────────┘
                                      │
                                      ▼
                             ┌──────────────────┐
                             │     AGENT 04     │
                             │  Action Planner  │
                             └────────┬─────────┘
                                      │
                                      ▼
                               [ AgentLog #4 ]
                                      │
                                      ▼
                        ┌────────────────────────────┐
                        │ Consolidated Advisory JSON │
                        └─────────────┬──────────────┘
                                      │
                         [ Stored in MongoDB Atlas ]
                                      │
                         [ Rendered on Dashboard UI ]
```

### The 4 Specialized Agents

| # | Agent Name | Primary Responsibility | Input Context | Output Schema |
|---|------------|------------------------|---------------|---------------|
| **01** | **Problem Analyzer Agent** | Extracts core symptoms, determines probable root causes, classifies category, and assigns confidence score. | Crop, location, soil, stage, symptoms, irrigation, weather | `category`, `identifiedProblem`, `possibleCauses`, `keySymptoms`, `confidence`, `missingInformation` |
| **02** | **Crop Reasoning Agent** | Analyzes crop physiology, soil nutrient absorption dynamics, and generates prioritized corrective actions. | Agent 1 output + soil type + growth stage | `analysis`, `recommendations [{ action, reason, priority }]`, `irrigationAdvice`, `nutrientAdvice` |
| **03** | **Risk Assessment Agent** | Evaluates severity, urgency window, yield loss risk factors, and flags if local agronomist escalation is required. | Agent 1 & Agent 2 outputs + symptom velocity | `riskLevel` (LOW, MEDIUM, HIGH, CRITICAL), `severity`, `urgency`, `riskReason`, `riskFactors`, `expertConsultationRecommended` |
| **04** | **Action Planner Agent** | Converts synthesized reasoning into a chronologically structured roadmap for field execution. | All previous agent outputs + farm context | `immediate`, `today`, `next3Days`, `next7Days`, `preventive`, `finalSummary` |

---

## ✨ Key Features

- **🔐 Cryptographic Authentication & Data Isolation:**
  - Secure bcrypt password hashing (12 salt rounds).
  - Signed JSON Web Tokens (JWT) protecting all private endpoints.
  - Strict tenant data isolation (`userId === authenticatedUser.id`) ensuring no user can access another user's advisories or audit logs.
- **🌾 Comprehensive Crop & Soil Matrix:**
  - Built-in support for Rice, Wheat, Cotton, Maize, Tomato, Potato, Groundnut, Soybean, Sugarcane, and custom crops.
  - Specific handling for Black Soil, Red Soil, Sandy Soil, Clay Soil, Loamy Soil, Alluvial Soil.
  - Granular growth stages from Seedling, Vegetative, Flowering, Fruiting, to Harvest.
- **📊 Real-Time Interactive Dashboard:**
  - Total advisories counter, high/critical risk alert metrics, and completed agent execution logs count.
  - Category breakdown distribution chart.
  - Quick action launcher for new diagnostic inquiries.
- **⚡ Live Multi-Agent Workflow Simulation:**
  - Visual animation displaying each of the 4 agents active during the generation phase.
  - Detailed audit view showing millisecond execution times, input/output inspection, and verification status.
- **📅 7-Day Farm Management Action Plan:**
  - Chronological phases: Immediate (right now), Day 1 (today), Days 2-3 (monitoring), Days 4-7 (recovery check), and Long-term preventive defense.
- **🔍 Historical Archive & Search:**
  - Filter by diagnostic category or risk level, with full-text search across symptoms, crops, and locations.
- **📱 Fully Responsive Design:**
  - Tailored SaaS aesthetic built with Tailwind CSS, supporting mobile phones, tablets, laptops, and ultra-wide desktops.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite 8
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v3.4 + Glassmorphism + Custom Agriculture Palette
- **Icons:** Lucide React
- **HTTP Client:** Axios (Centralized interceptors with automatic Bearer token injection)
- **Effects:** Canvas-Confetti

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Validation:** Zod Schema Validation
- **Authentication:** JWT (`jsonwebtoken`) + Password Hashing (`bcryptjs`)
- **Database:** MongoDB with Mongoose ODM
- **AI SDK:** Official `@google/genai` (Google Gemini 2.5 Flash) with resilient JSON extraction and retry logic
- **Zero-Config Dev Engine:** Built-in Agronomic Rule-based Expert Engine + `mongodb-memory-server` fallback for zero-barrier local evaluations

---

## 📂 Project Structure

```text
AGROMIND/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection & Atlas/Memory fallback
│   │   ├── controllers/
│   │   │   ├── authController.js     # Register, Login, Me, Logout
│   │   │   ├── advisoryController.js # CRUD & Orchestration endpoints
│   │   │   └── dashboardController.js# Aggregated stats & analytics
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT bearer protection
│   │   │   ├── validateMiddleware.js # Zod request validation
│   │   │   └── errorMiddleware.js    # Secure centralized error handler
│   │   ├── models/
│   │   │   ├── User.js               # User schema with bcrypt comparison
│   │   │   ├── Advisory.js           # Multi-agent crop advisory document
│   │   │   └── AgentLog.js           # Audit log for each individual agent run
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── advisoryRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   └── healthRoutes.js
│   │   ├── services/
│   │   │   ├── geminiService.js      # @google/genai integration & retry logic
│   │   │   ├── orchestrator.js       # Pipeline coordinator (Agent 1→2→3→4)
│   │   │   └── agents/
│   │   │       ├── problemAnalyzer.js# Agent 1 implementation
│   │   │       ├── cropReasoning.js  # Agent 2 implementation
│   │   │       ├── riskAssessment.js # Agent 3 implementation
│   │   │       └── actionPlanner.js  # Agent 4 implementation
│   │   ├── validators/
│   │   │   ├── authValidators.js
│   │   │   └── advisoryValidators.js
│   │   ├── scripts/
│   │   │   └── seed.js               # Realistic development demo seeder
│   │   └── server.js                 # Express server entrypoint
│   ├── tests/
│   │   └── api.test.js               # Node test suite (Auth, DB, Agents)
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RiskBadge.jsx
│   │   │   ├── RecommendationCard.jsx
│   │   │   ├── ActionPlanView.jsx
│   │   │   ├── AgentWorkflowTimeline.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Client auth state management
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx       # SaaS homepage with Agent collective
│   │   │   ├── LoginPage.jsx         # Login with 1-click Demo Account filler
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx     # Main stats & recent advisories
│   │   │   ├── NewAdvisoryPage.jsx   # Form & live agent execution animation
│   │   │   ├── AdvisoryDetailPage.jsx# Full advisory with all 4 agent logs
│   │   │   ├── HistoryPage.jsx       # Archive with search & filters
│   │   │   └── ProfilePage.jsx       # User details & session management
│   │   ├── services/
│   │   │   ├── api.js                # Axios instance with interceptors
│   │   │   ├── authApi.js
│   │   │   ├── advisoryApi.js
│   │   │   └── dashboardApi.js
│   │   ├── App.jsx                   # React Router root
│   │   ├── main.jsx
│   │   └── index.css                 # Tailwind design tokens & custom utilities
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── vercel.json
│   ├── .env.example
│   └── package.json
│
├── render.yaml                       # Render deployment manifest
├── vercel.json                       # Vercel deployment manifest
├── .gitignore
├── package.json                      # Root workspace scripts
└── README.md
```

---

## ⚡ Quick Start (Local Setup)

### Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- (Optional) **MongoDB Atlas connection string** or local MongoDB
- (Optional) **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/agromind-ai.git
cd agromind-ai
```

### Step 2: Install Dependencies
Run the workspace installer script from the root:
```bash
npm run install:all
```
*(Alternatively, run `npm install` inside both `backend` and `frontend` folders).*

---

### Step 3: Configure Environment Variables

#### Backend Configuration
Copy `.env.example` to `.env` in `backend/`:
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env`:
```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/agromind?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=super_secret_jwt_key_at_least_32_characters_long
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
> **Note:** If `MONGODB_URI` is left blank during local development, AgroMind automatically initializes an in-memory MongoDB instance so you can test immediately with zero external dependencies!

#### Frontend Configuration
Copy `.env.example` to `.env` in `frontend/`:
```bash
cp frontend/.env.example frontend/.env
```
Ensure `frontend/.env` contains:
```env
VITE_API_URL=http://localhost:5001/api
```

---

### Step 4: Seed Development Demo Data (Optional but Recommended)
Populate the database with a pre-configured demo user and realistic multi-agent advisories:
```bash
npm run seed
```
This generates:
- **Email:** `farmer@agromind.ai`
- **Password:** `Password123!`
- **Sample Advisories:** Rice (Nitrogen chlorosis in Black Soil) and Cotton (Pink Bollworm during Flowering stage) with full agent logs.

---

### Step 5: Run Automated Tests
Execute the backend unit and multi-agent integration test suite:
```bash
npm test
```
All 5 automated tests verify database connectivity, bcrypt encryption, the 4-agent orchestrator pipeline, and strict data isolation.

---

### Step 6: Start the Application

You can start both servers simultaneously from the root:
```bash
npm run dev
```

Or start them individually in separate terminals:

**Terminal 1 (Backend API & AI Orchestrator):**
```bash
cd backend
npm run dev
# Server listening on http://localhost:5001
```

**Terminal 2 (React Vite Frontend):**
```bash
cd frontend
npm run dev
# Client running at http://localhost:5173 (or http://localhost:5174)
```

Open your browser at `http://localhost:5173` to explore **AgroMind AI**!

---

## 🔑 Demo Account Credentials

To quickly test without registering a new account, use:
- **Email:** `farmer@agromind.ai`
- **Password:** `Password123!`

*(The Login screen includes a 1-click button: **"Fill Demo Credentials (Ramesh Patel)"**).*

---

## 📡 API Reference Documentation

All private routes require an `Authorization: Bearer <JWT>` header.

### Health Check
- `GET /api/health` — Returns status of backend server, MongoDB connection, and AI engine status.

### Authentication Endpoints
- `POST /api/auth/register` — Register a new farmer account.
- `POST /api/auth/login` — Authenticate and receive a JWT.
- `GET /api/auth/me` — Return currently authenticated user profile.
- `POST /api/auth/logout` — Invalidate user session.

### Advisory Endpoints
- `POST /api/advisories` — Submit crop data and trigger the 4-agent orchestration pipeline.
- `GET /api/advisories` — List user's advisories (supports `?category=`, `?riskLevel=`, `?search=`).
- `GET /api/advisories/:id` — Retrieve full advisory details (enforces data isolation).
- `DELETE /api/advisories/:id` — Delete an advisory and its related agent audit logs.
- `GET /api/advisories/:id/agents` — Retrieve execution logs and times for all 4 agents for an advisory.

### Dashboard Endpoints
- `GET /api/dashboard/stats` — Retrieve aggregated farm metrics, risk counters, and category distribution.

---

## 🚀 Deployment Guide

### Deploying Frontend to Vercel
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/).
3. Set the **Root Directory** to `frontend`.
4. Add the environment variable:
   - `VITE_API_URL` = `https://your-backend-service.onrender.com/api`
5. Deploy! Vercel will use `frontend/vercel.json` for client-side routing.

### Deploying Backend to Render
1. Create a new Web Service on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Configure the service:
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Set the Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `MONGODB_URI` = `mongodb+srv://<user>:<pwd>@cluster0.mongodb.net/agromind?retryWrites=true&w=majority`
   - `GEMINI_API_KEY` = `your_gemini_api_key`
   - `JWT_SECRET` = `your_secure_jwt_secret`
   - `CLIENT_URL` = `https://your-agromind-app.vercel.app`
5. Deploy! Render will monitor `/api/health` for automatic zero-downtime health verification.

---

## 🛡️ Security & Environmental Standards

- **Server-Side AI Secrets:** The `GEMINI_API_KEY` is maintained strictly on the Node.js backend. It is never bundled into or accessible by client code.
- **Data Isolation:** User ID is derived exclusively from verified JWT tokens on the backend. No user can view or delete another user's advisories.
- **Input Sanitization:** Every request payload is strictly validated using Zod against maximum length and enumerated type limits.
- **Safety Disclaimer:** The platform prominently states that all AI-generated guidance is decision-support material and encourages local expert consultation for severe situations.

---

## 📜 Safety & Agricultural Disclaimer

> **IMPORTANT:** AI-generated agricultural guidance is provided for informational and decision-support purposes only. Micro-climates, soil chemistry, and weather fluctuate by farm. For severe crop damage, suspected viral/bacterial outbreaks, or uncertain conditions, always consult a qualified local agricultural extension officer, university research station, or certified agronomist before taking significant chemical action.

---

## 👥 Contributors & Acknowledgements

Created with ❤️ by the **AgroMind AI Team**. Powered by Google DeepMind's Gemini models and modern Agentic AI workflows.
