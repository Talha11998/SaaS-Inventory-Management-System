import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Errors, Flash } from '../Components';

function AdjustControl({ product, onAdjust }) {
  const [delta, setDelta] = useState('');
  return (
    <form
      className="adjust"
      onSubmit={(e) => {
        e.preventDefault();
        onAdjust(product, delta).then((ok) => ok && setDelta(''));
      }}
    >
      <input type="number" step="1" placeholder="+/-" aria-label={`Adjust stock for ${product.name}`} value={delta} onChange={(e) => setDelta(e.target.value)} />
      <button className="btn secondary small" type="submit">Adjust</button>
    </form>
  );
}

export default function Products() {
  const [products, setProducts] = useState(null);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState([]);
  const [flash, setFlash] = useState('');

  const load = useCallback(() => {
    api
      .get(`/products${search ? `?q=${encodeURIComponent(search)}` : ''}`)
      .then((d) => setProducts(d.products))
      .catch((e) => setErrors(e.errors));
  }, [search]);

  useEffect(load, [load]);

  async function adjust(product, delta) {
    setErrors([]);
    setFlash('');
    try {
      const { product: updated } = await api.post(`/products/${product.id}/adjust`, { delta: Number(delta) });
      setProducts((list) => list.map((p) => (p.id === updated.id ? updated : p)));
      console.log("quantity",updated.quantity,updated,updated.quantityOnHand);
      setFlash(`Stock for ${updated.sku} is now ${updated.quantity}.`);
      return true;
    } catch (e) {
      setErrors(e.errors);
      return false;
    }
  }

  // async function remove(product) {
  //   if (!window.r(`Delete ${product.name}? This cannot be undone.`)) return;
  //   setErrors([]);
  //   try {
  //     await api.del(`/products/${product.id}`);
  //     setProducts((list) => list.filter((p) => p.id !== product.id));
  //     setFlash('Product deleted.');
  //   } catch (e) {
  //     setErrors(e.errors);
  //   }
  // }

  
const remove = async (product) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this product?'
  );

  if (!confirmed) return;

  try {
    await api.del(`/products/${product.id}`);

    // Remove the deleted product from the displayed list
    setProducts((current) =>
      current.filter((p) => p.id != product.id)
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    alert(error.message || 'Failed to delete product.');
  }
};


  return (
    <>
      <h1>Products</h1>
      <div className="toolbar">
        <form onSubmit={(e) => { e.preventDefault(); setSearch(query.trim()); }}>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or SKU" />
          <button className="btn secondary" type="submit">Search</button>
          {search && (
            <button className="btn secondary" type="button" onClick={() => { setQuery(''); setSearch(''); }}>Clear</button>
          )}
        </form>
        <Link className="btn" to="/products/new">Add product</Link>
      </div>
      <Flash message={flash} />
      <Errors errors={errors} />
      <div className="card">
        {!products ? (
          <div className="empty">Loading…</div>
        ) : products.length === 0 ? (
          <div className="empty">{search ? 'No products match your search.' : 'No products yet.'}</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th><th>SKU</th><th className="num">Quantity</th><th>Stock</th>
                <th className="num">Selling price</th><th />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td className="num">{p.quantityOnHand}</td>
                  <td>{p.isLow ? <span className="badge low">Low</span> : <span className="badge ok">OK</span>}</td>
                  <td className="num">{p.sellingPrice === null ? '—' : p.sellingPrice.toFixed(2)}</td>
                  <td className="actions">
                    <AdjustControl product={p} onAdjust={adjust} />{' '}
                    <Link className="btn secondary small" to={`/products/${p.id}/edit`}>Edit</Link>{' '}
                    <button className="btn danger small" onClick={() => remove(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
