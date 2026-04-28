import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import StockDetail from './pages/StockDetail';
import Academy from './pages/Academy';
import Simulator from './pages/Simulator';
import Mentorship from './pages/Mentorship';

import Signals from './pages/Signals';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
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
      </Routes>
    </BrowserRouter>
  );
}
