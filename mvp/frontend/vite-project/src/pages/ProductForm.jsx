import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { Errors, Field } from '../components';

const EMPTY = { name: '', sku: '', description: '', quantity: '0', lowStockThreshold: '', costPrice: '', sellingPrice: '' };
const str = (v) => (v === null || v === undefined ? '' : String(v));

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/products/${id}`)
      .then(({ product: p }) =>
        setForm({
          name: p.name, sku: p.sku, description: str(p.description), quantityOnHand: str(p.quantityOnHand),
          lowStockThreshold: str(p.lowStockThreshold), costPrice: str(p.costPrice), sellingPrice: str(p.sellingPrice),
        })
      )
      .catch((e) => setErrors(e.errors))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setErrors([]);
    try {
      if (isEdit) await api.put(`/products/${id}`, form);
      else await api.post('/products', form);
      navigate('/products');
    } catch (err) {
      setErrors(err.errors);
      setBusy(false);
    }
  }

  if (loading) return <div className="empty">Loading…</div>;

  return (
    <>
      <h1>{isEdit ? 'Edit product' : 'Add product'}</h1>
      <div className="card">
        <Errors errors={errors} />
        <form onSubmit={onSubmit}>
          <div className="grid2">
            <Field id="name" label="Name *">
              <input id="name" type="text" value={form.name} onChange={set('name')} required autoFocus />
            </Field>
            <Field id="sku" label="SKU *">
              <input id="sku" type="text" value={form.sku} onChange={set('sku')} required />
            </Field>
          </div>
          <Field id="description" label="Description">
            <textarea id="description" rows={3} value={form.description} onChange={set('description')} />
          </Field>
          <div className="grid2">
            <Field id="quantity" label="Quantity on hand">
              <input id="quantity" type="number" min="0" step="1" value={form.quantityOnHand} onChange={set('quantityOnHand')} />
            </Field>
            <Field id="threshold" label="Low stock threshold" hint="(blank = org default)">
              <input id="threshold" type="number" min="0" step="1" value={form.lowStockThreshold} onChange={set('lowStockThreshold')} />
            </Field>
          </div>
          <div className="grid2">
            <Field id="cost" label="Cost price">
              <input id="cost" type="number" min="0" step="0.01" value={form.costPrice} onChange={set('costPrice')} />
            </Field>
            <Field id="sell" label="Selling price">
              <input id="sell" type="number" min="0" step="0.01" value={form.sellingPrice} onChange={set('sellingPrice')} />
            </Field>
          </div>
          <button className="btn" type="submit" disabled={busy}>{busy ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}</button>{' '}
          <Link className="btn secondary" to="/products">Cancel</Link>
        </form>
      </div>
    </>
  );
}
