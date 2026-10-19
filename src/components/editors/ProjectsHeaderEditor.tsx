import { useState } from 'react';
import { useStore } from '../../store';
import { Modal } from '../Modal';
import { Field, FormActions, useSave } from './FormBits';

export function ProjectsHeaderEditor({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} title="Edit projects heading" onClose={onClose}>
      <ProjectsHeaderForm onClose={onClose} />
    </Modal>
  );
}

function ProjectsHeaderForm({ onClose }: { onClose: () => void }) {
  const { content, saveContent } = useStore();
  const [projects, setProjects] = useState(content.projects);
  const { saving, submit } = useSave(onClose);

  return (
    <form className="form" onSubmit={submit(() => saveContent({ ...content, projects }))}>
      <Field label="Section heading">
        <input value={projects.heading} onChange={(e) => setProjects({ ...projects, heading: e.target.value })} />
      </Field>
      <Field label="Tagline">
        <input value={projects.tagline} onChange={(e) => setProjects({ ...projects, tagline: e.target.value })} />
      </Field>
      <Field label="Sub-tagline">
        <input value={projects.subtagline} onChange={(e) => setProjects({ ...projects, subtagline: e.target.value })} />
      </Field>
      <FormActions saving={saving} onCancel={onClose} />
    </form>
  );
}
