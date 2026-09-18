import { useState } from 'react';

function AuthPanel({ enabled, user, error, onSignIn, onSignUp, onSignOut }) {
  const [mode, setMode] = useState('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (user) {
    return (
      <div className="auth-panel">
        <span className="auth-status">Synced as {user.email}</span>
        <button type="button" className="secondary-btn" onClick={onSignOut}>Sign out</button>
      </div>
    );
  }

  if (!enabled) {
    return <span className="auth-status">Local mode</span>;
  }

  const submit = (event) => {
    event.preventDefault();
    const action = mode === 'signIn' ? onSignIn : onSignUp;
    action(email, password);
  };

  return (
    <details className="auth-menu">
      <summary>{mode === 'signIn' ? 'Sign in' : 'Create account'}</summary>
      <form className="auth-form" onSubmit={submit}>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" minLength="6" required />
        <button type="submit" className="primary-btn">{mode === 'signIn' ? 'Sign in' : 'Create account'}</button>
        <button type="button" className="link-btn" onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}>
          {mode === 'signIn' ? 'Create an account' : 'Already have an account?'}
        </button>
        {error ? <span className="auth-error">{error}</span> : null}
      </form>
    </details>
  );
}

export default AuthPanel;
