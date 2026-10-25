import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Errors, Field } from '../Components';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setErrors([]);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrors(err.errors || ['Login failed.']);
      setBusy(false);
    }
  }

  return (
    <main className="auth">
      <div className="brand">StockFlow</div>
      <div className="card">
        <h1>Log in</h1>
        <Errors errors={errors} />
        <form onSubmit={onSubmit}>
          <Field id="email" label="Email">
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </Field>
          <Field id="password" label="Password">
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          <button className="btn" type="submit" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        </form>
        <p className="hint">No account? <Link to="/signup">Sign up</Link></p>
      </div>
    </main>
  );
}
