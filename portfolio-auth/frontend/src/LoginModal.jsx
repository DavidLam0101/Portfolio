import { useState } from 'react';
import { useAuth } from './AuthContext';

function LoginModal({ onClose }) {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await login(username, password);
        setLoading(false);
        if (result.success) {
            onClose();
        } else {
            setError(result.error || 'Login failed');
        }
    };

    return (
        <div style={overlay}>
            <div style={modal}>
                <button onClick={onClose} style={closeBtn} aria-label="Close">✕</button>
                <h2 style={{ marginBottom: '1.5rem', color: '#e2e8f0' }}>Admin Login</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        style={inputStyle}
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        autoFocus
                    />
                    <input
                        style={inputStyle}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    {error && <p style={{ color: '#fc8181', margin: 0 }}>{error}</p>}
                    <button style={submitBtn} type="submit" disabled={loading}>
                        {loading ? 'Logging in…' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

const overlay = {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
};
const modal = {
    background: '#1a202c', border: '1px solid #2d3748', borderRadius: '12px',
    padding: '2rem', width: '340px', position: 'relative'
};
const closeBtn = {
    position: 'absolute', top: '0.75rem', right: '0.75rem',
    background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer', fontSize: '1rem'
};
const inputStyle = {
    padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid #4a5568',
    background: '#2d3748', color: '#e2e8f0', fontSize: '1rem', outline: 'none'
};
const submitBtn = {
    padding: '0.7rem', borderRadius: '8px', border: 'none',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff', fontWeight: 600, fontSize: '1rem', cursor: 'pointer'
};

export default LoginModal;
