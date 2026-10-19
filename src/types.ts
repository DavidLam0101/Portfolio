export interface Links {
  email: string;
  github: string;
  linkedin: string;
  instagram: string;
  phone: string;
}

export interface HeroContent {
  /** Phrases the title types through, e.g. "Hi, my name is:" → "Or you can call me". */
  titles: string[];
  /** Names the big heading types through, e.g. "Dat Lam" → "David Lam". */
  names: string[];
  jobTitle: string;
  location: string;
  intro: string;
  cvUrl: string;
  cvFileName: string;
}

export interface ProfileContent {
  imageUrl: string;
  contactLabel: string;
}

export interface AboutContent {
  heading: string;
  imageUrl: string;
  text: string;
  skills: string[];
  /** Also list every language used by a project as a tech skill. */
  includeProjectLanguages: boolean;
}

export interface ProjectsContent {
  heading: string;
  tagline: string;
  subtagline: string;
}

export interface ContactContent {
  heading: string;
  subheading: string;
}

export interface SiteContent {
  /** Which one-time content upgrade (see SEED_VERSION) has been saved. */
  seedVersion?: number;
  hero: HeroContent;
  profile: ProfileContent;
  about: AboutContent;
  projects: ProjectsContent;
  contact: ContactContent;
  links: Links;
}

export interface Project {
  id: string;
  name: string;
  brief: string;
  longDescription: string;
  languages: string[];
  images: string[];
  /** Optional "View project" URL, e.g. an itch.io page or GitHub repo. */
  link: string;
  sortOrder: number;
  createdAt: string;
}

export type ProjectDraft = Omit<Project, 'id' | 'createdAt'> & { id?: string };

export interface AdminUser {
  email: string;
}
