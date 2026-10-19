import { useState } from 'react';
import { useStore } from '../../store';
import { Modal } from '../Modal';
import { Field, FormActions, useSave } from './FormBits';

export function ContactEditor({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} title="Edit contact" onClose={onClose}>
      <ContactForm onClose={onClose} />
    </Modal>
  );
}

function ContactForm({ onClose }: { onClose: () => void }) {
  const { content, saveContent } = useStore();
  const [contact, setContact] = useState(content.contact);
  const [links, setLinks] = useState(content.links);
  const { saving, submit } = useSave(onClose);

  return (
    <form className="form" onSubmit={submit(() => saveContent({ ...content, contact, links }))}>
      <Field label="Heading">
        <input value={contact.heading} onChange={(e) => setContact({ ...contact, heading: e.target.value })} />
      </Field>
      <Field label="Subheading">
        <input value={contact.subheading} onChange={(e) => setContact({ ...contact, subheading: e.target.value })} />
      </Field>
      <Field label="Phone">
        <input type="tel" value={links.phone} onChange={(e) => setLinks({ ...links, phone: e.target.value })} />
      </Field>
      <Field label="Email">
        <input type="email" value={links.email} onChange={(e) => setLinks({ ...links, email: e.target.value })} />
      </Field>
      <Field label="GitHub URL">
        <input value={links.github} onChange={(e) => setLinks({ ...links, github: e.target.value })} />
      </Field>
      <Field label="LinkedIn URL">
        <input value={links.linkedin} onChange={(e) => setLinks({ ...links, linkedin: e.target.value })} />
      </Field>
      <Field label="Instagram URL">
        <input value={links.instagram} placeholder="https://instagram.com/username" onChange={(e) => setLinks({ ...links, instagram: e.target.value })} />
      </Field>
      <p className="field-hint">If a link is empty, visitors who click its icon see a “link unavailable” message.</p>
      <FormActions saving={saving} onCancel={onClose} />
    </form>
  );
}
