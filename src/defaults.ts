import type { ProjectDraft, SiteContent } from './types';

// BASE_URL keeps these working when the site is served from a sub-path (GitHub Pages).
export const PORTRAIT_PLACEHOLDER = `${import.meta.env.BASE_URL}placeholder-portrait.svg`;
export const PROJECT_PLACEHOLDER = `${import.meta.env.BASE_URL}placeholder-project.svg`;

/*
 * Files bundled from public/assets. These paths are saved into the database,
 * so they're relative (no leading slash): the page always lives at the site
 * root, which makes them resolve both locally and under /Portfolio/ on Pages.
 */
const ASSET = {
  profilePhoto: 'assets/PFP.jpg',
  aboutPhoto: 'assets/AboutMePFP.jpg',
  resume: 'assets/Resume.pdf',
  nyctophobia: 'assets/Nyctophobia.png',
  caveDiver: 'assets/CaveDiver.png',
};

const LINKS = {
  email: 'lntd6534@gmail.com',
  github: 'https://github.com/DavidLam0101',
  linkedin: 'https://linkedin.com/in/dat-lam-26a6b62b2',
  instagram: 'https://instagram.com/lntd0101',
  phone: '6479063849',
};

const SKILLS = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'React Native', 'Node.js', 'Spring Boot',
  'Java', 'C++', 'C', 'C#', 'SQL', 'PostgreSQL', 'Godot', 'Git',
];

/** Bump when adding another one-time upgrade to applySeed / SEED_PROJECTS. */
export const SEED_VERSION = 1;

export const defaultContent: SiteContent = {
  seedVersion: SEED_VERSION,
  hero: {
    titles: ['Hi, my name is:', 'Or you can call me'],
    names: ['Dat Lam', 'David Lam'],
    jobTitle: 'Computer Science Student',
    location: 'Ottawa, Canada',
    intro:
      "I'm a Computer Science student interested in full-stack development and software engineering. I enjoy building applications using React, React Native, and TypeScript, while exploring backend technologies and database design. I'm passionate about turning ideas into functional, user-friendly software.",
    cvUrl: ASSET.resume,
    cvFileName: 'Dat-Lam-Resume.pdf',
  },
  profile: {
    imageUrl: ASSET.profilePhoto,
    contactLabel: 'My contact:',
  },
  about: {
    heading: 'Who am I, you might ask',
    imageUrl: ASSET.aboutPhoto,
    text:
      "I'm Dat Lam, a Computer Science Honours student at Carleton University. I have experience in building full-stack websites and system-level programming.\n\nCurrently, I'm also into game development with the Godot engine. I have made some games with my friends. This taught me how to cooperate with others, helping them and asking them to help when I need, it helped a lot with the progression.",
    skills: SKILLS,
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
  links: LINKS,
};

/** Projects carried over from the old portfolio. */
export const SEED_PROJECTS: ProjectDraft[] = [
  {
    name: 'Nyctophobia',
    brief: '2D maze game developed in Godot with maze algorithm and AI pathfinding.',
    longDescription: '',
    languages: ['GDScript', 'Godot'],
    images: [ASSET.nyctophobia],
    link: 'https://ccns.itch.io/nyctophobia',
    sortOrder: 0,
  },
  {
    name: 'Cave Diver Game',
    brief: '2D platformer game developed in Godot with custom physics and character controllers.',
    longDescription: '',
    languages: ['GDScript', 'Godot'],
    images: [ASSET.caveDiver],
    link: 'https://saynaa.itch.io/cave-diver',
    sortOrder: 1,
  },
];

/** Fill in any fields missing from saved content (e.g. after new fields are added). */
export function mergeContent(saved: Partial<SiteContent> | null | undefined): SiteContent {
  const d = defaultContent;
  if (!saved) return structuredClone(d);
  return {
    seedVersion: saved.seedVersion ?? 0,
    hero: { ...d.hero, ...saved.hero },
    profile: { ...d.profile, ...saved.profile },
    about: { ...d.about, ...saved.about },
    projects: { ...d.projects, ...saved.projects },
    contact: { ...d.contact, ...saved.contact },
    links: { ...d.links, ...saved.links },
  };
}

/**
 * One-time upgrade for content saved before the old portfolio's photos, CV,
 * links and skills were bundled: fills only fields that are still empty, so
 * nothing the admin wrote is overwritten.
 */
export function applySeed(c: SiteContent): SiteContent {
  if ((c.seedVersion ?? 0) >= SEED_VERSION) return c;
  const d = defaultContent;
  const fill = (value: string, fallback: string) => value.trim() || fallback;
  const skills = [...c.about.skills];
  for (const s of d.about.skills) {
    if (!skills.some((x) => x.toLowerCase() === s.toLowerCase())) skills.push(s);
  }
  const hasCv = !!c.hero.cvUrl.trim();
  return {
    ...c,
    seedVersion: SEED_VERSION,
    hero: {
      ...c.hero,
      cvUrl: hasCv ? c.hero.cvUrl : d.hero.cvUrl,
      cvFileName: hasCv ? c.hero.cvFileName : d.hero.cvFileName,
    },
    profile: { ...c.profile, imageUrl: fill(c.profile.imageUrl, d.profile.imageUrl) },
    about: { ...c.about, imageUrl: fill(c.about.imageUrl, d.about.imageUrl), skills },
    links: {
      email: fill(c.links.email, d.links.email),
      github: fill(c.links.github, d.links.github),
      linkedin: fill(c.links.linkedin, d.links.linkedin),
      instagram: fill(c.links.instagram, d.links.instagram),
      phone: fill(c.links.phone, d.links.phone),
    },
  };
}
