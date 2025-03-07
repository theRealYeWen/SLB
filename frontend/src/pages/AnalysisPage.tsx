import React, { useState } from 'react';

const AnalysisPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parameters, setParameters] = useState({
    method: 'linear',
    threshold: 0.5,
    iterations: 1000
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleParameterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParameters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 实现文件上传和分析逻辑
    console.log('提交分析请求', { file, parameters });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">数据分析</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 文件上传区域 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                上传数据文件
              </label>
              <div className="mt-1">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                />
              </div>
            </div>

            {/* 参数配置区域 */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  分析方法
                </label>
                <select
                  name="method"
                  value={parameters.method}
                  onChange={handleParameterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="linear">线性回归</option>
                  <option value="logistic">逻辑回归</option>
                  <option value="random_forest">随机森林</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  阈值
                </label>
                <input
                  type="number"
                  name="threshold"
                  value={parameters.threshold}
                  onChange={handleParameterChange}
                  step="0.1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  迭代次数
                </label>
                <input
                  type="number"
                  name="iterations"
                  value={parameters.iterations}
                  onChange={handleParameterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* 提交按钮 */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                开始分析
              </button>
            </div>
          </form>

          {/* 图表展示区域 */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">分析结果</h3>
            <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center">
              <p className="text-gray-500">分析结果将在这里显示</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage; 