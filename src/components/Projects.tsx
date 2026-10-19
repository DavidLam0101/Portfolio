import { useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReveal } from '../hooks/useReveal';
import { errorMessage } from '../lib/backend';
import { useStore } from '../store';
import type { Project } from '../types';
import { EditButton } from './editors/FormBits';
import { ProjectEditor } from './editors/ProjectEditor';
import { ProjectsHeaderEditor } from './editors/ProjectsHeaderEditor';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from './Icons';
import { ProjectCard } from './ProjectCard';

export function Projects() {
  const { content, projects, isAdmin, loading, deleteProject, moveProject, notify } = useStore();
  const twoColumns = useMediaQuery('(min-width: 860px)');
  const [expanded, setExpanded] = useState(false);
  const [editingHeader, setEditingHeader] = useState(false);
  const revealRef = useReveal<HTMLElement>();
  // undefined = closed, null = adding a new project
  const [editingProject, setEditingProject] = useState<Project | null | undefined>(undefined);

  const initialCount = twoColumns ? 4 : 3;
  const visible = expanded ? projects : projects.slice(0, initialCount);
  const hasMore = projects.length > initialCount;

  const remove = async (project: Project) => {
    if (!window.confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    try {
      await deleteProject(project.id);
      notify('Project deleted');
    } catch (err) {
      notify(`Could not delete: ${errorMessage(err)}`, 'error');
    }
  };

  const collapse = () => {
    setExpanded(false);
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="projects" className="projects section" ref={revealRef}>
      <h2 className="section-heading">{content.projects.heading}</h2>
      <div className="projects-frame editable">
        <EditButton onClick={() => setEditingHeader(true)} label="Edit heading" />
        <header className="projects-header">
          <p className="projects-tagline">{content.projects.tagline}</p>
          <p className="projects-subtagline">{content.projects.subtagline}</p>
        </header>

        {isAdmin && (
          <button type="button" className="btn btn--solid add-project" onClick={() => setEditingProject(null)}>
            <PlusIcon size={16} /> Add project
          </button>
        )}

        {projects.length === 0 ? (
          <p className="empty-state">
            {loading ? 'Loading projects…' : isAdmin ? 'No projects yet — add your first one.' : 'Projects are coming soon.'}
          </p>
        ) : (
          <div className="project-grid">
            {visible.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                admin={
                  isAdmin
                    ? {
                        onEdit: () => setEditingProject(p),
                        onDelete: () => remove(p),
                        onMoveUp: i > 0 ? () => moveProject(p.id, -1) : undefined,
                        onMoveDown: i < projects.length - 1 ? () => moveProject(p.id, 1) : undefined,
                      }
                    : undefined
                }
              />
            ))}
          </div>
        )}

        {hasMore && (
          <button type="button" className="btn btn--outline continue-btn" onClick={expanded ? collapse : () => setExpanded(true)}>
            {expanded ? (
              <>
                Show less <ChevronUpIcon size={16} />
              </>
            ) : (
              <>
                Continue viewing <ChevronDownIcon size={16} />
              </>
            )}
          </button>
        )}
      </div>

      <ProjectsHeaderEditor open={editingHeader} onClose={() => setEditingHeader(false)} />
      <ProjectEditor
        key={editingProject === undefined ? 'closed' : editingProject?.id ?? 'new'}
        open={editingProject !== undefined}
        project={editingProject ?? null}
        onClose={() => setEditingProject(undefined)}
      />
    </section>
  );
}
