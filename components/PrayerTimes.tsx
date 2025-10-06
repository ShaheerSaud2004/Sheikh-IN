'use client'

import { useState, useEffect } from 'react'
import { 
  Clock, 
  MapPin, 
  Compass,
  Sun,
  Moon,
  Sunrise,
  Sunset
} from 'lucide-react'

interface PrayerTime {
  name: string
  time: string
  icon: any
  color: string
}

interface PrayerTimesData {
  date: string
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
  qibla: number
}

export default function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060 }) // Default to NYC
  const [qiblaDirection, setQiblaDirection] = useState(0)
  const [compassRotation, setCompassRotation] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    getCurrentLocation()
  }, [])

  useEffect(() => {
    if (location.lat && location.lng) {
      fetchPrayerTimes()
      calculateQiblaDirection()
    }
  }, [location])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          setError('Unable to get your location. Using default location.')
        }
      )
    } else {
      setError('Geolocation is not supported by this browser.')
    }
  }

  const fetchPrayerTimes = async () => {
    try {
      // In a real implementation, you would use an Islamic prayer times API
      // For demo purposes, we'll use mock data
      const today = new Date()
      const mockPrayerTimes: PrayerTimesData = {
        date: today.toISOString().split('T')[0],
        fajr: '05:30',
        sunrise: '06:45',
        dhuhr: '12:15',
        asr: '15:30',
        maghrib: '18:45',
        isha: '20:00',
        qibla: 58.5 // Qibla direction in degrees
      }
      setPrayerTimes(mockPrayerTimes)
    } catch (error) {
      console.error('Error fetching prayer times:', error)
      setError('Unable to fetch prayer times')
    }
  }

  const calculateQiblaDirection = () => {
    // Simplified Qibla calculation
    // In a real implementation, you would use proper spherical geometry
    const meccaLat = 21.4225
    const meccaLng = 39.8262
    
    const lat1 = (location.lat * Math.PI) / 180
    const lat2 = (meccaLat * Math.PI) / 180
    const deltaLng = ((meccaLng - location.lng) * Math.PI) / 180
    
    const y = Math.sin(deltaLng) * Math.cos(lat2)
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng)
    
    let bearing = (Math.atan2(y, x) * 180) / Math.PI
    bearing = (bearing + 360) % 360
    
    setQiblaDirection(bearing)
  }

  const getCurrentPrayer = () => {
    if (!prayerTimes) return null

    const now = currentTime
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    const prayers = [
      { name: 'Fajr', time: prayerTimes.fajr },
      { name: 'Dhuhr', time: prayerTimes.dhuhr },
      { name: 'Asr', time: prayerTimes.asr },
      { name: 'Maghrib', time: prayerTimes.maghrib },
      { name: 'Isha', time: prayerTimes.isha }
    ]

    for (let i = 0; i < prayers.length; i++) {
      if (currentTimeStr < prayers[i].time) {
        return prayers[i]
      }
    }
    
    // If it's past Isha, next prayer is tomorrow's Fajr
    return prayers[0]
  }

  const getTimeUntilNextPrayer = () => {
    const nextPrayer = getCurrentPrayer()
    if (!nextPrayer || !prayerTimes) return null

    const now = currentTime
    const [hours, minutes] = nextPrayer.time.split(':').map(Number)
    const nextPrayerTime = new Date(now)
    nextPrayerTime.setHours(hours, minutes, 0, 0)
    
    // If the time has passed today, it's tomorrow's prayer
    if (nextPrayerTime <= now) {
      nextPrayerTime.setDate(nextPrayerTime.getDate() + 1)
    }
    
    const diffMs = nextPrayerTime.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${diffHours}h ${diffMinutes}m`
  }

  const prayerTimesList: PrayerTime[] = prayerTimes ? [
    { name: 'Fajr', time: prayerTimes.fajr, icon: Sun, color: 'text-orange-500' },
    { name: 'Sunrise', time: prayerTimes.sunrise, icon: Sunrise, color: 'text-yellow-500' },
    { name: 'Dhuhr', time: prayerTimes.dhuhr, icon: Sun, color: 'text-blue-500' },
    { name: 'Asr', time: prayerTimes.asr, icon: Sun, color: 'text-green-500' },
    { name: 'Maghrib', time: prayerTimes.maghrib, icon: Sunset, color: 'text-red-500' },
    { name: 'Isha', time: prayerTimes.isha, icon: Moon, color: 'text-purple-500' }
  ] : []

  const getCurrentPrayerIndex = () => {
    const nextPrayer = getCurrentPrayer()
    if (!nextPrayer) return -1
    
    return prayerTimesList.findIndex(prayer => prayer.name === nextPrayer.name)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <Clock className="w-5 h-5 mr-2 text-emerald-600" />
          Prayer Times
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-1" />
          {location.lat.toFixed(2)}, {location.lng.toFixed(2)}
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800">{error}</p>
        </div>
      )}

      {prayerTimes && (
        <>
          {/* Current Time and Next Prayer */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              {getCurrentPrayer() && (
                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm text-gray-600">Next Prayer</div>
                  <div className="text-lg font-semibold text-emerald-600">
                    {getCurrentPrayer()?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getCurrentPrayer()?.time} • {getTimeUntilNextPrayer()} remaining
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Prayer Times List */}
          <div className="space-y-2 mb-6">
            {prayerTimesList.map((prayer, index) => {
              const Icon = prayer.icon
              const isNext = getCurrentPrayerIndex() === index
              
              return (
                <div
                  key={prayer.name}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isNext ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className={`w-5 h-5 mr-3 ${prayer.color}`} />
                    <span className={`font-medium ${isNext ? 'text-emerald-700' : 'text-gray-700'}`}>
                      {prayer.name}
                    </span>
                    {isNext && (
                      <span className="ml-2 px-2 py-1 bg-emerald-600 text-white text-xs rounded-full">
                        Next
                      </span>
                    )}
                  </div>
                  <span className={`font-mono ${isNext ? 'text-emerald-700' : 'text-gray-600'}`}>
                    {prayer.time}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Qibla Compass */}
          <div className="border-t pt-6">
            <h4 className="text-md font-semibold mb-4 flex items-center">
              <Compass className="w-5 h-5 mr-2 text-emerald-600" />
              Qibla Direction
            </h4>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                {/* Compass Background */}
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 bg-white shadow-lg">
                  {/* Compass Points */}
                  <div className="absolute inset-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-8">N</div>
                      <div className="flex justify-between items-center w-full px-4">
                        <div className="text-xs text-gray-500">W</div>
                        <div className="text-xs text-gray-500">E</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-8">S</div>
                    </div>
                  </div>
                  
                  {/* Qibla Arrow */}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `rotate(${qiblaDirection}deg)` }}
                  >
                    <div className="w-1 h-16 bg-emerald-600 rounded-full relative">
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-emerald-600"></div>
                    </div>
                  </div>
                  
                  {/* Center Dot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                  </div>
                </div>
                
                {/* Qibla Direction Text */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="text-lg font-bold text-emerald-600">
                    {Math.round(qiblaDirection)}°
                  </div>
                  <div className="text-xs text-gray-500">from North</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

