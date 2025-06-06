import React, { useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { spendingParams, pieColors } from '@/database/financeData';
import { FiChevronDown } from 'react-icons/fi';

export const GeneralDatas = () => {
  const [activeGraph, setActiveGraph] = useState(null);

  const openModal = (graphType) => {
    setActiveGraph(graphType);
  };

  const closeModal = () => {
    setActiveGraph(null);
  };

  const renderGraph = () => {
    switch(activeGraph) {
      case 'efficiency':
        return (
          <PieChart width={600} height={400}>
            <Pie
              data={spendingParams}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
            >
              {spendingParams.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
          </PieChart>
        );
      case 'yield':
        return <div>Gráfica de Yield Rate</div>;
      case 'production':
        return <div>Gráfica de Production Summary</div>;
      case 'uph':
        return <div>Gráfica de UPH</div>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="general-data-grid">
        <div className="rectangular-group">
          <button className="data-button rectangular" onClick={() => openModal('efficiency')}>
            <div className="button-content">
              <p className="text-gray">Efficiency</p>
              <h2 className="text-green">Testing</h2>
            </div>
            <FiChevronDown className="dropdown-icon" />
          </button>

          <button className="data-button rectangular" onClick={() => openModal('yield')}>
            <div className="button-content">
              <p className="text-gray">Yield Rate</p>
              <h2 className="text-red">Testing</h2>
            </div>
            <FiChevronDown className="dropdown-icon" />
          </button>
        </div>

        <button className="data-button" onClick={() => openModal('production')}>
          <div className="button-content">
            <p className="text-gray">Production Summary</p>
            <div className="text-bold">$1452.23</div>
          </div>
          <FiChevronDown className="dropdown-icon" />
        </button>

        <button className="data-button" onClick={() => openModal('uph')}>
          <div className="button-content">
            <p className="text-gray mb">Cumulative Production & UPH</p>
            <div className="pie-container">
              <PieChart width={150} height={150}>
                <Pie
                  data={spendingParams}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={50}
                  fill="#8884d8"
                >
                  {spendingParams.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </div>
          <FiChevronDown className="dropdown-icon" />
        </button>
      </div>

      <div className={`graph-modal ${activeGraph ? 'active' : ''}`}>
        <div className="modal-content">
          <button className="close-modal" onClick={closeModal}>×</button>
          <div className="modal-graph-container">
            {renderGraph()}
          </div>
        </div>
      </div>
    </>
  );
};