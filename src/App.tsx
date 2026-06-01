import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import StockDetail from './pages/StockDetail';
import Academy from './pages/Academy';
import Simulator from './pages/Simulator';
import Mentorship from './pages/Mentorship';

import Signals from './pages/Signals';
import Settings from './pages/Settings';
import GenericPage from './pages/GenericPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        <Route path="/about" element={<GenericPage title="Tentang Kami" />} />
        <Route path="/careers" element={<GenericPage title="Karir" />} />
        <Route path="/contact" element={<GenericPage title="Kontak" />} />
        <Route path="/privacy" element={<GenericPage title="Kebijakan Privasi" />} />
        <Route path="/risk" element={<GenericPage title="Edukasi Risiko" />} />
        <Route path="/terms" element={<GenericPage title="Syarat & Ketentuan" />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stock/:symbol" element={<StockDetail />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/signals" element={<Signals />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Catch all to dashboard for now */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
