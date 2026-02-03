import { Suspense } from "react";
import { getSubmission, getSubmissionGalleys, getLocalizedValue } from "@/lib/ojs";
import type { Submission, Galley, OJSResponse } from "@/types/ojs";
import { SkeletonCard } from "@/components/SkeletonLoader";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function ArticleContent({ id }: { id: string }) {
  try {
    const article = await getSubmission(id) as Submission;
    const galleysData = await getSubmissionGalleys(id) as OJSResponse<Galley>;
    const galleys = galleysData.items || [];

    return (
      <div className="max-w-4xl">
        <article>
          <h1 className="text-4xl font-bold mb-4">{getLocalizedValue(article.title)}</h1>
          
          {article.authors && article.authors.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Authors</h2>
              <ul className="space-y-2">
                {article.authors.map((author, idx) => (
                  <li key={idx} className="text-gray-700">
                    <strong>
                      {getLocalizedValue(author.givenName)} {getLocalizedValue(author.familyName)}
                    </strong>
                    {author.affiliation && (
                      <span className="text-gray-600"> - {getLocalizedValue(author.affiliation)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {article.datePublished && (
            <p className="text-sm text-gray-600 mb-4">
              Published: {new Date(article.datePublished).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          )}

          {article.doi && (
            <p className="text-sm text-gray-600 mb-4">
              DOI: <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer" className="underline">
                {article.doi}
              </a>
            </p>
          )}

          {article.abstract && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-3">Abstract</h2>
              <div className="prose max-w-none text-gray-700">
                {getLocalizedValue(article.abstract)}
              </div>
            </div>
          )}

          {/* Galleys (PDFs) Section */}
          {galleys.length > 0 && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Downloads</h2>
              <ul className="space-y-3">
                {galleys.map((galley) => (
                  <li key={galley.id}>
                    <a
                      href={galley.urlPublished || galley.file?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-primary hover:underline font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{galley.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Citation Section */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">How to Cite</h2>
            <div className="bg-white p-4 rounded border">
              <p className="text-sm font-mono text-gray-800">
                {article.authors && article.authors.map(author => 
                  `${getLocalizedValue(author.familyName)}, ${getLocalizedValue(author.givenName)[0]}.`
                ).join(", ")}
                {" "}
                ({article.datePublished ? new Date(article.datePublished).getFullYear() : "n.d."}).
                {" "}
                {getLocalizedValue(article.title)}.
                {" "}
                <em>IFEMED Journal</em>
                {article.pages && `, ${article.pages}`}.
                {article.doi && ` https://doi.org/${article.doi}`}
              </p>
            </div>
          </div>
        </article>
      </div>
    );
  } catch (error) {
    console.error("Error fetching article:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading article. Please try again later.</p>
      </div>
    );
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<SkeletonCard />}>
      <ArticleContent id={id} />
    </Suspense>
  );
}
