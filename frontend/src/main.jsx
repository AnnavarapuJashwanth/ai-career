import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Suppress harmless Material-UI prop-types warning
const originalError = console.error;
console.error = function(...args) {
  if (args[0]?.includes?.('ForwardRef(SvgIcon')) {
    return;
  }
  originalError.apply(console, args);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
