import { Algorithm } from '../types';

const generateLinearData = (samples: number, noise: number = 0.2) => {
  return Array.from({ length: samples }, () => {
    const x = Math.random() * 100;
    const y = 0.5 * x + 30 + (Math.random() - 0.5) * noise * 100;
    return { x, y };
  });
};

const generateClusterData = (
  centers: Array<{ x: number; y: number }>,
  pointsPerCluster: number,
  spread: number
) => {
  return centers.map((center, i) => ({
    label: `Cluster ${i + 1}`,
    data: Array.from({ length: pointsPerCluster }, () => ({
      x: center.x + (Math.random() - 0.5) * spread,
      y: center.y + (Math.random() - 0.5) * spread,
    })),
  }));
};

const generateClassificationData = (samples: number) => {
  return Array.from({ length: samples }, () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 30 + Math.random() * 20;
    return {
      x: Math.cos(angle) * radius + 50,
      y: Math.sin(angle) * radius + 50,
    };
  });
};

export const algorithms: Algorithm[] = [
  {
    id: 'pca',
    name: 'Principal Component Analysis (PCA)',
    category: 'unsupervised',
    type: 'dimensionality',
    description: 'A dimensionality reduction technique that transforms high-dimensional data into a lower-dimensional space while preserving maximum variance. PCA identifies the principal components (directions) along which the data varies the most.',
    maxEpochs: 100,
    currentEpochs: 5,
    availableDatasets: [
      {
        id: 'iris',
        name: 'Iris Dataset',
        features: ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'],
        samples: 150,
        source: 'UCI Machine Learning Repository',
        description: 'Classic iris flower dataset with 4 features reduced to 2D'
      },
      {
        id: 'digits',
        name: 'Handwritten Digits',
        features: ['Pixel Values (784)', 'Reduced Dimensions (2)'],
        samples: 1000,
        source: 'MNIST Dataset',
        description: 'Handwritten digits reduced from 784 to 2 dimensions'
      }
    ],
    selectedDatasetId: 'iris',
    visualization: {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Transformed Data',
            data: generateClassificationData(100),
            backgroundColor: 'rgba(129, 140, 248, 0.5)',
            borderColor: 'rgba(129, 140, 248, 1)',
          }
        ]
      }
    },
    iterations: Array.from({ length: 5 }, (_, i) => ({
      epoch: i + 1,
      metrics: {
        explained_variance: 0.75 + (i * 0.05),
        reconstruction_error: 0.25 - (i * 0.04)
      }
    }))
  },
  {
    id: 'lda',
    name: 'Linear Discriminant Analysis (LDA)',
    category: 'supervised',
    type: 'dimensionality',
    description: 'A supervised dimensionality reduction technique that finds a linear combination of features that characterizes or separates two or more classes. LDA maximizes the separation between different classes while minimizing the spread within each class.',
    maxEpochs: 100,
    currentEpochs: 5,
    availableDatasets: [
      {
        id: 'wine',
        name: 'Wine Dataset',
        features: ['Alcohol', 'Malic Acid', 'Ash', 'Class'],
        samples: 178,
        source: 'UCI Wine Dataset',
        description: 'Wine chemical analysis dataset with 3 classes'
      },
      {
        id: 'cancer',
        name: 'Breast Cancer',
        features: ['Cell Size', 'Cell Shape', 'Adhesion', 'Class'],
        samples: 569,
        source: 'Wisconsin Breast Cancer Dataset',
        description: 'Breast cancer diagnostic data with binary classification'
      }
    ],
    selectedDatasetId: 'wine',
    visualization: {
      type: 'scatter',
      data: {
        datasets: generateClusterData(
          [
            { x: 30, y: 30 },
            { x: 70, y: 70 },
            { x: 30, y: 70 }
          ],
          20,
          15
        ).map((cluster, i) => ({
          ...cluster,
          backgroundColor: [
            'rgba(129, 140, 248, 0.5)',
            'rgba(34, 197, 94, 0.5)',
            'rgba(249, 115, 22, 0.5)'
          ][i],
          borderColor: [
            'rgba(129, 140, 248, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(249, 115, 22, 1)'
          ][i],
        }))
      }
    },
    iterations: Array.from({ length: 5 }, (_, i) => ({
      epoch: i + 1,
      metrics: {
        class_separation: 0.6 + (i * 0.08),
        accuracy: 0.8 + (i * 0.04)
      }
    }))
  },
  {
    id: 'decision-tree',
    name: 'Decision Tree Classifier',
    category: 'supervised',
    type: 'classification',
    description: 'A tree-structured classifier that recursively splits the data based on feature values. Each internal node represents a decision based on a feature, and each leaf node represents a class label. Decision trees are interpretable and can handle both numerical and categorical data.',
    maxEpochs: 100,
    currentEpochs: 5,
    availableDatasets: [
      {
        id: 'titanic',
        name: 'Titanic',
        features: ['Age', 'Sex', 'Class', 'Fare', 'Survived'],
        samples: 891,
        source: 'Titanic Dataset',
        description: 'Passenger survival prediction from Titanic disaster'
      },
      {
        id: 'credit',
        name: 'Credit Risk',
        features: ['Income', 'Age', 'Employment', 'Risk Level'],
        samples: 1000,
        source: 'Credit Risk Assessment',
        description: 'Credit risk classification dataset'
      }
    ],
    selectedDatasetId: 'titanic',
    visualization: {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Class 0',
            data: generateClassificationData(50),
            backgroundColor: 'rgba(129, 140, 248, 0.5)',
            borderColor: 'rgba(129, 140, 248, 1)',
          },
          {
            label: 'Class 1',
            data: generateClassificationData(50).map(p => ({ x: p.x + 20, y: p.y - 20 })),
            backgroundColor: 'rgba(34, 197, 94, 0.5)',
            borderColor: 'rgba(34, 197, 94, 1)',
          }
        ]
      }
    },
    iterations: Array.from({ length: 5 }, (_, i) => ({
      epoch: i + 1,
      metrics: {
        accuracy: 0.7 + (i * 0.06),
        gini_impurity: 0.3 - (i * 0.05)
      }
    }))
  },
  {
    id: 'svm',
    name: 'Support Vector Machine (SVM)',
    category: 'supervised',
    type: 'classification',
    description: 'A powerful classifier that finds the optimal hyperplane to separate different classes with maximum margin. SVMs can handle both linear and non-linear classification through kernel functions, making them versatile for various problems.',
    maxEpochs: 100,
    currentEpochs: 5,
    availableDatasets: [
      {
        id: 'spam',
        name: 'Spam Detection',
        features: ['Word Frequencies', 'Email Length', 'Special Chars', 'Label'],
        samples: 5000,
        source: 'Spam Email Dataset',
        description: 'Email spam classification dataset'
      },
      {
        id: 'sentiment',
        name: 'Sentiment',
        features: ['Word Embeddings', 'Text Length', 'Sentiment'],
        samples: 2000,
        source: 'Movie Reviews',
        description: 'Movie review sentiment analysis'
      }
    ],
    selectedDatasetId: 'spam',
    visualization: {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Class A',
            data: generateClassificationData(40),
            backgroundColor: 'rgba(129, 140, 248, 0.5)',
            borderColor: 'rgba(129, 140, 248, 1)',
          },
          {
            label: 'Class B',
            data: generateClassificationData(40).map(p => ({ x: p.x + 30, y: p.y + 30 })),
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
            borderColor: 'rgba(239, 68, 68, 1)',
          },
          {
            label: 'Support Vectors',
            data: [
              { x: 45, y: 45 },
              { x: 55, y: 55 },
              { x: 65, y: 65 }
            ],
            backgroundColor: 'rgba(234, 179, 8, 0.8)',
            borderColor: 'rgba(234, 179, 8, 1)',
            pointRadius: 8,
            pointStyle: 'star'
          }
        ]
      }
    },
    iterations: Array.from({ length: 5 }, (_, i) => ({
      epoch: i + 1,
      metrics: {
        accuracy: 0.85 + (i * 0.03),
        margin_width: 1.2 + (i * 0.2)
      }
    }))
  },
  {
    id: 'naive-bayes',
    name: 'Naive Bayes',
    category: 'supervised',
    type: 'classification',
    description: 'A probabilistic classifier based on Bayes\' theorem with an assumption of feature independence. Despite its simplicity and "naive" assumption, it performs remarkably well for text classification and other high-dimensional problems.',
    maxEpochs: 100,
    currentEpochs: 5,
    availableDatasets: [
      {
        id: 'news',
        name: 'News Categories',
        features: ['Word Frequencies', 'Article Length', 'Category'],
        samples: 2000,
        source: 'News Article Dataset',
        description: 'News article categorization dataset'
      },
      {
        id: 'language',
        name: 'Language Detection',
        features: ['Character Frequencies', 'Text Length', 'Language'],
        samples: 1000,
        source: 'Language Detection Dataset',
        description: 'Text language classification dataset'
      }
    ],
    selectedDatasetId: 'news',
    visualization: {
      type: 'scatter',
      data: {
        datasets: generateClusterData(
          [
            { x: 20, y: 20 },
            { x: 60, y: 60 },
            { x: 80, y: 30 }
          ],
          25,
          15
        ).map((cluster, i) => ({
          ...cluster,
          backgroundColor: [
            'rgba(129, 140, 248, 0.5)',
            'rgba(34, 197, 94, 0.5)',
            'rgba(249, 115, 22, 0.5)'
          ][i],
          borderColor: [
            'rgba(129, 140, 248, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(249, 115, 22, 1)'
          ][i],
        }))
      }
    },
    iterations: Array.from({ length: 5 }, (_, i) => ({
      epoch: i + 1,
      metrics: {
        accuracy: 0.75 + (i * 0.05),
        log_likelihood: -0.5 + (i * 0.08)
      }
    }))
  }
];