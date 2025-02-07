export interface Dataset {
  id: string;
  name: string;
  features: string[];
  samples: number;
  source: string;
  description: string;
}

export interface Algorithm {
  id: string;
  name: string;
  category: 'supervised' | 'unsupervised';
  type: 'regression' | 'classification' | 'clustering' | 'dimensionality';
  description: string;
  availableDatasets: Dataset[];
  selectedDatasetId: string;
  maxEpochs: number;
  currentEpochs: number;
  visualization: {
    type: 'scatter' | 'line' | 'bar';
    data: any;
  };
  iterations: {
    epoch: number;
    metrics: Record<string, number>;
  }[];
}