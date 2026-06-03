import { useState } from 'react';
import { useAuth } from './AuthContext';


function AdminPanel({ content, onSave }) {
    const { logout, token } = useAuth();
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState(content);
    const [status, setStatus] = useState('');

    const handleSave = async () => {
        setSaving(true);
        setStatus('');
        try {
            const res = await fetch('https://portfoliobackend-production-526d.up.railway.app/api/admin/content', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                const updated = await res.json();
                onSave(updated);
                setStatus('✅ Saved!');
            } else {
                setStatus('❌ Save failed');
            }
        } catch {
            setStatus('❌ Network error');
        }
        setSaving(false);
    };

    const updateProject = (idx, field, value) => {
        setForm(f => ({
            ...f,
            projects: f.projects.map((p, i) =>
                i === idx ? { ...p, [field]: value } : p
            )
        }));
    };

    const updateProjectTags = (idx, val) => {
        updateProject(idx, 'tags', val.split(',').map(t => t.trim()).filter(Boolean));
    };

    const addProject = () => {
    setForm(f => ({
        ...f,
            projects: [...f.projects, {
                id: Date.now(),
                title: 'New Project',
                description: 'Project description here',
                imageUrl: '',
                tags: [],
                link: ''
            }]
        }));
    };

    const deleteProject = (idx) => {
        setForm(f => ({
            ...f,
            projects: f.projects.filter((_, i) => i !== idx)
        }));
    };

    const moveProject = (idx, dir) => {
        setForm(f => {
            const projects = [...f.projects];
            const target = idx + dir;
            if (target < 0 || target >= projects.length) return f;
            [projects[idx], projects[target]] = [projects[target], projects[idx]];
            return { ...f, projects };
        });
    };

    const SmallBtn = ({ onClick, disabled, danger, children }) => (
        <button onClick={onClick} disabled={disabled}
            style={{ padding: '0.2rem 0.45rem', borderRadius: '4px', border: 'none',
                cursor: disabled ? 'default' : 'pointer',
                background: danger ? '#e53e3e' : '#4a5568',
                color: '#fff', fontSize: '0.75rem', opacity: disabled ? 0.4 : 1 }}>
            {children}
        </button>
    );

    const addBtn = {
        width: '100%', padding: '0.6rem', borderRadius: '8px',
        border: '2px dashed #4a5568', background: 'transparent',
        color: '#a0aec0', cursor: 'pointer', fontSize: '0.9rem',
        fontWeight: 600, marginTop: '0.25rem'
    };

    if (!open) {
        return (
            <button onClick={() => setOpen(true)} style={fab} title="Edit portfolio">
                ✏️ Edit
            </button>
        );
    }

    return (
        <div style={panel}>
            <div style={panelHeader}>
                <span style={{ fontWeight: 700, color: '#e2e8f0' }}>Admin Panel</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setOpen(false)} style={iconBtn}>✕</button>
                    <button onClick={logout} style={{ ...iconBtn, background: '#e53e3e' }}>Logout</button>
                </div>
            </div>

            <div style={scrollArea}>
                <Section title="Introduction">
                    <Label>Job Title</Label>
                    <Input value={form.jobTitle}
                        onChange={v => setForm(f => ({ ...f, jobTitle: v }))} />
                    <Label>Location</Label>
                    <Input value={form.location}
                        onChange={v => setForm(f => ({ ...f, location: v }))} />
                </Section>

                <Section title="About Me">
                    <Label>Bio Text</Label>
                    <Textarea value={form.aboutMeText}
                        onChange={v => setForm(f => ({ ...f, aboutMeText: v }))} />
                </Section>

                <Section title="Projects">
                    {form.projects.map((p, i) => (
                        <div key={p.id} style={projectBox}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#a0aec0', fontSize: '0.8rem', fontWeight: 600 }}>Card {i + 1}</span>
                                <div style={{ display: 'flex', gap: '0.3rem' }}>
                                    <SmallBtn onClick={() => moveProject(i, -1)} disabled={i === 0}>↑</SmallBtn>
                                    <SmallBtn onClick={() => moveProject(i, 1)} disabled={i === form.projects.length - 1}>↓</SmallBtn>
                                    <SmallBtn onClick={() => deleteProject(i)} danger>✕</SmallBtn>
                                </div>
                            </div>
                            <Label>Title</Label>
                            <Input value={p.title} onChange={v => updateProject(i, 'title', v)} />
                            <Label>Description</Label>
                            <Textarea value={p.description} onChange={v => updateProject(i, 'description', v)} />
                            <Label>Tags (comma-separated)</Label>
                            <Input value={p.tags.join(', ')} onChange={v => updateProjectTags(i, v)} />
                            <Label>Link URL</Label>
                            <Input value={p.link} onChange={v => updateProject(i, 'link', v)} />
                            <Label>Image URL (optional)</Label>
                            <Input value={p.imageUrl || ''} onChange={v => updateProject(i, 'imageUrl', v)} placeholder="Leave empty for default" />
                        </div>
                    ))}
                    <button onClick={addProject} style={addBtn}>+ Add Project Card</button>
                </Section>
            </div>

            <div style={footer}>
                {status && <span style={{ color: status.startsWith('✅') ? '#68d391' : '#fc8181' }}>{status}</span>}
                <button onClick={handleSave} disabled={saving} style={saveBtn}>
                    {saving ? 'Saving…' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}


const Section = ({ title, children }) => (
    <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ color: '#a0aec0', fontSize: '0.75rem', textTransform: 'uppercase',
            letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{title}</h4>
        {children}
    </div>
);
const Label = ({ children }) => (
    <p style={{ color: '#718096', fontSize: '0.8rem', margin: '0.4rem 0 0.15rem' }}>{children}</p>
);
const Input = ({ value, onChange }) => (
    <input value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '0.45rem 0.6rem', borderRadius: '6px',
            border: '1px solid #4a5568', background: '#2d3748', color: '#e2e8f0',
            fontSize: '0.85rem', boxSizing: 'border-box' }} />
);
const Textarea = ({ value, onChange }) => (
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
        style={{ width: '100%', padding: '0.45rem 0.6rem', borderRadius: '6px',
            border: '1px solid #4a5568', background: '#2d3748', color: '#e2e8f0',
            fontSize: '0.85rem', resize: 'vertical', boxSizing: 'border-box' }} />
);


const fab = {
    position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9000,
    padding: '0.6rem 1.1rem', borderRadius: '999px', border: 'none',
    background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff',
    fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
};
const panel = {
    position: 'fixed', top: 0, right: 0, bottom: 0, width: '320px', zIndex: 9000,
    background: '#1a202c', borderLeft: '1px solid #2d3748',
    display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 20px rgba(0,0,0,0.5)'
};
const panelHeader = {
    padding: '1rem', borderBottom: '1px solid #2d3748',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
};
const scrollArea = { flex: 1, overflowY: 'auto', padding: '1rem' };
const footer = {
    padding: '0.75rem 1rem', borderTop: '1px solid #2d3748',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem'
};
const iconBtn = {
    padding: '0.3rem 0.6rem', borderRadius: '6px', border: 'none',
    background: '#4a5568', color: '#fff', cursor: 'pointer', fontSize: '0.8rem'
};
const saveBtn = {
    padding: '0.55rem 1.2rem', borderRadius: '8px', border: 'none',
    background: 'linear-gradient(135deg,#667eea,#764ba2)',
    color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'
};
const projectBox = {
    border: '1px solid #2d3748', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem'
};


export default AdminPanel;
