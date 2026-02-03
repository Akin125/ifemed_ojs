import { Suspense } from "react";
import { getIssues, getLocalizedValue } from "@/lib/ojs";
import type { Issue, OJSResponse } from "@/types/ojs";
import { SkeletonList } from "@/components/SkeletonLoader";

async function IssuesList() {
  try {
    const data = await getIssues(50, 0) as OJSResponse<Issue>;
    
    if (!data.items || data.items.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">No issues found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {data.items.map((issue: Issue) => (
          <div key={issue.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-2">
              {getLocalizedValue(issue.title)}
            </h2>
            
            <div className="flex gap-4 text-gray-600 mb-3">
              {issue.volume && <span>Vol. {issue.volume}</span>}
              {issue.number && <span>No. {issue.number}</span>}
              {issue.year && <span>({issue.year})</span>}
            </div>
            
            {issue.description && (
              <p className="text-gray-700 mb-3">
                {getLocalizedValue(issue.description)}
              </p>
            )}
            
            {issue.datePublished && (
              <p className="text-sm text-gray-500">
                Published: {new Date(issue.datePublished).toLocaleDateString()}
              </p>
            )}
            
            {issue.urlPublished && (
              <a 
                href={issue.urlPublished} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-3 text-primary hover:underline font-medium"
              >
                View Issue →
              </a>
            )}
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching issues:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading archive. Please check your API configuration.</p>
      </div>
    );
  }
}

export default function ArchivePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Journal Archive</h1>
      <Suspense fallback={<SkeletonList count={5} />}>
        <IssuesList />
      </Suspense>
    </div>
  );
}
