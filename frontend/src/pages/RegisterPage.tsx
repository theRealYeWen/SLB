import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface FormData {
  phone: string;
  verificationCode: string;
  password: string;
  confirmPassword: string;
  invitationCode: string;
}

interface FormErrors {
  phone?: string;
  verificationCode?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    verificationCode: '',
    password: '',
    confirmPassword: '',
    invitationCode: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 处理倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 验证手机号格式
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // 验证密码格式
  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
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

      case 'verificationCode':
        if (!value) {
          newErrors.verificationCode = '请输入验证码';
        } else if (!/^\d{6}$/.test(value)) {
          newErrors.verificationCode = '验证码应为6位数字';
        } else {
          delete newErrors.verificationCode;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = '请输入密码';
        } else if (!validatePassword(value)) {
          newErrors.password = '密码至少需要6个字符，包含数字和字母';
        } else {
          delete newErrors.password;
        }
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = '两次输入的密码不一致';
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = '请确认密码';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = '两次输入的密码不一致';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }

    setErrors(newErrors);
  };

  // 发送验证码
  const handleSendVerificationCode = async () => {
    if (!validatePhone(formData.phone) || countdown > 0) return;

    try {
      // TODO: 调用发送验证码的API
      console.log('发送验证码到:', formData.phone);
      setCountdown(60);
    } catch (error) {
      console.error('发送验证码失败:', error);
    }
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    validateField('phone', formData.phone);
    validateField('verificationCode', formData.verificationCode);
    validateField('password', formData.password);
    validateField('confirmPassword', formData.confirmPassword);

    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      // TODO: 调用注册API
      console.log('提交注册信息:', formData);
    } catch (error) {
      console.error('注册失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* 左侧欢迎区域 */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 p-12 flex-col justify-center">
        <div className="text-white">
          <h1 className="text-5xl font-bold mb-6">创建账号</h1>
          <p className="text-xl mb-8">如果您还没有账号，请注册</p>
        </div>
      </div>

      {/* 右侧注册表单 */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">注册</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 手机号输入 */}
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

            {/* 验证码输入 */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  required
                  value={formData.verificationCode}
                  onChange={handleInputChange}
                  placeholder="请输入验证码"
                  className={`w-full px-4 py-3 rounded-lg bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    errors.verificationCode ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
              </div>
              <button
                type="button"
                onClick={handleSendVerificationCode}
                disabled={!validatePhone(formData.phone) || countdown > 0}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  !validatePhone(formData.phone) || countdown > 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {countdown > 0 ? `${countdown}秒后重试` : '发送验证码'}
              </button>
            </div>
            {errors.verificationCode && (
              <p className="mt-2 text-sm text-red-600">{errors.verificationCode}</p>
            )}

            {/* 密码输入 */}
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

            {/* 确认密码 */}
            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="请确认密码"
                className={`w-full px-4 py-3 rounded-lg bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* 邀请码（选填） */}
            <div>
              <input
                id="invitationCode"
                name="invitationCode"
                type="text"
                value={formData.invitationCode}
                onChange={handleInputChange}
                placeholder="注册码（选填）"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>

            {/* 注册按钮 */}
            <button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className={`w-full py-3 px-4 rounded-lg text-white text-lg font-semibold transition-colors ${
                isSubmitting || Object.keys(errors).length > 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? '注册中...' : '注册'}
            </button>

            <p className="text-center text-gray-600 mt-8">
              已有账号？{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                直接登录
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 