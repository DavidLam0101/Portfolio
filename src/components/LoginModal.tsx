import { useState, type FormEvent } from 'react';
import { backend, errorMessage } from '../lib/backend';
import { useStore } from '../store';
import { EyeIcon, EyeOffIcon } from './Icons';
import { Modal } from './Modal';

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const close = () => {
    setMode('login');
    onClose();
  };
  return (
    <Modal open={open} title={mode === 'login' ? 'Admin login' : 'Reset password'} onClose={close}>
      {mode === 'login' ? (
        <LoginForm onDone={close} onForgot={() => setMode('forgot')} />
      ) : (
        <ForgotForm onBack={() => setMode('login')} />
      )}
    </Modal>
  );
}

function LoginForm({ onDone, onForgot }: { onDone: () => void; onForgot: () => void }) {
  const { notify } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await backend.signIn(email.trim(), password);
      notify('Welcome back — admin mode is on');
      onDone();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form login-form" onSubmit={onSubmit}>
      <label className="field">
        <span className="field-label">Email</span>
        <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="field">
        <span className="field-label">Password</span>
        <span className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="icon-btn"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
        </span>
      </label>
      <button type="button" className="link-btn forgot-link" onClick={onForgot}>
        Forgot password?
      </button>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn--solid btn--block" disabled={busy}>
        {busy ? 'Logging in…' : 'Log in'}
      </button>
      {backend.demoCredentials && (
        <p className="demo-hint">
          Demo mode: log in with <code>{backend.demoCredentials.email}</code> / <code>{backend.demoCredentials.password}</code>.
          Connect Supabase to use your real account.
        </p>
      )}
    </form>
  );
}

function ForgotForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      await backend.sendPasswordReset(email.trim());
      setStatus({ kind: 'ok', text: 'If that email belongs to the admin account, a reset link is on its way.' });
    } catch (err) {
      setStatus({ kind: 'error', text: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form login-form" onSubmit={onSubmit}>
      <p className="muted">Enter your admin email and we'll send you a link to set a new password.</p>
      <label className="field">
        <span className="field-label">Email</span>
        <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      {status && (
        <p className={status.kind === 'ok' ? 'form-success' : 'form-error'} role="status">
          {status.text}
        </p>
      )}
      <button type="submit" className="btn btn--solid btn--block" disabled={busy}>
        {busy ? 'Sending…' : 'Send reset link'}
      </button>
      <button type="button" className="link-btn" onClick={onBack}>
        ← Back to login
      </button>
    </form>
  );
}
