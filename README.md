# IFEMED OJS 3.5 Headless Journal Frontend

A production-ready Next.js 15 boilerplate for building a state-of-the-art headless academic journal that consumes the OJS 3.5 REST API.

## 🚀 Features

### Core Functionality
- **OJS 3.5 REST API Integration**: Complete wrapper for all primary OJS endpoints
- **Locale Intelligence**: Smart extraction of localized strings from OJS objects
- **Authentication**: Secure Bearer token handling with API keys
- **User Registration**: Server actions for author signup (userGroupId: 18)
- **Submission Tracking**: Dashboard for monitoring editorial stages

### Pages & Components
- **Home Page**: Featured article hero, latest news ticker, top research grid
- **Article Detail**: Two-column layout with metadata, PDF download, DOI, citations
- **Search**: Real-time article search with /submissions?searchPhrase endpoint
- **Dashboard**: User submission tracking with editorial stage display
- **Registration**: Complete user signup form with validation

### Design & UX
- **Editorial Aesthetic**: High-end design with Serif (Lora) for body text and Sans-Serif (Inter) for UI
- **Tailwind CSS**: Custom academic color palette and component library
- **Responsive**: Mobile-first design that works on all devices
- **Accessibility**: Semantic HTML and ARIA labels

### SEO & Performance
- **OpenGraph Tags**: Social media sharing optimization
- **Google Scholar Meta Tags**: Academic citation support
- **ISR (Incremental Static Regeneration)**: 1-hour revalidation for optimal performance
- **TypeScript**: Full type safety throughout the application

## 📁 Project Structure

```
ifemed_ojs/
├── app/
│   ├── actions/
│   │   └── userActions.ts          # Server actions for user management
│   ├── article/[id]/
│   │   └── page.tsx                # Article detail page
│   ├── dashboard/
│   │   └── page.tsx                # User dashboard
│   ├── register/
│   │   └── page.tsx                # User registration
│   ├── search/
│   │   └── page.tsx                # Search functionality
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Home page
├── lib/
│   └── ojs.ts                      # OJS API integration library
├── .env.example                    # Environment variables template
├── .env.local                      # Local environment variables
├── next.config.ts                  # Next.js configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- OJS 3.5 installation with API access
- OJS API Key (generate from OJS Settings > Website > Plugins > Web Services)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akin125/ifemed_ojs.git
   cd ifemed_ojs
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env.local` and update with your OJS settings:
   
   ```env
   # OJS 3.5 Backend Configuration
   OJS_BASE_URL=http://localhost/ojs/api/v1
   OJS_API_KEY=your_ojs_api_key_here
   OJS_JOURNAL_PATH=journal
   OJS_ADMIN_USERNAME=admin
   OJS_ADMIN_PASSWORD=admin_password
   
   # Next.js Configuration
   NEXT_PUBLIC_SITE_NAME=IFEMED Journal
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Generate OJS API Key**
   
   In your OJS installation:
   - Log in as admin
   - Go to Settings > Website > Plugins
   - Enable "REST API" plugin
   - Go to Settings > API Key Management
   - Generate a new API key
   - Copy the key to `OJS_API_KEY` in `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 API Documentation

### Core Functions (lib/ojs.ts)

#### Submissions
```typescript
// Fetch published articles
const articles = await getSubmissions({ count: 10 });

// Fetch single article with full metadata
const article = await getArticle(articleId);

// Search articles
const results = await searchArticles("machine learning");
```

#### Issues
```typescript
// Fetch all issues
const issues = await getIssues();

// Fetch current issue
const currentIssue = await getCurrentIssue();
```

#### Announcements
```typescript
// Fetch announcements
const news = await getAnnouncements({ count: 5 });
```

#### User Management
```typescript
// Register new user (Author)
const user = await registerUser({
  username: "jdoe",
  email: "jdoe@example.com",
  password: "securepass",
  givenName: "John",
  familyName: "Doe",
  userGroupId: 18, // Author role
});
```

#### Utilities
```typescript
// Extract localized string
const title = getLocaleValue(article.title); // Returns "Hello" from { en_US: "Hello" }

// Format authors
const authors = formatAuthors(article.authors); // Returns "Smith, J., Doe, J., & Johnson, A."

// Format citation (APA style)
const citation = formatCitation(article);
```

## 🎨 Customization

### Styling
- Edit `tailwind.config.js` to customize colors, fonts, and theme
- Modify `app/globals.css` for global styles
- Update component classes in individual page files

### Fonts
The project uses Google Fonts:
- **Lora** (Serif) for article body text
- **Inter** (Sans-Serif) for UI elements

To change fonts, update the imports in `app/layout.tsx`

### Colors
Academic color palette is defined in `tailwind.config.js`:
- `academic-*`: Gray scale for professional look
- `primary-*`: Blue tones for interactive elements

## 🚢 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The app can be deployed to any Node.js hosting platform:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway
- Render

### Build for Production
```bash
npm run build
npm start
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OJS_BASE_URL` | Base URL of OJS API (e.g., http://localhost/ojs/api/v1) | Yes |
| `OJS_API_KEY` | OJS API authentication key | Yes |
| `OJS_JOURNAL_PATH` | Journal path in OJS | Yes |
| `OJS_ADMIN_USERNAME` | Admin username for protected endpoints | No |
| `OJS_ADMIN_PASSWORD` | Admin password for protected endpoints | No |
| `NEXT_PUBLIC_SITE_NAME` | Journal name for branding | No |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the frontend | No |

## 🔒 Security

- API keys are stored in environment variables
- Server actions for secure form submissions
- CSRF protection via OJS API tokens
- No sensitive data exposed to client

## 🧪 Testing

To test the application:
1. Ensure your OJS installation has sample data
2. Verify API connectivity
3. Test each page:
   - Home: Should display articles and announcements
   - Article detail: Should show full metadata
   - Search: Should return relevant results
   - Dashboard: Enter valid user ID to view submissions
   - Register: Test form submission (may need OJS configuration)

## 📖 Additional Resources

- [OJS 3.5 Documentation](https://docs.pkp.sfu.ca/dev/api/)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 💬 Support

For issues and questions:
- Open a GitHub issue
- Contact: editor@ifemed.com

---

Built with ❤️ using Next.js 15, TypeScript, and Tailwind CSS