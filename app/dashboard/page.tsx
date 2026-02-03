'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserSubmissionsAction } from '@/app/actions/userActions';
import { 
  getLocaleValue, 
  getEditorialStageName, 
  getStatusName,
  type Submission 
} from '@/lib/ojs';

/**
 * User Dashboard Page Component
 * 
 * Features:
 * - Display user's active submissions
 * - Show current editorial stage for each submission
 * - Track submission status (Submission, Review, Production)
 * - Link to submission workflow
 */
export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // Note: In a real application, you would get the userId from authentication
  // For demo purposes, we'll use a placeholder
  useEffect(() => {
    // TODO: Replace with actual authentication logic
    // const authenticatedUserId = getAuthenticatedUserId();
    // setUserId(authenticatedUserId);
    
    // For now, we'll show a placeholder message
    setIsLoading(false);
  }, []);

  async function loadSubmissions(uid: number) {
    setIsLoading(true);
    setError(null);

    const result = await getUserSubmissionsAction(uid);

    if (result.success) {
      setSubmissions(result.submissions);
    } else {
      setError(result.message || 'Failed to load submissions');
    }

    setIsLoading(false);
  }

  // Handle demo user ID input
  async function handleDemoSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const demoUserId = parseInt(formData.get('userId') as string);
    
    if (demoUserId) {
      setUserId(demoUserId);
      await loadSubmissions(demoUserId);
    }
  }

  return (
    <div className="bg-academic-50 py-12 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-academic-900 mb-2">
            My Dashboard
          </h1>
          <p className="text-lg text-academic-600">
            Track your submissions and their editorial status
          </p>
        </div>

        {/* Demo User ID Input - Remove in production */}
        {!userId && (
          <div className="card card-body mb-8 max-w-2xl">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-yellow-400 mr-3 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-yellow-800">Demo Mode</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Authentication is not yet implemented. Enter your OJS user ID to view your submissions.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleDemoSubmit} className="space-y-4">
              <div>
                <label htmlFor="userId" className="form-label">
                  Your OJS User ID
                </label>
                <input
                  type="number"
                  id="userId"
                  name="userId"
                  required
                  className="form-input"
                  placeholder="Enter your user ID"
                />
                <p className="text-sm text-academic-500 mt-1">
                  You can find your user ID in the OJS backend under Users & Roles
                </p>
              </div>
              <button type="submit" className="btn btn-primary">
                Load My Submissions
              </button>
            </form>
          </div>
        )}

        {/* Loading State */}
        {isLoading && userId && (
          <div className="text-center py-12">
            <svg
              className="animate-spin h-12 w-12 mx-auto text-primary-600 mb-4"
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
            <p className="text-academic-600">Loading your submissions...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-400 mr-3 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submissions List */}
        {!isLoading && userId && submissions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-academic-900">
                Your Submissions ({submissions.length})
              </h2>
              <Link href="/register" className="btn btn-primary">
                New Submission
              </Link>
            </div>

            <div className="grid gap-6">
              {submissions.map((submission) => (
                <div key={submission.id} className="card card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-academic-900 mb-2">
                        {getLocaleValue(submission.title)}
                      </h3>
                      <p className="text-sm text-academic-600">
                        Submission ID: {submission.id}
                      </p>
                    </div>
                    
                    {/* Status Badge */}
                    <span
                      className={`badge ${
                        submission.status === 3
                          ? 'badge-success'
                          : submission.status === 4
                          ? 'bg-red-100 text-red-800'
                          : 'badge-warning'
                      }`}
                    >
                      {getStatusName(submission.status)}
                    </span>
                  </div>

                  {/* Editorial Stage */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-sm text-academic-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-semibold">Editorial Stage:</span>
                      <span className="badge badge-primary">
                        {getEditorialStageName(submission.stageId)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-academic-700">Progress</span>
                      <span className="text-xs text-academic-600">
                        {submission.submissionProgress || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-academic-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${submission.submissionProgress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-academic-200">
                    {submission.urlWorkflow && (
                      <a
                        href={submission.urlWorkflow}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline text-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View in OJS
                      </a>
                    )}
                    {submission.status === 3 && submission.urlPublished && (
                      <Link
                        href={`/article/${submission.id}`}
                        className="btn btn-primary text-sm"
                      >
                        View Published Article
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && userId && submissions.length === 0 && !error && (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-academic-600 mb-2">
              No Submissions Yet
            </h3>
            <p className="text-academic-500 mb-6">
              You haven't submitted any manuscripts yet. Start your first submission now.
            </p>
            <Link href="/register" className="btn btn-primary">
              Submit Your First Manuscript
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
