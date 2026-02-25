import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import StockIn from './pages/StockIn';
import Sales from './pages/Sales';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Login from './pages/Login';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <LoadingSpinner />;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingSpinner />;

  return (
    <Router>
      <div className="min-h-screen pb-20 bg-slate-950 text-slate-100">
        {user && <Navbar />}
        <main className={user ? "max-w-7xl mx-auto py-8 px-4" : ""}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
            <Route path="/stock-in" element={<PrivateRoute><StockIn /></PrivateRoute>} />
            <Route path="/sales" element={<PrivateRoute><Sales /></PrivateRoute>} />
            <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
            <Route path="/customers/:id" element={<PrivateRoute><CustomerDetail /></PrivateRoute>} />
            <Route path="/payments" element={<PrivateRoute><Payments /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
