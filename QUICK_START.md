# Quick Start Guide

Get your OJS 3.5 headless journal frontend up and running in minutes.

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js 18 or higher installed
- ✅ npm, yarn, or pnpm package manager
- ✅ OJS 3.5 installation with API access
- ✅ OJS API Key (we'll show you how to get this)

## Step 1: Get Your OJS API Key

1. Log in to your OJS installation as an administrator
2. Navigate to **Settings → Website → Plugins**
3. Find and enable the **REST API** plugin
4. Go to **Settings → API Key Management**
5. Click **Generate API Key**
6. Copy the generated key - you'll need it in Step 3

## Step 2: Clone and Install

```bash
# Clone the repository
git clone https://github.com/Akin125/ifemed_ojs.git
cd ifemed_ojs

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

## Step 3: Configure Environment

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your settings:
   ```env
   # Your OJS API endpoint (usually /api/v1)
   OJS_BASE_URL=http://localhost/ojs/api/v1
   
   # Paste your API key from Step 1
   OJS_API_KEY=your_api_key_here
   
   # Your journal path (e.g., 'journal' from http://localhost/ojs/journal)
   OJS_JOURNAL_PATH=journal
   
   # Optional: Admin credentials for protected endpoints
   OJS_ADMIN_USERNAME=admin
   OJS_ADMIN_PASSWORD=your_password
   
   # Your journal name
   NEXT_PUBLIC_SITE_NAME=My Journal
   
   # Your frontend URL
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

## Step 4: Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see:
- ✅ Home page with featured articles
- ✅ News ticker (if you have announcements)
- ✅ Latest research grid

## Step 5: Test the Features

### Browse Articles
- Click on any article card to view full details
- Check the PDF download button
- View DOI and citation information

### Search
- Navigate to `/search` or use the header link
- Enter keywords to search articles
- Results appear from your OJS installation

### Register
- Go to `/register`
- Fill out the author registration form
- Submit to create a new author account in OJS

### Dashboard
- Go to `/dashboard`
- Enter your OJS user ID (found in OJS admin panel)
- View your submissions and their editorial stages

## Troubleshooting

### "Failed to fetch" Errors

**Problem**: You see connection errors when loading pages.

**Solution**: 
1. Verify your OJS installation is running
2. Check `OJS_BASE_URL` is correct in `.env.local`
3. Ensure the REST API plugin is enabled in OJS
4. Test the API directly: `curl http://localhost/ojs/api/v1/submissions`

### No Articles Appearing

**Problem**: Home page shows "No Articles Found".

**Solution**:
1. Ensure you have published articles in OJS (status = 3)
2. Check articles are assigned to an issue
3. Verify API key has read permissions
4. Check OJS settings allow public access to published content

### API Authentication Errors

**Problem**: 401 or 403 errors.

**Solution**:
1. Regenerate API key in OJS
2. Update `OJS_API_KEY` in `.env.local`
3. Restart the development server
4. Clear Next.js cache: `rm -rf .next`

### TypeScript Errors

**Problem**: Type errors when building.

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## Next Steps

### Customize Design
- Edit `tailwind.config.js` to change colors and fonts
- Modify `app/globals.css` for custom styles
- Update `app/layout.tsx` to customize header/footer

### Add Features
- Implement user authentication (currently uses demo mode)
- Add submission forms for authors
- Create admin dashboard
- Integrate analytics

### Deploy to Production
- Build: `npm run build`
- Test: `npm start`
- Deploy to Vercel, Netlify, or your hosting provider

## Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

# Clear cache
rm -rf .next         # Clear Next.js cache

# Update dependencies
npm update           # Update packages
```

## Documentation

- 📖 [README.md](README.md) - Full documentation
- 📁 [DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md) - Project structure
- 🔗 [OJS API Docs](https://docs.pkp.sfu.ca/dev/api/) - OJS REST API reference
- 🔗 [Next.js Docs](https://nextjs.org/docs) - Next.js documentation

## Need Help?

- 🐛 [Open an Issue](https://github.com/Akin125/ifemed_ojs/issues)
- 📧 Email: editor@ifemed.com
- 💬 OJS Community: [PKP Forum](https://forum.pkp.sfu.ca/)

## Common Customizations

### Change Journal Name
Edit `.env.local`:
```env
NEXT_PUBLIC_SITE_NAME=Your Journal Name
```

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Your brand colors
    500: '#your-color',
    600: '#your-darker-color',
  }
}
```

### Change Fonts
Edit `app/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont&display=swap');

body {
  font-family: 'YourFont', sans-serif;
}
```

### Add Google Analytics
Add to `app/layout.tsx`:
```tsx
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
<Script id="google-analytics">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

---

🎉 **Congratulations!** You now have a fully functional headless journal frontend. Enjoy building!
