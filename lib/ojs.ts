/**
 * OJS 3.5 REST API Integration Library
 * 
 * This module provides a comprehensive interface to interact with the
 * Open Journal Systems (OJS) 3.5 REST API, including authentication,
 * locale handling, and all primary API endpoints.
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * OJS localized string object
 * Example: { "en_US": "Title", "fr_CA": "Titre" }
 */
export type LocalizedString = {
  [locale: string]: string;
};

/**
 * Author information
 */
export interface Author {
  id: number;
  email: string;
  fullName: string;
  givenName: LocalizedString;
  familyName: LocalizedString;
  affiliation: LocalizedString;
  country: string;
  url?: string;
  orcid?: string;
  biography?: LocalizedString;
  seq: number;
}

/**
 * Publication galley (PDF or other format)
 */
export interface Galley {
  id: number;
  label: string;
  locale: string;
  pub_id_type?: string;
  urlPublished: string;
  urlRemote?: string;
  file?: {
    id: number;
    mimetype: string;
    url: string;
  };
}

/**
 * OJS Article/Submission
 */
export interface Submission {
  id: number;
  title: LocalizedString;
  subtitle?: LocalizedString;
  abstract?: LocalizedString;
  authors: Author[];
  currentPublicationId: number;
  datePublished?: string;
  doi?: string;
  keywords?: LocalizedString;
  pages?: string;
  section?: {
    id: number;
    title: LocalizedString;
  };
  stageId?: number;
  status?: number;
  submissionProgress?: number; // Progress percentage (0-100) for incomplete submissions
  urlPublished?: string;
  urlWorkflow?: string;
  galleys?: Galley[];
  citations?: string;
  copyrightHolder?: LocalizedString;
  copyrightYear?: number;
  licenseUrl?: string;
  pub_id?: {
    type: string;
    value: string;
  }[];
}

/**
 * OJS Issue
 */
export interface Issue {
  id: number;
  title: LocalizedString;
  description?: LocalizedString;
  volume: number;
  number: string;
  year: number;
  datePublished: string;
  coverImageUrl?: LocalizedString;
  urlPath?: string;
  urlPublished: string;
  published: boolean;
  articles?: Submission[];
}

/**
 * OJS Announcement
 */
export interface Announcement {
  id: number;
  title: LocalizedString;
  descriptionShort?: LocalizedString;
  description: LocalizedString;
  dateExpire?: string;
  datePosted: string;
  url?: string;
  urlPublished: string;
}

/**
 * OJS Navigation Menu Item
 */
export interface NavigationMenuItem {
  id: number;
  title: LocalizedString;
  url?: string;
  path?: string;
  type: string;
  isDisplayed: boolean;
  children?: NavigationMenuItem[];
}

/**
 * User registration data
 */
export interface UserRegistration {
  username: string;
  email: string;
  password: string;
  givenName: string;
  familyName: string;
  affiliation?: string;
  country?: string;
  userGroupId: number; // 18 for authors
}

/**
 * API Response wrapper
 */
export interface OJSAPIResponse<T> {
  items?: T[];
  itemsMax?: number;
  [key: string]: any;
}

// ============================================================================
// Configuration
// ============================================================================

const OJS_BASE_URL = process.env.OJS_BASE_URL || 'http://localhost/ojs/api/v1';
const OJS_API_KEY = process.env.OJS_API_KEY || '';
const OJS_JOURNAL_PATH = process.env.OJS_JOURNAL_PATH || 'journal';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Safely extract a localized string value from an OJS localized object
 * 
 * @param obj - OJS localized string object
 * @param preferredLocale - Preferred locale (default: en_US)
 * @returns The extracted string or empty string if not found
 * 
 * @example
 * const title = getLocaleValue({ en_US: "Hello", fr_CA: "Bonjour" });
 * // Returns: "Hello"
 */
export function getLocaleValue(
  obj: LocalizedString | string | null | undefined,
  preferredLocale: string = 'en_US'
): string {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  
  // Try preferred locale
  if (obj[preferredLocale]) return obj[preferredLocale];
  
  // Try common fallbacks
  const fallbacks = ['en_US', 'en', 'en_GB'];
  for (const locale of fallbacks) {
    if (obj[locale]) return obj[locale];
  }
  
  // Return first available value
  const keys = Object.keys(obj);
  if (keys.length > 0) return obj[keys[0]];
  
  return '';
}

