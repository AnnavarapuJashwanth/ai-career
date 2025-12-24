# CareerAI - Complete Project Guide & Documentation

## 🎯 Project Overview

**CareerAI** is an AI-powered career guidance platform that helps professionals identify skill gaps, analyze market trends, and generate personalized learning roadmaps. It uses Gemini AI to provide intelligent recommendations based on resume analysis and industry demands.

### Problem Statement
In today's rapidly evolving job market, professionals struggle to:
- Identify which skills are most valuable for their career growth
- Understand current market demands and trends
- Create structured upskilling plans
- Bridge the gap between current skills and target roles

### Solution
An AI-driven platform that:
- Analyzes resumes to extract current skills
- Compares skills against market trends
- Generates personalized career roadmaps
- Recommends courses and learning paths
- Tracks progress with visual dashboards

---

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   React     │ ◄────► │   FastAPI    │ ◄────► │   MongoDB   │
│  Frontend   │  HTTP  │   Backend    │         │   Database  │
└─────────────┘         └──────────────┘         └─────────────┘
                               │
                               │
                        ┌──────▼──────┐
                        │  Gemini AI  │
                        │     API     │
                        └─────────────┘
```

### Tech Stack

#### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Three.js** (@react-three/fiber) - 3D visualizations
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Toastify** - Notifications

#### Backend
- **FastAPI** - Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **PyMongo** - MongoDB driver
- **JWT** - Authentication
- **PDFPlumber** - Resume parsing
- **Google Gemini AI** - LLM integration
- **RapidAPI** - Market data

#### Database
- **MongoDB Atlas** - Cloud database
- Collections: users, analyses, roadmaps

---

## 📁 Project Structure

```
cmr/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables
│   ├── api/
│   │   ├── routes.py          # Main API endpoints
│   │   └── auth_routes.py     # Authentication endpoints
│   ├── models/
│   │   ├── auth.py            # User models
│   │   └── schemas.py         # Request/response models
│   ├── services/
│   │   ├── llm_service.py     # Gemini AI integration
│   │   ├── resume_parser.py  # Resume text extraction
│   │   ├── roadmap_generator.py # Roadmap creation logic
│   │   └── market_trend_service.py # Market analysis
│   ├── utils/
│   │   ├── db.py              # MongoDB connection
│   │   ├── security.py        # JWT & password hashing
│   │   └── settings.py        # Configuration
│   └── data/
│       ├── skills_database.json
│       └── roles_skills.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   ├── index.css          # Global styles
│   │   ├── pages/
│   │   │   ├── Landing.jsx    # Home page
│   │   │   ├── Dashboard.jsx  # Main dashboard
│   │   │   ├── InputForm.jsx  # Resume upload & role selection
│   │   │   ├── AuthPages.jsx  # Login/Signup
│   │   │   ├── Features.jsx   # Features page
│   │   │   ├── About.jsx      # About page
│   │   │   ├── CoursesPage.jsx
│   │   │   ├── MarketTrendsPage.jsx
│   │   │   └── SkillGapPage.jsx
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx        # Navigation header
│   │   │   │   ├── Sidebar.jsx       # Dashboard sidebar
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── DashboardHeader.jsx
│   │   │   ├── cards/
│   │   │   │   ├── PhaseCard.jsx
│   │   │   │   ├── DetailedPhaseCard.jsx
│   │   │   │   ├── SkillCard.jsx
│   │   │   │   ├── CourseCard.jsx
│   │   │   │   ├── SkillGapRadar.jsx
│   │   │   │   └── MarketTrendsBar.jsx
│   │   │   ├── 3d/
│   │   │   │   ├── RoadmapScene.jsx  # 3D roadmap visualization
│   │   │   │   ├── FuturisticRoadmap3D.jsx
│   │   │   │   └── NeonRoadmap3D.jsx
│   │   │   └── landing/
│   │   │       ├── HeroParallax.jsx
│   │   │       ├── StatsStrip.jsx
│   │   │       ├── RoadmapShowcase.jsx
│   │   │       ├── BackgroundMesh.jsx
│   │   │       ├── Testimonials.jsx
│   │   │       ├── FeaturesOrbs.jsx
│   │   │       └── PhaseTimeline.jsx
│   │   ├── hooks/
│   │   │   ├── useResumeAnalysis.js
│   │   │   ├── useRoadmapGeneration.js
│   │   │   └── useMarketTrends.js
│   │   └── utils/
│   │       ├── api.js          # Axios instance
│   │       └── format.js       # Utility functions
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
│
└── .venv/                      # Python virtual environment
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Python 3.9+**
- **Node.js 18+** and npm
- **MongoDB Atlas** account (or local MongoDB)
- **Google Gemini API** key
- **RapidAPI** key (optional for enhanced market data)

