import React from 'react';

interface Task {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed';
  createdAt: string;
}

const UserDashboard: React.FC = () => {
  // 模拟用户数据
  const user = {
    name: '张三',
    email: 'zhangsan@example.com',
    membershipLevel: '高级会员',
    joinDate: '2024-01-01'
  };

  // 模拟任务数据
  const tasks: Task[] = [
    {
      id: '1',
      name: '销售数据分析',
      status: 'completed',
      createdAt: '2024-03-07'
    },
    {
      id: '2',
      name: '客户行为分析',
      status: 'processing',
      createdAt: '2024-03-06'
    },
    {
      id: '3',
      name: '市场趋势分析',
      status: 'pending',
      createdAt: '2024-03-05'
    }
  ];

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 用户信息卡片 */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">个人信息</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">姓名</p>
              <p className="mt-1 text-lg text-gray-900">{user.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">邮箱</p>
              <p className="mt-1 text-lg text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">会员等级</p>
              <p className="mt-1 text-lg text-gray-900">{user.membershipLevel}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">加入时间</p>
              <p className="mt-1 text-lg text-gray-900">{user.joinDate}</p>
            </div>
          </div>
        </div>

        {/* 分析任务列表 */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">分析任务</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    任务名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建时间
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {task.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {task.status === 'completed' && '已完成'}
                        {task.status === 'processing' && '处理中'}
                        {task.status === 'pending' && '待处理'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.createdAt}
                    </td>
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

export default UserDashboard; 