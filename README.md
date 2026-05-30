# CollabConnect 🤝

A full-stack platform for content creators to find collaboration partners.

## Features
- User Signup/Login with JWT
- Creator Profiles (Niche, Follower Range, Bio)
- Swipe-based matching (Coming soon)
- Real-time chat (Coming soon)

## Tech Stack
- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Auth:** JWT

## Setup
1. Clone repo
2. `cd backend && npm install`
3. Create `.env` with `PORT=5001` and `JWT_SECRET`
4. Setup MySQL and create `collabconnect` database
5. `npm run dev`
6. `cd ../frontend && npm install && npm run dev`
