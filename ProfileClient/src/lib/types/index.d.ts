
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