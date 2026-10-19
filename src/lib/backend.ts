import type { AdminUser, Project, ProjectDraft, SiteContent } from '../types';
import { createLocalBackend } from './localBackend';
import { createSupabaseBackend } from './supabaseBackend';

export interface Backend {
  readonly mode: 'supabase' | 'local';
  /** Only set in local demo mode, so the login panel can show a hint. */
  readonly demoCredentials?: { email: string; password: string };

  getUser(): Promise<AdminUser | null>;
  /** `recovery` is true when the user arrived from a password-reset email. */
  onAuthChange(cb: (user: AdminUser | null, recovery: boolean) => void): () => void;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  sendPasswordReset(email: string): Promise<void>;
  updatePassword(password: string): Promise<void>;

  loadContent(): Promise<Partial<SiteContent> | null>;
  saveContent(content: SiteContent): Promise<void>;

  listProjects(): Promise<Project[]>;
  saveProject(project: ProjectDraft): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  /** Stores a file and returns a URL it can be displayed/downloaded from. */
  uploadFile(file: Blob, folder: string, filename: string): Promise<string>;
}

// Accept the API URL as copied from the dashboard (".../rest/v1/") — the client
// adds those paths itself and needs only the project origin.
const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)
  ?.trim()
  .replace(/\/(rest|auth|storage)\/v1\/?.*$/, '')
  .replace(/\/+$/, '');
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

export const backend: Backend =
  url && anonKey ? createSupabaseBackend(url, anonKey) : createLocalBackend();

export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === 'object' && 'message' in err) return String(err.message);
  return 'Something went wrong.';
}