/**
 * Generate authentication headers for OJS API requests
 * 
 * Note: OJS 3.5 uses API Key authentication. The header name may vary
 * based on your OJS configuration. Common headers include:
 * - X-Csrf-Token (default for OJS 3.x)
 * - Authorization: Bearer {token}
 */
function getAuthHeaders(): HeadersInit {
  return {
    'X-Csrf-Token': OJS_API_KEY, // OJS 3.x API Key header
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}

/**
 * Make an authenticated request to the OJS API
 * 
 * @param endpoint - API endpoint path
 * @param options - Fetch options
 * @returns Promise with the API response
 */
async function fetchOJS<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${OJS_BASE_URL}/${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
    next: options.next || { revalidate: 3600 }, // ISR with 1-hour cache
  });

  if (!response.ok) {
    throw new Error(`OJS API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ============================================================================
// API Functions - Submissions
// ============================================================================

/**
 * Fetch published articles (Status 3)
 * 
 * @param params - Query parameters
 * @returns Promise with array of submissions
 * 
 * @example
 * const articles = await getSubmissions({ count: 10 });
 */
export async function getSubmissions(params?: {
  count?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  searchPhrase?: string;
  status?: number;
}): Promise<Submission[]> {
  const queryParams = new URLSearchParams();
  
  // Default to published articles (status 3)
  queryParams.append('status', String(params?.status || 3));
  
  if (params?.count) queryParams.append('count', String(params.count));
  if (params?.offset) queryParams.append('offset', String(params.offset));
  if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
  if (params?.orderDirection) queryParams.append('orderDirection', params.orderDirection);
  if (params?.searchPhrase) queryParams.append('searchPhrase', params.searchPhrase);

  const response = await fetchOJS<OJSAPIResponse<Submission>>(
    `submissions?${queryParams.toString()}`
  );

  return response.items || [];
}

/**
 * Fetch a single article by ID with full metadata
 * 
 * @param id - Submission ID
 * @returns Promise with submission details
 * 
 * @example
 * const article = await getArticle(123);
 */
export async function getArticle(id: number | string): Promise<Submission> {
  return fetchOJS<Submission>(`submissions/${id}`);
}

/**
 * Fetch user's own submissions (requires authentication)
 * 
 * @param userId - User ID
 * @returns Promise with array of user's submissions
 */
export async function getUserSubmissions(userId: number): Promise<Submission[]> {
  const response = await fetchOJS<OJSAPIResponse<Submission>>(
    `submissions?assignedTo=${userId}`
  );
  
  return response.items || [];
}

// ============================================================================
// API Functions - Issues
// ============================================================================

/**
 * Fetch all published issues (volumes/issues)
 * 
 * @param params - Query parameters
 * @returns Promise with array of issues
 * 
 * @example
 * const issues = await getIssues();
 */
export async function getIssues(params?: {
  count?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  isPublished?: boolean;
}): Promise<Issue[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.count) queryParams.append('count', String(params.count));
  if (params?.offset) queryParams.append('offset', String(params.offset));
  if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
  if (params?.orderDirection) queryParams.append('orderDirection', params.orderDirection);
  if (params?.isPublished !== undefined) {
    queryParams.append('isPublished', String(params.isPublished));
  }

  const response = await fetchOJS<OJSAPIResponse<Issue>>(
    `issues?${queryParams.toString()}`
  );

  return response.items || [];
}

/**
 * Fetch a single issue by ID
 * 
 * @param id - Issue ID
 * @returns Promise with issue details
 */
export async function getIssue(id: number | string): Promise<Issue> {
  return fetchOJS<Issue>(`issues/${id}`);
}

/**
 * Fetch the current issue
 * 
 * @returns Promise with current issue
 */
export async function getCurrentIssue(): Promise<Issue> {
  return fetchOJS<Issue>('issues/current');
}

// ============================================================================
// API Functions - Announcements
// ============================================================================

/**
 * Fetch journal announcements/news
 * 
 * @param params - Query parameters
 * @returns Promise with array of announcements
 * 
 * @example
 * const news = await getAnnouncements({ count: 5 });
 */
export async function getAnnouncements(params?: {
  count?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}): Promise<Announcement[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.count) queryParams.append('count', String(params.count));
  if (params?.offset) queryParams.append('offset', String(params.offset));
  if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
  if (params?.orderDirection) queryParams.append('orderDirection', params.orderDirection);

  const response = await fetchOJS<OJSAPIResponse<Announcement>>(
    `announcements?${queryParams.toString()}`
  );

  return response.items || [];
}

/**
 * Fetch a single announcement by ID
 * 
 * @param id - Announcement ID
 * @returns Promise with announcement details
 */
export async function getAnnouncement(id: number | string): Promise<Announcement> {
  return fetchOJS<Announcement>(`announcements/${id}`);
}

// ============================================================================
// API Functions - Navigation Menus
// ============================================================================

/**
 * Fetch navigation menus directly from OJS settings
 * 
 * This prevents hardcoding links and uses OJS configuration
 * 
 * @returns Promise with navigation menu items
 * 
 * @example
 * const menus = await getNavigationMenus();
 */
export async function getNavigationMenus(): Promise<NavigationMenuItem[]> {
  try {
    // Note: The exact endpoint may vary based on OJS configuration
    // This is a common pattern for fetching site navigation
    const response = await fetchOJS<{ items: NavigationMenuItem[] }>(
      '_site/navigationMenus'
    );
    
    return response.items || [];
  } catch (error) {
    console.error('Error fetching navigation menus:', error);
    return [];
  }
}

// ============================================================================
// API Functions - User Management
// ============================================================================

/**
 * Register a new user via OJS API
 * 
 * @param userData - User registration data
 * @returns Promise with created user data
 * 
 * @example
 * const user = await registerUser({
 *   username: "jdoe",
 *   email: "jdoe@example.com",
 *   password: "securepass",
 *   givenName: "John",
 *   familyName: "Doe",
 *   userGroupId: 18
 * });
 */
export async function registerUser(userData: UserRegistration): Promise<any> {
  return fetchOJS('users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * Authenticate a user and get session token
 * 
 * @param username - Username
 * @param password - Password
 * @returns Promise with authentication token
 */
export async function authenticateUser(
  username: string,
  password: string
): Promise<{ token: string }> {
  const response = await fetch(`${OJS_BASE_URL}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Authentication failed');
  }

  return response.json();
}

