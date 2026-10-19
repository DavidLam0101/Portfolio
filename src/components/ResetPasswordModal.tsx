import { useState, type FormEvent } from 'react';
import { backend, errorMessage } from '../lib/backend';
import { useStore } from '../store';
import { Modal } from './Modal';

/** Shown after following a password-reset email link. */
export function ResetPasswordModal() {
  const { recovering, finishRecovery, notify } = useStore();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setError('Use at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setBusy(true);
    setError('');
    try {
      await backend.updatePassword(password);
      notify('Password updated — you are logged in');
      finishRecovery();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={recovering} title="Set a new password" onClose={finishRecovery}>
      <form className="form login-form" onSubmit={onSubmit}>
        <label className="field">
          <span className="field-label">New password</span>
          <input type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Confirm password</span>
          <input type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn--solid btn--block" disabled={busy}>
          {busy ? 'Saving…' : 'Update password'}
        </button>
      </form>
    </Modal>
  );
}
