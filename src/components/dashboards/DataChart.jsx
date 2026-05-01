import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Enregistrer les composants de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DataChart = ({ 
  type = 'line',
  data,
  height = 300,
  options = {},
  title,
  showLegend = true
}) => {
  // Options par défaut
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
      },
      title: {
        display: !!title,
        text: title,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: type === 'line' || type === 'bar' ? {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    } : undefined,
    elements: {
      line: {
        tension: 0.3
      },
      point: {
        radius: 3,
        hoverRadius: 5
      }
    }
  };

  // Fusionner les options personnalisées
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...(options.plugins || {})
    }
  };

  // Données par défaut si aucune n'est fournie
  const defaultData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Données exemple',
        data: [12, 19, 3, 5, 2, 3, 9],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const chartData = data || defaultData;

  // Rendu conditionnel basé sur le type de graphique
  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={chartData} options={mergedOptions} />;
      case 'bar':
        return <Bar data={chartData} options={mergedOptions} />;
      case 'pie':
        return <Pie data={chartData} options={mergedOptions} />;
      default:
        return <Line data={chartData} options={mergedOptions} />;
    }
  };

  return (
    <div style={{ height: `${height}px` }} className="relative">
      {renderChart()}
      
      {!data && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-center p-4">
            <div className="text-gray-400 mb-2">Données de démonstration</div>
            <div className="text-sm text-gray-500">
              Les données réelles s'afficheront ici
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataChart;