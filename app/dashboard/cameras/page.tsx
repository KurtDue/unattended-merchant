'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  VideoCameraIcon,
  PlayIcon,
  PauseIcon,
  ArrowsPointingOutIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Camera {
  id: string
  name: string
  location: string
  status: 'online' | 'offline' | 'maintenance'
  stream_url: string
  lastUpdate: string
  resolution: string
  type: 'security' | 'entrance' | 'overview'
}

export default function CamerasPage() {
  const { user, selectedStore } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [cameras, setCameras] = useState<Camera[]>([])
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null)
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    loadCameras()
  }, [user, router, selectedStore])

  const loadCameras = async () => {
    setLoading(true)
    
    try {
      // Simulate loading camera data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock camera data - in production this would come from your API
      const mockCameras: Camera[] = [
        {
          id: 'cam-001',
          name: 'Front Entrance',
          location: 'Main Entry',
          status: 'online',
          stream_url: 'rtmp://demo.stream/front',
          lastUpdate: new Date().toISOString(),
          resolution: '1920x1080',
          type: 'entrance'
        },
        {
          id: 'cam-002',
          name: 'Store Overview',
          location: 'Center Ceiling',
          status: 'online',
          stream_url: 'rtmp://demo.stream/overview',
          lastUpdate: new Date().toISOString(),
          resolution: '1280x720',
          type: 'overview'
        },
        {
          id: 'cam-003',
          name: 'Security Camera',
          location: 'Back Exit',
          status: 'maintenance',
          stream_url: 'rtmp://demo.stream/security',
          lastUpdate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          resolution: '1920x1080',
          type: 'security'
        },
        {
          id: 'cam-004',
          name: 'Parking Area',
          location: 'External',
          status: 'offline',
          stream_url: 'rtmp://demo.stream/parking',
          lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          resolution: '1280x720',
          type: 'security'
        }
      ]
      
      setCameras(mockCameras)
      setSelectedCamera(mockCameras[0])
    } catch (error) {
      console.error('Error loading cameras:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayPause = (cameraId: string) => {
    setIsPlaying(prev => ({
      ...prev,
      [cameraId]: !prev[cameraId]
    }))
  }

  const getStatusColor = (status: Camera['status']) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-100'
      case 'offline':
        return 'text-red-600 bg-red-100'
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: Camera['type']) => {
    const iconClass = "w-5 h-5"
    switch (type) {
      case 'entrance':
        return <ArrowsPointingOutIcon className={iconClass} />
      case 'overview':
        return <VideoCameraIcon className={iconClass} />
      case 'security':
        return <Cog6ToothIcon className={iconClass} />
      default:
        return <VideoCameraIcon className={iconClass} />
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

  const onlineCameras = cameras.filter(c => c.status === 'online').length
  const totalCameras = cameras.length

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Security Cameras</h1>
          <p className="mt-2 text-gray-600">
            Monitor live feeds from {selectedStore?.name}
          </p>
        </div>

        {/* Camera Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Online Cameras</p>
                <p className="text-2xl font-bold text-gray-900">{onlineCameras}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50">
                <VideoCameraIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cameras</p>
                <p className="text-2xl font-bold text-gray-900">{totalCameras}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-50">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Issues</p>
                <p className="text-2xl font-bold text-gray-900">
                  {cameras.filter(c => c.status !== 'online').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Feed */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedCamera?.name || 'Select a Camera'}
                </h2>
                {selectedCamera && (
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      getStatusColor(selectedCamera.status)
                    }`}>
                      {selectedCamera.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedCamera.resolution}
                    </span>
                  </div>
                )}
              </div>
              
              {selectedCamera ? (
                <div className="relative">
                  {/* Video Placeholder */}
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {selectedCamera.status === 'online' ? (
                      <>
                        {/* Simulated live feed placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                          <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium animate-pulse">
                            ● LIVE
                          </div>
                          <div className="absolute bottom-4 left-4 text-white text-sm">
                            {new Date().toLocaleTimeString()}
                          </div>
                          
                          {/* Camera feed simulation */}
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center text-white">
                              <VideoCameraIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                              <p className="text-lg font-medium">Live Camera Feed</p>
                              <p className="text-sm opacity-75">{selectedCamera.name}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Video Controls */}
                        <div className="absolute bottom-4 right-4 flex space-x-2">
                          <button
                            onClick={() => handlePlayPause(selectedCamera.id)}
                            className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                          >
                            {isPlaying[selectedCamera.id] ? (
                              <PauseIcon className="w-5 h-5" />
                            ) : (
                              <PlayIcon className="w-5 h-5" />
                            )}
                          </button>
                          <button className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all">
                            <ArrowsPointingOutIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-400">
                        <ExclamationTriangleIcon className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-lg font-medium">Camera Offline</p>
                        <p className="text-sm">{selectedCamera.name} is currently {selectedCamera.status}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Camera Info */}
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <span className="ml-2 font-medium">{selectedCamera.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Update:</span>
                      <span className="ml-2 font-medium">
                        {new Date(selectedCamera.lastUpdate).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <VideoCameraIcon className="w-16 h-16 mx-auto mb-4" />
                    <p>Select a camera to view feed</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Camera List */}
          <div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Cameras</h3>
              <div className="space-y-3">
                {cameras.map((camera) => (
                  <div
                    key={camera.id}
                    onClick={() => setSelectedCamera(camera)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedCamera?.id === camera.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${
                          camera.status === 'online' ? 'bg-green-100 text-green-600' :
                          camera.status === 'offline' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {getTypeIcon(camera.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{camera.name}</h4>
                          <p className="text-xs text-gray-500">{camera.location}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        getStatusColor(camera.status)
                      }`}>
                        {camera.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {camera.resolution} • Updated {new Date(camera.lastUpdate).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coming Soon */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Coming Soon</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>Motion Detection Alerts</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>Recording & Playback</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>AI-Powered Analytics</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span>Mobile App Integration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}