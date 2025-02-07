import React, { useState } from 'react';
import { Algorithm } from '../types';
import { Line, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Brain, RefreshCw, Database, Sparkles, GitBranch } from 'lucide-react';
import clsx from 'clsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  algorithm: Algorithm;
  onUpdateEpochs: (id: string, epochs: number) => void;
  onChangeDataset: (id: string, datasetId: string) => void;
}

export const AlgorithmCard: React.FC<Props> = ({ 
  algorithm, 
  onUpdateEpochs,
  onChangeDataset
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const selectedDataset = algorithm.availableDatasets.find(d => d.id === algorithm.selectedDatasetId)!;

  const handleEpochChange = async (epochs: number) => {
    setIsLoading(true);
    await onUpdateEpochs(algorithm.id, epochs);
    setIsLoading(false);
  };

  const getAlgorithmIcon = () => {
    switch (algorithm.type) {
      case 'dimensionality':
        return <Sparkles className="w-6 h-6 text-purple-400" />;
      case 'classification':
        return <GitBranch className="w-6 h-6 text-green-400" />;
      default:
        return <Brain className="w-6 h-6 text-indigo-400" />;
    }
  };

  const getBackgroundGradient = () => {
    switch (algorithm.type) {
      case 'dimensionality':
        return 'bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-purple-900/50';
      case 'classification':
        return 'bg-gradient-to-br from-green-900/50 via-emerald-900/30 to-green-900/50';
      default:
        return 'bg-gradient-to-br from-indigo-900/50 via-blue-900/30 to-indigo-900/50';
    }
  };

  return (
    <div className={clsx(
      "rounded-xl shadow-xl p-6 space-y-6 border border-gray-700/50 backdrop-blur-sm",
      "hover:border-opacity-75 transition-all duration-300",
      getBackgroundGradient()
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gray-900/50 rounded-lg ring-2 ring-gray-700/50">
            {getAlgorithmIcon()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{algorithm.name}</h3>
            <p className="text-gray-400 capitalize">
              {algorithm.category} Learning - {algorithm.type}
            </p>
          </div>
        </div>
        <div className={clsx(
          "transition-opacity duration-300",
          isLoading ? "opacity-100" : "opacity-0"
        )}>
          <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-300">{algorithm.description}</p>
        
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-200">Dataset Selection</h4>
            <Database className="w-5 h-5 text-indigo-400" />
          </div>
          
          <div className="grid gap-4">
            <div className="flex space-x-2">
              {algorithm.availableDatasets.map((dataset) => (
                <button
                  key={dataset.id}
                  onClick={() => onChangeDataset(algorithm.id, dataset.id)}
                  className={clsx(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
                    dataset.id === algorithm.selectedDatasetId
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  )}
                >
                  {dataset.name}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Samples</p>
                <p className="font-medium text-gray-200">{selectedDataset.samples}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Source</p>
                <p className="font-medium text-gray-200">{selectedDataset.source}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-400">Features</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedDataset.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-1 bg-gray-800/50 text-gray-300 rounded-full text-xs border border-gray-700/50"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-200">Training Control</h4>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-400">Epochs:</label>
                <select
                  value={algorithm.currentEpochs}
                  onChange={(e) => handleEpochChange(Number(e.target.value))}
                  className="bg-gray-800 border border-gray-700 text-gray-300 rounded-md px-2 py-1 text-sm"
                >
                  {[5, 10, 20, 50, 100].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="h-64">
            {algorithm.visualization.type === 'scatter' ? (
              <Scatter
                data={algorithm.visualization.data}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                  },
                  scales: {
                    x: {
                      grid: {
                        color: 'rgba(75, 85, 99, 0.2)',
                        borderColor: 'rgba(99, 102, 241, 0.2)'
                      },
                      ticks: { color: '#9CA3AF' }
                    },
                    y: {
                      grid: {
                        color: 'rgba(75, 85, 99, 0.2)',
                        borderColor: 'rgba(99, 102, 241, 0.2)'
                      },
                      ticks: { color: '#9CA3AF' }
                    }
                  },
                  plugins: {
                    legend: {
                      labels: { color: '#D1D5DB' }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(17, 24, 39, 0.9)',
                      titleColor: '#F3F4F6',
                      bodyColor: '#D1D5DB',
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                      borderWidth: 1
                    }
                  }
                }}
              />
            ) : (
              <Line
                data={algorithm.visualization.data}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                  },
                  scales: {
                    x: {
                      grid: {
                        color: 'rgba(75, 85, 99, 0.2)',
                        borderColor: 'rgba(99, 102, 241, 0.2)'
                      },
                      ticks: { color: '#9CA3AF' }
                    },
                    y: {
                      grid: {
                        color: 'rgba(75, 85, 99, 0.2)',
                        borderColor: 'rgba(99, 102, 241, 0.2)'
                      },
                      ticks: { color: '#9CA3AF' }
                    }
                  },
                  plugins: {
                    legend: {
                      labels: { color: '#D1D5DB' }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(17, 24, 39, 0.9)',
                      titleColor: '#F3F4F6',
                      bodyColor: '#D1D5DB',
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                      borderWidth: 1
                    }
                  }
                }}
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-gray-200">Training Progress</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700/50">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Epoch
                  </th>
                  {Object.keys(algorithm.iterations[0].metrics).map((metric) => (
                    <th
                      key={metric}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                    >
                      {metric}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {algorithm.iterations.map((iteration) => (
                  <tr key={iteration.epoch} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {iteration.epoch}
                    </td>
                    {Object.entries(iteration.metrics).map(([key, value]) => (
                      <td
                        key={key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                      >
                        {value.toFixed(4)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};