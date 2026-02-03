// TypeScript types for OJS API responses

export interface LocalizedString {
  en_US?: string;
  [key: string]: string | undefined;
}

export interface Submission {
  id: number;
  title: LocalizedString;
  abstract?: LocalizedString;
  authors?: Author[];
  datePublished?: string;
  pages?: string;
  urlPublished?: string;
  doi?: string;
  issueId?: number;
  sectionId?: number;
}

export interface Author {
  id: number;
  givenName: LocalizedString;
  familyName: LocalizedString;
  affiliation?: LocalizedString;
  email?: string;
}

export interface Galley {
  id: number;
  label: string;
  locale?: string;
  file?: {
    id: number;
    name: LocalizedString;
    url: string;
  };
  urlPublished?: string;
}

export interface Issue {
  id: number;
  title: LocalizedString;
  description?: LocalizedString;
  volume?: number;
  number?: string;
  year?: number;
  datePublished?: string;
  urlPublished?: string;
}

export interface Announcement {
  id: number;
  title: LocalizedString;
  descriptionShort?: LocalizedString;
  description?: LocalizedString;
  datePosted?: string;
}

export interface OJSResponse<T> {
  itemsMax: number;
  items: T[];
}
