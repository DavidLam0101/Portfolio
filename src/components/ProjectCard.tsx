import { useEffect, useRef, useState } from 'react';
import { PROJECT_PLACEHOLDER } from '../defaults';
import type { Project } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashIcon } from './Icons';

interface AdminActions {
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const SLIDE_MS = 5000;

export function ProjectCard({ project, admin }: { project: Project; admin?: AdminActions }) {
  const [active, setActive] = useState(false);
  const [slide, setSlide] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const images = project.images.length ? project.images : [PROJECT_PLACEHOLDER];

  // While the card is open, advance the slideshow every 5 seconds.
  useEffect(() => {
    if (!active) {
      setSlide(0);
      return;
    }
    if (images.length < 2) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % images.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [active, images.length]);

  // Touch devices have no hover: a tap opens the card, a tap elsewhere closes it.
  useEffect(() => {
    if (!active) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setActive(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [active]);

  const paragraphs = project.longDescription.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <article
      ref={ref}
      className={`project-card${active ? ' is-active' : ''}`}
      tabIndex={0}
      aria-expanded={active}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setActive(false)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button, a')) return;
        if (e.nativeEvent instanceof PointerEvent && e.nativeEvent.pointerType === 'mouse') return;
        setActive((a) => !a);
      }}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActive((a) => !a);
        } else if (e.key === 'Escape') {
          setActive(false);
        }
      }}
    >
      <div className="project-media">
        {images.map((src, i) => (
          <img key={src + i} src={src} alt={i === 0 ? `${project.name} screenshot` : ''} className={i === slide ? 'is-shown' : undefined} loading="lazy" />
        ))}
        {active && images.length > 1 && (
          <div className="slide-dots" aria-hidden="true">
            {images.map((_, i) => (
              <span key={i} className={i === slide ? 'is-current' : undefined} />
            ))}
          </div>
        )}
        {admin && (
          <div className="card-admin">
            {admin.onMoveUp && (
              <button type="button" onClick={admin.onMoveUp} aria-label="Move earlier" title="Move earlier">
                <ChevronLeftIcon size={15} />
              </button>
            )}
            {admin.onMoveDown && (
              <button type="button" onClick={admin.onMoveDown} aria-label="Move later" title="Move later">
                <ChevronRightIcon size={15} />
              </button>
            )}
            <button type="button" onClick={admin.onEdit} aria-label="Edit project" title="Edit">
              <PencilIcon size={15} />
            </button>
            <button type="button" onClick={admin.onDelete} aria-label="Delete project" title="Delete">
              <TrashIcon size={15} />
            </button>
          </div>
        )}
      </div>

      <div className="project-body">
        <h3 className="project-name">{project.name}</h3>
        <p className="project-brief">{project.brief}</p>
        {project.languages.length > 0 && (
          <ul className="lang-list">
            {project.languages.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        )}
      </div>

      {paragraphs.length > 0 && (
        <div className="project-details" aria-hidden={!active}>
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
    </article>
  );
}
