# Render Backend Deployment Guide

## 🚀 Quick Deploy to Render

### Step 1: Prepare Your Repository
✅ Code pushed to GitHub: https://github.com/AnnavarapuJashwanth/ai-career

### Step 2: Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `AnnavarapuJashwanth/ai-career`

### Step 3: Configure Service Settings

**Basic Settings:**
- **Name**: `careerai-backend` (or any name you prefer)
- **Region**: Oregon (US West) - or closest to your users
- **Branch**: `main`
- **Root Directory**: *(leave empty - deploy from repo root)*

**Build & Deploy:**
- **Runtime**: `Python 3`
- **Build Command**: 
  ```bash
  cd backend && pip install --upgrade pip && pip install -r requirements.txt
  ```
- **Start Command**: 
  ```bash
  python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT
  ```

**Instance Type:**
- Select **Free** (512 MB RAM, 0.1 CPU)
- ⚠️ Note: Free instances spin down after inactivity

### Step 4: Environment Variables

Click **"Advanced"** and add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `MONGODB_URI` | `mongodb+srv://jashwanthannavarapu99_db_user:YOUR_PASSWORD@roadmap.cgbfuqp.mongodb.net/careerai` | Your MongoDB connection string |
| `GEMINI_API_KEY` | `YOUR_GEMINI_API_KEY` | From Google AI Studio |
| `RAPIDAPI_KEY` | `YOUR_RAPIDAPI_KEY` | If using RapidAPI (optional) |
| `JWT_SECRET_KEY` | `YOUR_RANDOM_SECRET` | Generate with: `openssl rand -hex 32` |
| `ALLOWED_ORIGINS` | `https://your-app.netlify.app` | Will update after frontend deploy |
| `PYTHONPATH` | `/opt/render/project/src` | Required for absolute imports |

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for initial build
3. Note your backend URL: `https://careerai-backend.onrender.com`

### Step 6: Test Backend

Once deployed, test these endpoints:

```bash
# Health check
curl https://careerai-backend.onrender.com/

# Should return: {"service":"careerai","status":"ok"}
```

---

## 🔧 Troubleshooting

### Build Fails
- Check logs in Render dashboard
- Ensure all dependencies in `requirements.txt` are compatible
- Python version defaults to 3.11 (compatible with your code)

### Import Errors
- Verify `PYTHONPATH=/opt/render/project/src` is set
- Ensure all imports use `backend.` prefix (already fixed)

### MongoDB Connection Fails
- Whitelist Render's IP: `0.0.0.0/0` in MongoDB Atlas Network Access
- Verify connection string is correct

### App Sleeps (Free Plan)
- Free instances spin down after 15 min of inactivity
- First request after sleep takes 30-60 seconds
- Upgrade to Starter ($7/month) for always-on

---

## 📊 After Backend is Live

**Next Steps:**
1. ✅ Note your backend URL: `https://YOUR-APP.onrender.com`
2. Update frontend API URL in `frontend/src/utils/api.js`
3. Add backend URL to MongoDB Atlas whitelist
4. Deploy frontend to Netlify (see NETLIFY_DEPLOYMENT.md)
5. Update `ALLOWED_ORIGINS` in Render with Netlify URL

**Important URLs:**
- Render Dashboard: https://dashboard.render.com
- Your Backend: `https://YOUR-SERVICE.onrender.com`
- API Docs (after deploy): `https://YOUR-SERVICE.onrender.com/docs`

---

## 💡 Pro Tips

1. **Free Tier Limitations:**
   - Spins down after 15 min inactivity
   - 750 hours/month free
   - No SSH access
   - Limited build minutes

2. **Keep It Awake:**
   - Use [UptimeRobot](https://uptimerobot.com/) to ping every 14 minutes
   - Or upgrade to paid plan ($7/month)

3. **Logs:**
   - View real-time logs in Render dashboard
   - Check for startup errors or crashes

4. **Environment Variables:**
   - Never commit `.env` files (already gitignored)
   - Update variables in Render dashboard → Settings → Environment

---

**Ready?** Click "Create Web Service" and let Render handle the rest! 🚀
