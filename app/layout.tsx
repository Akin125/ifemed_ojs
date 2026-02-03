import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || "IFEMED Journal",
  description: "A state-of-the-art headless academic journal powered by OJS 3.5",
  keywords: ["academic journal", "research", "OJS", "scholarly publishing"],
  authors: [{ name: "IFEMED Journal" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || "IFEMED Journal",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-academic-200 sticky top-0 z-50 shadow-sm">
          <div className="container-custom">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">IF</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-academic-900">
                    {process.env.NEXT_PUBLIC_SITE_NAME || "IFEMED Journal"}
                  </h1>
                  <p className="text-xs text-academic-500">Academic Excellence</p>
                </div>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-academic-700 hover:text-primary-600 font-medium">
                  Home
                </Link>
                <Link href="/search" className="text-academic-700 hover:text-primary-600 font-medium">
                  Search
                </Link>
                <Link href="/dashboard" className="text-academic-700 hover:text-primary-600 font-medium">
                  Dashboard
                </Link>
                <Link href="/register" className="text-academic-700 hover:text-primary-600 font-medium">
                  Register
                </Link>
              </nav>

              {/* Mobile menu button */}
              <button className="md:hidden p-2 rounded-lg hover:bg-academic-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-academic-900 text-white mt-16">
          <div className="container-custom py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* About */}
              <div>
                <h3 className="text-lg font-bold mb-4">About IFEMED</h3>
                <p className="text-academic-300 text-sm leading-relaxed">
                  A cutting-edge academic journal platform powered by OJS 3.5,
                  delivering scholarly excellence through modern web technology.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/" className="text-academic-300 hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/search" className="text-academic-300 hover:text-white">
                      Search Articles
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="text-academic-300 hover:text-white">
                      Submit Manuscript
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="text-academic-300 hover:text-white">
                      My Dashboard
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-lg font-bold mb-4">Contact</h3>
                <p className="text-academic-300 text-sm">
                  For inquiries and submissions:<br />
                  <a href="mailto:editor@ifemed.com" className="hover:text-white">
                    editor@ifemed.com
                  </a>
                </p>
              </div>
            </div>

            <div className="border-t border-academic-700 mt-8 pt-8 text-center text-sm text-academic-400">
              <p>&copy; {new Date().getFullYear()} IFEMED Journal. All rights reserved.</p>
              <p className="mt-2">Powered by OJS 3.5 &amp; Next.js 15</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
