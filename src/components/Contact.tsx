import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { toHref } from '../lib/image';
import { useStore } from '../store';
import { ContactEditor } from './editors/ContactEditor';
import { EditButton } from './editors/FormBits';
import { GithubIcon, InstagramIcon, LinkedinIcon, MailIcon } from './Icons';
import { SocialLink } from './SocialLink';

export function Contact() {
  const { content } = useStore();
  const { contact, links } = content;
  const [editing, setEditing] = useState(false);
  const revealRef = useReveal<HTMLDivElement>();

  return (
    <footer id="contact" className="contact">
      <div className="contact-inner editable" ref={revealRef}>
        <EditButton onClick={() => setEditing(true)} />
        <h2 className="contact-heading">{contact.heading}</h2>
        <p className="contact-sub">{contact.subheading}</p>
        {links.phone && (
          <p className="contact-phone">
            Phone: <a href={toHref(links.phone, 'phone')}>{links.phone}</a>
          </p>
        )}
        <div className="social-list">
          <SocialLink field="github" className="social-icon">
            <GithubIcon size={26} />
          </SocialLink>
          <SocialLink field="linkedin" className="social-icon">
            <LinkedinIcon size={24} />
          </SocialLink>
          <SocialLink field="instagram" className="social-icon">
            <InstagramIcon size={26} />
          </SocialLink>
          <SocialLink field="email" className="social-icon">
            <MailIcon size={26} />
          </SocialLink>
        </div>
        <p className="copyright">© {new Date().getFullYear()} Dat Lam</p>
      </div>
      <ContactEditor open={editing} onClose={() => setEditing(false)} />
    </footer>
  );
}
