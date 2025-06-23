import React from 'react';
import { Bell, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Welcome back
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900">
            <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {user?.email}
          </span>
        </div>
      </div>
    </header>
  );
}