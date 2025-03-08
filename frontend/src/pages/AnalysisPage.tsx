import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import LoginModal from '../components/LoginModal';

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface FormData {
  method: string;
  threshold: number;
  iterations: number;
}

interface AnalysisResult {
  labels: string[];
  predictions: number[];
  actuals?: number[];
  accuracy?: number;
  error?: number;
}

const AnalysisPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    method: 'linear',
    threshold: 0.5,
    iterations: 1000
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 模拟检查登录状态
  const isLoggedIn = false; // TODO: 替换为实际的登录状态检查

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // 验证文件类型
      if (!selectedFile.type.match('text/csv|application/vnd.ms-excel|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        toast.error('请上传 CSV 或 Excel 格式的文件');
        return;
      }
      // 验证文件大小（限制为 10MB）
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('文件大小不能超过 10MB');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      // 验证文件类型和大小
      if (!droppedFile.type.match('text/csv|application/vnd.ms-excel|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        toast.error('请上传 CSV 或 Excel 格式的文件');
        return;
      }
      if (droppedFile.size > 10 * 1024 * 1024) {
        toast.error('文件大小不能超过 10MB');
        return;
      }
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleParameterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!file) {
      toast.error('请选择要分析的文件');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 创建 FormData 对象
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      formDataToSend.append('method', formData.method);
      formDataToSend.append('threshold', formData.threshold.toString());
      formDataToSend.append('iterations', formData.iterations.toString());

      // 发送请求
      const response = await axios.post('/api/analyze', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30秒超时
      });

      // 处理响应
      if (response.data.success) {
        setAnalysisResult(response.data.result);
        toast.success('分析完成！');
      } else {
        throw new Error(response.data.message || '分析失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '分析过程中发生错误';
      setError(errorMessage);
      toast.error(errorMessage);
      setAnalysisResult(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 渲染图表
  const renderChart = () => {
    if (!analysisResult) return null;

    const chartData = {
      labels: analysisResult.labels,
      datasets: [
        {
          label: '预测值',
          data: analysisResult.predictions,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        ...(analysisResult.actuals ? [{
          label: '实际值',
          data: analysisResult.actuals,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
        }] : []),
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: '分析结果',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <Line data={chartData} options={options} />
        {analysisResult.accuracy && (
          <div className="mt-4 text-center text-sm text-gray-600">
            准确率: {(analysisResult.accuracy * 100).toFixed(2)}%
          </div>
        )}
        {analysisResult.error && (
          <div className="mt-4 text-center text-sm text-gray-600">
            平均误差: {analysisResult.error.toFixed(4)}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">数据分析</h2>
              {!isLoggedIn && (
                <p className="mt-2 text-sm text-gray-600">
                  注意：部分功能需要登录后才能使用
                </p>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 文件上传区域 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  上传数据文件
                </label>
                <div
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                      >
                        <span>选择文件</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                          accept=".csv,.xls,.xlsx"
                        />
                      </label>
                      <p className="pl-1">或拖放文件到这里</p>
                    </div>
                    <p className="text-xs text-gray-500">支持 CSV、Excel 等格式，文件大小不超过 10MB</p>
                  </div>
                </div>
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    已选择文件：{file.name}
                  </p>
                )}
              </div>

              {/* 参数配置区域 */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    分析方法
                  </label>
                  <select
                    name="method"
                    value={formData.method}
                    onChange={handleParameterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  >
                    <option value="linear">线性回归</option>
                    <option value="logistic">逻辑回归</option>
                    <option value="random_forest">随机森林</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    阈值
                  </label>
                  <input
                    type="number"
                    name="threshold"
                    value={formData.threshold}
                    onChange={handleParameterChange}
                    step="0.1"
                    min="0"
                    max="1"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    迭代次数
                  </label>
                  <input
                    type="number"
                    name="iterations"
                    value={formData.iterations}
                    onChange={handleParameterChange}
                    min="100"
                    max="10000"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* 提交按钮 */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !file}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting || !file
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {isSubmitting ? '分析中...' : '开始分析'}
                </button>
              </div>
            </form>

            {/* 分析结果展示区域 */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">分析结果</h3>
              {error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : isSubmitting ? (
                <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">正在分析数据，请稍候...</p>
                  </div>
                </div>
              ) : analysisResult ? (
                renderChart()
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center">
                  <p className="text-gray-500">分析结果将在这里显示</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 登录提示模态框 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Toast 容器 */}
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default AnalysisPage; 