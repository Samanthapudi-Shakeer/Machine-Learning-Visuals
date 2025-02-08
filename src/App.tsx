import React, { useState } from 'react';
import { AlgorithmCard } from './components/AlgorithmCard';
import { algorithms as initialAlgorithms } from './data/algorithms';
import { Brain, Sparkles } from 'lucide-react';
import clsx from 'clsx';

type Category = 'all' | 'supervised' | 'unsupervised';
type Type = 'all' | 'regression' | 'classification' | 'clustering' | 'dimensionality';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedType, setSelectedType] = useState<Type>('all');
  const [algorithms, setAlgorithms] = useState(initialAlgorithms);

  const filteredAlgorithms = algorithms.filter(algo => {
    if (selectedCategory !== 'all' && algo.category !== selectedCategory) return false;
    if (selectedType !== 'all' && algo.type !== selectedType) return false;
    return true;
  });

  const handleUpdateEpochs = async (id: string, epochs: number) => {
    setAlgorithms(prevAlgorithms => 
      prevAlgorithms.map(algo => {
        if (algo.id !== id) return algo;
        
        // Simulate new training data
        const newIterations = Array.from({ length: epochs }, (_, i) => ({
          epoch: i + 1,
          metrics: Object.fromEntries(
            Object.keys(algo.iterations[0].metrics).map(metric => [
              metric,
              Math.random() * 0.5 + (i / epochs) * 0.5 // Improve metrics over time
            ])
          )
        }));

        return {
          ...algo,
          currentEpochs: epochs,
          iterations: newIterations
        };
      })
    );
  };

  const handleChangeDataset = (algorithmId: string, datasetId: string) => {
    setAlgorithms(prevAlgorithms =>
      prevAlgorithms.map(algo => {
        if (algo.id !== algorithmId) return algo;
        return {
          ...algo,
          selectedDatasetId: datasetId
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-900/50 rounded-lg ring-2 ring-indigo-500/20">
                <Brain className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  ML Algorithm Visualizer
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </h1>
                <p className="text-gray-400">
                  Interactive visualization of popular machine learning algorithms
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <div className="flex space-x-2">
                {(['all', 'supervised', 'unsupervised'] as const).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={clsx(
                      'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    )}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type
              </label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'regression', 'classification', 'clustering', 'dimensionality'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={clsx(
                      'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                      selectedType === type
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    )}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredAlgorithms.map((algorithm) => (
            <AlgorithmCard 
              key={algorithm.id} 
              algorithm={algorithm}
              onUpdateEpochs={handleUpdateEpochs}
              onChangeDataset={handleChangeDataset}
            />
          ))}
        </div>
      </main>

      <footer className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 ML Algorithm Visualizer. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Developed by Neural Knights
              <span> - ♞Shakeer ♞Yaswanth ♞Prathyush ♞Harshitha</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
