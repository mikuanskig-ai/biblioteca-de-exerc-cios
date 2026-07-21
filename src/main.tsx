import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Silenciar erros benignos de WebSocket e HMR do Vite no ambiente de preview
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  if (
    reason &&
    (reason.message?.includes('WebSocket') ||
      reason.message?.includes('websocket') ||
      reason.message?.includes('HMR') ||
      String(reason).includes('WebSocket closed') ||
      String(reason).includes('websocket'))
  ) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  if (
    event.message?.includes('WebSocket') ||
    event.message?.includes('websocket') ||
    event.message?.includes('HMR') ||
    event.message?.includes('WebSocket closed')
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
