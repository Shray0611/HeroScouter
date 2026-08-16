# HeroScouter Deployment Guide

Separate Frontend and Backend Deployment

## Infrastructure Overview

```
┌─────────────────────────────────────────────────┐
│           heroscouter.com                       │
│        (Frontend - Vercel/Netlify)              │
│        ├─ React + Vite App                      │
│        └─ Calls: api.heroscouter.com            │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│        api.heroscouter.com                      │
│      (Backend - Railway/Render)                 │
│        ├─ Express.js Server                     │
│        ├─ MongoDB Connection                    │
│        └─ REST API Endpoints                    │
└─────────────────────────────────────────────────┘
```

---

## Part 1: Backend Deployment (api.heroscouter.com)

### Option A: Railway.app (Recommended)

#### 1. Create Railway Account
- Go to https://railway.app
- Sign up with GitHub

#### 2. Create New Project
- Click "New Project" → "Deploy from GitHub"
- Select your repository
- Choose `server/server.js` as entry point (or configure in railway.json)

#### 3. Create `railway.json` (in project root)
```json
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "node server/server.js",
    "restartPolicyMaxRetries": 5
  }
}
```

#### 4. Set Environment Variables in Railway Dashboard
```
MONGODB_URI = mongodb+srv://Arjun:Arjun0611@arjuncluster.ty0fqsd.mongodb.net/heroscouter
MONGODB_DB = heroscouter
NODE_ENV = production
API_PORT = 3001
ALLOWED_ORIGINS = https://heroscouter.com,https://www.heroscouter.com
```

#### 5. Get Your Backend Domain
- Railway generates: `projectname-production.up.railway.app`
- Or connect custom domain: `api.heroscouter.com`

**To connect custom domain to Railway:**
1. In Railway dashboard → Domain
2. Add domain: `api.heroscouter.com`
3. Follow DNS instructions

#### 6. Deploy
- Push to GitHub main branch
- Railway automatically deploys

---

### Option B: Render.com

#### 1. Create Account
- Go to https://render.com
- Sign up

#### 2. Create New Web Service
- New → Web Service
- Connect GitHub repository
- Build Command: `npm install`
- Start Command: `node server/server.js`
- Environment: Node
- Plan: Free tier

#### 3. Set Environment Variables
Add same vars as Railway above

#### 4. Connect Domain
- Copy Render's provided domain
- Or add custom domain: `api.heroscouter.com` in settings

---

## Part 2: Frontend Deployment (heroscouter.com)

### Vercel Deployment

#### 1. Go to Vercel
- https://vercel.com/import
- Import your GitHub repository

#### 2. Configure Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Root Directory**: `.` (project root)

#### 3. Set Environment Variables (Production)
- `VITE_API_URL` = `https://api.heroscouter.com`
- `VITE_GOOGLE_SHEETS_URL` = (your value)
- `VITE_CALENDLY_URL` = (your value)
- etc.

#### 4. Deploy
- Vercel auto-deploys to default URL: `yourproject.vercel.app`

#### 5. Connect Custom Domain
1. In Vercel: **Settings** → **Domains**
2. Add domain: `heroscouter.com`
3. Vercel shows DNS records
4. Update your domain registrar with nameservers OR add CNAME record
5. SSL certificate auto-provisioned

---

## Part 3: Domain Configuration

### Domain Registrar Setup (e.g., GoDaddy, Namecheap)

#### Option 1: Use Vercel Nameservers (Easiest)
1. In your registrar account
2. Change nameservers to Vercel's:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
   - etc.
3. Vercel manages DNS for both domains

#### Option 2: CNAME Records (More Control)
Frontend (`heroscouter.com`):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Backend (`api.heroscouter.com`):
```
Type: CNAME
Name: api
Value: (Railway/Render domain)
```

Main domain (`heroscouter.com`):
```
Type: A
Value: (Vercel's IP)
```

---

## Part 4: Testing Deployment

### Test Backend API
```bash
curl https://api.heroscouter.com/api/roles
curl https://api.heroscouter.com/api/companies
```

### Test Frontend
- Visit https://heroscouter.com
- Open DevTools → Network tab
- Check API calls go to `https://api.heroscouter.com`

### Monitor Logs
- **Vercel**: Deployments → Logs
- **Railway**: Deployments → Logs
- **Render**: Logs tab

---

## Part 5: Local Development Setup

### Run Both Servers Locally

Terminal 1 (Backend):
```bash
npm run api
# Starts on http://localhost:3001
```

Terminal 2 (Frontend):
```bash
npm run dev
# Starts on http://localhost:5173 (or similar)
# Uses VITE_API_URL=http://localhost:3001
```

---

## Environment Variables Summary

### `.env` (Local Development)
```
VITE_API_URL=http://localhost:3001
MONGODB_URI=mongodb+srv://...
```

### `.env.production` (Frontend Production)
```
VITE_API_URL=https://api.heroscouter.com
```

### Backend Environment (Railway/Render)
```
MONGODB_URI=mongodb+srv://...
NODE_ENV=production
API_PORT=3001
ALLOWED_ORIGINS=https://heroscouter.com,https://www.heroscouter.com
```

---

## Troubleshooting

### "API returns 404"
- Check backend is running on Railway/Render
- Verify MONGODB_URI in Railway dashboard
- Check ALLOWED_ORIGINS includes your frontend domain

### "CORS Error"
- Backend's `ALLOWED_ORIGINS` doesn't match frontend domain
- Update in Railway/Render environment variables

### "Frontend shows loading forever"
- VITE_API_URL in Vercel environment variables is wrong
- Check Network tab to see API endpoint being called

### MongoDB Connection Failed
- Verify connection string format
- Add Railway/Render IP to MongoDB Atlas whitelist (0.0.0.0/0)

---

## Deployment Checklist

- [ ] Backend deployed to Railway/Render
- [ ] Backend domain: `api.heroscouter.com` working
- [ ] Frontend deployed to Vercel
- [ ] Frontend domain: `heroscouter.com` working
- [ ] `.env.production` set in Vercel with correct `VITE_API_URL`
- [ ] Backend environment variables set correctly
- [ ] MongoDB connection working from backend
- [ ] Frontend API calls hitting backend
- [ ] SSL certificates auto-provisioned
- [ ] Test roles/companies endpoints accessible