// ============================================================================
// Search Functions
// ============================================================================

/**
 * Search articles by phrase
 * 
 * @param query - Search query
 * @param params - Additional search parameters
 * @returns Promise with matching submissions
 * 
 * @example
 * const results = await searchArticles("machine learning");
 */
export async function searchArticles(
  query: string,
  params?: {
    count?: number;
    offset?: number;
  }
): Promise<Submission[]> {
  return getSubmissions({
    searchPhrase: query,
    ...params,
  });
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format author names for display
 * 
 * @param authors - Array of authors
 * @returns Formatted author string
 * 
 * @example
 * formatAuthors([...]) // Returns: "Smith, J., Doe, J., & Johnson, A."
 */
export function formatAuthors(authors: Author[]): string {
  if (!authors || authors.length === 0) return '';
  
  const names = authors.map(author => {
    const given = getLocaleValue(author.givenName);
    const family = getLocaleValue(author.familyName);
    const initial = given ? given.charAt(0) + '.' : '';
    return family ? `${family}, ${initial}` : author.fullName;
  });

  if (names.length === 1) return names[0];
  if (names.length === 2) return names.join(' & ');
  
  const lastAuthor = names.pop();
  return `${names.join(', ')}, & ${lastAuthor}`;
}

/**
 * Format citation for an article
 * 
 * @param article - Article submission
 * @returns Formatted citation string (APA style)
 */
export function formatCitation(article: Submission): string {
  const authors = formatAuthors(article.authors);
  const year = article.datePublished 
    ? new Date(article.datePublished).getFullYear()
    : new Date().getFullYear();
  const title = getLocaleValue(article.title);
  const doi = article.doi ? `https://doi.org/${article.doi}` : '';
  
  return `${authors} (${year}). ${title}. ${doi}`;
}

/**
 * Get editorial stage name from stage ID
 * 
 * @param stageId - Stage ID
 * @returns Stage name
 */
export function getEditorialStageName(stageId?: number): string {
  const stages: { [key: number]: string } = {
    1: 'Submission',
    3: 'Review',
    4: 'Copyediting',
    5: 'Production',
  };
  
  return stageId ? stages[stageId] || 'Unknown' : 'Unknown';
}

/**
 * Get status name from status ID
 * 
 * @param status - Status ID
 * @returns Status name
 */
export function getStatusName(status?: number): string {
  const statuses: { [key: number]: string } = {
    1: 'Queued',
    2: 'Scheduled',
    3: 'Published',
    4: 'Declined',
  };
  
  return status ? statuses[status] || 'Unknown' : 'Unknown';
}
