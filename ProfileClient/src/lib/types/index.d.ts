
type LocalizedString = {
  en: string;
  he: string;
}

type AboutMe = {
  id: number;
  fullName: LocalizedString;
  bio: LocalizedString;
  location: LocalizedString;
  email: string;
  gitHub: string;
  linkedIn: string;
  profilePictureUrl: string;
}

type Experience = {
  id: number;
  title: string;
  company: string;
  location: string;
  startDate: string; // ISO string
  endDate: string | null;
  highlights: string[];
};

type SkillCategory = {
  category: string;
  skills: string[];
};

type Project = {
  id: number;
  name: string;
  description: string;
  url?: string;
  gitHubRepo?: string;
  isInProgress: boolean;
  images: string[]; // Array of image URLs
}

type JobMatchItem = {
  id: string;
  jobTitle: string;
  company: string;
  matchPercentage: number;
  salary?: string;
  location?: string;
  matchedDate: string; // ISO string
  status: string;
  jobUrl?: string;
  createdAt: string; // ISO string
};

type JobMatchFilter = {
  searchTerm?: string;
  minMatchPercentage?: number;
  status?: string;
  company?: string;
  fromDate?: string; // ISO string
  toDate?: string; // ISO string
  page?: number;
  pageSize?: number;
};

type JobMatchListResponse = {
  jobMatches: JobMatchItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
