import { useState } from 'react';
import { PORTRAIT_PLACEHOLDER } from '../defaults';
import { useReveal } from '../hooks/useReveal';
import { useStore } from '../store';
import { HeroEditor } from './editors/HeroEditor';
import { ProfileEditor } from './editors/ProfileEditor';
import { EditButton } from './editors/FormBits';
import { DownloadIcon, GithubIcon, LinkedinIcon, MailIcon } from './Icons';
import { SocialLink } from './SocialLink';
import { TypedText, useSyncedTyping } from './TypeCycle';

export function Hero() {
  const { content, notify } = useStore();
  const { hero } = content;
  const [editing, setEditing] = useState(false);
  const [title, name] = useSyncedTyping([hero.titles, hero.names]);
  const revealRef = useReveal<HTMLElement>();

  const downloadCv = async () => {
    if (!hero.cvUrl) return notify('The CV has not been uploaded yet.', 'error');
    const filename = hero.cvFileName || 'Dat-Lam-CV.pdf';
    try {
      // Fetching first lets the download keep its file name even for cross-origin storage URLs.
      const res = await fetch(hero.cvUrl);
      if (!res.ok) throw new Error(String(res.status));
      const url = URL.createObjectURL(await res.blob());
      const a = Object.assign(document.createElement('a'), { href: url, download: filename });
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      window.open(hero.cvUrl, '_blank', 'noopener');
    }
  };

  return (
    <section id="home" className="hero section" ref={revealRef}>
      <div className="hero-text editable">
        <EditButton onClick={() => setEditing(true)} />
        <TypedText as="p" className="hero-title" text={title} label={hero.titles.join(' / ')} />
        <TypedText as="h1" className="hero-name" text={name} label={hero.names.join(' / ')} />
        <p className="hero-job">{hero.jobTitle}</p>
        <p className="hero-location">{hero.location}</p>
        <p className="hero-intro">{hero.intro}</p>
        <button type="button" className="btn btn--outline btn--shadow" onClick={downloadCv}>
          <DownloadIcon size={16} /> Download CV
        </button>
      </div>
      <ProfileCard />
      <HeroEditor open={editing} onClose={() => setEditing(false)} />
    </section>
  );
}

function ProfileCard() {
  const { content } = useStore();
  const { profile } = content;
  const [editing, setEditing] = useState(false);

  return (
    <aside className="profile-card editable">
      <EditButton onClick={() => setEditing(true)} />
      <div className="profile-photo">
        <img src={profile.imageUrl || PORTRAIT_PLACEHOLDER} alt="Portrait of Dat Lam" />
      </div>
      <p className="profile-contact-label">{profile.contactLabel}</p>
      <div className="profile-contacts">
        <SocialLink field="email" className="contact-chip" showLabel>
          <MailIcon size={15} />
        </SocialLink>
        <SocialLink field="github" className="contact-chip" showLabel>
          <GithubIcon size={15} />
        </SocialLink>
        <SocialLink field="linkedin" className="contact-chip" showLabel>
          <LinkedinIcon size={15} />
        </SocialLink>
      </div>
      <ProfileEditor open={editing} onClose={() => setEditing(false)} />
    </aside>
  );
}
