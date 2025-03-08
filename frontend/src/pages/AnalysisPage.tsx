import React, { useState } from 'react';
import LoginModal from '../components/LoginModal';

interface FormData {
  method: string;
  threshold: number;
  iterations: number;
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

  // 模拟检查登录状态
  const isLoggedIn = false; // TODO: 替换为实际的登录状态检查

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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

    setIsSubmitting(true);
    try {
      // TODO: 实现文件上传和分析逻辑
      console.log('提交分析请求', { file, formData });
      // 分析成功后的处理...
    } catch (error) {
      console.error('分析失败:', error);
    } finally {
      setIsSubmitting(false);
    }
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
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
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
                        />
                      </label>
                      <p className="pl-1">或拖放文件到这里</p>
                    </div>
                    <p className="text-xs text-gray-500">支持 CSV、Excel 等格式</p>
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
              <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center">
                <p className="text-gray-500">分析结果将在这里显示</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 登录提示模态框 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default AnalysisPage; 