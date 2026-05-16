# JaaS (Jitsi as a Service) Setup Guide

## ✅ What You Have

You've created a JaaS Dev Plan account with:
- App ID: `vpaas-magic-cookie-bbd5ebf95864472e82b23e9c625af9d7`
- API Keys for JWT generation
- Free tier: 10,000 minutes/month

## 🚀 Setup Steps

### Step 1: Get Your Private Key

1. Go to your JaaS dashboard: https://jaas.8x8.vc/
2. Navigate to **Developers** → **API Keys**
3. Copy your **Private Key** (it's a long RSA key)

### Step 2: Add Environment Variables

Add these to your `.env.local` file:

```env
# JaaS Configuration
NEXT_PUBLIC_JAAS_APP_ID=vpaas-magic-cookie-bbd5ebf95864472e82b23e9c625af9d7
JAAS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
YOUR_PRIVATE_KEY_HERE
-----END PRIVATE KEY-----"
```

**Important:** 
- Replace `YOUR_PRIVATE_KEY_HERE` with your actual private key
- Keep the quotes around the private key
- Include the BEGIN and END lines

### Step 3: Install Dependencies

The package is being installed. Please approve the command:
```bash
npm install jsonwebtoken @types/jsonwebtoken
```

### Step 4: Restart Development Server

After adding environment variables:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

## 🎯 How It Works

### JWT Authentication Flow:

1. **User clicks "Start Session"**
   ↓
2. **Backend generates JWT token** with user info
   ↓
3. **Token sent to Jitsi** for authentication
   ↓
4. **Jitsi validates token** and allows access
   ↓
5. **User joins meeting** - no login required!

### Token Contains:
- User name and email
- Moderator status (mentors = moderators)
- Room name
- Expiration (2 hours)
- Feature permissions

## 🔒 Security Features

### Automatic:
- ✅ **JWT Authentication** - Only authorized users can join
- ✅ **Moderator Control** - Mentors have full control
- ✅ **Time-limited** - Tokens expire after 2 hours
- ✅ **Room-specific** - Each token is for one room only

### Mentor Powers:
- Set passwords
- Kick participants
- Mute everyone
- Lock room
- Enable/disable features

## 📝 Implementation Details

### Files Created:

1. **`/api/generate-jitsi-token/route.ts`**
   - Generates JWT tokens
   - Uses your private key
   - Sets user permissions

2. **`/video/[id]/page.tsx`**
   - Requests JWT token
   - Loads JaaS iframe
   - Handles authentication

### JWT Payload:
```javascript
{
  aud: 'jitsi',
  iss: 'chat',
  sub: 'your-app-id',
  context: {
    user: {
      name: 'User Name',
      email: 'user@email.com',
      moderator: true/false
    },
    features: {
      recording: true,
      // ... other features
    }
  },
  room: 'room-name'
}
```

## 🎉 Features Enabled

With JaaS, you get:
- ✅ HD video and audio
- ✅ Screen sharing
- ✅ Chat
- ✅ **Recording** (cloud)
- ✅ Virtual backgrounds
- ✅ Raise hand
- ✅ Reactions
- ✅ Polls
- ✅ Breakout rooms
- ✅ Live streaming
- ✅ **No authentication prompts!**

## 🧪 Testing

1. **Add environment variables** to `.env.local`
2. **Restart the server**
3. **Book a session**
4. **Click "Start Session"**
5. **Video loads** - no login required!

Both mentor and student can join seamlessly.

## 💡 Troubleshooting

### If video doesn't load:

**Check Environment Variables:**
```bash
# Make sure these are set:
echo $NEXT_PUBLIC_JAAS_APP_ID
echo $JAAS_PRIVATE_KEY
```

**Check Console for Errors:**
- Open browser DevTools (F12)
- Look for JWT generation errors
- Check network tab for API calls

**Common Issues:**

1. **"Failed to generate token"**
   - Private key not set correctly
   - Check `.env.local` format
   - Restart server after adding env vars

2. **"Invalid JWT"**
   - Wrong private key
   - App ID mismatch
   - Check JaaS dashboard for correct keys

3. **"Room not found"**
   - Check room name format
   - Should be: `{appId}/{roomName}`

## 📊 Free Tier Limits

Your JaaS Dev Plan includes:
- **10,000 minutes per month** (about 166 hours)
- **Unlimited rooms**
- **Up to 100 participants per room**
- **Cloud recording**
- **All premium features**

This is more than enough for a student project!

## 🎓 User Experience

### For Mentors:
1. Click "Start Session"
2. JWT generated automatically
3. Jitsi loads with moderator powers
4. Can control the meeting
5. No login required!

### For Students:
1. Click "Join Session"
2. JWT generated automatically
3. Jitsi loads as participant
4. Join and learn
5. No login required!

## 🔄 Compared to Free Jitsi

| Feature | meet.jit.si | JaaS (Your Setup) |
|---------|-------------|-------------------|
| **Authentication** | ❌ Required | ✅ JWT (automatic) |
| **Cost** | Free | Free (10k min/month) |
| **Recording** | Manual | Cloud (automatic) |
| **Quality** | Good | Better |
| **Reliability** | OK | Excellent |
| **Support** | Community | Official |

## 🚀 Production Ready

This setup is production-ready:
- ✅ Secure (JWT authentication)
- ✅ Scalable (handles many users)
- ✅ Reliable (8x8 infrastructure)
- ✅ Professional (enterprise features)

## 📖 Next Steps

1. **Get your private key** from JaaS dashboard
2. **Add to `.env.local`**
3. **Restart server**
4. **Test a video session**
5. **Enjoy seamless video calls!** 🎉

---

**Documentation:**
- JaaS Docs: https://developer.8x8.com/jaas/docs
- JWT Guide: https://developer.8x8.com/jaas/docs/jwt

**Support:**
- JaaS Dashboard: https://jaas.8x8.vc/
- Community: https://community.jitsi.org/

---

**You're all set!** This is a professional, production-ready video solution. 🎯
