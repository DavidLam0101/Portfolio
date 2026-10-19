import { useState } from 'react';
import { PORTRAIT_PLACEHOLDER } from '../../defaults';
import { useStore } from '../../store';
import { Modal } from '../Modal';
import { Field, FormActions, ImageInput, useSave } from './FormBits';

export function ProfileEditor({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} title="Edit profile card" onClose={onClose}>
      <ProfileForm onClose={onClose} />
    </Modal>
  );
}

function ProfileForm({ onClose }: { onClose: () => void }) {
  const { content, saveContent } = useStore();
  const [profile, setProfile] = useState(content.profile);
  const [links, setLinks] = useState(content.links);
  const { saving, submit } = useSave(onClose);

  return (
    <form className="form" onSubmit={submit(() => saveContent({ ...content, profile, links }))}>
      <ImageInput
        label="Photo"
        value={profile.imageUrl}
        folder="profile"
        fallback={PORTRAIT_PLACEHOLDER}
        onChange={(imageUrl) => setProfile({ ...profile, imageUrl })}
      />
      <Field label="Contact label">
        <input value={profile.contactLabel} onChange={(e) => setProfile({ ...profile, contactLabel: e.target.value })} />
      </Field>
      <Field label="Email" hint="Also used in the footer.">
        <input type="email" value={links.email} onChange={(e) => setLinks({ ...links, email: e.target.value })} />
      </Field>
      <Field label="GitHub URL" hint="Also used in the footer.">
        <input value={links.github} placeholder="https://github.com/username" onChange={(e) => setLinks({ ...links, github: e.target.value })} />
      </Field>
      <Field label="LinkedIn URL" hint="Also used in the footer.">
        <input value={links.linkedin} placeholder="https://linkedin.com/in/username" onChange={(e) => setLinks({ ...links, linkedin: e.target.value })} />
      </Field>
      <FormActions saving={saving} onCancel={onClose} />
    </form>
  );
}
