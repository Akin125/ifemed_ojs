# IFEMED OJS Headless Journal

A modern, headless Open Journal Systems (OJS) 3.5 frontend built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🏠 **Home Page**: Display published articles from OJS API (`/submissions?status=3`)
- 📄 **Article Detail**: Full article view with PDFs (galleys) and citation formatting
- 📚 **Archive**: Browse journal issues
- 📰 **News**: View announcements
- 🔍 **Search**: Full-text search functionality
- 👤 **User Registration**: Server-side action for user registration
- 🎨 **Modern UI**: Deep blue theme (#1e3a8a) with serif typography
- ⚡ **ISR**: Incremental Static Regeneration for optimal SEO
- 💀 **Skeleton Loaders**: Improved UX with loading states

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **API**: OJS 3.5 REST API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OJS 3.5 instance with API access

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Akin125/ifemed_ojs.git
cd ifemed_ojs
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your OJS instance details:
```env
OJS_API_KEY=your_api_key_here
OJS_BASE_URL=https://your-ojs-instance.com/api/v1
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   └── search/        # Search endpoint
│   ├── archive/           # Archive page
│   ├── article/[id]/      # Dynamic article pages
│   ├── news/              # News/announcements page
│   ├── register/          # User registration
│   ├── search/            # Search page
│   ├── layout.tsx         # Root layout with navigation
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   └── SkeletonLoader.tsx # Loading states
├── lib/                   # Core utilities
│   └── ojs.ts            # OJS API fetcher with ISR
├── types/                 # TypeScript type definitions
│   └── ojs.ts            # OJS API types
└── ...
```

## Key Features Explained

### OJS API Integration

The `lib/ojs.ts` file provides a centralized fetcher for OJS API with:
- Built-in authentication via API key
- ISR support (1-hour revalidation)
- Localized string handling (e.g., `title.en_US`)

### Localization

OJS returns multilingual content as objects like:
```json
{
  "title": {
    "en_US": "Article Title",
    "fr_CA": "Titre de l'article"
  }
}
```

The `getLocalizedValue()` function extracts the appropriate language, defaulting to `en_US`.

### Server Actions

The registration form uses Next.js Server Actions for secure server-side processing:
- Form submission handled by `app/register/actions.ts`
- Server-side validation and API calls
- No client-side API key exposure

### ISR (Incremental Static Regeneration)

Pages are statically generated and revalidated every hour:
```typescript
fetch(url, {
  next: { revalidate: 3600 } // 1 hour
})
```

This provides:
- Fast page loads
- SEO benefits
- Fresh content updates

## Screenshots

### Homepage
![Homepage](https://github.com/user-attachments/assets/939768e7-362b-4b9e-9c6f-67af4c35eb94)

### Search Page
![Search](https://github.com/user-attachments/assets/010a39e8-feff-4580-9c06-9a68fd668c0e)

### Registration Form
![Register](https://github.com/user-attachments/assets/1bd7c7f3-8496-43a3-8155-b5aade050751)

## Customization

### Theme Colors

Edit `app/globals.css` to change the primary color:
```css
h1, h2, h3, h4, h5, h6 {
  @apply text-[#1e3a8a]; /* Change this hex color */
}
```

### Font

The project uses Georgia serif. To change it, update `app/globals.css`:
```css
body {
  font-family: 'Your Font', serif;
}
```

## License

ISC

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
