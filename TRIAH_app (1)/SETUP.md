# TRIAH — Setup Guide

**TRIAH (Trusted Review for Intelligent AI in Healthcare)** is a multi-evaluator scoring and certification platform for healthcare AI products. Expert reviewers independently score AI vendors across 8 weighted standards, and the platform aggregates scores to produce badge certifications and inter-rater reliability (IRR) metrics.

---

## Step 1 — Import from GitHub

1. Log into [replit.com](https://replit.com)
2. Click **Create Repl**
3. Select **Import from GitHub**
4. Enter the repository URL: `https://github.com/WinAI247/new_app`
5. Click **Import from GitHub** to create the workspace

---

## Step 2 — Add a PostgreSQL Database

The app requires a PostgreSQL database to store vendors, evaluations, and scores.

1. Inside your Repl, open the **Tools** panel on the left sidebar
2. Click **Database**
3. Click **Create a database** (choose PostgreSQL)
4. Replit will automatically set the `DATABASE_URL` environment variable — no extra steps needed

---

## Step 3 — Connect Replit Auth

The app uses Replit's built-in authentication so team members can log in with their Replit accounts.

1. Open the **Tools** panel on the left sidebar
2. Click **Integrations**
3. Find **Replit Auth** and click to enable it
4. The `.replit` file in the project already references this integration — Replit will wire it up automatically

---

## Step 4 — Set the SESSION_SECRET

The app needs a secret key to secure user sessions.

1. Open the **Tools** panel and click **Secrets**
2. Add a new secret:
   - **Key:** `SESSION_SECRET`
   - **Value:** Any long random string (at least 32 characters), for example:  
     `a7f3k2m9p4q8r1s6t0v5w2x7y3z8b1c4`
3. Click **Add Secret**

> `DATABASE_URL` is set automatically by Replit in Step 2 — you do not need to add it manually.

---

## Step 5 — Install Dependencies

Open the **Shell** tab and run:

```bash
npm install
```

Wait for it to finish before proceeding.

---

## Step 6 — Push the Database Schema

This creates all the required tables in your PostgreSQL database.

In the **Shell** tab, run:

```bash
npm run db:push
```

You should see output confirming the tables were created.

---

## Step 7 — Start the App

Click the **Run** button at the top of the workspace (or type `npm run dev` in the Shell).

Once it starts, open the **Webview** tab or the preview URL (ending in `.replit.dev`) to see the app. You will be prompted to log in with your Replit account.

---

## Step 8 — Seed Initial Data

The first time you run the app, you need to populate it with vendor profiles and evaluator data:

1. Log into the app and navigate to **Admin Panel** in the left sidebar
2. Click the **Data Operations** tab
3. Click **Seed Vendors (first run)** — this loads the 4 healthcare AI vendor profiles
4. Click **Add Sandeep & Michael** — this adds completed evaluation sessions for Sandeep Kashyap and Michael Sheedy
5. Evaluations for Angela Askren, David Rivera, and Kamal Sharma must be started manually by each evaluator once they log in

---

## What is NOT Included in the Code

> **Important:** The following items are intentionally excluded from the GitHub repository for security and privacy reasons. They must be re-created in each new workspace:
>
> - **Database records** — vendor profiles, evaluation scores, calibration data, and session history must be re-seeded (see Step 8)
> - **Secrets** — `SESSION_SECRET` must be re-entered in each workspace (see Step 4)
> - **Database connection** — `DATABASE_URL` is workspace-specific and set automatically by Replit

---

## For Deployment (Publishing)

To make the app available at a permanent URL for your team:

1. Run the build in the Shell:
   ```bash
   npm run build
   ```
2. Click the **Deploy** button in the Replit toolbar
3. In the publishing settings, enable **Private Deployment** so only members of your Replit team can access the published URL
4. Click **Publish**

With **Private Deployment** enabled, only people who are members of your Replit organization and logged into their Replit account can open the app — no public internet access.

---

## Team Member Access

Once the app is deployed, share the published URL (ending in `.replit.app`) with your team. Each member must:

1. Have a Replit account
2. Be added to your Replit team/organization (via replit.com/t/triah → Members)
3. Log into replit.com before opening the app URL

Team members log in using their Replit accounts — no separate passwords needed.
