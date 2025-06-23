import React from 'react';
import { 
  DollarSign, 
  FileText, 
  Users, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { format, subDays, isAfter, isBefore, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Dashboard() {
  const { invoices, clients, timeEntries, loading } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Calculate statistics
  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const pendingAmount = invoices
    .filter(inv => ['sent', 'overdue'].includes(inv.status))
    .reduce((sum, inv) => sum + inv.total, 0);

  const overdueInvoices = invoices.filter(inv => 
    inv.status === 'overdue' || 
    (inv.status === 'sent' && isAfter(new Date(), parseISO(inv.due_date)))
  );

  const recentActivity = [
    ...invoices.slice(-5).map(inv => ({
      type: 'invoice',
      title: `Invoice ${inv.invoice_number}`,
      subtitle: clients.find(c => c.id === inv.client_id)?.name || 'Unknown Client',
      amount: inv.total,
      date: inv.created_at,
      status: inv.status
    })),
    ...timeEntries.slice(-3).map(entry => ({
      type: 'time',
      title: entry.project_name,
      subtitle: `${Math.floor(entry.duration / 60)}h ${entry.duration % 60}m`,
      date: entry.created_at
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  // Sample chart data
  const revenueData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayInvoices = invoices.filter(inv => 
      inv.status === 'paid' && 
      format(parseISO(inv.created_at), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    return {
      date: format(date, 'MMM dd'),
      revenue: dayInvoices.reduce((sum, inv) => sum + inv.total, 0)
    };
  });

  const stats = [
    {
      name: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: '+12.5%',
      changeType: 'increase'
    },
    {
      name: 'Pending Amount',
      value: `$${pendingAmount.toLocaleString()}`,
      icon: Clock,
      change: '-2.1%',
      changeType: 'decrease'
    },
    {
      name: 'Total Invoices',
      value: invoices.length.toString(),
      icon: FileText,
      change: '+8.2%',
      changeType: 'increase'
    },
    {
      name: 'Active Clients',
      value: clients.length.toString(),
      icon: Users,
      change: '+4.1%',
      changeType: 'increase'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <stat.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'increase'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                vs last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {overdueInvoices.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h3 className="ml-2 text-sm font-medium text-red-800 dark:text-red-400">
              Overdue Invoices
            </h3>
          </div>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            You have {overdueInvoices.length} overdue invoice{overdueInvoices.length > 1 ? 's' : ''} 
            totaling ${overdueInvoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}.
          </p>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4f46e5" 
                strokeWidth={2}
                dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Invoice Status
          </h3>
          <div className="space-y-4">
            {['paid', 'sent', 'draft', 'overdue'].map(status => {
              const count = invoices.filter(inv => inv.status === status).length;
              const percentage = invoices.length > 0 ? (count / invoices.length) * 100 : 0;
              
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm">
                    <span className="capitalize text-gray-600 dark:text-gray-400">
                      {status}
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {count}
                    </span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status === 'paid' ? 'bg-green-500' :
                        status === 'sent' ? 'bg-blue-500' :
                        status === 'overdue' ? 'bg-red-500' :
                        'bg-gray-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {activity.type === 'invoice' ? (
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                      <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  ) : (
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  {activity.amount && (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ${activity.amount.toLocaleString()}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(parseISO(activity.date), 'MMM dd')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}