import type { SiteContent } from './types';

// BASE_URL keeps these working when the site is served from a sub-path (GitHub Pages).
export const PORTRAIT_PLACEHOLDER = `${import.meta.env.BASE_URL}placeholder-portrait.svg`;
export const PROJECT_PLACEHOLDER = `${import.meta.env.BASE_URL}placeholder-project.svg`;

export const defaultContent: SiteContent = {
  hero: {
    titles: ['Hi, my name is:', 'Or you can call me'],
    names: ['Dat Lam', 'David Lam'],
    jobTitle: 'Computer Science Student',
    location: 'Ottawa, Canada',
    intro:
      "I'm a Computer Science student interested in full-stack development and software engineering. I enjoy building applications using React, React Native, and TypeScript, while exploring backend technologies and database design. I'm passionate about turning ideas into functional, user-friendly software.",
    cvUrl: '',
    cvFileName: 'Dat-Lam-CV.pdf',
  },
  profile: {
    imageUrl: '',
    contactLabel: 'My contact:',
  },
  about: {
    heading: 'Who am I, you might ask',
    imageUrl: '',
    text:
      "I'm Dat Lam, a Computer Science Honours student at Carleton University. I have experience in building full-stack websites and system-level programming.\n\nCurrently, I'm also into game development with the Godot engine. I have made some games with my friends. This taught me how to cooperate with others, helping them and asking them to help when I need, it helped a lot with the progression.",
    skills: ['CSS', 'JavaScript', 'TypeScript', 'React', 'React Native', 'C++', 'C', 'Java', 'Godot'],
    includeProjectLanguages: true,
  },
  projects: {
    heading: 'Things he has built',
    tagline: 'These may impress you',
    subtagline: 'or not, but thank you for reading through this',
  },
  contact: {
    heading: 'Contact the publisher',
    subheading: 'You can find him here',
  },
  links: {
    email: '',
    github: '',
    linkedin: '',
    instagram: '',
    phone: '6479063849',
  },
};

/** Fill in any fields missing from saved content (e.g. after new fields are added). */
export function mergeContent(saved: Partial<SiteContent> | null | undefined): SiteContent {
  const d = defaultContent;
  if (!saved) return structuredClone(d);
  return {
    hero: { ...d.hero, ...saved.hero },
    profile: { ...d.profile, ...saved.profile },
    about: { ...d.about, ...saved.about },
    projects: { ...d.projects, ...saved.projects },
    contact: { ...d.contact, ...saved.contact },
    links: { ...d.links, ...saved.links },
  };
}
