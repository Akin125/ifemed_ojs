import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IFEMED OJS Journal",
  description: "Headless OJS 3.5 Journal powered by Next.js 15",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="bg-primary text-white shadow-md">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex items-center justify-between">
              <a href="/" className="text-2xl font-bold text-white hover:text-gray-200">
                IFEMED Journal
              </a>
              <div className="space-x-6">
                <a href="/" className="text-white hover:text-gray-200">Home</a>
                <a href="/archive" className="text-white hover:text-gray-200">Archive</a>
                <a href="/news" className="text-white hover:text-gray-200">News</a>
                <a href="/search" className="text-white hover:text-gray-200">Search</a>
                <a href="/register" className="text-white hover:text-gray-200">Register</a>
              </div>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-100 border-t mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} IFEMED Journal. Powered by OJS.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
