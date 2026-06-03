import { useState, useEffect } from 'react';
import NavBar from './NavBar.jsx';
import Introduction from './Introduction.jsx';
import AboutMe from './AboutMe.jsx';
import Projects from './Project.jsx';
import Contact from './Contact.jsx';
import AdminPanel from './AdminPanel.jsx';
import { AuthProvider, useAuth } from './AuthContext.jsx';

function PortfolioApp() {
  const { isAdmin } = useAuth();
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetch('https://portfoliobackend-production-526d.up.railway.app/api/content')
      .then(r => r.json())
      .then(setContent)
      .catch(() => setContent(null));
  }, []);

  return (
    <>
      <NavBar />
      <section id="Home" className="sectionHome" style={{ scrollMarginTop: '100px' }}>
        <Introduction dynamicContent={content} />
      </section>
      <section id="AboutMe" className="sectionAboutMe" style={{ scrollMarginTop: '100px' }}>
        <AboutMe dynamicContent={content} />
      </section>
      <section id="Project" className="sectionProject" style={{ scrollMarginTop: '100px' }}>
        <Projects dynamicContent={content} />
      </section>
      <section id="Contact" className="sectionContact">
        <Contact />
      </section>
      {isAdmin && content && <AdminPanel content={content} onSave={setContent} />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <PortfolioApp />
    </AuthProvider>
  );
}

export default App;