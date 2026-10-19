import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { backend, errorMessage } from '../lib/backend';
import { useStore } from '../store';
import { LogoutIcon, MenuIcon, MoonIcon, SunIcon, XIcon } from './Icons';
import { LoginModal } from './LoginModal';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Me' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar() {
  const { user, isAdmin, notify } = useStore();
  const [theme, toggleTheme] = useTheme();
  const [loginOpen, setLoginOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('home');
  const accountRef = useRef<HTMLDivElement>(null);

  // Highlight the link of the section currently in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!accountOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!accountRef.current?.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [accountOpen]);

  const logout = async () => {
    setAccountOpen(false);
    try {
      await backend.signOut();
      notify('Logged out');
    } catch (err) {
      notify(errorMessage(err), 'error');
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="account" ref={accountRef}>
          <button
            type="button"
            className="logo"
            onClick={() => (isAdmin ? setAccountOpen((o) => !o) : setLoginOpen(true))}
            aria-label={isAdmin ? 'Admin menu' : 'Admin login'}
            aria-expanded={isAdmin ? accountOpen : undefined}
          >
            Dat Lam
          </button>
          {isAdmin && <span className="admin-badge">Admin</span>}
          {accountOpen && (
            <div className="account-menu" role="menu">
              <p className="account-email">Signed in as {user?.email}</p>
              <button type="button" role="menuitem" onClick={logout}>
                <LogoutIcon size={16} /> Log out
              </button>
            </div>
          )}
        </div>

        <nav className={`nav-links${menuOpen ? ' is-open' : ''}`} aria-label="Sections">
          {LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? 'is-active' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="nav-tools">
          <button
            type="button"
            className={`theme-toggle${theme === 'dark' ? ' is-dark' : ''}`}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span className="theme-knob">{theme === 'dark' ? <MoonIcon size={13} /> : <SunIcon size={13} />}</span>
          </button>
          <button
            type="button"
            className="icon-btn menu-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
}
