# Deployment Guide: Video Summarizer

This project is configured to be deployed as a Docker container. We recommend **Render** as it offers a simple, robust platform for full-stack Docker apps.

## Prerequisites
1.  A GitHub account independent of specific orgs.
2.  A [Render](https://render.com) account (Free Tier is sufficient to start, but "Starter" is recommended for performance).

## Step 1: Push Code to GitHub
Ensure all your latest changes are pushed to your GitHub repository:
```bash
git add .
git commit -m "chore: Prepare for deployment (Docker + Static build)"
git push origin main
```

## Step 2: Deploy on Render
1.  Go to the [Render Dashboard](https://dashboard.render.com).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository (`VideoSummarizer`).
4.  **Configuration:**
    *   **Name:** `video-summarizer` (or any name)
    *   **Runtime:** **Docker** (This is crucial! It will automatically detect the `Dockerfile` in the root).
    *   **Region:** Choose the one closest to you (e.g., Singapore, Frankfurt).
    *   **Instance Type:** **Free** (or Starter for $7/mo if you need more RAM for Whisper).

5.  **Environment Variables:**
    You MUST add these environment variables in the Render dashboard (Advanced settings):

    | Key | Value | Description |
    | :--- | :--- | :--- |
    | `HF_API_KEY` | `hf_...` | Your Hugging Face API Token (copy from your local .env) |
    | `PORT` | `8000` | The internal port (Render sets this, but good to be explicit) |

6.  Click **Create Web Service**.

## Step 3: Wait for Build
Render will now:
1.  Clone your repo.
2.  Build the Docker image (this takes 5-10 minutes the first time because it installs FFmpeg, Python, Node, and builds the frontend).
3.  Deploy the service.

## Access Your App
Once deployed, Render will give you a URL like: `https://video-summarizer-xyz.onrender.com`.
Open that link—your full app (Frontend + Backend) is live! 🚀