### Backend Setup

1. **Create Virtual Environment**
```bash
cd backend
python -m venv ../.venv
```

2. **Activate Virtual Environment**
```bash
# Windows
..\.venv\Scripts\activate

# Linux/Mac
source ../.venv/bin/activate
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure Environment Variables**

Create `backend/.env`:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
RAPIDAPI_KEY=your_rapidapi_key_here
GEMINI_API_KEY=your_gemini_api_key_here
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE_MINUTES=1440
```

5. **Run Backend Server**
```bash
# From project root
cd cmr
$env:PYTHONPATH="e:\cmr"  # Windows
export PYTHONPATH="/path/to/cmr"  # Linux/Mac

python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Configure Environment Variables**

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```

3. **Run Frontend Dev Server**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## 🔑 Key Features Implementation

### 1. Resume Analysis

**How it works:**
1. User uploads resume (text or PDF)
2. Backend extracts text using PDFPlumber
3. AI parses skills, experience, and role
4. Results stored in MongoDB

**Key Files:**
- `backend/services/resume_parser.py`
- `frontend/src/hooks/useResumeAnalysis.js`
- `backend/api/routes.py` - `/api/analyze_resume`

**API Endpoint:**
```python
POST /api/analyze_resume
Body: {
  "resume_text": "string"
}
Response: {
  "skills": ["Python", "React", ...],
  "current_role": "Software Developer",
  "experience_years": 3
}
```

### 2. Market Trends Analysis

**How it works:**
1. Fetches trending skills for target role
2. Calculates demand scores
3. Compares with user's current skills
4. Visualizes gaps in radar chart

**Key Files:**
- `backend/services/market_trend_service.py`
- `frontend/src/components/cards/SkillGapRadar.jsx`
- `backend/data/skills_database.json`

**API Endpoint:**
```python
GET /api/market_trends?role=<role>&location=<location>
Response: {
  "trending_skills": [
    {"name": "React", "importance": 0.95, "growth": 0.85},
    ...
  ],
  "market_stats": {...}
}
```

### 3. Roadmap Generation

**How it works:**
1. Analyzes skill gaps
2. Creates learning phases
3. AI generates detailed explanations
4. Suggests projects and courses
5. Provides timelines

**Key Files:**
- `backend/services/roadmap_generator.py`
- `backend/services/llm_service.py`
- `frontend/src/pages/Dashboard.jsx`

**Roadmap Structure:**
```json
{
  "target_role": "Full Stack Developer",
  "current_skills": ["Python", "SQL"],
  "phases": [
    {
      "name": "Foundation",
      "duration": "2 months",
      "skills": ["JavaScript", "HTML", "CSS"],
      "resources": [...],
      "projects": [...]
    },
    ...
  ]
}
```

### 4. Authentication System

**Implementation:**
- JWT tokens for session management
- Password hashing with bcrypt
- Protected routes on frontend
- Token validation on backend

**Key Files:**
- `backend/utils/security.py`
- `backend/api/auth_routes.py`
- `frontend/src/utils/api.js`

**Auth Flow:**
```
1. User signs up/logs in
2. Backend validates credentials
3. Returns JWT token
4. Frontend stores token in localStorage
5. Token sent in Authorization header for protected routes
```

### 5. 3D Roadmap Visualization

**Implementation:**
- Three.js with React Three Fiber
- Animated 3D nodes for each phase
- Interactive camera controls
- Smooth transitions

**Key Files:**
- `frontend/src/components/3d/RoadmapScene.jsx`
- Uses `@react-three/fiber` and `@react-three/drei`

---

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  created_at: Date
}
```

### Analyses Collection
```javascript
{
  _id: ObjectId,
  user_id: String,
  resume_text: String,
  skills: [String],
  current_role: String,
  experience_years: Number,
  timestamp: Date
}
```

### Roadmaps Collection
```javascript
{
  _id: ObjectId,
  user_id: String,
  target_role: String,
  current_skills: [String],
  phases: [
    {
      name: String,
      duration: String,
      skills: [String],
      resources: [Object],
      projects: [String]
    }
  ],
  created_at: Date,
  progress: Object
}
```

---

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--blue-600: #2563eb;
--purple-600: #9333ea;
--indigo-600: #4f46e5;

/* Gradients */
--gradient-primary: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
--gradient-blue-purple: linear-gradient(to right, #3b82f6, #9333ea);

/* Backgrounds */
--bg-light: #f9fafb;
--bg-dark: #1f2937;
```

### Responsive Breakpoints
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md/lg)
- Desktop: > 1024px (xl)

### Components
- **Glassmorphism Cards**: `backdrop-blur-xl bg-white/10`
- **Gradient Buttons**: `bg-gradient-to-r from-blue-500 to-purple-600`
- **Shadow Effects**: Custom shadows with color tints

