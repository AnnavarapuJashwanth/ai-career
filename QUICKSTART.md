# CareerAI - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Git (optional)

### Step 1: Navigate to Project

```bash
cd e:\cmr-blackbox\frontend
```

### Step 2: Install Dependencies

Already done! But if needed:
```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

**Output:**
```
Port 5173 is in use, trying another one...

  VITE v7.2.7  ready in 1801 ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
```

### Step 4: Open in Browser

Navigate to: **http://localhost:5174**

You should see the CareerAI landing page! 🎉

## 📱 Page Routes

| URL | Page | Purpose |
|-----|------|---------|
| `/` | Landing | Hero, features, CTAs |
| `/generate` | InputForm | Resume upload & role selection |
| `/dashboard` | Dashboard | Results & roadmap display |

## 🎯 Try These Features

1. **Landing Page** (`/`)
   - Scroll through features
   - Click "Generate Roadmap" button
   
2. **Input Form** (`/generate`)
   - Paste sample resume text or upload file
   - Select a target role
   - Click "Generate Roadmap"

3. **Dashboard** (`/dashboard`)
   - View 3D roadmap (interactive)
   - See skill cards
   - Explore learning phases
   - Check course recommendations

## 🔧 Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Stop server
# Press Ctrl+C in terminal
```

## 🌳 Project Structure Quick Look

```
frontend/
├── src/pages/          # Page components (Landing, InputForm, Dashboard)
├── src/components/     # Reusable components (cards, 3D, common)
├── src/hooks/          # Custom React hooks (API calls)
├── src/utils/          # Helper functions (API client, formatting)
├── src/App.jsx         # Main app with routing
├── tailwind.config.js  # Styling configuration
└── package.json        # Dependencies
```

## 🔌 Mock Data

The dashboard currently uses **mock data**. To use real data:

1. **Start Backend Server**
   ```bash
   cd backend
   python -m uvicorn main:app --reload
   # Should be available at http://localhost:8000
   ```

2. **Update .env** (Create if not exists)
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

3. **Restart Frontend Server**
   ```bash
   npm run dev
   ```

## 🎨 Styling

The project uses **TailwindCSS**:
- Utility-first approach
- Pre-defined color palette
- Responsive design (mobile-first)
- Custom gradients and animations

### Main Colors
- **Primary Blue**: Used for buttons and accents
- **Purple Gradient**: Background for 3D scene
- **Phase Colors**: Blue, Purple, Pink for phases

## 🎬 3D Visualization

**RoadmapScene Component** features:
- Interactive 3D milestones
- Auto-rotating camera
- Hover effects with scaling
- Orbit controls
- Billboard labels

Try hovering over the 3D nodes in the dashboard!

## 💡 Tips & Tricks

### Hot Reload
- Edit any file and it auto-refreshes in browser
- No manual refresh needed!

### Browser DevTools
1. Open DevTools: `F12`
2. Go to **Network** tab to see API calls (when connected to backend)
3. React DevTools browser extension helps inspect components

### Clear Cache
If styles or components look weird:
```bash
# Clear browser cache: Ctrl+Shift+Delete in most browsers
# Or restart dev server: npm run dev
```

## 🐛 Troubleshooting

### Port Already in Use
- Dev server automatically tries next port (5174, 5175, etc.)
- Or kill process: `npx kill-port 5173`

### Styling Not Working
- Restart dev server
- Clear browser cache (Ctrl+Shift+Delete)
- Check if TailwindCSS is installed: `npm list tailwindcss`

### 3D Scene Not Showing
- Check browser console (F12 > Console)
- Verify WebGL support
- Try different browser

### Dependencies Error
```bash
npm install --legacy-peer-deps
```

## 📚 Documentation

- **Frontend Guide**: See `FRONTEND_DEVELOPMENT.md`
- **Project Structure**: See `PROJECT_STRUCTURE.md`
- **AI Instructions**: See `.github/copilot-instructions.md`

## ✨ What's Included

✅ **Landing Page** - Hero section, features, CTAs
✅ **Form Page** - Resume upload, role selection
✅ **Dashboard** - Results, 3D roadmap, courses
✅ **Components** - Skill cards, phase cards, course cards
✅ **3D Scene** - Interactive roadmap visualization
✅ **Styling** - TailwindCSS + custom theme
✅ **Routing** - React Router setup
✅ **Hooks** - Custom API hooks
✅ **Animations** - Framer Motion effects
✅ **Icons** - Material-UI icons

## 🚀 Next Steps

1. **Start Backend**: Get API running
2. **Test API Endpoints**: Use Postman or curl
3. **Connect Frontend**: Update .env with API URL
4. **Add Error Handling**: Better error messages
5. **Deploy**: Push to production

## 📞 Need Help?

Check these files for detailed info:
- `FRONTEND_DEVELOPMENT.md` - Detailed frontend guide
- `PROJECT_STRUCTURE.md` - Complete file structure
- `.github/copilot-instructions.md` - AI agent guide

---

**Enjoy building!** 🎉

Questions? Check browser console for errors or see the documentation files above.
