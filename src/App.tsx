import { About } from './components/About';
import { Contact } from './components/Contact';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Projects } from './components/Projects';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { LinkUnavailableModal } from './components/SocialLink';
import { backend } from './lib/backend';
import { StoreProvider, useStore } from './store';

function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.kind}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

function AdminBar() {
  const { isAdmin } = useStore();
  if (!isAdmin) return null;
  return (
    <div className="admin-bar">
      Admin mode — use the <strong>Edit</strong> buttons on each section.
      {backend.mode === 'local' && ' (Demo: changes are saved in this browser only.)'}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Navbar />
      <AdminBar />
      <main>
        <Hero />
        <hr className="divider" />
        <About />
        <hr className="divider" />
        <Projects />
      </main>
      <Contact />
      <ResetPasswordModal />
      <LinkUnavailableModal />
      <Toasts />
    </StoreProvider>
  );
}
