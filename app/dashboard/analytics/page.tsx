'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface AnalyticsData {
  dailyVisitors: Array<{ date: string; visitors: number }>
  weeklyStats: {
    totalVisitors: number
    averageDaily: number
    peakHour: string
    changeFromLastWeek: number
  }
  hourlyData: Array<{ hour: string; visitors: number }>
  monthlyTrend: Array<{ month: string; visitors: number }>
}

export default function AnalyticsPage() {
  const { user, selectedStore } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    loadAnalytics()
  }, [user, router, selectedStore, timeRange])

  const loadAnalytics = async () => {
    setLoading(true)
    
    try {
      // Simulate loading analytics data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock analytics data - in production this would come from your API
      const mockData: AnalyticsData = {
        dailyVisitors: [
          { date: '2025-08-21', visitors: 23 },
          { date: '2025-08-22', visitors: 31 },
          { date: '2025-08-23', visitors: 28 },
          { date: '2025-08-24', visitors: 35 },
          { date: '2025-08-25', visitors: 42 },
          { date: '2025-08-26', visitors: 38 },
          { date: '2025-08-27', visitors: 29 },
        ],
        weeklyStats: {
          totalVisitors: 226,
          averageDaily: 32.3,
          peakHour: '14:00-15:00',
          changeFromLastWeek: 12.5
        },
        hourlyData: [
          { hour: '09:00', visitors: 5 },
          { hour: '10:00', visitors: 8 },
          { hour: '11:00', visitors: 12 },
          { hour: '12:00', visitors: 15 },
          { hour: '13:00', visitors: 18 },
          { hour: '14:00', visitors: 22 },
          { hour: '15:00', visitors: 19 },
          { hour: '16:00', visitors: 16 },
          { hour: '17:00', visitors: 14 },
          { hour: '18:00', visitors: 11 },
          { hour: '19:00', visitors: 8 },
          { hour: '20:00', visitors: 4 },
        ],
        monthlyTrend: [
          { month: 'Jan', visitors: 890 },
          { month: 'Feb', visitors: 945 },
          { month: 'Mar', visitors: 1023 },
          { month: 'Apr', visitors: 1156 },
          { month: 'May', visitors: 1089 },
          { month: 'Jun', visitors: 1234 },
          { month: 'Jul', visitors: 1345 },
          { month: 'Aug', visitors: 1289 },
        ]
      }
      
      setAnalytics(mockData)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" className="text-primary-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Visitor insights for {selectedStore?.name}
              </p>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['week', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    timeRange === range
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.weeklyStats.totalVisitors}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50">
                <ChartBarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Daily Average</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.weeklyStats.averageDaily.toFixed(1)}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-50">
                <ClockIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Peak Hour</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.weeklyStats.peakHour}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${
                (analytics?.weeklyStats.changeFromLastWeek || 0) >= 0 ? 'bg-green-50' : 'bg-red-50'
              }`}>
                {(analytics?.weeklyStats.changeFromLastWeek || 0) >= 0 ? (
                  <TrendingUpIcon className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDownIcon className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Weekly Change</p>
                <p className={`text-2xl font-bold ${
                  (analytics?.weeklyStats.changeFromLastWeek || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {analytics?.weeklyStats.changeFromLastWeek > 0 ? '+' : ''}
                  {analytics?.weeklyStats.changeFromLastWeek.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Visitors Chart */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Daily Visitors</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics?.dailyVisitors}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    stroke="#666"
                  />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number) => [value, 'Visitors']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hourly Distribution */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Hourly Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip formatter={(value: number) => [value, 'Visitors']} />
                  <Bar 
                    dataKey="visitors" 
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip formatter={(value: number) => [value, 'Visitors']} />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div className="card mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <TrendingUpIcon className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-900">Peak Performance</h3>
              </div>
              <p className="text-sm text-blue-700">
                Your busiest hour is {analytics?.weeklyStats.peakHour}, with an average of 22 visitors.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CalendarDaysIcon className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-medium text-green-900">Weekly Growth</h3>
              </div>
              <p className="text-sm text-green-700">
                Visitor count increased by {analytics?.weeklyStats.changeFromLastWeek.toFixed(1)}% compared to last week.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <ChartBarIcon className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="font-medium text-purple-900">Daily Average</h3>
              </div>
              <p className="text-sm text-purple-700">
                You're averaging {analytics?.weeklyStats.averageDaily.toFixed(1)} visitors per day this week.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}