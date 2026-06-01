import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import './index.css';
import { UserProvider } from './context/UserContext.tsx';
import { TradingProvider } from './context/TradingContext.tsx';

// Ganti dengan Client ID dari Google Cloud Console
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserProvider>
        <TradingProvider>
          <App />
        </TradingProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
