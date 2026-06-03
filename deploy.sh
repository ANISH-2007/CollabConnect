#!/bin/bash

echo "🚀 Deploying CollabConnect..."

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy to production"
git push origin main

# Deploy backend to Render (via GitHub)
echo "🖥️ Backend will auto-deploy on Render from GitHub"

# Deploy frontend to Vercel
echo "🎨 Deploying frontend to Vercel..."
cd frontend
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Frontend: https://collabconnect.vercel.app"
echo "🔗 Backend: https://collabconnect-api.onrender.com"
