'use client';

import { useState } from 'react';
import { registerUserAction } from '@/app/actions/userActions';
import Link from 'next/link';

/**
 * User Registration Page Component
 * 
 * Features:
 * - User registration form for authors
 * - Form validation
 * - Server action for secure signup
 * - Maps users to userGroupId: 18 (Author role)
 */
export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const response = await registerUserAction(formData);

    setResult(response);
    setIsSubmitting(false);

    // Reset form on success
    if (response.success) {
      event.currentTarget.reset();
    }
  }

  return (
    <div className="bg-academic-50 py-12">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-academic-900 mb-4">
              Register as Author
            </h1>
            <p className="text-lg text-academic-600">
              Create an account to submit your research for publication
            </p>
          </div>

          {/* Registration Form */}
          <div className="card card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Alert Messages */}
              {result && (
                <div
                  className={`p-4 rounded-lg ${
                    result.success
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <div className="flex items-start">
                    <svg
                      className={`w-5 h-5 mr-3 mt-0.5 ${
                        result.success ? 'text-green-400' : 'text-red-400'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      {result.success ? (
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      ) : (
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      )}
                    </svg>
                    <p className="text-sm">{result.message}</p>
                  </div>
                </div>
              )}

              {/* Account Information */}
              <div>
                <h2 className="text-lg font-semibold text-academic-900 mb-4">
                  Account Information
                </h2>
                <div className="space-y-4">
                  {/* Username */}
                  <div>
                    <label htmlFor="username" className="form-label">
                      Username <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      required
                      className="form-input"
                      placeholder="johndoe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="form-label">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="form-input"
                      placeholder="john.doe@university.edu"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="form-label">
                      Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      minLength={6}
                      className="form-input"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h2 className="text-lg font-semibold text-academic-900 mb-4">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Given Name */}
                  <div>
                    <label htmlFor="givenName" className="form-label">
                      Given Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="givenName"
                      name="givenName"
                      required
                      className="form-input"
                      placeholder="John"
                    />
                  </div>

                  {/* Family Name */}
                  <div>
                    <label htmlFor="familyName" className="form-label">
                      Family Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="familyName"
                      name="familyName"
                      required
                      className="form-input"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h2 className="text-lg font-semibold text-academic-900 mb-4">
                  Professional Information
                </h2>
                <div className="space-y-4">
                  {/* Affiliation */}
                  <div>
                    <label htmlFor="affiliation" className="form-label">
                      Affiliation
                    </label>
                    <input
                      type="text"
                      id="affiliation"
                      name="affiliation"
                      className="form-input"
                      placeholder="University or Institution"
                    />
                    <p className="text-sm text-academic-500 mt-1">
                      Your university, research institution, or organization
                    </p>
                  </div>

                  {/* Country */}
                  <div>
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      className="form-input"
                    >
                      <option value="">Select a country</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="ES">Spain</option>
                      <option value="IT">Italy</option>
                      <option value="NL">Netherlands</option>
                      <option value="SE">Sweden</option>
                      <option value="CH">Switzerland</option>
                      <option value="JP">Japan</option>
                      <option value="CN">China</option>
                      <option value="IN">India</option>
                      <option value="BR">Brazil</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-academic-50 p-4 rounded-lg">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 mr-3 w-4 h-4 text-primary-600 border-academic-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-academic-700">
                    I agree to the terms and conditions and understand that my
                    submitted manuscripts will be subject to peer review. I confirm
                    that I have the right to submit the work.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-4">
                <Link href="/" className="text-sm text-academic-600 hover:text-primary-600">
                  Already have an account? Log in
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Registering...
                    </span>
                  ) : (
                    'Register'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Additional Information */}
          <div className="mt-8 text-center text-sm text-academic-600">
            <p>
              Need help? Contact us at{' '}
              <a href="mailto:editor@ifemed.com" className="text-primary-600 hover:text-primary-700">
                editor@ifemed.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
