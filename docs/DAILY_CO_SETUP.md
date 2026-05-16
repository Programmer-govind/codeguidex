# Daily.co Video Integration Setup

## ✅ What We've Done

Replaced Jitsi with Daily.co for video sessions. Daily.co is:
- **Free** for up to 10,000 minutes/month
- **No authentication required** - works immediately
- **Better quality** than Jitsi
- **Simpler** to use

## 🚀 Setup Instructions

### Step 1: Install Dependencies

The package is being installed. Please wait for the command to complete:
```bash
npm install @daily-co/daily-js
```

### Step 2: Create Daily.co Account

1. Go to https://dashboard.daily.co/signup
2. Sign up for a free account
3. Go to **Developers** → **API Keys**
4. Copy your API key

### Step 3: Add API Key to Environment

Add this to your `.env.local` file:

```env
DAILY_API_KEY=your_daily_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** Replace `your_daily_api_key_here` with your actual Daily.co API key.

### Step 4: Restart Development Server

After adding the environment variables:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## 📝 How It Works

### 1. When a booking is created:
- A Daily.co room is created via `/api/create-daily-room`
- The room URL is stored in the session
- Both mentor and student get the video link

### 2. When users click "Start Session":
- They're taken to `/video/[roomUrl]`
- Daily.co iframe loads automatically
- They join with their display name
- **No login required!** ✅

### 3. Features:
- ✅ Screen sharing
- ✅ Chat
- ✅ Video/Audio controls
- ✅ Recording (cloud)
- ✅ Up to 10 participants
- ✅ Works on all devices

## 🎯 Files Changed

1. **`src/app/api/create-daily-room/route.ts`** - Creates Daily.co rooms
2. **`src/app/video/[id]/page.tsx`** - Video session page (replaced Jitsi)
3. **`src/services/mentor.service.ts`** - Updated to create Daily.co rooms

## 🧪 Testing

1. Create a mentor account
2. Book a session as a student
3. Complete payment
4. Click "Start Session" in bookings
5. Video call should start immediately - no authentication needed!

## 💡 Troubleshooting

**If video doesn't load:**
- Check that `DAILY_API_KEY` is set in `.env.local`
- Check that `NEXT_PUBLIC_APP_URL` is correct
- Restart the dev server
- Check browser console for errors

**If room creation fails:**
- Verify your Daily.co API key is correct
- Check you haven't exceeded the free tier limit (10,000 min/month)

## 📊 Free Tier Limits

- **10,000 minutes per month** (about 166 hours)
- **Unlimited rooms**
- **Up to 10 participants per room**
- **Cloud recording included**

This is more than enough for a learning project or MVP!

## 🎉 Benefits Over Jitsi

| Feature | Jitsi (meet.jit.si) | Daily.co |
|---------|---------------------|----------|
| Authentication | ❌ Required | ✅ None needed |
| Setup | Complex | Simple |
| Quality | Good | Better |
| Free Tier | Limited | 10,000 min/month |
| Recording | Manual | Automatic |
| Mobile Support | OK | Excellent |

---

**Next Steps:**
1. Get your Daily.co API key
2. Add it to `.env.local`
3. Restart the server
4. Test a video session!
