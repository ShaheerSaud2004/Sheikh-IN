'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { 
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Video,
  Users,
  Settings,
  Filter
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns'

interface CalendarEvent {
  id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  eventType: 'AVAILABILITY' | 'BOOKING' | 'BREAK' | 'PERSONAL'
  serviceType?: string
  location?: string
  isBooked: boolean
  meetingUrl?: string
  status: 'AVAILABLE' | 'BOOKED' | 'CANCELLED' | 'COMPLETED'
  user: {
    profile: {
      name: string
    }
  }
}

interface Booking {
  id: string
  serviceType: string
  startTime: string
  endTime: string
  location?: string
  description?: string
  status: string
  meetingUrl?: string
  notes?: string
  price?: number
  sheikh: {
    profile: { name: string }
  }
  client: {
    profile: { name: string }
  }
}

export default function CalendarPage() {
  const { user, token } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  useEffect(() => {
    fetchCalendarData()
  }, [currentDate, token])

  const fetchCalendarData = async () => {
    if (!token) return

    try {
      setLoading(true)
      const start = format(startOfMonth(currentDate), 'yyyy-MM-dd')
      const end = format(endOfMonth(currentDate), 'yyyy-MM-dd')

      // Fetch calendar events
      const eventsResponse = await fetch(`/api/calendar?start=${start}&end=${end}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json()
        setEvents(eventsData.events || [])
      }

      // Fetch bookings
      const bookingsResponse = await fetch(`/api/bookings?start=${start}&end=${end}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData.bookings || [])
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.startTime), date)
    )
  }

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => 
      isSameDay(new Date(booking.startTime), date)
    )
  }

  const getEventColor = (event: CalendarEvent) => {
    switch (event.eventType) {
      case 'AVAILABILITY': return 'bg-green-100 text-green-800 border-green-200'
      case 'BOOKING': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'BREAK': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'PERSONAL': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
            {day}
          </div>
        ))}
        {days.map(day => {
          const dayEvents = getEventsForDate(day)
          const dayBookings = getBookingsForDate(day)
          const isToday = isSameDay(day, new Date())
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[120px] p-1 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
                !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
              } ${isToday ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded border ${getEventColor(event)} truncate`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedEvent(event)
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 2} more
                  </div>
                )}
                {dayBookings.map(booking => (
                  <div
                    key={booking.id}
                    className="text-xs p-1 rounded bg-blue-100 text-blue-800 border border-blue-200 truncate"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle booking click
                    }}
                  >
                    📅 {booking.serviceType}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderEventModal = () => {
    if (!selectedEvent) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">{selectedEvent.title}</h3>
          
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              {format(new Date(selectedEvent.startTime), 'MMM d, yyyy h:mm a')} - 
              {format(new Date(selectedEvent.endTime), 'h:mm a')}
            </div>
            
            {selectedEvent.location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {selectedEvent.location}
              </div>
            )}
            
            {selectedEvent.meetingUrl && (
              <div className="flex items-center text-sm text-gray-600">
                <Video className="w-4 h-4 mr-2" />
                <a href={selectedEvent.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Join Video Call
                </a>
              </div>
            )}
            
            {selectedEvent.description && (
              <div className="text-sm text-gray-700">
                {selectedEvent.description}
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-6 space-x-2">
            <button
              onClick={() => setSelectedEvent(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
            {user?.userType === 'PROFESSIONAL' && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <CalendarIcon className="w-8 h-8 mr-3 text-emerald-600" />
              Calendar
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your availability and view your bookings
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex bg-white rounded-lg border">
              <button
                onClick={() => setView('month')}
                className={`px-4 py-2 rounded-l-lg ${
                  view === 'month' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-4 py-2 ${
                  view === 'week' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView('day')}
                className={`px-4 py-2 rounded-r-lg ${
                  view === 'day' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Day
              </button>
            </div>
            
            {user?.userType === 'PROFESSIONAL' && (
              <button
                onClick={() => setShowEventModal(true)}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </button>
            )}
          </div>
        </div>

        {/* Calendar Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ←
              </button>
              <h2 className="text-xl font-semibold">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                →
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
          
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              renderMonthView()
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="font-semibold mb-3">Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded mr-2"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded mr-2"></div>
              <span className="text-sm">Booked</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded mr-2"></div>
              <span className="text-sm">Break</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded mr-2"></div>
              <span className="text-sm">Personal</span>
            </div>
          </div>
        </div>
      </div>

      {renderEventModal()}
    </div>
  )
}

