import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import LoginModal from './LoginModal';

interface CorrelationResult {
  image: string;
  correlation: number;
  p_value: number;
  method: string;
}

interface InputData {
  xValues: string;
  yValues: string;
  method: 'pearson' | 'spearman';
  title: string;
  xLabel: string;
  yLabel: string;
  pointSize: number;
}

const CorrelationAnalysis: React.FC = () => {
  const [inputData, setInputData] = useState<InputData>({
    xValues: '',
    yValues: '',
    method: 'pearson',
    title: 'Correlation Analysis',
    xLabel: 'X Values',
    yLabel: 'Y Values',
    pointSize: 3
  });
  const [result, setResult] = useState<CorrelationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Simulated login status (replace with actual auth logic)
  const isLoggedIn = true; // Set to false to test login modal

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputData(prev => ({ ...prev, [name]: value }));
  };

  const validateInput = () => {
    // Check if input is provided
    if (!inputData.xValues.trim() || !inputData.yValues.trim()) {
      toast.error('Please provide values for both X and Y axes');
      return false;
    }

    // Parse and validate X values
    const xArray = inputData.xValues.split(',').map(x => x.trim());
    const xValid = xArray.every(x => !isNaN(Number(x)));
    if (!xValid) {
      toast.error('X values must be valid numbers separated by commas');
      return false;
    }

    // Parse and validate Y values
    const yArray = inputData.yValues.split(',').map(y => y.trim());
    const yValid = yArray.every(y => !isNaN(Number(y)));
    if (!yValid) {
      toast.error('Y values must be valid numbers separated by commas');
      return false;
    }

    // Check if arrays have the same length
    if (xArray.length !== yArray.length) {
      toast.error('X and Y must have the same number of values');
      return false;
    }

    return true;
  };

  const generateCorrelationPlot = async () => {
    if (!validateInput()) return;

    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/correlation/plot', {
        x: inputData.xValues,
        y: inputData.yValues,
        method: inputData.method,
        title: inputData.title,
        xlab: inputData.xLabel,
        ylab: inputData.yLabel,
        pointSize: inputData.pointSize,
        width: 800,
        height: 600
      });

      setResult(response.data);
      toast.success('Correlation analysis completed successfully!');
    } catch (error) {
      console.error('Error generating correlation plot:', error);
      toast.error('Failed to generate correlation plot. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadExampleData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/correlation/example', {
        params: {
          n: 50,
          correlation: 0.7,
          method: inputData.method
        }
      });
      
      const exampleData = response.data;
      setResult(exampleData);
      
      // Format the data for the input fields
      const xValues = exampleData.data.x.join(', ');
      const yValues = exampleData.data.y.join(', ');
      
      setInputData(prev => ({
        ...prev,
        xValues,
        yValues,
        title: `Example ${inputData.method} Correlation`
      }));
      
      toast.info('Example data loaded successfully!');
    } catch (error) {
      console.error('Error loading example data:', error);
      toast.error('Failed to load example data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Correlation Analysis</h2>
              <p className="mt-2 text-sm text-gray-600">
                Analyze the correlation between two sets of values and visualize the relationship.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    X Values (comma-separated)
                  </label>
                  <textarea
                    name="xValues"
                    value={inputData.xValues}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                    placeholder="e.g., 10, 2, 3, 4, 5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Y Values (comma-separated)
                  </label>
                  <textarea
                    name="yValues"
                    value={inputData.yValues}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                    placeholder="e.g., 5, 6, 7, 8, 7"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correlation Method
                    </label>
                    <select
                      name="method"
                      value={inputData.method}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="pearson">Pearson</option>
                      <option value="spearman">Spearman</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Point Size
                    </label>
                    <input
                      type="number"
                      name="pointSize"
                      value={inputData.pointSize}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      step="0.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plot Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={inputData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      X-Axis Label
                    </label>
                    <input
                      type="text"
                      name="xLabel"
                      value={inputData.xLabel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Y-Axis Label
                    </label>
                    <input
                      type="text"
                      name="yLabel"
                      value={inputData.yLabel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={generateCorrelationPlot}
                    disabled={isLoading}
                    className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
                  >
                    {isLoading ? 'Generating...' : 'Generate Plot'}
                  </button>

                  <button
                    type="button"
                    onClick={loadExampleData}
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Load Example
                  </button>
                </div>
              </div>

              {/* Result Display */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Correlation Result</h3>

                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    <div className="bg-white p-2 rounded-md shadow-sm">
                      <img 
                        src={result.image} 
                        alt="Correlation Plot" 
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Correlation Method</p>
                          <p className="font-medium">{result.method.charAt(0).toUpperCase() + result.method.slice(1)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Correlation Coefficient</p>
                          <p className="font-medium">{result.correlation.toFixed(3)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">P-value</p>
                          <p className="font-medium">{result.p_value.toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Significance</p>
                          <p className={`font-medium ${result.p_value < 0.05 ? 'text-green-600' : 'text-red-600'}`}>
                            {result.p_value < 0.05 ? 'Significant' : 'Not Significant'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-64 text-gray-500">
                    Enter data and generate a correlation plot to see results
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default CorrelationAnalysis;
