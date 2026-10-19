import type { AdminUser, Project, SiteContent } from '../types';
import type { Backend } from './backend';
import { blobToDataUrl } from './image';

/*
 * Local demo backend: everything lives in this browser's localStorage and
 * uploaded files are stored as data URLs. Meant for trying the site before
 * Supabase is connected — nothing is shared with other visitors.
 */

const CONTENT_KEY = 'portfolio.content';
const PROJECTS_KEY = 'portfolio.projects';
const SESSION_KEY = 'portfolio.session';

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    throw new Error(
      'Browser storage is full. Demo mode keeps images in the browser — try smaller images, or connect Supabase.',
    );
  }
}

export function createLocalBackend(): Backend {
  const email = (import.meta.env.VITE_DEMO_ADMIN_EMAIL as string | undefined) || 'admin@example.com';
  const password = (import.meta.env.VITE_DEMO_ADMIN_PASSWORD as string | undefined) || 'admin123';
  const listeners = new Set<(user: AdminUser | null, recovery: boolean) => void>();
  const emit = (user: AdminUser | null) => listeners.forEach((cb) => cb(user, false));

  return {
    mode: 'local',
    demoCredentials: { email, password },

    async getUser() {
      return read<AdminUser>(SESSION_KEY);
    },

    onAuthChange(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },

    async signIn(e, p) {
      if (e.trim().toLowerCase() !== email.toLowerCase() || p !== password) {
        throw new Error('Invalid email or password.');
      }
      const user = { email };
      write(SESSION_KEY, user);
      emit(user);
    },

    async signOut() {
      write(SESSION_KEY, null);
      emit(null);
    },

    async sendPasswordReset() {
      throw new Error(
        'Password reset emails need Supabase. In demo mode the password is set in .env.local (VITE_DEMO_ADMIN_PASSWORD).',
      );
    },

    async updatePassword() {
      throw new Error('Not available in demo mode.');
    },

    async loadContent() {
      return read<Partial<SiteContent>>(CONTENT_KEY);
    },

    async saveContent(content) {
      write(CONTENT_KEY, content);
    },

    async listProjects() {
      const list = read<Project[]>(PROJECTS_KEY) ?? [];
      return [...list].sort(
        (a, b) => a.sortOrder - b.sortOrder || b.createdAt.localeCompare(a.createdAt),
      );
    },

    async saveProject(draft) {
      const list = read<Project[]>(PROJECTS_KEY) ?? [];
      const existing = draft.id ? list.find((p) => p.id === draft.id) : undefined;
      const project: Project = {
        ...draft,
        id: existing?.id ?? crypto.randomUUID(),
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      };
      write(
        PROJECTS_KEY,
        existing ? list.map((p) => (p.id === project.id ? project : p)) : [...list, project],
      );
      return project;
    },

    async deleteProject(id) {
      const list = read<Project[]>(PROJECTS_KEY) ?? [];
      write(PROJECTS_KEY, list.filter((p) => p.id !== id));
    },

    async uploadFile(file) {
      return blobToDataUrl(file);
    },
  };
}
