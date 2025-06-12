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
  CartesianGrid,
  Legend
} from 'recharts';

function App() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [containerHeight, setContainerHeight] = useState('100vh');
  const [theme, setTheme] = useState('light');
  const [alertPulse, setAlertPulse] = useState(false);

  useEffect(() => {
    function handleResize() {
      setContainerHeight(`${window.innerHeight}px`);
    }

    const alertInterval = setInterval(() => {
      setAlertPulse(true);
      setTimeout(() => setAlertPulse(false), 1000);
    }, 5000);

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(alertInterval);
    };
  }, []);

  // Efecto para forzar redibujado de gráficas después de montar el componente
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = (index) => {
    setSelectedCard(index);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const renderTooltip = (props) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div className={`custom-tooltip ${theme}`}>
          <p className="tooltip-label">{label || 'Hora actual'}</p>
          <p className="tooltip-value">{`${payload[0].value} ${payload[0].name === 'Piezas por hora' ? 'piezas' : '%'}`}</p>
        </div>
      );
    }
    return null;
  };

  // Colores dinámicos según el tema
  const chartColor = theme === 'light' ? '#4361ee' : '#4cc9f0';
  const backgroundColor = theme === 'light' ? '#f5f7fa' : '#121212';
  const cardBackground = theme === 'light' ? '#ffffff' : '#1e1e1e';
  const textColor = theme === 'light' ? '#212529' : '#e9ecef';

  return (
    <div className={`dashboard ${theme}`} style={{ 
      height: containerHeight,
      backgroundColor: backgroundColor,
      color: textColor
    }}>
      <header className={`dashboard-header ${theme}`} style={{ backgroundColor: cardBackground }}>
        <div className="line-title">FA</div>
        <div className={`downtime-alert ${alertPulse ? 'pulse' : ''} ${theme}`}>
          ⚠️ High downtime detected
        </div>
        <div className="header-right">
          <div className={`shift-info ${theme}`}>Shift 1</div>
          <div className={`time ${theme}`}>10:32</div>
          <button className={`theme-toggle ${theme}`} onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>
      
      <main className="dashboard-grid">
        {data.map((item, index) => (
          <button
            key={index}
            className={`card-button ${item.trend} ${theme}`}
            onClick={() => handleCardClick(index)}
            style={{ backgroundColor: cardBackground }}
          >
            <div className="card-title">{item.title}</div>
            <div className={`card-value ${item.trend}`}>{item.value}</div>
            
            {item.chartType === 'bar' && item.chartData?.length > 0 && (
              <div className={`mini-chart ${theme}`} key={`mini-bar-${index}-${theme}`}>
                <ResponsiveContainer width="100%" height={60}>
                  <BarChart 
                    data={item.chartData} 
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="2 2" stroke={theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10, fill: textColor }}
                      tickMargin={5}
                      height={15}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: textColor }}
                      tickMargin={5}
                      width={25}
                    />
                    <Bar 
                      dataKey="value" 
                      fill={chartColor} 
                      radius={[4, 4, 0, 0]} 
                      name="Piezas"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {item.chartType === 'line' && item.chartData?.length > 0 && (
              <div className={`mini-chart ${theme}`} key={`mini-line-${index}-${theme}`}>
                <ResponsiveContainer width="100%" height={60}>
                  <LineChart 
                    data={item.chartData} 
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="2 2" stroke={theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10, fill: textColor }}
                      tickMargin={5}
                      height={15}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: textColor }}
                      tickMargin={5}
                      width={25}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={chartColor} 
                      strokeWidth={2} 
                      dot={false}
                      name="Piezas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {item.chartType === 'circle' && (
              <div className="circle" style={{ 
                background: `conic-gradient(${chartColor} 0% ${parseFloat(item.value)}%, ${theme === 'light' ? '#e9ecef' : '#333'} ${parseFloat(item.value)}% 100%)`,
                color: chartColor
              }}>
                {item.value.split(' ')[0]}
              </div>
            )}
          </button>
        ))}
      </main>

      {selectedCard !== null && (
        <div className="modal-overlay" onClick={closeModal}>
          <div 
            className={`modal-content ${theme}`} 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              backgroundColor: cardBackground,
              color: textColor
            }}
          >
            <button 
              className={`close-button ${theme}`} 
              onClick={closeModal}
            >
              ×
            </button>
            <h2>{data[selectedCard].title}</h2>
            <p>{data[selectedCard].detail}</p>
            
            <div className={`full-chart-container ${theme}`}>
              <div className="full-chart">
                <ResponsiveContainer width="100%" height="100%">
                  {data[selectedCard].chartType === 'bar' ? (
                    <BarChart 
                      data={data[selectedCard].chartData}
                      key={`modal-bar-${selectedCard}-${theme}`}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'} />
                      <XAxis 
                        dataKey="name" 
                        label={{ value: 'Horas', position: 'insideBottomRight', offset: -5, fill: textColor }}
                        tick={{ fontSize: 12, fill: textColor }}
                      />
                      <YAxis 
                        label={{ value: 'Piezas', angle: -90, position: 'insideLeft', fill: textColor }} 
                        tick={{ fontSize: 12, fill: textColor }}
                      />
                      <Tooltip content={renderTooltip} />
                      <Legend wrapperStyle={{ color: textColor }} />
                      <Bar 
                        dataKey="value" 
                        fill={chartColor} 
                        radius={[4, 4, 0, 0]} 
                        name="Piezas por hora"
                      />
                    </BarChart>
                  ) : data[selectedCard].chartType === 'line' ? (
                    <LineChart 
                      data={data[selectedCard].chartData}
                      key={`modal-line-${selectedCard}-${theme}`}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'} />
                      <XAxis 
                        dataKey="name" 
                        label={{ value: 'Horas', position: 'insideBottomRight', offset: -5, fill: textColor }}
                        tick={{ fontSize: 12, fill: textColor }}
                      />
                      <YAxis 
                        label={{ value: 'Piezas', angle: -90, position: 'insideLeft', fill: textColor }} 
                        tick={{ fontSize: 12, fill: textColor }}
                      />
                      <Tooltip content={renderTooltip} />
                      <Legend wrapperStyle={{ color: textColor }} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={chartColor} 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }}
                        name="Piezas por hora"
                      />
                    </LineChart>
                  ) : (
                    <div className="circle-large-container">
                      <div 
                        className="circle-large" 
                        style={{ 
                          background: `conic-gradient(${chartColor} 0% ${parseFloat(data[selectedCard].value)}%, ${theme === 'light' ? '#e9ecef' : '#333'} ${parseFloat(data[selectedCard].value)}% 100%)`,
                          color: chartColor
                        }}
                      >
                        {data[selectedCard].value.split(' ')[0]}
                      </div>
                      <div className={`circle-label ${theme}`}>Eficiencia General (OEE)</div>
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;