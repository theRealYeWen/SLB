import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface FormData {
  phone: string;
  password: string;
}

interface FormErrors {
  phone?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    password: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 验证手机号格式
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // 验证单个字段
  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'phone':
        if (!value) {
          newErrors.phone = '请输入手机号';
        } else if (!validatePhone(value)) {
          newErrors.phone = '请输入有效的手机号';
        } else {
          delete newErrors.phone;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = '请输入密码';
        } else {
          delete newErrors.password;
        }
        break;
    }

    setErrors(newErrors);
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    validateField('phone', formData.phone);
    validateField('password', formData.password);

    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      // TODO: 调用登录API
      console.log('提交登录信息:', formData);
    } catch (error) {
      console.error('登录失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* 左侧欢迎区域 */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 p-12 flex-col justify-center">
        <div className="text-white">
          <h1 className="text-5xl font-bold mb-6">欢迎回来！</h1>
          <p className="text-xl mb-8">如果您已有账号，请直接登录</p>
        </div>
      </div>

      {/* 右侧登录表单 */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">登录</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="请输入手机号"
                className={`w-full px-4 py-3 rounded-lg bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  errors.phone ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="请输入密码"
                className={`w-full px-4 py-3 rounded-lg bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  errors.password ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 text-gray-600">
                  记住我
                </label>
              </div>
              <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-500">
                忘记密码？
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0 || !formData.phone || !formData.password}
              className={`w-full py-3 px-4 rounded-lg text-white text-lg font-semibold transition-colors ${
                isSubmitting || Object.keys(errors).length > 0 || !formData.phone || !formData.password
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? '登录中...' : '登录'}
            </button>

            <p className="text-center text-gray-600 mt-8">
              还没有账号？{' '}
              <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
                立即注册
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 