---

## 🔌 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### Authentication

**Register User**
```http
POST /api/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Login**
```http
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {...}
}
```

#### Resume Analysis

**Analyze Resume**
```http
POST /api/analyze_resume
Authorization: Bearer <token>
Content-Type: application/json

{
  "resume_text": "Full resume text here..."
}

Response:
{
  "skills": ["Python", "React", "Node.js"],
  "current_role": "Software Developer",
  "experience_years": 3
}
```

#### Roadmap

**Generate Roadmap**
```http
POST /api/generate_roadmap
Authorization: Bearer <token>
Content-Type: application/json

{
  "target_role": "Full Stack Developer",
  "current_skills": ["Python", "SQL"],
  "experience_years": 2,
  "location": "USA"
}

Response:
{
  "target_role": "Full Stack Developer",
  "phases": [...],
  "total_duration": "6 months"
}
```

**Get Latest Roadmap**
```http
GET /api/roadmaps/latest
Authorization: Bearer <token>

Response:
{
  "target_role": "...",
  "phases": [...],
  "created_at": "2025-12-24T..."
}
```

#### Market Trends

**Get Market Trends**
```http
GET /api/market_trends?role=Full%20Stack%20Developer&location=USA
Authorization: Bearer <token>

Response:
{
  "trending_skills": [
    {
      "name": "React",
      "importance": 0.95,
      "growth": 0.85,
      "demand_level": "Very High"
    }
  ],
  "market_stats": {
    "avg_salary": 120000,
    "job_openings": 15000
  }
}
```

---

## 🎭 Frontend Components Guide

### Creating Responsive Components

**Example: Responsive Card**
```jsx
import { motion } from 'framer-motion';

function ResponsiveCard({ title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="
        glassmorphism-card 
        p-4 sm:p-6 lg:p-8 
        rounded-lg sm:rounded-xl lg:rounded-2xl
        shadow-lg
      "
    >
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 mt-2">
        {description}
      </p>
    </motion.div>
  );
}
```

### Custom Hooks

**useResumeAnalysis Hook**
```javascript
import { useState } from 'react';
import api from '../utils/api';

export function useResumeAnalysis() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  
  const analyze = async (resumeText) => {
    setLoading(true);
    try {
      const response = await api.post('/analyze_resume', {
        resume_text: resumeText
      });
      setData(response.data);
      return response.data;
    } finally {
      setLoading(false);
    }
  };
  
  return { analyze, loading, data };
}
```

---

## 🚀 Deployment Guide

### Backend Deployment (Railway/Render)

1. **Prepare for Production**
```python
# Update settings.py for production
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', '*').split(',')
```

2. **Create Procfile**
```
web: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

3. **Deploy to Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

4. **Set Environment Variables** in Railway dashboard

### Frontend Deployment (Vercel/Netlify)

1. **Build Configuration**
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

2. **Deploy to Vercel**
```bash
npm install -g vercel
vercel --prod
```

3. **Update API URL**
```env
# .env.production
VITE_API_URL=https://your-backend.railway.app
```

### Database (MongoDB Atlas)

1. Whitelist IP addresses or use `0.0.0.0/0` for production
2. Create database user with read/write access
3. Update connection string in environment variables

---

## 🔄 How to Replicate for Similar Projects

### Step-by-Step Adaptation Guide

#### 1. **Define Your Problem Statement**
- What career/skill problem are you solving?
- Who is your target audience?
- What data sources will you use?

#### 2. **Modify Data Models**

**Example: Changing from Career to Education Planning**

```python
# backend/models/schemas.py
class EducationAnalysisRequest(BaseModel):
    transcript: str
    target_degree: str
    current_courses: List[str]

class CourseRecommendation(BaseModel):
    course_name: str
    prerequisites: List[str]
    credits: int
    difficulty: str
```

#### 3. **Adapt AI Prompts**

```python
# backend/services/llm_service.py
def generate_study_plan(transcript, target_degree):
    prompt = f"""
    Analyze this academic transcript: {transcript}
    Target degree: {target_degree}
    
    Generate a semester-by-semester study plan including:
    - Required courses
    - Electives recommendations
    - Prerequisites completion order
    - Estimated timeline
    """
    # Rest of implementation
```

#### 4. **Update Frontend Flow**

```jsx
// Change InputForm.jsx to EducationForm.jsx
const steps = [
  'Upload Transcript',
  'Select Target Degree',
  'View Study Plan'
];
```

#### 5. **Rebrand UI**
- Update `Header.jsx` with new app name
- Change color scheme in `tailwind.config.js`
- Update landing page messaging

#### 6. **Data Sources**
- Replace `skills_database.json` with your domain data
- Update market trend APIs
- Modify MongoDB collections

---

## 🛠️ Common Modifications

