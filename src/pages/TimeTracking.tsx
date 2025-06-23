import React, { useState } from 'react';
import { Play, Pause, Square, Plus, Clock, Calendar } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { format, parseISO } from 'date-fns';

export default function TimeTracking() {
  const { timeEntries, clients, addTimeEntry, loading } = useData();
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentProject, setCurrentProject] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');
  const [selectedClient, setSelectedClient] = useState('');

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    setStartTime(new Date());
    setIsTracking(true);
    setElapsedTime(0);
  };

  const handlePauseTimer = () => {
    setIsTracking(false);
  };

  const handleStopTimer = async () => {
    if (startTime && currentProject) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60); // in minutes
      const client = clients.find(c => c.id === selectedClient);

      try {
        await addTimeEntry({
          client_id: selectedClient || undefined,
          project_name: currentProject,
          description: currentDescription,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          duration,
          hourly_rate: client?.hourly_rate || 0,
          is_billable: true,
          is_invoiced: false,
        });

        // Reset timer
        setIsTracking(false);
        setStartTime(null);
        setElapsedTime(0);
        setCurrentProject('');
        setCurrentDescription('');
        setSelectedClient('');
      } catch (error) {
        console.error('Error saving time entry:', error);
      }
    }
  };

  const totalHoursToday = timeEntries
    .filter(entry => {
      const entryDate = format(parseISO(entry.created_at), 'yyyy-MM-dd');
      const today = format(new Date(), 'yyyy-MM-dd');
      return entryDate === today;
    })
    .reduce((total, entry) => total + entry.duration, 0);

  const totalEarningsToday = timeEntries
    .filter(entry => {
      const entryDate = format(parseISO(entry.created_at), 'yyyy-MM-dd');
      const today = format(new Date(), 'yyyy-MM-dd');
      return entryDate === today && entry.is_billable;
    })
    .reduce((total, entry) => total + (entry.duration / 60) * entry.hourly_rate, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Time Tracking</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your time and manage your projects
        </p>
      </div>

      {/* Timer Widget */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <div className="text-6xl font-mono font-bold text-gray-900 dark:text-white mb-6">
            {formatTime(elapsedTime)}
          </div>

          <div className="max-w-2xl mx-auto space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Project name"
                value={currentProject}
                onChange={(e) => setCurrentProject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select client (optional)</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder="Description (optional)"
              value={currentDescription}
              onChange={(e) => setCurrentDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-center space-x-4">
            {!isTracking ? (
              <button
                onClick={handleStartTimer}
                disabled={!currentProject}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Play className="h-5 w-5 mr-2" />
                Start
              </button>
            ) : (
              <>
                <button
                  onClick={handlePauseTimer}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
                >
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </button>
                <button
                  onClick={handleStopTimer}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  <Square className="h-5 w-5 mr-2" />
                  Stop
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Hours Today
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.floor(totalHoursToday / 60)}h {totalHoursToday % 60}m
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Earnings Today
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalEarningsToday.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Time Entries */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Time Entries
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {timeEntries.slice(0, 10).map((entry) => {
                const client = clients.find(c => c.id === entry.client_id);
                const amount = (entry.duration / 60) * entry.hourly_rate;
                
                return (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.project_name}
                        </div>
                        {entry.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {entry.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {client?.name || 'No client'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {Math.floor(entry.duration / 60)}h {entry.duration % 60}m
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${entry.hourly_rate}/hr
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {format(parseISO(entry.created_at), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {timeEntries.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              No time entries yet. Start tracking your time!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}