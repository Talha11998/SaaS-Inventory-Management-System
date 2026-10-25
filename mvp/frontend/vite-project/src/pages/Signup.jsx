import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Errors, Field } from '../Components';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', organizationName: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setErrors([]);
    try {
      await signup(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrors(err.errors || ['Signup failed.']);
      setBusy(false);
    }
  }

  return (
    <main className="auth">
      <div className="brand">StockFlow</div>
      <div className="card">
        <h1>Create your account</h1>
        <Errors errors={errors} />
        <form onSubmit={onSubmit}>
          <Field id="email" label="Email">
            <input id="email" type="email" value={form.email} onChange={set('email')} required autoFocus />
          </Field>
          <Field id="org" label="Organization name">
            <input id="org" type="text" value={form.organizationName} onChange={set('organizationName')} placeholder="My Test Store" required />
          </Field>
          <Field id="password" label="Password" hint="(min 8 characters)">
            <input id="password" type="password" value={form.password} onChange={set('password')} minLength={8} required />
          </Field>
           <Field
            id="confirmPassword"
            label="Confirm password"
            hint="Re-enter your password"
          >
            <input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              minLength={8}
              required
            />
          </Field>
          <button className="btn" type="submit" disabled={busy}>{busy ? 'Creating…' : 'Sign up'}</button>
        </form>
        <p className="hint">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </main>
  );
}
