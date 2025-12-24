# Frontend Development Guide - CareerAI

## 🎯 Project Status

✅ **Complete Frontend Structure Created**

The CareerAI frontend is fully scaffolded with all necessary components, pages, hooks, and utilities. The application is running successfully on `http://localhost:5174`.

## 📦 What Has Been Built

### Core Application Structure
- ✅ Vite + React 19 project setup
- ✅ TailwindCSS styling framework
- ✅ Material-UI Icons integration
- ✅ React Router v6 for client-side routing
- ✅ Framer Motion for animations
- ✅ React Three Fiber + Three.js for 3D visualization
- ✅ Axios HTTP client with interceptors

### Pages Created

#### 1. **Landing Page** (`src/pages/Landing.jsx`)
- Hero section with gradient backgrounds
- Three feature cards (Skill Gap Analysis, Market Insights, Tailored Curriculum)
- Call-to-action buttons
- Responsive design
- Animated elements with Framer Motion

**Features:**
- Modern gradient UI
- Material-UI icons for feature highlights
- Mobile-first responsive design
- Two CTA paths: "Generate Roadmap" and "View Demo"

#### 2. **Input Form Page** (`src/pages/InputForm.jsx`)
- Two-step wizard interface
  - Step 1: Resume upload/paste
  - Step 2: Target role selection
- Resume upload with drag-and-drop support
- Text paste option
- 10+ target role options (Full Stack, Data Scientist, Cloud Engineer, etc.)
- Years of experience input
- Optional location field
- Progress indicator
- Loading states

**Features:**
- File input with visual feedback
- Character counter
- Target role selection grid
- Previous/Continue button flow
- Error handling with user messages

#### 3. **Dashboard Page** (`src/pages/Dashboard.jsx`)
- Personalized career roadmap display
- Three metric cards:
  - Readiness Score
  - Skill Gap Percentage
  - Total Duration
- 3D roadmap visualization
- Current skills showcase
- Learning phases breakdown
- Course recommendations grid
- Download roadmap as JSON
- Share functionality
- Start learning CTA

**Features:**
- Real-time data display
- Metric cards with gradients
- Interactive 3D scene
- Phase details with resources
- Course cards with ratings
- Export options

### Components Created

#### Common Components
- **Header** (`src/components/common/Header.jsx`): Navigation with branding, sticky
- **Footer** (`src/components/common/Footer.jsx`): Social links, company info, navigation

#### Card Components
- **SkillCard** (`src/components/cards/SkillCard.jsx`): 
  - Skill name display
  - Importance badge
  - Progress bar visualization
  - Hover effects

- **PhaseCard** (`src/components/cards/PhaseCard.jsx`):
  - Gradient header with phase name
  - Duration display
  - Skills list with tags
  - Resources list with icons
  - Animated entrance

- **CourseCard** (`src/components/cards/CourseCard.jsx`):
  - Course image placeholder
  - Title and description
  - Instructor and duration info
  - Star rating
  - Enroll button

#### 3D Components
- **RoadmapScene** (`src/components/3d/RoadmapScene.jsx`):
  - React Three Fiber canvas setup
  - Interactive milestone nodes
  - Color-coded phases
  - Hover animations with scaling
  - Billboard labels
  - OrbitControls for camera interaction
  - Auto-rotate functionality
  - Connection lines between milestones
  - Glow effects on hover

### Custom Hooks
- **useResumeAnalysis** (`src/hooks/useResumeAnalysis.js`): Resume analysis API integration
- **useRoadmapGeneration** (`src/hooks/useRoadmapGeneration.js`): Roadmap generation API
- **useMarketTrends** (`src/hooks/useMarketTrends.js`): Market trends data fetching

**Hook Features:**
- State management (data, loading, error)
- Error handling
- Async operations
- Callback functions for API calls

### Utilities
- **API Client** (`src/utils/api.js`):
  - Axios instance with base configuration
  - Request/response interceptors
  - Auth token handling
  - Error response handling

- **Format Functions** (`src/utils/format.js`):
  - `formatDuration()`: Convert months to readable string
  - `getImportanceColor()`: Color coding for importance
  - `getImportanceLabel()`: Text labels for importance
  - `truncateText()`: Text truncation utility
  - `capitalize()`: String capitalization

