import React from 'react';
import { useTheme } from '@/components/ui/ThemeContext';
import { useNavigate } from 'react-router-dom'; // Importación modificada
import '@/css/theme.css';
import { GeneralDatas } from '@/components/ui/cards';
import { Efficiencyperhour, Downtimes } from '@/components/dashboard';
import { FiChevronDown, FiHome } from 'react-icons/fi';

export default function App() {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate(); // Hook añadido

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header-container">
        <button 
          className="home-button"
          onClick={() => navigate('/')} // Modificado aquí
          aria-label="Volver al inicio"
        >
          <h1 className="dashboard-title">FA-A</h1>
        </button>
        
        <button 
          onClick={toggleDarkMode}
          className={`dark-mode-toggle ${darkMode ? 'dark' : 'light'}`}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <>
              <span className="toggle-icon">☀️</span> Light Mode
            </>
          ) : (
            <>
              <span className="toggle-icon">🌙</span> Dark Mode
            </>
          )}
        </button>
      </div>
      
      <GeneralDatas />
      
      <div className="dashboard-subgrid">
        <Efficiencyperhour />
        <Downtimes />
      </div>
    </div>
  );
}