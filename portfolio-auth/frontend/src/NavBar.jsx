import { FiSun, FiMoon, FiLock, FiUnlock } from "react-icons/fi";
import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import LoginModal from './LoginModal';

function NavBar(){
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const [isDark, setIsDark] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const { isAdmin, logout } = useAuth();

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
    }, [isDark]);

    useEffect(() => {
        if (localStorage.getItem('theme') === 'dark') setIsDark(true);
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    return(        
        <nav className={isDark ? 'dark' : 'light'}>
            {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
            <div className="NavBar">
                <ul className="NavList">  
                    <li><a className={isDark ? 'darkNavSection' : 'lightNavSection'} onClick={() => scrollToSection('Home')}>Home</a></li>
                    <li><a className={isDark ? 'darkNavSection' : 'lightNavSection'} onClick={() => scrollToSection('AboutMe')}>About me</a></li>
                    <li><a className={isDark ? 'darkNavSection' : 'lightNavSection'} onClick={() => scrollToSection('Project')}>Project</a></li>
                    <li><a className={isDark ? 'darkNavSection' : 'lightNavSection'} onClick={() => scrollToSection('Contact')}>Contact</a></li>
                </ul>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button className = {isDark ? 'darkLock' : 'lightLock'}
                    onClick={isAdmin ? logout : () => setShowLogin(true)}
                    title={isAdmin ? 'Logout (admin)' : 'Admin login'}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: isAdmin ? '#68d391' : 'inherit',
                        fontSize: '1.1rem', padding: '0.4rem', borderRadius: '50%',
                        display: 'flex', alignItems: 'center'
                    }}
                    aria-label={isAdmin ? 'Logout' : 'Admin login'}
                >
                    {isAdmin ? <FiUnlock /> : <FiLock />}
                </button>
                <button 
                    className={isDark ? 'darkButton' : 'lightButton'} 
                    onClick={() => setIsDark(!isDark)}
                    aria-label="Toggle theme"
                >
                    {isDark ? <FiSun/> : <FiMoon/>}
                </button>
            </div>
        </nav>
    );
}

export default NavBar;