import Link from "next/link";
import { 
  getSubmissions, 
  getAnnouncements, 
  getLocaleValue,
  formatAuthors,
  type Submission,
  type Announcement 
} from "@/lib/ojs";

/**
 * Home Page Component
 * 
 * Features:
 * - Hero section with featured article
 * - Latest news ticker
 * - Top research grid
 * - Uses ISR with 1-hour revalidation
 */
export default async function HomePage() {
  // Fetch data with error handling
  let articles: Submission[] = [];
  let announcements: Announcement[] = [];

  try {
    // Fetch latest published articles
    articles = await getSubmissions({ 
      count: 7, 
      orderBy: 'datePublished',
      orderDirection: 'DESC'
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
  }

  try {
    // Fetch latest announcements
    announcements = await getAnnouncements({ 
      count: 3,
      orderBy: 'datePosted',
      orderDirection: 'DESC'
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
  }

  // Extract featured article (first one)
  const featuredArticle = articles[0];
  const topResearch = articles.slice(1, 7);

  return (
    <div className="bg-academic-50">
      {/* Hero Section - Featured Article */}
      {featuredArticle && (
        <section className="bg-gradient-to-br from-primary-900 to-primary-700 text-white py-20">
          <div className="container-custom">
            <div className="max-w-4xl">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured Article
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 leading-tight">
                {getLocaleValue(featuredArticle.title)}
              </h1>
              
              <p className="text-xl text-white/90 mb-6 line-clamp-3 font-serif">
                {getLocaleValue(featuredArticle.abstract)}
              </p>
              
              <div className="flex items-center space-x-4 mb-8">
                <div>
                  <p className="text-white/80 text-sm">Authors</p>
                  <p className="font-medium">{formatAuthors(featuredArticle.authors)}</p>
                </div>
                {featuredArticle.datePublished && (
                  <div>
                    <p className="text-white/80 text-sm">Published</p>
                    <p className="font-medium">
                      {new Date(featuredArticle.datePublished).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
              
              <Link 
                href={`/article/${featuredArticle.id}`}
                className="inline-flex items-center px-6 py-3 bg-white text-primary-900 rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                Read Full Article
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest News Ticker */}
      {announcements.length > 0 && (
        <section className="bg-primary-600 text-white py-4">
          <div className="container-custom">
            <div className="flex items-center">
              <div className="flex items-center space-x-2 mr-6 shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                <span className="font-semibold">Latest News:</span>
              </div>
              <div className="overflow-hidden">
                <div className="flex space-x-8 animate-scroll">
                  {announcements.map((announcement) => (
                    <span key={announcement.id} className="whitespace-nowrap">
                      {getLocaleValue(announcement.title)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Top Research Grid */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-academic-900 mb-2">Latest Research</h2>
              <p className="text-academic-600">Discover cutting-edge academic publications</p>
            </div>
            <Link href="/search" className="btn btn-outline">
              View All Articles
            </Link>
          </div>

          {topResearch.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topResearch.map((article) => (
                <Link 
                  key={article.id}
                  href={`/article/${article.id}`}
                  className="card card-body group"
                >
                  {/* Article Type Badge */}
                  {article.section && (
                    <span className="badge badge-primary mb-3">
                      {getLocaleValue(article.section.title)}
                    </span>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-bold text-academic-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {getLocaleValue(article.title)}
                  </h3>

                  {/* Authors */}
                  <p className="text-sm text-academic-600 mb-3">
                    {formatAuthors(article.authors)}
                  </p>

                  {/* Abstract */}
                  <p className="text-academic-700 text-sm line-clamp-3 mb-4 font-serif">
                    {getLocaleValue(article.abstract)}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-academic-500 pt-4 border-t border-academic-200">
                    {article.datePublished && (
                      <span>
                        {new Date(article.datePublished).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    )}
                    {article.doi && (
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                        DOI
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-academic-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-academic-600 mb-2">No Articles Found</h3>
              <p className="text-academic-500">Check back later for new publications</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white py-16 border-t border-academic-200">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-academic-900 mb-4">
            Submit Your Research
          </h2>
          <p className="text-lg text-academic-600 mb-8 max-w-2xl mx-auto">
            Join our community of scholars. Submit your manuscript for peer review
            and contribute to advancing knowledge in your field.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/register" className="btn btn-primary">
              Register as Author
            </Link>
            <Link href="/search" className="btn btn-outline">
              Browse Guidelines
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
