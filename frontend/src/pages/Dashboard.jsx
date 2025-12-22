import { useBookings } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import StarklyAIChatWidget from '../chatbot/StarklyAIChatWidget'

const Dashboard = () => {
  const { getBookingStats } = useBookings();
  const { isAdmin } = useAuth();
  const stats = getBookingStats();
 

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.total,
      icon: Calendar,
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'yellow',
      change: '+5%'
    },
    {
      title: 'Confirmed',
      value: stats.confirmed,
      icon: CheckCircle,
      color: 'green',
      change: '+8%'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: TrendingUp,
      color: 'purple',
      change: '+15%'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-500 text-blue-100',
    yellow: 'bg-yellow-500 text-yellow-100',
    green: 'bg-green-500 text-green-100',
    purple: 'bg-purple-500 text-purple-100'
  };
 


  return (
    <div className="space-y-6">
     
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          {isAdmin() ? 'Admin Dashboard' : 'My Dashboard'}
        </h1>
        <div className="text-sm text-gray-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                  <p className="text-sm text-green-600 mt-1">{card.change} from last month</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[card.color]}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
              <h4 className="font-medium text-primary-700">Create New Booking</h4>
              <p className="text-sm text-primary-600">Schedule a new appointment</p>
            </button>
            <button className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <h4 className="font-medium text-green-700">View Today's Schedule</h4>
              <p className="text-sm text-green-600">Check today's appointments</p>
            </button>
            {isAdmin() && (
              <button className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <h4 className="font-medium text-purple-700">User Management</h4>
                <p className="text-sm text-purple-600">Manage system users</p>
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">Booking confirmed</p>
                <p className="text-xs text-gray-600">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">New booking created</p>
                <p className="text-xs text-gray-600">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">Booking pending approval</p>
                <p className="text-xs text-gray-600">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;