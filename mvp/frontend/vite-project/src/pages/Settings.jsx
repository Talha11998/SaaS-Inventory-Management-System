import { useEffect, useState } from 'react';
import { api } from '../api';
import { Errors, Flash } from '../Components';

export default function Settings() {
  const [value, setValue] = useState(null);
  const [errors, setErrors] = useState([]);
  const [flash, setFlash] = useState('');

  useEffect(() => {
    api.get('/settings').then((d) => setValue(String(d.defaultLowStockThreshold))).catch((e) => setErrors(e.errors));
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setErrors([]);
    setFlash('');
    try {
      await api.put('/settings', { defaultLowStockThreshold: value === '' ? '' : Number(value) });
      setFlash('Settings saved.');
    } catch (err) {
      setErrors(err.errors);
    }
  }

  if (value === null && !errors.length) return <div className="empty">Loading…</div>;

  return (
    <>
      <h1>Settings</h1>
      <Flash message={flash} />
      <div className="card" style={{ maxWidth: 480 }}>
        <Errors errors={errors} />
        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="threshold">Default low stock threshold</label>
            <input id="threshold" type="number" min="0" step="1" value={value ?? ''} onChange={(e) => setValue(e.target.value)} required />
            <div className="hint">Used for any product that has no threshold of its own.</div>
          </div>
          <button className="btn" type="submit">Save</button>
        </form>
      </div>
    </>
  );
}
