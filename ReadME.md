# ASCII Art Restaurant Reviews (P.R.A.S.)

A web application for sharing restaurant reviews, featuring a unique terminal/ASCII art aesthetic and real-time updates. Inspired by cyberpunk and science fiction themes, the application is built with a modern tech stack and optimized for simple, immediate deployment.

## Main Features

- **Real-Time Updates**: New reviews appear instantly for all connected users without needing a page refresh, thanks to Supabase's real-time subscriptions.

- **Unique ASCII Art Interface**: A fully customized user experience with a terminal aesthetic, enriched by a header with ASCII animations (3D donut, NERV, and SEELE logos).

- **Fast and Optimized**: Built with Next.js to ensure a responsive, high-performance, and modern user experience.

- **Serverless Backend**: The project relies on Supabase, which provides a managed PostgreSQL database, instant APIs, and a robust authentication system, eliminating the need to manage a server.

- **Continuous Deployment**: Configured for simple and automated deployment via Vercel, directly linked to GitHub.

## Tech Stack

- **Frontend**: Next.js (React Framework)
- **Styling**: Tailwind CSS
- **Backend & Database**: Supabase (PostgreSQL, API, Real-time)
- **Deployment**: Vercel

## Getting Started and Deployment

This project is configured for immediate deployment on Vercel. Follow these steps.

### 1. Set Up Your Supabase Project

1. Sign up on [supabase.com](https://supabase.com) and create a new project (the free plan is perfect to get started).

2. Once in the dashboard, go to the "SQL Editor" (icon `</>`).

3. Copy and paste the following SQL script to create the reviews table and click "RUN":

```sql
-- Create the reviews table
CREATE TABLE reviews (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  restaurant_name TEXT NOT NULL,
  review_text TEXT,
  rating INT2 NOT NULL CHECK (rating >= 1 AND rating <= 5),
  maps_link TEXT
);

-- Create the votes table for user votes on reviews
CREATE TABLE review_votes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  review_id BIGINT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_ip TEXT NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  UNIQUE(review_id, user_ip)
);

-- Enable real-time updates for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE review_votes;
```

4. Go to **Project Settings** → **API**. Here you will find your credentials. Copy the project URL and the anon public API key.

### 2. Deploy to Vercel

1. Create a "fork" of this repository on your GitHub account or upload your frontend folder to a new repository.

2. Go to [vercel.com](https://vercel.com) and sign up using your GitHub account.

3. From your Vercel dashboard, click **"Add New... → Project"** and import the repository you just created.

4. Vercel will automatically recognize that it is a Next.js project. Before deploying, expand the **"Environment Variables"** section. Here you must enter your Supabase keys to allow the site to connect to the database:

| Variable Name | Value |
|---------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Paste your Supabase project URL here |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Paste your anon public API key here |

5. Click **"Deploy"**.

In a few minutes, your application will be online! From now on, every git push to the main branch of your repository will automatically update the live site.

### 3. (Optional) Connect a Custom Domain

After deploying, you can replace the default `.vercel.app` URL with your own custom domain.

1. Go to your Vercel Project Dashboard.
2. Navigate to the **"Settings"** tab and then select **"Domains"**.
3. Enter your custom domain name (e.g., `miodominio.com`) and click **"Add"**.
4. Vercel will present you with configuration options. The recommended method is using Vercel's Nameservers.

#### Method A: Using Vercel's Nameservers (Recommended)

This method allows Vercel to manage your DNS records automatically, which is simpler and more reliable.

1. Log in to the control panel of your domain provider (where you bought your domain, e.g., GoDaddy, Namecheap, Aruba, etc.).

2. Find the DNS or Nameserver settings for your domain.

3. Replace your provider's default nameservers with the ones provided by Vercel (they usually look like `ns1.vercel-dns.com` and `ns2.vercel-dns.com`).

4. Save the changes. It may take up to 24 hours for the DNS changes to propagate, but it's often much faster. Vercel's dashboard will show you when the configuration is complete and valid.

#### Method B: Using an A Record (Advanced)

Use this method if you want to keep your DNS management with your current provider.

1. In Vercel's domain settings, choose the **"A Record"** configuration option. Vercel will provide you with an IP address.

2. Log in to your domain provider's control panel and find the DNS settings.

3. Create a new A record:
   - **Type**: A
   - **Name / Host**: `@` (this usually represents the root domain)
   - **Value / Points to**: The IP address provided by Vercel
   - **TTL**: Leave it as default or set it to 1 hour

4. Save the changes. As with the other method, propagation can take some time. Once complete, your site will be live at your custom domain.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).