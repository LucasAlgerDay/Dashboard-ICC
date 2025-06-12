import { createRoot } from 'react-dom/client';
import ErrorBoundary from './ErrorBoundary';
import App from './App.jsx';
import { ThemeProvider } from '@/components/ui/ThemeContext';
import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ThemeProvider>
  <ErrorBoundary fallback={<h1>Algo salió mal</h1>}>
    <App />
  </ErrorBoundary>
  </ThemeProvider>
  </BrowserRouter>
);