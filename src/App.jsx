import React, { useState, useEffect, useRef } from 'react';
import './css/app.css';
import data from './database/datas_testing';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { fetchShiftData, fetchProductionData, updateLineSelection } from './database/apiService';

function App() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [containerHeight, setContainerHeight] = useState('100vh');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('dashboard-theme');
    return savedTheme || 'light';
  });
  const toggleMainLineDropdown = () => {
    setShowMainLineDropdown(!showMainLineDropdown);
    setShowSubLineDropdown(false);
  };
  const toggleSubLineDropdown  = () => {
    setShowSubLineDropdown(!showSubLineDropdown);
    setShowMainLineDropdown(false);
  }
  const [alertPulse, setAlertPulse] = useState(false);
  const [productionData, setProductionData] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [apiError, setApiError] = useState(null);
  const [selectedMainLine, setSelectedMainLine] = useState('FA');
  const [selectedSubLine, setSelectedSubLine] = useState('A');
  const [showMainLineDropdown, setShowMainLineDropdown] = useState(false);
  const [showSubLineDropdown, setShowSubLineDropdown] = useState(false);
  const [shiftInfo, setShiftInfo] = useState({
    shift: '1',
    date: new Date().toLocaleDateString(),
    status: 'loading'
  });

  const timeoutRef = useRef(null);

  const lineOptions = {
    'FA': ['A', 'B', 'C', 'D'],
    'PAK': ['A', 'B', 'C', 'D'],
    'OFFLINE': ['A-1', 'A-2', 'C-1', 'C-2', 'C-3', 'C-4', 'C-5'],
    'Docking': ['A', 'B']
  };

  const checkAlertConditions = () => {
    const hasCriticalCards = data.some(item => item.trend === 'critical');
    const isCriticalShift = shiftInfo.shift === '3';
    const currentHour = currentTime.getHours();
    const isCriticalTime = currentHour >= 14 && currentHour < 15;
    
    return hasCriticalCards || isCriticalShift || isCriticalTime;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const loadProductionData = async (mainLine, subLine)=>{
    setIsLoading(true);
    try{
      const apiData = await fetchProductionData(mainLine, subLine);
      setProductionData(apiData);
      await updateLineSelection(mainLine, subLine);
      setApiError(null);
    } catch(error){
      console.error('Using local data due to API error: ', error);
      setProductionData(data);
      setApiError(`Error of connection: ${error.message}. Showing local datas`)
    } finally{setIsLoading(false);}
  }

  const handleMainLineSelect = async (line) => {
    const defaultSubLine = lineOptions[line][0];
    setSelectedMainLine(line);
    setSelectedSubLine(defaultSubLine);
    setShowMainLineDropdown(false);
    await loadProductionData(line, defaultSubLine);
  };

  const handleSubLineSelect = async (line) => {
    setSelectedSubLine(line);
    setShowSubLineDropdown(false);
    await loadProductionData(selectedMainLine, line);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('dashboard-theme', newTheme);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setShowAlert(checkAlertConditions());
    }, 1000);

    return () => clearInterval(timer);
  }, [shiftInfo.shift]);

  useEffect(() => {
    if (showAlert) {
      const interval = setInterval(() => {
        setAlertPulse(true);
        setTimeout(() => setAlertPulse(false), 1000);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [showAlert]);

  useEffect(() => {
    function handleResize() {
      setContainerHeight(`${window.innerHeight}px`);
    }
    const loadData = async () => {
      await loadProductionData('FA','A');
      try {
        timeoutRef.current = setTimeout(() => {
          setApiError('Error: Tiempo de espera agotado. No se pudo cargar la información.');
          setIsLoading(false);
          setShiftInfo(prev => ({
            ...prev,
            status: 'error',
            errorMessage: 'Timeout: El servidor no respondió'
          }));
        }, 15000);

        const shiftData = await fetchShiftData();
        
        clearTimeout(timeoutRef.current);
        
        setShiftInfo({
          shift: shiftData.shift,
          date: shiftData.date || new Date().toLocaleDateString(),
          status: shiftData.status
        });

        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        clearTimeout(timeoutRef.current);
        console.error('Error cargando datos:', error);
        setApiError(`Error de conexión: ${error.message}`);
        setShiftInfo(prev => ({
          ...prev,
          status: 'error',
          errorMessage: error.message
        }));
      } finally {
        setIsLoading(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    loadData();
    setShowAlert(checkAlertConditions());

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCardClick = (index) => {
    setSelectedCard(index);
  };

  const closeModal = () => {
    setSelectedCard(null);
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

  const chartColor = theme === 'light' ? '#4361ee' : '#4cc9f0';
  const backgroundColor = theme === 'light' ? '#f5f7fa' : '#121212';
  const cardBackground = theme === 'light' ? '#ffffff' : '#1e1e1e';
  const textColor = theme === 'light' ? '#212529' : '#e9ecef';

  if (isLoading) {
    return (
      <div className={`loading-screen ${theme}`}>
        <div className="loading-spinner"></div>
        <div className="loading-text">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className={`dashboard ${theme}`} style={{ 
      height: containerHeight,
      backgroundColor: backgroundColor,
      color: textColor
    }}>
      {apiError && (
        <div className={`api-error-banner ${theme}`}>
          {apiError} - Mostrando datos locales
        </div>
      )}
      
      <header className={`dashboard-header ${theme}`} style={{ backgroundColor: cardBackground }}>
        <div className="line-controls">
          <div className="line-selector-container main-line">
            <button 
              className={`main-line-selector ${theme}`}
              onClick={toggleMainLineDropdown}
            >
              {selectedMainLine}
            </button>
            {showMainLineDropdown && (
              <div className={`main-line-dropdown ${theme}`}>
                {Object.keys(lineOptions).map(line => (
                  <button 
                    key={line} 
                    onClick={() => handleMainLineSelect(line)}
                    className={selectedMainLine === line ? 'active' : ''}
                  >
                    {line}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="line-selector-container sub-line">
            <button 
              className={`sub-line-selector ${theme}`}
              onClick={toggleSubLineDropdown}
            >
              {selectedSubLine}
            </button>
            {showSubLineDropdown && (
              <div className={`sub-line-dropdown ${theme}`}>
                {lineOptions[selectedMainLine].map(line => (
                  <button 
                    key={line} 
                    onClick={() => handleSubLineSelect(line)}
                    className={selectedSubLine === line ? 'active' : ''}
                  >
                    {line}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {showAlert && (
          <div className={`downtime-alert ${alertPulse ? 'pulse' : ''} ${theme}`}>
            ⚠️ High downtime detected - {shiftInfo.date} {formatTime(currentTime)}
          </div>
        )}
        <div className="header-right">
          <div className={`shift-info ${theme}`}>Shift {shiftInfo.shift}</div>
          <div className={`time ${theme}`}>
            {shiftInfo.date} {formatTime(currentTime)}
          </div>
          <button className={`theme-toggle ${theme}`} onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>
      
      <main className="dashboard-grid">
        {productionData.map((item, index) => (
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