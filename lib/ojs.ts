// OJS API fetcher with localized JSON handling

import type { LocalizedString } from "@/types/ojs";

const OJS_API_KEY = process.env.OJS_API_KEY || "";
const OJS_BASE_URL = process.env.OJS_BASE_URL || "";

/**
 * Extract localized string value, preferring en_US
 */
export function getLocalizedValue(
  value: string | LocalizedString | undefined,
  locale: string = "en_US"
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[locale] || value.en_US || Object.values(value)[0] || "";
}

/**
 * Base fetcher for OJS API
 */
export async function ojsFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${OJS_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(OJS_API_KEY && { "Authorization": `Bearer ${OJS_API_KEY}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  });

  if (!response.ok) {
    throw new Error(`OJS API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get published submissions (status=3)
 */
export async function getPublishedSubmissions(count: number = 20, offset: number = 0) {
  return ojsFetch(`/submissions?status=3&count=${count}&offset=${offset}`);
}

/**
 * Get a single submission by ID
 */
export async function getSubmission(id: string) {
  return ojsFetch(`/submissions/${id}`);
}

/**
 * Get submission galleys (PDFs, etc.)
 */
export async function getSubmissionGalleys(submissionId: string) {
  return ojsFetch(`/submissions/${submissionId}/galleys`);
}

/**
 * Get issues (journal archive)
 */
export async function getIssues(count: number = 20, offset: number = 0) {
  return ojsFetch(`/issues?count=${count}&offset=${offset}`);
}

/**
 * Get single issue
 */
export async function getIssue(id: string) {
  return ojsFetch(`/issues/${id}`);
}

/**
 * Get announcements (news)
 */
export async function getAnnouncements(count: number = 20, offset: number = 0) {
  return ojsFetch(`/announcements?count=${count}&offset=${offset}`);
}

/**
 * Search submissions
 */
export async function searchSubmissions(searchPhrase: string, count: number = 20) {
  return ojsFetch(`/submissions?searchPhrase=${encodeURIComponent(searchPhrase)}&status=3&count=${count}`);
}

/**
 * User registration (Server Action)
 */
export async function registerUser(userData: {
  username: string;
  email: string;
  password: string;
  givenName: string;
  familyName: string;
}) {
  return ojsFetch("/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}
