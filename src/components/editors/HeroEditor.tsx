import { useRef, useState } from 'react';
import { errorMessage } from '../../lib/backend';
import { useStore } from '../../store';
import { UploadIcon } from '../Icons';
import { Modal } from '../Modal';
import { Field, FormActions, linesToList, useSave } from './FormBits';

export function HeroEditor({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} title="Edit home section" onClose={onClose} wide>
      <HeroForm onClose={onClose} />
    </Modal>
  );
}

function HeroForm({ onClose }: { onClose: () => void }) {
  const { content, saveContent, uploadFile, notify } = useStore();
  const [hero, setHero] = useState(content.hero);
  const [titles, setTitles] = useState(content.hero.titles.join('\n'));
  const [names, setNames] = useState(content.hero.names.join('\n'));
  const [uploading, setUploading] = useState(false);
  const cvRef = useRef<HTMLInputElement>(null);
  const { saving, submit } = useSave(onClose);

  const onCv = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, 'cv');
      setHero((h) => ({ ...h, cvUrl: url, cvFileName: file.name }));
    } catch (err) {
      notify(`Upload failed: ${errorMessage(err)}`, 'error');
    } finally {
      setUploading(false);
      if (cvRef.current) cvRef.current.value = '';
    }
  };

  return (
    <form
      className="form"
      onSubmit={submit(() =>
        saveContent({ ...content, hero: { ...hero, titles: linesToList(titles), names: linesToList(names) } }),
      )}
    >
      <div className="form-grid">
        <Field label="Title phrases" hint="One per line. The title types through these in order.">
          <textarea rows={3} value={titles} onChange={(e) => setTitles(e.target.value)} />
        </Field>
        <Field label="Names" hint="One per line, e.g. Dat Lam / David Lam.">
          <textarea rows={3} value={names} onChange={(e) => setNames(e.target.value)} />
        </Field>
        <Field label="Job title">
          <input value={hero.jobTitle} onChange={(e) => setHero({ ...hero, jobTitle: e.target.value })} />
        </Field>
        <Field label="Location">
          <input value={hero.location} onChange={(e) => setHero({ ...hero, location: e.target.value })} />
        </Field>
      </div>
      <Field label="Introduction">
        <textarea rows={5} value={hero.intro} onChange={(e) => setHero({ ...hero, intro: e.target.value })} />
      </Field>
      <div className="field">
        <span className="field-label">CV file</span>
        <div className="cv-row">
          <span className="cv-name">{hero.cvUrl ? hero.cvFileName || 'CV uploaded' : 'No CV uploaded yet'}</span>
          <button type="button" className="btn btn--small" disabled={uploading} onClick={() => cvRef.current?.click()}>
            <UploadIcon size={14} /> {uploading ? 'Uploading…' : hero.cvUrl ? 'Replace' : 'Upload PDF'}
          </button>
          {hero.cvUrl && (
            <button type="button" className="btn btn--small btn--ghost" onClick={() => setHero({ ...hero, cvUrl: '' })}>
              Remove
            </button>
          )}
          <input ref={cvRef} type="file" accept=".pdf,.doc,.docx,application/pdf" hidden onChange={(e) => onCv(e.target.files?.[0])} />
        </div>
      </div>
      <FormActions saving={saving || uploading} onCancel={onClose} />
    </form>
  );
}
