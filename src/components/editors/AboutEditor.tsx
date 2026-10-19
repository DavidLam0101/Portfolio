import { useState } from 'react';
import { PORTRAIT_PLACEHOLDER } from '../../defaults';
import { useStore } from '../../store';
import { Modal } from '../Modal';
import { ChipInput, Field, FormActions, ImageInput, useSave } from './FormBits';

export function AboutEditor({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} title="Edit about me" onClose={onClose} wide>
      <AboutForm onClose={onClose} />
    </Modal>
  );
}

function AboutForm({ onClose }: { onClose: () => void }) {
  const { content, saveContent } = useStore();
  const [about, setAbout] = useState(content.about);
  const { saving, submit } = useSave(onClose);

  return (
    <form className="form" onSubmit={submit(() => saveContent({ ...content, about }))}>
      <Field label="Section heading">
        <input value={about.heading} onChange={(e) => setAbout({ ...about, heading: e.target.value })} />
      </Field>
      <ImageInput
        label="Photo"
        value={about.imageUrl}
        folder="about"
        fallback={PORTRAIT_PLACEHOLDER}
        onChange={(imageUrl) => setAbout({ ...about, imageUrl })}
      />
      <Field label="About me" hint="Who you are, your goals and ambitions. Leave a blank line between paragraphs.">
        <textarea rows={9} value={about.text} onChange={(e) => setAbout({ ...about, text: e.target.value })} />
      </Field>
      <ChipInput
        label="Tech skills"
        values={about.skills}
        placeholder="e.g. Python"
        onChange={(skills) => setAbout({ ...about, skills })}
      />
      <label className="checkbox">
        <input
          type="checkbox"
          checked={about.includeProjectLanguages}
          onChange={(e) => setAbout({ ...about, includeProjectLanguages: e.target.checked })}
        />
        Also show every language used in my projects
      </label>
      <FormActions saving={saving} onCancel={onClose} />
    </form>
  );
}
