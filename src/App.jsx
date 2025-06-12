import React, { useState, useEffect } from 'react';
import './css/app.css';
import data from './database/datas_testing';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

function App() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [containerHeight, setContainerHeight] = useState('100vh');

  useEffect(() => {
    // Ajustar altura para evitar scroll en TV
    function handleResize() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      setContainerHeight(`${window.innerHeight}px`);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCardClick = (index) => {
    setSelectedCard(index);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  return (
    <div className="dashboard" style={{ height: containerHeight }}>
      <header className="dashboard-header">
        <div className="line-title">FA</div>
        <div className="downtime-alert">⚠️ High downtime detected</div>
        <div className="shift-info">Shift 1</div>
        <div className="time">10:32</div>
      </header>
      
      <main className="dashboard-grid">
        {data.map((item, index) => (
          <button
            key={index}
            className={`card-button ${item.trend}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-title">{item.title}</div>
            <div className={`card-value ${item.trend}`}>{item.value}</div>
            {item.chartType === 'bar' && (
              <div className="mini-chart">
                <ResponsiveContainer width="100%" height={40}>
                  <BarChart data={item.chartData}>
                    <Bar dataKey="value" fill="#4361ee" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {item.chartType === 'line' && (
              <div className="mini-chart">
                <ResponsiveContainer width="100%" height={40}>
                  <LineChart data={item.chartData}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#4361ee" 
                      strokeWidth={2} 
                      dot={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            {item.chartType === 'circle' && (
              <div className="circle">{item.value}</div>
            )}
          </button>
        ))}
      </main>

      {selectedCard !== null && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>×</button>
            <h2>{data[selectedCard].title}</h2>
            <p>{data[selectedCard].detail}</p>
            <div className="full-chart">
              <ResponsiveContainer width="100%" height={250}>
                {data[selectedCard].chartType === 'bar' ? (
                  <BarChart data={data[selectedCard].chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4361ee" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : data[selectedCard].chartType === 'line' ? (
                  <LineChart data={data[selectedCard].chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#4361ee" 
                      strokeWidth={2} 
                      dot={{ r: 3 }} 
                    />
                  </LineChart>
                ) : (
                  <div className="circle-large">{data[selectedCard].value}</div>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;