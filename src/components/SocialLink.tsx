import { useState, type ReactNode } from 'react';
import { toHref } from '../lib/image';
import { useStore } from '../store';
import type { Links } from '../types';
import { Field, FormActions, useSave } from './editors/FormBits';
import { PencilIcon } from './Icons';
import { Modal } from './Modal';

export const LINK_META: Record<Exclude<keyof Links, 'phone'>, { label: string; kind: 'url' | 'email'; placeholder: string }> = {
  github: { label: 'GitHub', kind: 'url', placeholder: 'https://github.com/username' },
  linkedin: { label: 'LinkedIn', kind: 'url', placeholder: 'https://linkedin.com/in/username' },
  instagram: { label: 'Instagram', kind: 'url', placeholder: 'https://instagram.com/username' },
  email: { label: 'Email', kind: 'email', placeholder: 'you@example.com' },
};

interface SocialLinkProps {
  field: keyof typeof LINK_META;
  className: string;
  children: ReactNode;
  /** Show the visible label next to the icon (profile card) or only as a tooltip (footer). */
  showLabel?: boolean;
}

/**
 * A contact link that opens the saved URL, or an "unavailable" popup when none
 * is set. Admins get a pencil badge to paste the link straight in.
 */
export function SocialLink({ field, className, children, showLabel }: SocialLinkProps) {
  const { content, isAdmin, showUnavailable } = useStore();
  const [editing, setEditing] = useState(false);
  const meta = LINK_META[field];
  const href = toHref(content.links[field], meta.kind);

  return (
    <span className="social-link">
      <a
        href={href || '#'}
        className={`${className}${href ? '' : ' is-empty'}`}
        aria-label={showLabel ? undefined : meta.label}
        title={meta.label}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel="noopener noreferrer"
        onClick={(e) => {
          if (!href) {
            e.preventDefault();
            showUnavailable(meta.label);
          }
        }}
      >
        {children}
        {showLabel && ` ${meta.label}`}
      </a>
      {isAdmin && (
        <button type="button" className="link-edit-badge" onClick={() => setEditing(true)} aria-label={`Edit ${meta.label} link`} title={`Edit ${meta.label} link`}>
          <PencilIcon size={11} />
        </button>
      )}
      <Modal open={editing} title={`${meta.label} link`} onClose={() => setEditing(false)}>
        <LinkForm field={field} onClose={() => setEditing(false)} />
      </Modal>
    </span>
  );
}

function LinkForm({ field, onClose }: { field: keyof typeof LINK_META; onClose: () => void }) {
  const { content, saveContent } = useStore();
  const meta = LINK_META[field];
  const [value, setValue] = useState(content.links[field]);
  const { saving, submit } = useSave(onClose);

  return (
    <form className="form" onSubmit={submit(() => saveContent({ ...content, links: { ...content.links, [field]: value.trim() } }))}>
      <Field
        label={meta.kind === 'email' ? 'Email address' : 'Link'}
        hint="Used everywhere this link appears. Leave empty to show visitors a “link unavailable” message."
      >
        <input
          type={meta.kind === 'email' ? 'email' : 'text'}
          value={value}
          placeholder={meta.placeholder}
          onChange={(e) => setValue(e.target.value)}
        />
      </Field>
      <FormActions saving={saving} onCancel={onClose} />
    </form>
  );
}

/** The popup visitors see when a link hasn't been set yet. */
export function LinkUnavailableModal() {
  const { unavailableLink, showUnavailable } = useStore();
  return (
    <Modal open={unavailableLink !== null} title="Link unavailable" onClose={() => showUnavailable(null)}>
      <div className="form">
        <p className="muted">Sorry, the {unavailableLink} link isn't available right now. Please check back later.</p>
        <div className="form-actions">
          <button type="button" className="btn btn--solid" onClick={() => showUnavailable(null)}>
            OK
          </button>
        </div>
      </div>
    </Modal>
  );
}
