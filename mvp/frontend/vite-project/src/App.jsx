import { Routes, Route, Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Settings from './pages/Settings';

function Layout() {
  const { user, logout } = useAuth();
  return (
    <>
      <nav>
        <NavLink className="brand" to="/dashboard">StockFlow</NavLink>
        <NavLink className="link" to="/dashboard">Dashboard</NavLink>
        <NavLink className="link" to="/products">Products</NavLink>
        <NavLink className="link" to="/settings">Settings</NavLink>
        <span className="spacer" />
        <span className="who">{user.organizationName} · {user.email}</span>
        <button className="btn secondary small" onClick={logout}>Log out</button>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}

function Protected() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <main><div className="empty">Loading…</div></main>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Layout />;
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
      <Route element={<Protected />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/products/:id/edit" element={<ProductForm />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
