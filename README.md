# Iron Legacy Project Website

A plain HTML/CSS/JS site — no build step required. Four pages:

- `index.html` — Home: Mission, Slogan & Core Values, Programs
- `donate.html` — Donate & Volunteer (volunteer form saves to Supabase)
- `nominate.html` — Nominate a Veteran (nomination form saves to Supabase)
- `about.html` — About the Founder & Contact

## 1. Edit before launch

- `about.html`: replace the draft founder bio paragraph with your own words, and drop a real photo
  in `assets/founder-photo.jpg` (a placeholder logo shows until you do).
- `donate.html`: the "Donate Now" button currently opens an email. Once you have a donation
  processor (Givebutter, PayPal Giving Fund, Stripe Payment Link, etc.) and your 501(c)(3) status,
  replace that `href` with your real donation link.
- Check the phone number and email in the footer of every page match your current contact info.

## 2. Set up Supabase (stores nomination + volunteer form submissions)

1. Go to https://supabase.com and create a free account and a new project.
2. In the project, open **SQL Editor -> New query**, paste the contents of `supabase/schema.sql`,
   and run it. This creates the `nominations` and `volunteer_signups` tables.
3. Go to **Settings -> API** and copy the **Project URL** and the **anon public** key.
4. Open `js/supabase-config.js` and paste those two values in place of the placeholders.
5. To review submissions later, log into the Supabase dashboard and open **Table Editor** — the
   public website key can only submit new entries, not read them, which keeps nominee and
   volunteer information confidential by default.

## 3. Push to GitHub

```bash
cd website
git init
git add .
git commit -m "Iron Legacy Project website"
```

Then create a new repository on https://github.com/new (you'll need to sign in / create a GitHub
account yourself), and follow GitHub's instructions to push an existing repository, e.g.:

```bash
git remote add origin https://github.com/YOUR-USERNAME/iron-legacy-project.git
git branch -M main
git push -u origin main
```

## 4. Deploy on Vercel

1. Go to https://vercel.com and sign in (you can sign in with your GitHub account).
2. Click **Add New -> Project**, select the `iron-legacy-project` repository you just pushed.
3. Framework preset: choose **Other** (this is a static site — no build command needed).
4. Click **Deploy**. Vercel will give you a live URL (e.g. `iron-legacy-project.vercel.app`).
5. Optional: in the Vercel project's **Settings -> Domains**, add your own domain name if you buy
   one.

After the first deploy, any time you push new commits to the `main` branch on GitHub, Vercel will
automatically redeploy the site.

## Notes

- This site does not collect payment information directly — donations route through whatever
  processor link you add in `donate.html`. Never enter card numbers or bank details into this
  codebase.
- The forms degrade gracefully: until `js/supabase-config.js` has real values, submitting a form
  shows a friendly message asking the visitor to email you directly instead of failing silently.
