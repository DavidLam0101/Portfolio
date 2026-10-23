# Dat Lam — Portfolio

A single-page portfolio built with React, TypeScript and Vite. All content can be edited in the browser by the admin.

- **Home**: the title and name type themselves out in a loop ("Hi, my name is:" ↔ "Or you can call me", "Dat Lam" ↔ "David Lam"). Below them are the job title, location, intro and a Download CV button. Next to them is a photo card with Email, GitHub and LinkedIn links.
- **About me**: a photo card with two tabs. *About me* holds the bio. *Tech skills* shows your manual skills plus every language used in your projects.
- **Projects**: project cards with an image, name, short description and languages. Hovering a card (or tapping it on a phone) enlarges it, cycles its images every 5 seconds and shows the long description. Wide screens show 4 cards, 2 per row. Narrow screens show 3 cards, 1 per row. "Continue viewing" shows the rest.
- **Contact footer**: your phone number plus GitHub, LinkedIn, Instagram and Email icons. Each icon sits on a gradient in its brand color (GitHub purple, LinkedIn blue, Instagram's gradient, Email red).
- **Admin mode**: click the "Dat Lam" logo to log in. The panel has a "Forgot password?" link. While you're logged in, every section shows an **Edit** button, and you can add, edit, reorder and delete projects.
- Light and dark theme toggle.

## Run it

```bash
npm install
npm run dev
```

Open the printed URL (usually http://localhost:5173).

### Demo mode (default)

Without Supabase configured, the site runs in **demo mode**:

- Log in with `admin@example.com` / `admin123`. You can change these in `.env.local`.
- Edits, images and the CV are saved **only in your browser** (localStorage). Visitors won't see them.
- Password-reset emails don't work in demo mode.

Use demo mode to try the editor. For the real site, connect Supabase.

## Connect Supabase (real login and shared content)

Supabase's free tier is enough for this site.

1. Create a project at https://supabase.com.
2. **Create your admin user**: go to *Authentication → Users → Add user*, enter your email and a password, and tick *Auto confirm user*.
3. **Block other sign-ups**: go to *Authentication → Sign In / Providers* and turn off *Allow new users to sign up*.
4. **Create the tables and storage**: open `supabase/schema.sql`, replace `YOUR_ADMIN_EMAIL` with the email from step 2, then paste the file into *SQL Editor* and run it.
5. **Allow password-reset links to return to your site**: go to *Authentication → URL Configuration*. Set *Site URL* to your deployed URL, and add `http://localhost:5173` under *Redirect URLs*.
6. Copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from *Project Settings → API*.
7. Restart `npm run dev`, log in, and fill in your content: photos, links, CV and projects.

The anon key is safe to put in frontend code. Only the email named in `is_admin()` can write data, which the database's row-level security enforces.

## Deploy

### GitHub Pages (set up)

`.github/workflows/deploy.yml` builds and publishes the site on every push to `main`. The build reads the Supabase URL and publishable key from the committed `.env.production`. That key is meant to be public, and row-level security protects the data. A build without these values fails, so the browser-only demo can never be published.

One-time setup:

1. **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**.
2. In Supabase, go to **Authentication → URL Configuration**. Set *Site URL* to `https://<username>.github.io/<repo>/` and add it to *Redirect URLs*.

### Other hosts

```bash
npm run build   # outputs to dist/
```

Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages). Set the two `VITE_SUPABASE_*` environment variables in the host's settings.

## Customising

- **Accent color**: change `--accent` in `src/styles.css`. There's a light and a dark value.
- **Default text** (used before anything is saved): `src/defaults.ts`.
