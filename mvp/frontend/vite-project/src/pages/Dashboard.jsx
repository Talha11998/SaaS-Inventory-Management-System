import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Errors } from '../components';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    api.get('/dashboard').then(setData).catch((e) => setErrors(e.errors));
  }, []);

  if (errors.length) return <Errors errors={errors} />;
  if (!data) return <div className="empty">Loading…</div>;

  return (
    <>
      <h1>Dashboard</h1>
      <div className="cards">
        <div className="card stat"><div className="num">{data.totalProducts}</div><div className="label">Total products</div></div>
        <div className="card stat"><div className="num">{data.totalUnits}</div><div className="label">Total units on hand</div></div>
        <div className="card stat"><div className="num">{data.lowStock.length}</div><div className="label">Low stock items</div></div>
      </div>
      <div className="card">
        <h2>Low stock items</h2>
        {data.lowStock.length === 0 ? (
          <div className="empty">
            {data.totalProducts === 0 ? (
              <>No products yet. <Link to="/products/new">Add your first product</Link> to get started.</>
            ) : (
              'Nothing is running low.'
            )}
          </div>
        ) : (
          <table>
            <thead>
              <tr><th>Name</th><th>SKU</th><th className="num">Quantity on hand</th><th className="num">Low stock threshold</th></tr>
            </thead>
            <tbody>
              {data.lowStock.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td><td>{p.sku}</td>
                  <td className="num">{p.quantityOnHand}</td><td className="num">{p.threshold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}


// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { api } from '../api';
// import { Errors } from '../components';

// export default function Dashboard() {
//   const [data, setData] = useState(null);
//   const [errors, setErrors] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let active = true;

//     async function loadDashboard() {
//       try {
//         const result = await api.get('/dashboard');
//         console.log('Dashboard data:', result);

//         if (active) {
//           setData(result);
//           setErrors([]);
//         }
//       } catch (error) {
//         console.error('Dashboard request failed:', error);

//         if (active) {
//           setErrors(
//             error.errors || [error.message || 'Unable to load dashboard']
//           );
//         }
//       } finally {
//         if (active) setLoading(false);
//       }
//     }

//     loadDashboard();

//     return () => {
//       active = false;
//     };
//   }, []);

//   if (loading) return <div className="empty">Loading dashboard...</div>;

//   if (errors.length > 0) {
//     return (
//       <div className="card">
//         <h1>Dashboard could not load</h1>
//         <Errors errors={errors} />
//         <button onClick={() => window.location.reload()}>
//           Try again
//         </button>
//       </div>
//     );
//   }

//   if (!data) {
//     return <div className="empty">No dashboard data available.</div>;
//   }

//   const lowStock = data.lowStock || [];

//   return (
//     <>
//       <h1>Dashboard</h1>

//       <div className="cards">
//         <div className="card stat">
//           <div className="num">{data.totalProducts ?? 0}</div>
//           <div className="label">Total products</div>
//         </div>

//         <div className="card stat">
//           <div className="num">{data.totalUnits ?? 0}</div>
//           <div className="label">Total units on hand</div>
//         </div>

//         <div className="card stat">
//           <div className="num">{lowStock.length}</div>
//           <div className="label">Low stock items</div>
//         </div>
//       </div>

//       <div className="card">
//         <h2>Low stock items</h2>

//         {lowStock.length === 0 ? (
//           <div className="empty">
//             {data.totalProducts === 0 ? (
//               <>
//                 No products yet.{' '}
//                 <Link to="/products/new">Add your first product</Link>
//                 {' '}to get started.
//               </>
//             ) : (
//               'Nothing is running low.'
//             )}
//           </div>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>SKU</th>
//                 <th className="num">Quantity on hand</th>
//                 <th className="num">Low stock threshold</th>
//               </tr>
//             </thead>
//             <tbody>
//               {lowStock.map((p) => (
//                 <tr key={p.id}>
//                   <td>{p.name}</td>
//                   <td>{p.sku}</td>
//                   <td className="num">{p.quantity}</td>
//                   <td className="num">{p.threshold}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </>
//   );
// }

