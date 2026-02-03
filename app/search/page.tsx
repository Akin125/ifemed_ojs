'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { searchArticles, getLocaleValue, formatAuthors, type Submission } from '@/lib/ojs';

/**
 * Search Page Component (Inner)
 * 
 * Features:
 * - Search bar using /submissions?searchPhrase={query}
 * - Display search results
 * - Real-time search with debouncing
 */
function SearchPageInner() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Submission[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  async function performSearch(searchQuery: string) {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const articles = await searchArticles(searchQuery, { count: 20 });
      setResults(articles);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    performSearch(query);
  }

  return (
    <div className="bg-academic-50 py-12 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-academic-900 mb-2">
            Search Articles
          </h1>
          <p className="text-lg text-academic-600">
            Find research articles by title, author, keywords, or abstract
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="card card-body">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter search terms..."
                    className="form-input pl-12"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-academic-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="btn btn-primary disabled:opacity-50"
              >
                {isSearching ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Searching...
                  </span>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div>
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-academic-900">
                {isSearching ? (
                  'Searching...'
                ) : (
                  <>
                    {results.length} {results.length === 1 ? 'Result' : 'Results'}
                    {query && ` for "${query}"`}
                  </>
                )}
              </h2>
            </div>

            {/* Results List */}
            {!isSearching && results.length > 0 && (
              <div className="space-y-6">
                {results.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.id}`}
                    className="card card-body block group"
                  >
                    {/* Article Type Badge */}
                    {article.section && (
                      <span className="badge badge-primary mb-3">
                        {getLocaleValue(article.section.title)}
                      </span>
                    )}

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-academic-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {getLocaleValue(article.title)}
                    </h3>

                    {/* Authors */}
                    <p className="text-sm text-academic-600 mb-3">
                      {formatAuthors(article.authors)}
                    </p>

                    {/* Abstract */}
                    <p className="text-academic-700 line-clamp-3 mb-4 font-serif">
                      {getLocaleValue(article.abstract)}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center space-x-4 text-xs text-academic-500 pt-4 border-t border-academic-200">
                      {article.datePublished && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {new Date(article.datePublished).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                      {article.doi && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                          DOI: {article.doi}
                        </span>
                      )}
                      {article.pages && (
                        <span>Pages: {article.pages}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isSearching && results.length === 0 && (
              <div className="text-center py-16">
                <svg
                  className="w-16 h-16 mx-auto text-academic-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-academic-600 mb-2">
                  No Results Found
                </h3>
                <p className="text-academic-500 mb-6">
                  Try adjusting your search terms or browse all articles
                </p>
                <Link href="/" className="btn btn-primary">
                  Browse All Articles
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 mx-auto text-academic-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-academic-600 mb-2">
              Start Your Search
            </h3>
            <p className="text-academic-500">
              Enter keywords, author names, or topics to find relevant articles
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Search Page Component (Wrapper with Suspense)
 */
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container-custom py-12">
          <div className="text-center">Loading search...</div>
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
