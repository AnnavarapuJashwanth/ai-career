# Netlify Frontend Deployment Guide

## 🎨 Deploy React Frontend to Netlify

### Prerequisites
✅ Backend deployed on Render  
✅ Backend URL: `https://YOUR-APP.onrender.com`

---

## Step 1: Update Frontend API URL

**IMPORTANT**: Your backend is already deployed at:
```
https://ai-career-hect.onrender.com
```

The frontend is already configured to auto-detect the environment:
- **Local Development**: Uses `http://localhost:8000/api`
- **Production (Netlify)**: Uses `https://ai-career-hect.onrender.com/api`

**File**: `frontend/src/utils/api.js` ✅ Already configured!

You can optionally set environment variable in Netlify:
- `VITE_API_URL` = `https://ai-career-hect.onrender.com/api`

---

## Step 2: Create Netlify Configuration

Already created in your project:
- `frontend/netlify.toml` - Build settings
- `frontend/_redirects` - SPA routing

---

## Step 3: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Go to [Netlify](https://app.netlify.com/)**
2. Click **"Add new site"** → **"Import an existing project"**
3. **Connect to Git**: Select GitHub
4. **Pick repository**: `AnnavarapuJashwanth/ai-career`
5. **Configure build settings**:

   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

6. **Environment Variables** (Optional - auto-detected):
   - Click "Show advanced"
   - Add: `VITE_API_URL` = `https://ai-career-hect.onrender.com/api`
   - *Note: Frontend auto-detects Netlify and uses correct URL*

7. Click **"Deploy site"**

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to frontend
cd frontend

# Build the app
npm run build

# Deploy
netlify deploy --prod
```

---

## Step 4: Configure Custom Domain (Optional)

1. In Netlify dashboard → **Domain settings**
2. Add custom domain or use: `YOUR-APP.netlify.app`
3. Netlify provides free HTTPS automatically

---

## Step 5: Update Backend CORS

After getting your Netlify URL (e.g., `https://careerai.netlify.app`):

1. Go to **Render Dashboard** → Your backend service (ai-career-hect)
2. **Environment** tab
3. Update `ALLOWED_ORIGINS` to include your Netlify URL:
   ```
   http://localhost:5173,http://localhost:5174,https://careerai.netlify.app,https://www.careerai.netlify.app
   ```
4. Service will auto-redeploy (~2 minutes)

---

## Step 6: Test Deployment

Visit your Netlify URL and test:

- ✅ Landing page loads
- ✅ Sign up / Login works
- ✅ Resume upload works
- ✅ Roadmap generation works
- ✅ No CORS errors in console

---

## 🔧 Troubleshooting

### Build Fails
**Error**: `npm run build` fails

**Solution**:
- Check Node version (use 18.x or 20.x)
- Run `npm install` locally and test build
- Check build logs in Netlify

### Blank Page / 404 on Refresh
**Issue**: SPA routes not working

**Solution**: Ensure `_redirects` file exists:
```
/*    /index.html   200
```

### API Not Connecting
**Issue**: Frontend can't reach backend

**Solutions**:
1. Check API URL in `frontend/src/utils/api.js`
2. Verify backend is running: `curl https://YOUR-BACKEND.onrender.com/`
3. Check CORS settings in backend
4. Check browser console for errors

### Environment Variables Not Working
**Issue**: `import.meta.env.VITE_*` is undefined

**Solution**:
- Prefix vars with `VITE_` in Netlify dashboard
- Trigger manual redeploy after adding vars

---

## 📋 Netlify Configuration Files

### `frontend/netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"
  
[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### `frontend/_redirects`
```
/*    /index.html   200
```

---

## 🚀 Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Backend URL updated in `frontend/src/utils/api.js`
- [ ] Frontend builds successfully locally (`npm run build`)
- [ ] Connected GitHub repo to Netlify
- [ ] Build settings configured (base: `frontend`, publish: `dist`)
- [ ] Site deployed successfully
- [ ] Backend CORS updated with Netlify URL
- [ ] Tested all features work in production
- [ ] Custom domain configured (optional)

---

## 💡 Pro Tips

1. **Auto Deploys**: 
   - Netlify auto-deploys on git push to `main`
   - Use branch deploys for testing

2. **Preview Deploys**:
   - Every PR gets a preview URL
   - Test before merging

3. **Build Minutes**:
   - Free tier: 300 build minutes/month
   - Each build ~2-3 minutes

4. **Performance**:
   - Netlify has global CDN
   - Automatic asset optimization
   - Free SSL/HTTPS

5. **Rollbacks**:
   - Easy rollback to previous deploys
   - Click "Deploys" → older version → "Publish"

---

## 📊 After Deployment

Your full-stack app is live! 🎉

**URLs:**
- Frontend: `https://YOUR-APP.netlify.app`
- Backend: `https://YOUR-APP.onrender.com`
- API Docs: `https://YOUR-APP.onrender.com/docs`

**Share your project:**
```
🚀 CareerAI - AI-Powered Career Guidance
Frontend: https://YOUR-APP.netlify.app
GitHub: https://github.com/AnnavarapuJashwanth/ai-career
```

---

Need help? Check:
- [Netlify Docs](https://docs.netlify.com/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html#netlify)
