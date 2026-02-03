"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getLocalizedValue } from "@/lib/ojs";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setResults(data.items || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Search Articles</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter search terms..."
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {loading && (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No results found for "{searchTerm}"</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-6">
          <p className="text-gray-600 mb-4">Found {results.length} result(s)</p>
          {results.map((article: any) => (
            <article key={article.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-bold mb-2">
                <a href={`/article/${article.id}`} className="hover:underline">
                  {getLocalizedValue(article.title)}
                </a>
              </h2>
              
              {article.authors && article.authors.length > 0 && (
                <p className="text-gray-600 mb-3">
                  {article.authors.map((author: any) => 
                    `${getLocalizedValue(author.givenName)} ${getLocalizedValue(author.familyName)}`
                  ).join(", ")}
                </p>
              )}
              
              {article.abstract && (
                <p className="text-gray-700 line-clamp-3">
                  {getLocalizedValue(article.abstract)}
                </p>
              )}
              
              {article.datePublished && (
                <p className="text-sm text-gray-500 mt-3">
                  Published: {new Date(article.datePublished).toLocaleDateString()}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
