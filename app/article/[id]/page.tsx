import { Metadata } from "next";
import Link from "next/link";
import {
  getArticle,
  getLocaleValue,
  formatAuthors,
  formatCitation,
} from "@/lib/ojs";

/**
 * Generate metadata for SEO and OpenGraph
 */
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const article = await getArticle(params.id);
    const title = getLocaleValue(article.title);
    const abstract = getLocaleValue(article.abstract);
    const authors = formatAuthors(article.authors);

    // Google Scholar meta tags
    const googleScholarMeta = article.authors.map((author, index) => ({
      name: `citation_author`,
      content: author.fullName,
    }));

    return {
      title: `${title} | IFEMED Journal`,
      description: abstract.substring(0, 160),
      keywords: getLocaleValue(article.keywords),
      authors: article.authors.map(author => ({ name: author.fullName })),
      openGraph: {
        title,
        description: abstract.substring(0, 160),
        type: "article",
        publishedTime: article.datePublished,
        authors: [authors],
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/article/${article.id}`,
      },
      other: {
        // Google Scholar meta tags
        citation_title: title,
        citation_abstract: abstract,
        citation_publication_date: article.datePublished || "",
        citation_journal_title: process.env.NEXT_PUBLIC_SITE_NAME || "IFEMED Journal",
        ...(article.doi && { citation_doi: article.doi }),
        ...(article.pages && { citation_firstpage: article.pages.split("-")[0] }),
        ...(article.pages && { citation_lastpage: article.pages.split("-")[1] || "" }),
        // Author meta tags
        ...article.authors.reduce((acc, author, index) => ({
          ...acc,
          [`citation_author_${index}`]: author.fullName,
        }), {}),
      },
    };
  } catch (error) {
    return {
      title: "Article Not Found | IFEMED Journal",
      description: "The requested article could not be found.",
    };
  }
}

/**
 * Article Detail Page Component
 * 
 * Features:
 * - Two-column layout
 * - Left: Title, Authors, Abstract
 * - Right: PDF Download, DOI, Keywords, Citation
 * - SEO optimized with OpenGraph and Google Scholar tags
 * - ISR with 1-hour revalidation
 */
export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  let article;
  
  try {
    article = await getArticle(params.id);
  } catch (error) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-academic-900 mb-4">Article Not Found</h1>
          <p className="text-academic-600 mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/" className="btn btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const title = getLocaleValue(article.title);
  const abstract = getLocaleValue(article.abstract);
  const keywords = getLocaleValue(article.keywords);
  const pdfGalley = article.galleys?.find(g => g.label.toLowerCase().includes('pdf'));

  return (
    <div className="bg-academic-50 py-12">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-academic-600">
            <li>
              <Link href="/" className="hover:text-primary-600">Home</Link>
            </li>
            <li>/</li>
            <li className="text-academic-900">Article</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column (2/3 width) */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-sm p-8">
              {/* Article Type Badge */}
              {article.section && (
                <span className="badge badge-primary mb-4">
                  {getLocaleValue(article.section.title)}
                </span>
              )}

              {/* Title */}
              <h1 className="text-4xl font-bold font-serif text-academic-900 mb-6 leading-tight">
                {title}
              </h1>

              {/* Publication Date */}
              {article.datePublished && (
                <div className="flex items-center text-sm text-academic-600 mb-6">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Published on {new Date(article.datePublished).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}

              {/* Authors with Tooltips */}
              <div className="mb-8 pb-8 border-b border-academic-200">
                <h2 className="text-sm font-semibold text-academic-700 uppercase tracking-wide mb-4">
                  Authors
                </h2>
                <div className="space-y-4">
                  {article.authors.map((author) => (
                    <div key={author.id} className="group">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-academic-900">
                            {author.fullName}
                          </h3>
                          {author.affiliation && (
                            <p className="text-sm text-academic-600">
                              {getLocaleValue(author.affiliation)}
                            </p>
                          )}
                          {author.orcid && (
                            <a
                              href={`https://orcid.org/${author.orcid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-primary-600 hover:text-primary-700 mt-1"
                            >
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 01-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-1.016 5.016-5.325 5.016h-3.919V7.416z"/>
                              </svg>
                              ORCID: {author.orcid}
                            </a>
                          )}
                        </div>
                      </div>
                      {/* Tooltip with Biography */}
                      {author.biography && (
                        <div className="mt-2 text-sm text-academic-700 bg-academic-50 p-3 rounded hidden group-hover:block">
                          {getLocaleValue(author.biography)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Abstract */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-academic-900 mb-4">Abstract</h2>
                <div className="prose prose-lg max-w-none font-serif">
                  <p className="text-academic-800 leading-relaxed">
                    {abstract}
                  </p>
                </div>
              </div>

              {/* Keywords */}
              {keywords && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-academic-700 uppercase tracking-wide mb-3">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {keywords.split(/[,;]/).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-academic-100 text-academic-700 rounded-full text-sm"
                      >
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Copyright Information */}
              {article.copyrightHolder && (
                <div className="text-sm text-academic-600 pt-8 border-t border-academic-200">
                  <p>
                    © {article.copyrightYear || new Date().getFullYear()} {getLocaleValue(article.copyrightHolder)}.
                    {article.licenseUrl && (
                      <span> Licensed under <a href={article.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">this license</a>.</span>
                    )}
                  </p>
                </div>
              )}
            </article>
          </div>

          {/* Sidebar - Right Column (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Download PDF */}
            {pdfGalley && (
              <div className="card card-body">
                <h3 className="text-lg font-bold text-academic-900 mb-4">Download</h3>
                <a
                  href={pdfGalley.urlPublished || pdfGalley.file?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </a>
              </div>
            )}

            {/* DOI Badge */}
            {article.doi && (
              <div className="card card-body">
                <h3 className="text-lg font-bold text-academic-900 mb-3">DOI</h3>
                <a
                  href={`https://doi.org/${article.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-academic-50 rounded-lg hover:bg-academic-100 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  <span className="text-sm font-mono text-academic-700 break-all">
                    {article.doi}
                  </span>
                </a>
              </div>
            )}

            {/* Pages */}
            {article.pages && (
              <div className="card card-body">
                <h3 className="text-lg font-bold text-academic-900 mb-2">Pages</h3>
                <p className="text-academic-700">{article.pages}</p>
              </div>
            )}

            {/* How to Cite */}
            <div className="card card-body">
              <h3 className="text-lg font-bold text-academic-900 mb-3">How to Cite</h3>
              <div className="bg-academic-50 p-4 rounded-lg">
                <p className="text-sm text-academic-800 font-serif leading-relaxed">
                  {formatCitation(article)}
                </p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(formatCitation(article))}
                className="btn btn-outline w-full mt-3 text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Citation
              </button>
            </div>

            {/* Share */}
            <div className="card card-body">
              <h3 className="text-lg font-bold text-academic-900 mb-3">Share</h3>
              <div className="flex space-x-2">
                <button className="flex-1 btn btn-outline text-sm">
                  Twitter
                </button>
                <button className="flex-1 btn btn-outline text-sm">
                  LinkedIn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
