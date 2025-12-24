# 🚀 Deployment Guide - CareerAI Application

## Overview
This guide will help you deploy:
- **Frontend** → Netlify
- **Backend** → Render

---

## 📋 Prerequisites

### 1. Create Accounts
- [GitHub Account](https://github.com/signup) (to push your code)
- [Netlify Account](https://app.netlify.com/signup) (for frontend)
- [Render Account](https://dashboard.render.com/register) (for backend)

### 2. Verify Environment Variables
Make sure your `.env` file exists in the `backend` folder with:
```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/careerai?retryWrites=true&w=majority
RAPIDAPI_KEY=your_rapidapi_key
GEMINI_API_KEY=your_gemini_api_key
ALLOWED_ORIGINS=https://your-app-name.netlify.app
```

---

## 🔐 Step 1: Secure Your Environment Variables

### ✅ IMPORTANT: Protect Your Secrets!

1. **Verify `.gitignore` files exist:**
   - Backend: `backend/.gitignore` should include `.env`
   - Frontend: `frontend/.gitignore` already exists

2. **Test what will be committed:**
   ```bash
   cd e:\cmr-blackbox
   git status
   ```

3. **Make sure `.env` is NOT listed!** If it is:
   ```bash
   git rm --cached backend/.env
   echo ".env" >> backend/.gitignore
   ```

---

## 📤 Step 2: Push to GitHub

### Create a New Repository

1. **Go to GitHub** and create a new repository named `cmr-blackbox` (or your preferred name)

2. **Initialize and push your code:**
   ```bash
   cd e:\cmr-blackbox
   
   # Initialize git if not already done
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - CareerAI application"
   
   # Add remote (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/cmr-blackbox.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

3. **Verify on GitHub** that your `.env` file is **NOT** visible in the repository

---

## 🎨 Step 3: Deploy Frontend to Netlify

### Option A: Deploy via Netlify UI (Recommended)

1. **Login to Netlify:** https://app.netlify.com/

2. **Click "Add new site" → "Import an existing project"**

3. **Connect to GitHub:**
   - Click "GitHub"
   - Authorize Netlify
   - Select your `cmr-blackbox` repository

4. **Configure Build Settings:**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

5. **Add Environment Variables** (if needed for frontend):
   - Go to Site settings → Environment variables
   - Add any required variables

6. **Deploy!** Click "Deploy site"

7. **Get Your URL:** Copy your Netlify URL (e.g., `https://your-app-name.netlify.app`)

### Option B: Deploy via Netlify CLI

```bash
cd frontend
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

---

## ⚙️ Step 4: Deploy Backend to Render

### Create Web Service on Render

1. **Login to Render:** https://dashboard.render.com/

2. **Click "New +" → "Web Service"**

3. **Connect Your Repository:**
   - Click "Connect account" for GitHub
   - Select your `cmr-blackbox` repository

4. **Configure Service:**
   ```
   Name: careerai-backend
   Region: Select closest to your users
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

5. **Select Plan:**
   - Choose "Free" tier for testing (spins down after inactivity)
   - Or select a paid tier for production

6. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable" and add:
   ```
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/careerai?retryWrites=true&w=majority
   RAPIDAPI_KEY=your_rapidapi_key
   GEMINI_API_KEY=your_gemini_api_key
   ALLOWED_ORIGINS=https://your-app-name.netlify.app,http://localhost:5173
   ```

7. **Create Web Service** - Render will start deploying!

8. **Get Your Backend URL:** Copy your Render URL (e.g., `https://careerai-backend.onrender.com`)

---

## 🔗 Step 5: Connect Frontend to Backend

### Update Frontend API Configuration

1. **Update the frontend API base URL:**

   Edit `frontend/src/utils/api.js`:
   ```javascript
   import axios from 'axios';

   const api = axios.create({
     baseURL: 'https://careerai-backend.onrender.com/api', // Your Render URL
     headers: {
       'Content-Type': 'application/json',
     },
   });
   
   // Add token to requests
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('authToken');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });

   export default api;
   ```

2. **Commit and push changes:**
   ```bash
   git add frontend/src/utils/api.js
   git commit -m "Update API URL for production"
   git push
   ```

3. **Netlify will auto-deploy** the updated frontend

---

## 🔄 Step 6: Update Backend CORS

1. **Update ALLOWED_ORIGINS in Render:**
   - Go to Render Dashboard → Your Service
   - Environment → Edit `ALLOWED_ORIGINS`
   - Add your Netlify URL: `https://your-app-name.netlify.app`
   - Save (Render will redeploy automatically)

---

## ✅ Step 7: Test Your Deployment

### 1. Test Backend API
Visit: `https://careerai-backend.onrender.com/docs`
- You should see the FastAPI documentation

### 2. Test Frontend
Visit: `https://your-app-name.netlify.app`
- Sign up for a new account
- Upload a resume
- Generate a roadmap
- Check that data is saving to MongoDB

### 3. Verify MongoDB Connection
- Login to MongoDB Atlas
- Go to Database → Collections
- Check that data is being saved in:
  - `users` collection (user accounts)
  - `analyses` collection (resume analyses)
  - `roadmaps` collection (generated roadmaps)

---

## 🐛 Troubleshooting

### Frontend Issues

**Problem:** Blank page or errors
- **Solution:** Check browser console for errors
- **Solution:** Verify API URL is correct in `api.js`

**Problem:** CORS errors
- **Solution:** Update `ALLOWED_ORIGINS` in Render to include your Netlify URL

### Backend Issues

**Problem:** 503 Service Unavailable (Render free tier)
- **Solution:** First request may be slow (service wakes up), wait 30-60 seconds

**Problem:** MongoDB connection errors
- **Solution:** Check `MONGODB_URI` in Render environment variables
- **Solution:** Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

**Problem:** Import errors
- **Solution:** Verify `requirements.txt` includes all dependencies
- **Solution:** Check Render build logs

---

## 📊 Monitoring & Maintenance

### Netlify
- View build logs: Site → Deploys → Click on a deploy
- Monitor bandwidth: Site → Analytics

### Render
- View logs: Service → Logs tab
- Monitor metrics: Service → Metrics tab
- **Note:** Free tier spins down after 15 minutes of inactivity

### MongoDB Atlas
- Monitor connections: Database → Metrics
- View logs: Database → Monitoring → Logs

---

## 🚀 Continuous Deployment

Both Netlify and Render support automatic deployments:

1. **Make changes locally**
2. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```
3. **Netlify and Render will auto-deploy!**

---

## 💰 Cost Optimization

### Free Tiers Include:
- **Netlify:** 100GB bandwidth/month, unlimited sites
- **Render:** 750 hours/month (enough for 1 service running 24/7)
- **MongoDB Atlas:** 512MB storage

### If You Need More:
- **Netlify Pro:** $19/month (better performance, analytics)
- **Render Starter:** $7/month (no spin down, better resources)
- **MongoDB Atlas:** M2 tier $9/month (2GB storage)

---

## 🔒 Security Checklist

- [ ] `.env` file is NOT in GitHub
- [ ] MongoDB password is strong and unique
- [ ] MongoDB Atlas IP whitelist includes 0.0.0.0/0 OR Render's IPs
- [ ] API keys are stored in Render environment variables
- [ ] CORS is properly configured with your frontend URL
- [ ] HTTPS is enabled on both frontend and backend (automatic)

---

## 📝 Important URLs Reference

After deployment, save these URLs:

```
Frontend (Netlify):  https://your-app-name.netlify.app
Backend (Render):    https://careerai-backend.onrender.com
API Docs:            https://careerai-backend.onrender.com/docs
MongoDB:             https://cloud.mongodb.com/
GitHub Repo:         https://github.com/YOUR_USERNAME/cmr-blackbox
```

---

## 🎉 You're Done!

Your CareerAI application is now live and accessible worldwide!

### Next Steps:
1. Share your app URL with friends
2. Monitor usage in Netlify and Render dashboards
3. Check MongoDB for saved data
4. Consider adding custom domain (Netlify Pro)
5. Set up monitoring and alerts

---

## 📞 Support Resources

- **Netlify Docs:** https://docs.netlify.com/
- **Render Docs:** https://render.com/docs
- **MongoDB Docs:** https://docs.mongodb.com/
- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **React Docs:** https://react.dev/

---

## 🔄 Quick Reference Commands

```bash
# Check git status
git status

# Push new changes
git add .
git commit -m "Your message"
git push

# View Netlify status
netlify status

# View Render logs
# (Use Render dashboard)

# Test backend locally
cd backend
uvicorn main:app --reload

# Test frontend locally
cd frontend
npm run dev
```

Good luck with your deployment! 🚀
