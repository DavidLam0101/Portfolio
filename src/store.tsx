import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { backend, errorMessage } from './lib/backend';
import { resizeImage } from './lib/image';
import { defaultContent, mergeContent } from './defaults';
import type { AdminUser, Project, ProjectDraft, SiteContent } from './types';

interface Toast {
  id: number;
  message: string;
  kind: 'success' | 'error';
}

interface Store {
  content: SiteContent;
  projects: Project[];
  loading: boolean;
  user: AdminUser | null;
  isAdmin: boolean;
  /** True while the user is setting a new password after a reset email. */
  recovering: boolean;
  finishRecovery(): void;
  toasts: Toast[];
  notify(message: string, kind?: Toast['kind']): void;
  /** Name of the link whose "unavailable" popup is open, or null. */
  unavailableLink: string | null;
  showUnavailable(label: string | null): void;
  saveContent(next: SiteContent): Promise<void>;
  saveProject(draft: ProjectDraft): Promise<void>;
  deleteProject(id: string): Promise<void>;
  moveProject(id: string, direction: -1 | 1): Promise<void>;
  uploadImage(file: File, folder: string, maxSize?: number): Promise<string>;
  uploadFile(file: File, folder: string): Promise<string>;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [recovering, setRecovering] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [unavailableLink, setUnavailableLink] = useState<string | null>(null);
  const toastId = useRef(0);

  const notify = useCallback((message: string, kind: Toast['kind'] = 'success') => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([backend.loadContent(), backend.listProjects(), backend.getUser()])
      .then(([saved, list, u]) => {
        if (cancelled) return;
        setContent(mergeContent(saved));
        setProjects(list);
        setUser(u);
      })
      .catch((err) => !cancelled && notify(`Could not load content: ${errorMessage(err)}`, 'error'))
      .finally(() => !cancelled && setLoading(false));

    const unsubscribe = backend.onAuthChange((u, recovery) => {
      setUser(u);
      if (recovery) setRecovering(true);
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [notify]);

  const saveContent = useCallback(async (next: SiteContent) => {
    await backend.saveContent(next);
    setContent(next);
  }, []);

  const saveProject = useCallback(async (draft: ProjectDraft) => {
    const saved = await backend.saveProject(draft);
    setProjects((list) =>
      list.some((p) => p.id === saved.id)
        ? list.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...list],
    );
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    await backend.deleteProject(id);
    setProjects((list) => list.filter((p) => p.id !== id));
  }, []);

  const moveProject = useCallback(
    async (id: string, direction: -1 | 1) => {
      const index = projects.findIndex((p) => p.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= projects.length) return;
      // Renumber everything so the order is stable regardless of earlier values.
      const reordered = [...projects];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
      const renumbered = reordered.map((p, i) => ({ ...p, sortOrder: i }));
      setProjects(renumbered);
      try {
        const changed = renumbered.filter((p) => projects.find((o) => o.id === p.id)?.sortOrder !== p.sortOrder);
        await Promise.all(changed.map((p) => backend.saveProject(p)));
      } catch (err) {
        setProjects(projects);
        notify(`Could not reorder: ${errorMessage(err)}`, 'error');
      }
    },
    [projects, notify],
  );

  const uploadImage = useCallback(async (file: File, folder: string, maxSize?: number) => {
    // Local demo mode stores images in localStorage, so keep them smaller there.
    const size = maxSize ?? (backend.mode === 'local' ? 900 : 1800);
    const blob = await resizeImage(file, size, backend.mode === 'local' ? 0.75 : 0.85);
    const name = file.name.replace(/\.[^.]+$/, '') + (blob.type === 'image/webp' ? '.webp' : '');
    return backend.uploadFile(blob, folder, name);
  }, []);

  const uploadFile = useCallback((file: File, folder: string) => backend.uploadFile(file, folder, file.name), []);

  const value = useMemo<Store>(
    () => ({
      content,
      projects,
      loading,
      user,
      isAdmin: !!user,
      recovering,
      finishRecovery: () => setRecovering(false),
      toasts,
      notify,
      unavailableLink,
      showUnavailable: setUnavailableLink,
      saveContent,
      saveProject,
      deleteProject,
      moveProject,
      uploadImage,
      uploadFile,
    }),
    [content, projects, loading, user, recovering, toasts, notify, unavailableLink, saveContent, saveProject, deleteProject, moveProject, uploadImage, uploadFile],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside <StoreProvider>');
  return store;
}

/** Every skill shown in the Tech skills tab: manual skills plus project languages, de-duplicated. */
export function useAllSkills(): string[] {
  const { content, projects } = useStore();
  return useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    const add = (s: string) => {
      const key = s.trim().toLowerCase();
      if (key && !seen.has(key)) {
        seen.add(key);
        result.push(s.trim());
      }
    };
    content.about.skills.forEach(add);
    if (content.about.includeProjectLanguages) projects.forEach((p) => p.languages.forEach(add));
    return result;
  }, [content.about.skills, content.about.includeProjectLanguages, projects]);
}
