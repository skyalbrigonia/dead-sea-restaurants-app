ASCII Art Restaurant Reviews (P.R.A.S.)
A web application for sharing restaurant reviews, featuring a unique terminal/ASCII art aesthetic and real-time updates. Inspired by cyberpunk and science fiction themes, the application is built with a modern tech stack and optimized for simple, immediate deployment.

Main Features
Real-Time Updates: New reviews appear instantly for all connected users without needing a page refresh, thanks to Supabase's real-time subscriptions.

Unique ASCII Art Interface: A fully customized user experience with a terminal aesthetic, enriched by a header with ASCII animations (3D donut, NERV, and SEELE logos).

Fast and Optimized: Built with Next.js to ensure a responsive, high-performance, and modern user experience.

Serverless Backend: The project relies on Supabase, which provides a managed PostgreSQL database, instant APIs, and a robust authentication system, eliminating the need to manage a server.

Continuous Deployment: Configured for simple and automated deployment via Vercel, directly linked to GitHub.

Tech Stack
Frontend: Next.js (React Framework)

Styling: Tailwind CSS

Backend & Database: Supabase (PostgreSQL, API, Real-time)

Deployment: Vercel

Getting Started and Deployment
This project is configured for immediate deployment on Vercel. Follow these steps.

1. Set Up Your Supabase Project
Sign up on supabase.com and create a new project (the free plan is perfect to get started).

Once in the dashboard, go to the "SQL Editor" (icon <>).

Copy and paste the following SQL script to create the reviews table and click "RUN":

-- Create the reviews table
CREATE TABLE reviews (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  restaurant_name TEXT NOT NULL,
  review_text TEXT,
  rating INT2 NOT NULL CHECK (rating >= 1 AND rating <= 5),
  maps_link TEXT
);

-- Enable real-time updates for the 'reviews' table
ALTER PUBLICATION supabase_realtime ADD TABLE reviews;

Go to Project Settings -> API. Here you will find your credentials. Copy the project URL and the anon public API key.

2. Deploy to Vercel
Create a "fork" of this repository on your GitHub account or upload your frontend folder to a new repository.

Go to vercel.com and sign up using your GitHub account.

From your Vercel dashboard, click "Add New... -> Project" and import the repository you just created.

Vercel will automatically recognize that it is a Next.js project. Before deploying, expand the "Environment Variables" section. Here you must enter your Supabase keys to allow the site to connect to the database:

Variable Name

Value

NEXT_PUBLIC_SUPABASE_URL

Paste your Supabase project URL here

NEXT_PUBLIC_SUPABASE_ANON_KEY

Paste your anon public API key here

Click "Deploy".

In a few minutes, your application will be online! From now on, every git push to the main branch of your repository will automatically update the live site.