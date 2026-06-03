import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('portfolio_token'));
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (token) {
    
            fetch('https://portfoliobackend-production-526d.up.railway.app/api/auth/verify', {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(r => r.json())
            .then(data => setIsAdmin(data.valid === true))
            .catch(() => { logout(); });
        }
    }, [token]);

    const login = async (username, password) => {
        const res = await fetch('https://portfoliobackend-production-526d.up.railway.app/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('portfolio_token', data.token);
            setToken(data.token);
            setIsAdmin(true);
            return { success: true };
        }
        return { success: false, error: data.error };
    };

    const logout = () => {
        localStorage.removeItem('portfolio_token');
        setToken(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isAdmin, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
