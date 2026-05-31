import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { UserProvider } from './context/UserContext.tsx';
import { TradingProvider } from './context/TradingContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <TradingProvider>
        <App />
      </TradingProvider>
    </UserProvider>
  </StrictMode>,
);
