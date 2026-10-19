import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { errorMessage } from '../../lib/backend';
import { useStore } from '../../store';
import { PencilIcon, UploadIcon, XIcon } from '../Icons';

export function EditButton({ onClick, label = 'Edit' }: { onClick: () => void; label?: string }) {
  const { isAdmin } = useStore();
  if (!isAdmin) return null;
  return (
    <button type="button" className="edit-btn" onClick={onClick}>
      <PencilIcon size={14} /> {label}
    </button>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

/** Text input that turns Enter/comma-separated entries into removable chips. */
export function ChipInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');
  const id = useId();

  const commit = (raw: string) => {
    const additions = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s && !values.some((v) => v.toLowerCase() === s.toLowerCase()));
    if (additions.length) onChange([...values, ...additions]);
    setDraft('');
  };

  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div className="chip-input">
        {values.map((v) => (
          <span className="chip" key={v}>
            {v}
            <button type="button" aria-label={`Remove ${v}`} onClick={() => onChange(values.filter((x) => x !== v))}>
              <XIcon size={12} />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => (e.target.value.includes(',') ? commit(e.target.value) : setDraft(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit(draft);
            } else if (e.key === 'Backspace' && !draft && values.length) {
              onChange(values.slice(0, -1));
            }
          }}
          onBlur={() => draft && commit(draft)}
        />
      </div>
      <span className="field-hint">Press Enter or comma to add.</span>
    </div>
  );
}

/** Image picker that uploads immediately and shows a preview. */
export function ImageInput({
  label,
  value,
  folder,
  onChange,
  fallback,
}: {
  label: string;
  value: string;
  folder: string;
  onChange: (url: string) => void;
  fallback: string;
}) {
  const { uploadImage, notify } = useStore();
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadImage(file, folder));
    } catch (err) {
      notify(`Upload failed: ${errorMessage(err)}`, 'error');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="image-input">
        <img src={value || fallback} alt="" />
        <div className="image-input-actions">
          <button type="button" className="btn btn--small" disabled={busy} onClick={() => inputRef.current?.click()}>
            <UploadIcon size={14} /> {busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}
          </button>
          {value && (
            <button type="button" className="btn btn--small btn--ghost" onClick={() => onChange('')}>
              Remove
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
    </div>
  );
}

/** Shared submit/cancel handling for editor modals. */
export function useSave(onDone: () => void) {
  const { notify } = useStore();
  const [saving, setSaving] = useState(false);
  const submit = (action: () => Promise<void>, message = 'Saved') => async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await action();
      notify(message);
      onDone();
    } catch (err) {
      notify(`Could not save: ${errorMessage(err)}`, 'error');
    } finally {
      setSaving(false);
    }
  };
  return { saving, submit };
}

export function FormActions({ saving, onCancel, submitLabel = 'Save' }: { saving: boolean; onCancel: () => void; submitLabel?: string }) {
  return (
    <div className="form-actions">
      <button type="button" className="btn btn--ghost" onClick={onCancel}>
        Cancel
      </button>
      <button type="submit" className="btn btn--solid" disabled={saving}>
        {saving ? 'Saving…' : submitLabel}
      </button>
    </div>
  );
}

export const linesToList = (s: string) =>
  s
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
