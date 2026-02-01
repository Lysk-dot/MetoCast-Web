import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Handle GitHub Pages 404 redirect
const redirect = sessionStorage.getItem('redirect');
if (redirect) {
  sessionStorage.removeItem('redirect');
  // Remove o basename e redireciona para a rota correta
  const path = redirect.replace('/MetoCast-Web', '') || '/';
  window.history.replaceState(null, '', '/MetoCast-Web' + path);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
