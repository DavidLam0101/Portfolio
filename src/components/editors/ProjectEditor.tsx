import { useRef, useState } from 'react';
import { errorMessage } from '../../lib/backend';
import { useStore } from '../../store';
import type { Project, ProjectDraft } from '../../types';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, XIcon } from '../Icons';
import { Modal } from '../Modal';
import { ChipInput, Field, FormActions, useSave } from './FormBits';

interface Props {
  open: boolean;
  /** The project to edit, or null to add a new one. */
  project: Project | null;
  onClose: () => void;
}

export function ProjectEditor({ open, project, onClose }: Props) {
  return (
    <Modal open={open} title={project ? 'Edit project' : 'Add project'} onClose={onClose} wide>
      <ProjectForm project={project} onClose={onClose} />
    </Modal>
  );
}

function ProjectForm({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const { projects, saveProject, uploadImage, notify } = useStore();
  const [draft, setDraft] = useState<ProjectDraft>(
    () =>
      project ?? {
        name: '',
        brief: '',
        longDescription: '',
        languages: [],
        images: [],
        // New projects go first.
        sortOrder: projects.length ? Math.min(...projects.map((p) => p.sortOrder)) - 1 : 0,
      },
  );
  const [uploading, setUploading] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const { saving, submit } = useSave(onClose);

  const addImages = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files);
    setUploading((n) => n + list.length);
    for (const file of list) {
      try {
        const url = await uploadImage(file, 'projects');
        setDraft((d) => ({ ...d, images: [...d.images, url] }));
      } catch (err) {
        notify(`Upload failed for ${file.name}: ${errorMessage(err)}`, 'error');
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const moveImage = (index: number, dir: -1 | 1) =>
    setDraft((d) => {
      const images = [...d.images];
      const target = index + dir;
      if (target < 0 || target >= images.length) return d;
      [images[index], images[target]] = [images[target], images[index]];
      return { ...d, images };
    });

  return (
    <form
      className="form"
      onSubmit={submit(() => saveProject(draft), project ? 'Project updated' : 'Project added')}
    >
      <Field label="Name">
        <input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
      </Field>
      <Field label="Brief description" hint="One or two sentences shown on the card.">
        <textarea rows={2} maxLength={220} value={draft.brief} onChange={(e) => setDraft({ ...draft, brief: e.target.value })} />
      </Field>
      <Field
        label="Long description"
        hint="Shown when a visitor hovers the card: what it does, how you built it, and what you learned. Blank lines start new paragraphs."
      >
        <textarea
          rows={8}
          value={draft.longDescription}
          onChange={(e) => setDraft({ ...draft, longDescription: e.target.value })}
        />
      </Field>
      <ChipInput
        label="Languages / technologies"
        values={draft.languages}
        placeholder="e.g. TypeScript"
        onChange={(languages) => setDraft({ ...draft, languages })}
      />
      <div className="field">
        <span className="field-label">Images</span>
        <div className="thumb-grid">
          {draft.images.map((src, i) => (
            <figure className="thumb" key={src + i}>
              <img src={src} alt="" />
              <div className="thumb-actions">
                <button type="button" aria-label="Move left" disabled={i === 0} onClick={() => moveImage(i, -1)}>
                  <ChevronLeftIcon size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => setDraft((d) => ({ ...d, images: d.images.filter((_, j) => j !== i) }))}
                >
                  <XIcon size={14} />
                </button>
                <button type="button" aria-label="Move right" disabled={i === draft.images.length - 1} onClick={() => moveImage(i, 1)}>
                  <ChevronRightIcon size={14} />
                </button>
              </div>
            </figure>
          ))}
          <button type="button" className="thumb thumb--add" onClick={() => fileRef.current?.click()}>
            <PlusIcon />
            <span>{uploading ? `Uploading ${uploading}…` : 'Add images'}</span>
          </button>
        </div>
        <span className="field-hint">The first image is the cover. On hover, images slide every 5 seconds.</span>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addImages(e.target.files)} />
      </div>
      <FormActions saving={saving || uploading > 0} onCancel={onClose} submitLabel={project ? 'Save' : 'Add project'} />
    </form>
  );
}
