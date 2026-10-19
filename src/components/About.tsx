import { useState } from 'react';
import { PORTRAIT_PLACEHOLDER } from '../defaults';
import { useReveal } from '../hooks/useReveal';
import { useAllSkills, useStore } from '../store';
import { AboutEditor } from './editors/AboutEditor';
import { EditButton } from './editors/FormBits';

type Tab = 'about' | 'skills';

export function About() {
  const { content } = useStore();
  const { about } = content;
  const skills = useAllSkills();
  const [tab, setTab] = useState<Tab>('about');
  const [editing, setEditing] = useState(false);
  const revealRef = useReveal<HTMLElement>();

  const paragraphs = about.text.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <section id="about" className="about section" ref={revealRef}>
      <h2 className="slab-heading">{about.heading}</h2>
      <div className="about-card editable">
        <EditButton onClick={() => setEditing(true)} />
        <div className="about-photo">
          <img src={about.imageUrl || PORTRAIT_PLACEHOLDER} alt="Dat Lam" />
        </div>
        <div className="about-content">
          <div className="tabs" role="tablist" aria-label="About me">
            <button type="button" role="tab" id="tab-about" aria-selected={tab === 'about'} aria-controls="panel-about" onClick={() => setTab('about')}>
              About me
            </button>
            <button type="button" role="tab" id="tab-skills" aria-selected={tab === 'skills'} aria-controls="panel-skills" onClick={() => setTab('skills')}>
              Tech skills
            </button>
          </div>
          {tab === 'about' ? (
            <div className="about-text tab-panel" role="tabpanel" id="panel-about" aria-labelledby="tab-about">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : (
            <ul className="skills-grid tab-panel" role="tabpanel" id="panel-skills" aria-labelledby="tab-skills">
              {skills.map((s) => (
                <li key={s} title={s}>
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <AboutEditor open={editing} onClose={() => setEditing(false)} />
    </section>
  );
}
