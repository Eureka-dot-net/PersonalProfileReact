export interface LocalizedString {
  en: string;
  he: string;
}

export interface AboutMe {
  id: number;
  fullName: LocalizedString;
  bio: LocalizedString;
  location: LocalizedString;
  email: string;
  gitHub: string;
  linkedIn: string;
  profilePictureUrl: string;
}