### Styling & Configuration
- **TailwindCSS Config** (`tailwind.config.js`):
  - Custom color palette (primary: #0052CC, etc.)
  - Custom animations (fadeIn, slideUp)
  - Extended theme
  - Post-processing setup

- **Global Styles** (`src/index.css`):
  - TailwindCSS directives
  - Custom utility classes
  - Scrollbar styling
  - Gradient text effects
  - Card shadow utilities
  - Button gradient styling

## 🚀 How to Use the Frontend

### Start Development Server

```bash
cd e:\cmr-blackbox\frontend
npm run dev
```

Access at: `http://localhost:5174`

### Build for Production

```bash
npm run build
```

Output: `dist/` directory

### Preview Production Build

```bash
npm run preview
```

## 📝 Key Design Decisions

### 1. **Component Architecture**
- Functional components with React Hooks
- Custom hooks for API logic separation
- Reusable card components for consistency

### 2. **Styling Approach**
- Utility-first TailwindCSS for rapid development
- Global custom classes for common patterns
- Inline Framer Motion for animations

### 3. **3D Visualization**
- React Three Fiber for seamless React integration
- Interactive milestone nodes
- Auto-rotating scene with orbit controls
- Billboard labels that face camera

### 4. **State Management**
- Component local state with useState
- Custom hooks for API calls
- React Router for page state management

### 5. **Error Handling**
- Try-catch blocks in async functions
- User-friendly error messages
- Loading states for better UX

## 🔌 API Integration Points

The frontend expects these backend endpoints:

```javascript
POST /api/analyze_resume
// Input: { resume_text: string }
// Output: { skills: [], current_role: string, experience_years: int }

POST /api/generate_roadmap
// Input: { resume_text, target_role, years_of_experience, location }
// Output: { phases: [], current_skills: [], target_role, readiness_score, skill_gap_percentage }

GET /api/market_trends
// Params: ?role=...&location=...
// Output: { trending_skills: [{ name, importance, job_count }] }
```

## 📱 Responsive Design

The UI is fully responsive with TailwindCSS breakpoints:

- **Mobile** (default): Stack layout, full width
- **Tablet** (md): Two-column grids
- **Desktop** (lg): Three-column grids, side panels
- **Large Desktop** (xl): Four-column grids

## 🎨 Color Scheme

```css
Primary Blue: #0052CC
Primary Purple: #667eea
Secondary Purple: #764ba2
Gradients:
- Blue to Purple: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
- Pink to Purple: various phase colors
```

## 🔐 Security Measures

- Environment variables for sensitive data (.env)
- Axios interceptors for token management
- XSS protection via React's escaping
- CORS headers in API requests

## 🎬 Animation Library Usage

**Framer Motion Effects:**
- `initial`, `animate`, `exit`: Page transitions
- `whileInView`: Scroll-triggered animations
- `whileHover`, `whileTap`: Interactive feedback
- `transition`: Control animation timing
- `motion.div`, `motion.button`: Animated elements

## 📊 Performance Considerations

- Code splitting with React Router
- Lazy loading of 3D components
- Optimized re-renders with memo
- Image optimization (icons loaded from CDN)
- CSS minification at build time

## 🐛 Common Issues & Solutions

### Port Already in Use
Solution: The dev server automatically uses port 5174 if 5173 is busy.

### Missing Dependencies
Solution: Run `npm install` again or use `--legacy-peer-deps` flag

### 3D Scene Not Loading
Solution: Check browser WebGL support, verify Three.js library is loaded

### Styling Not Applied
Solution: Ensure TailwindCSS is properly configured, rebuild CSS

## 📚 Next Steps

1. **Connect to Backend**: 
   - Ensure backend is running on `http://localhost:8000`
   - Update `.env` with correct API URL
   - Test API endpoints with Postman

2. **Add Real Data**:
   - Replace mock data in components
   - Integrate actual API responses
   - Add error handling for API failures

3. **Enhancement Features**:
   - User authentication/login
   - Save roadmaps to database
   - Course filtering and search
   - Progress tracking dashboard

4. **Testing**:
   - Add unit tests with Vitest
   - Component tests with React Testing Library
   - E2E tests with Cypress

5. **Deployment**:
   - Configure production environment
   - Set up CI/CD pipeline
   - Deploy to Vercel or similar

## 🔗 Important Files to Know

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app with routing |
| `src/pages/Landing.jsx` | Home page |
| `src/pages/InputForm.jsx` | Resume & role form |
| `src/pages/Dashboard.jsx` | Results display |
| `src/components/3d/RoadmapScene.jsx` | 3D visualization |
| `src/hooks/useResumeAnalysis.js` | Resume API |
| `src/utils/api.js` | Axios config |
| `tailwind.config.js` | Styling config |
| `.env.example` | Environment variables template |

## 💡 Development Tips

1. **Hot Module Replacement**: Changes auto-reload in dev mode
2. **DevTools**: Install React DevTools browser extension
3. **Console Logging**: Use for debugging component state
4. **Network Tab**: Monitor API calls in browser DevTools
5. **Component Inspector**: React DevTools for component tree

## 📞 Support

For questions or issues:
1. Check browser console for errors
2. Review Network tab in DevTools
3. Verify backend is running
4. Check `.env` configuration

---

**Frontend is ready for backend integration!** 🚀
