import { createClient, type User } from '@supabase/supabase-js';
import type { Project, ProjectDraft } from '../types';
import type { Backend } from './backend';

const BUCKET = 'portfolio';

interface ProjectRow {
  id: string;
  name: string;
  brief: string;
  long_description: string;
  languages: string[];
  images: string[];
  link: string | null;
  sort_order: number;
  created_at: string;
}

function fromRow(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    brief: row.brief ?? '',
    longDescription: row.long_description ?? '',
    languages: row.languages ?? [],
    images: row.images ?? [],
    link: row.link ?? '',
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
  };
}

function safeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '') || 'file';
}

export function createSupabaseBackend(url: string, anonKey: string): Backend {
  const sb = createClient(url, anonKey);
  const toUser = (u: User | null | undefined) => (u?.email ? { email: u.email } : null);

  return {
    mode: 'supabase',

    async getUser() {
      const { data } = await sb.auth.getSession();
      return toUser(data.session?.user);
    },

    onAuthChange(cb) {
      const { data } = sb.auth.onAuthStateChange((event, session) => {
        cb(toUser(session?.user), event === 'PASSWORD_RECOVERY');
      });
      return () => data.subscription.unsubscribe();
    },

    async signIn(email, password) {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },

    async signOut() {
      const { error } = await sb.auth.signOut();
      if (error) throw error;
    },

    async sendPasswordReset(email) {
      const { error } = await sb.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname,
      });
      if (error) throw error;
    },

    async updatePassword(password) {
      const { error } = await sb.auth.updateUser({ password });
      if (error) throw error;
    },

    async loadContent() {
      const { data, error } = await sb.from('site_content').select('data').eq('id', 1).maybeSingle();
      if (error) throw error;
      return data?.data ?? null;
    },

    async saveContent(content) {
      const { error } = await sb
        .from('site_content')
        .upsert({ id: 1, data: content, updated_at: new Date().toISOString() });
      if (error) throw error;
    },

    async listProjects() {
      const { data, error } = await sb
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as ProjectRow[]).map(fromRow);
    },

    async saveProject(p: ProjectDraft) {
      const row = {
        name: p.name,
        brief: p.brief,
        long_description: p.longDescription,
        languages: p.languages,
        images: p.images,
        link: p.link,
        sort_order: p.sortOrder,
      };
      const query = p.id
        ? sb.from('projects').update(row).eq('id', p.id)
        : sb.from('projects').insert(row);
      const { data, error } = await query.select().single();
      if (error) throw error;
      return fromRow(data as ProjectRow);
    },

    async deleteProject(id) {
      const { error } = await sb.from('projects').delete().eq('id', id);
      if (error) throw error;
    },

    async uploadFile(file, folder, filename) {
      const path = `${folder}/${Date.now()}-${safeName(filename)}`;
      const { error } = await sb.storage.from(BUCKET).upload(path, file, {
        contentType: file.type || undefined,
        cacheControl: '31536000',
      });
      if (error) throw error;
      return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    },
  };
}
