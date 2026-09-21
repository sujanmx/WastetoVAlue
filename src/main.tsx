import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { CHUNK_RELOAD_STORAGE_KEY, CHUNK_RELOAD_COOLDOWN_MS } from './components/feedback/ErrorBoundary';
import './styles/globals.css';

// Handle dynamic chunk import failures gracefully (e.g. after a new production deployment)
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    try {
      const lastReload = window.sessionStorage.getItem(CHUNK_RELOAD_STORAGE_KEY);
      const now = Date.now();

      if (!lastReload || now - parseInt(lastReload, 10) > CHUNK_RELOAD_COOLDOWN_MS) {
        window.sessionStorage.setItem(CHUNK_RELOAD_STORAGE_KEY, String(now));
        // Prevent default browser unhandled rejection noise and reload to fetch fresh index.html & chunks
        event.preventDefault();
        window.location.reload();
      }
    } catch {
      // Fall back gracefully if sessionStorage is restricted
    }
  });
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found in index.html');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
