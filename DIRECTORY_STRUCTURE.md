# Project Directory Structure

This document provides a visual representation of the complete project structure.

```
ifemed_ojs/
│
├── .env.example                 # Environment variables template
├── .env.local                   # Local environment variables (not in git)
├── .gitignore                   # Git ignore rules
├── README.md                    # Comprehensive documentation
├── DIRECTORY_STRUCTURE.md       # This file
│
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── package.json                 # Dependencies and scripts
│
├── app/                         # Next.js App Router directory
│   ├── layout.tsx              # Root layout with header/footer
│   ├── page.tsx                # Home page (featured articles, news, research grid)
│   ├── globals.css             # Global styles and Tailwind imports
│   │
│   ├── actions/                # Server Actions
│   │   └── userActions.ts     # User registration and submission tracking
│   │
│   ├── article/               # Article routes
│   │   └── [id]/
│   │       └── page.tsx       # Article detail page (dynamic route)
│   │
│   ├── dashboard/             # User dashboard
│   │   └── page.tsx          # Submission tracking page
│   │
│   ├── register/              # Registration
│   │   └── page.tsx          # User registration form
│   │
│   └── search/                # Search functionality
│       └── page.tsx           # Search page with results
│
├── lib/                        # Library code
│   └── ojs.ts                 # OJS API integration (core logic)
│
└── components/                 # Reusable React components
    └── CopyButton.tsx         # Copy to clipboard with feedback

```

## File Descriptions

### Configuration Files

- **`.env.example`**: Template for environment variables. Copy to `.env.local` and fill in your OJS details.
- **`.gitignore`**: Specifies which files Git should ignore (node_modules, build artifacts, env files).
- **`next.config.ts`**: Next.js configuration including image domains and optimization settings.
- **`tsconfig.json`**: TypeScript compiler configuration with path aliases.
- **`tailwind.config.js`**: Tailwind CSS theme customization (colors, fonts, components).
- **`postcss.config.js`**: PostCSS configuration for Tailwind processing.
- **`package.json`**: Project dependencies, scripts, and metadata.

### Application Files

#### Root Level (`app/`)
- **`layout.tsx`**: Global layout wrapper with header, navigation, and footer.
- **`page.tsx`**: Home page featuring hero section, news ticker, and article grid.
- **`globals.css`**: Global CSS including Tailwind directives and custom styles.

#### Server Actions (`app/actions/`)
- **`userActions.ts`**: Server-side form handlers for user registration and data fetching.

#### Article Pages (`app/article/[id]/`)
- **`page.tsx`**: Dynamic article detail page with:
  - Two-column layout
  - SEO metadata generation
  - OpenGraph tags
  - Google Scholar meta tags
  - PDF download links
  - DOI badges
  - Citation formatting

#### Dashboard (`app/dashboard/`)
- **`page.tsx`**: User submission tracking dashboard showing:
  - Active submissions
  - Editorial stages
  - Progress indicators
  - Links to OJS workflow

#### Registration (`app/register/`)
- **`page.tsx`**: Author registration form with:
  - Form validation
  - Server action integration
  - User feedback
  - Maps to userGroupId: 18 (Author)

#### Search (`app/search/`)
- **`page.tsx`**: Article search interface with:
  - Real-time search
  - Results display
  - Query parameter support

### Library (`lib/`)

#### `ojs.ts` - Core API Library
Complete OJS 3.5 REST API wrapper including:

**Types:**
- `LocalizedString`: Type for OJS localized objects
- `Author`: Author information
- `Galley`: PDF/file attachments
- `Submission`: Article/submission data
- `Issue`: Journal issue data
- `Announcement`: News/announcements
- `NavigationMenuItem`: Menu items
- `UserRegistration`: User signup data

**Functions:**
- `getLocaleValue()`: Extract localized strings
- `getSubmissions()`: Fetch published articles
- `getArticle()`: Fetch single article with metadata
- `getUserSubmissions()`: Fetch user's submissions
- `getIssues()`: Fetch journal issues
- `getCurrentIssue()`: Fetch current issue
- `getAnnouncements()`: Fetch news/announcements
- `getNavigationMenus()`: Fetch navigation structure
- `registerUser()`: Create new author account
- `authenticateUser()`: User login
- `searchArticles()`: Search articles by phrase
- `formatAuthors()`: Format author names for display
- `formatCitation()`: Generate APA-style citations
- `getEditorialStageName()`: Get stage name from ID
- `getStatusName()`: Get status name from ID

### Components (`components/`)

- **`CopyButton.tsx`**: Reusable copy-to-clipboard button with:
  - Success/error feedback
  - Visual state changes
  - Accessibility support

## Key Features by File

### SEO & Performance
- **ISR (Incremental Static Regeneration)**: 1-hour revalidation on all data-fetching pages
- **Metadata API**: Dynamic meta tags in `app/article/[id]/page.tsx`
- **OpenGraph**: Social media sharing optimization
- **Google Scholar**: Academic citation meta tags

### Design System
- **Tailwind CSS**: Utility-first styling
- **Custom Theme**: Academic color palette in `tailwind.config.js`
- **Typography**: Serif (Lora) for content, Sans-Serif (Inter) for UI
- **Responsive**: Mobile-first design throughout

### Data Flow
1. **Server Components**: Pages fetch data server-side
2. **Client Components**: Interactive elements like forms and buttons
3. **Server Actions**: Secure form submissions
4. **ISR**: Automatic revalidation for fresh data

## Getting Started

1. Copy `.env.example` to `.env.local` and configure
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start development server
4. Open http://localhost:3000 in your browser

## Build for Production

```bash
npm run build
npm start
```

The build process:
1. Compiles TypeScript
2. Bundles and optimizes code
3. Pre-renders static pages
4. Generates optimized images
5. Creates production build in `.next/` directory
