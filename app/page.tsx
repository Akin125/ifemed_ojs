import { Suspense } from "react";
import { getPublishedSubmissions } from "@/lib/ojs";
import { getLocalizedValue } from "@/lib/ojs";
import type { Submission, OJSResponse } from "@/types/ojs";
import { SkeletonList } from "@/components/SkeletonLoader";

async function ArticlesList() {
  try {
    const data = await getPublishedSubmissions(20, 0) as OJSResponse<Submission>;
    
    if (!data.items || data.items.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">No published articles found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {data.items.map((article: Submission) => (
          <article key={article.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-2">
              <a href={`/article/${article.id}`} className="hover:underline">
                {getLocalizedValue(article.title)}
              </a>
            </h2>
            
            {article.authors && article.authors.length > 0 && (
              <p className="text-gray-600 mb-3">
                {article.authors.map(author => 
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
    );
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading articles. Please check your API configuration.</p>
      </div>
    );
  }
}

export default function HomePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Published Articles</h1>
      <Suspense fallback={<SkeletonList count={5} />}>
        <ArticlesList />
      </Suspense>
    </div>
  );
}