### Adding New API Endpoints

```python
# backend/api/routes.py
@router.post("/custom_endpoint")
async def custom_endpoint(
    request: CustomRequest,
    current_user: UserPublic = Depends(get_current_user)
):
    # Your logic here
    return {"result": "success"}
```

### Adding New Frontend Pages

```jsx
// src/pages/NewPage.jsx
import React from 'react';

export default function NewPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">New Page</h1>
    </div>
  );
}

// Add to App.jsx
<Route path="/new-page" element={<NewPage />} />
```

### Integrating Different AI Models

```python
# backend/services/llm_service.py

# For OpenAI
import openai
openai.api_key = settings.OPENAI_KEY
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": prompt}]
)

# For Anthropic Claude
import anthropic
client = anthropic.Anthropic(api_key=settings.ANTHROPIC_KEY)
response = client.messages.create(
    model="claude-3-opus",
    messages=[{"role": "user", "content": prompt}]
)
```

---

## 🎯 Hackathon Tips

### Time Management (24-48 hours)

**Hour 0-4: Setup & Planning**
- Clone this project as template
- Set up MongoDB and API keys
- Sketch wireframes
- Define problem statement clearly

**Hour 4-12: Core Features**
- Implement main user flow
- Basic AI integration
- Database operations
- Authentication

**Hour 12-20: UI/UX Polish**
- Responsive design
- Animations
- Error handling
- Loading states

**Hour 20-24: Testing & Deployment**
- Fix bugs
- Deploy to production
- Create demo video
- Prepare presentation

### Must-Have Features for Demo

1. **Working Authentication** - Shows professionalism
2. **AI Integration** - The "wow" factor
3. **Responsive Design** - Works on judges' devices
4. **Data Visualization** - Makes impact clear
5. **Real-time Updates** - Feels modern

### Presentation Tips

1. **Problem First** - Start with the problem, not technology
2. **Live Demo** - Show real functionality
3. **User Journey** - Walk through as a user would
4. **Technical Highlights** - Mention AI, scalability
5. **Future Vision** - Show you have a roadmap

---

## 🐛 Troubleshooting

### Common Issues & Solutions

**1. CORS Errors**
```python
# backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**2. MongoDB Connection Issues**
- Check IP whitelist in MongoDB Atlas
- Verify connection string format
- Ensure network connectivity

**3. Gemini API Rate Limits**
```python
# Add retry logic
import time
for attempt in range(3):
    try:
        response = model.generate_content(prompt)
        break
    except Exception as e:
        if attempt < 2:
            time.sleep(2 ** attempt)
        else:
            raise
```

**4. Frontend Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📚 Resources & References

### Documentation
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Gemini AI](https://ai.google.dev/)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)

### Learning Resources
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Framer Motion](https://www.framer.com/motion/)
- [JWT Authentication](https://jwt.io/)

### APIs Used
- Google Gemini AI
- RapidAPI (Job Market Data)
- MongoDB Atlas

---

## 🎓 Key Takeaways

### What Makes This Project Stand Out

1. **AI Integration** - Not just API calls, meaningful AI usage
2. **Full Stack** - Both frontend and backend implemented
3. **Modern Stack** - Current, in-demand technologies
4. **User Experience** - Smooth animations, responsive design
5. **Real Problem** - Addresses actual career pain points

### Scalability Considerations

- MongoDB for flexible schema changes
- JWT for stateless authentication
- React for component reusability
- FastAPI for async performance
- Cloud-native deployment

### Security Best Practices

- Password hashing with bcrypt
- JWT token expiration
- Environment variable protection
- Input validation with Pydantic
- CORS configuration

---

## 📞 Support & Contact

For questions about this project or adaptations for your hackathon:

**Project Repository**: Available on request
**Documentation**: This guide + inline code comments
**Demo Video**: Can be generated on request

---

## 🏆 Success Checklist for Hackathon

- [ ] Problem clearly defined
- [ ] Backend API working
- [ ] Frontend deployed
- [ ] Database connected
- [ ] AI integration functional
- [ ] Authentication working
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] Demo account created
- [ ] Presentation prepared
- [ ] Code commented
- [ ] README.md updated
- [ ] Screenshots/Video ready

---

## 🚀 Quick Start Commands

```bash
# Backend
cd cmr
$env:PYTHONPATH="e:\cmr"
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# Frontend
cd frontend
npm install
npm run dev

# Access
Frontend: http://localhost:5173
Backend: http://localhost:8000
API Docs: http://localhost:8000/docs
```

---

**Last Updated**: December 24, 2025
**Version**: 1.0.0
**License**: Open for hackathon and educational use

---

*Good luck with your hackathon! Remember: Start simple, iterate fast, and focus on solving the problem. The tech is just a tool.* 🚀
