'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Monitor,
  MonitorOff,
  Settings,
  Users,
  MessageSquare
} from 'lucide-react'

interface VideoCallProps {
  meetingUrl: string
  onEndCall: () => void
  isHost?: boolean
  participants?: Array<{
    id: string
    name: string
    isVideoOn: boolean
    isAudioOn: boolean
  }>
}

export default function VideoCall({ 
  meetingUrl, 
  onEndCall, 
  isHost = false,
  participants = []
}: VideoCallProps) {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string
    sender: string
    message: string
    timestamp: Date
  }>>([])
  const [newMessage, setNewMessage] = useState('')

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    initializeVideoCall()
    return () => {
      cleanup()
    }
  }, [])

  const initializeVideoCall = async () => {
    try {
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      streamRef.current = stream
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // In a real implementation, you would connect to your video calling service
      // (like WebRTC, Agora, Twilio, etc.) here
      console.log('Video call initialized with meeting URL:', meetingUrl)
      
    } catch (error) {
      console.error('Error accessing camera/microphone:', error)
      // Fallback to audio-only call
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true
        })
        streamRef.current = audioStream
        setIsVideoOn(false)
      } catch (audioError) {
        console.error('Error accessing microphone:', audioError)
      }
    }
  }

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOn(videoTrack.enabled)
      }
    }
  }

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioOn(audioTrack.enabled)
      }
    }
  }

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        })
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream
        }
        
        setIsScreenSharing(true)
      } else {
        // Stop screen sharing and return to camera
        if (localVideoRef.current && streamRef.current) {
          localVideoRef.current.srcObject = streamRef.current
        }
        setIsScreenSharing(false)
      }
    } catch (error) {
      console.error('Error toggling screen share:', error)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real implementation, you would start/stop recording here
    console.log('Recording', !isRecording ? 'started' : 'stopped')
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: 'You',
        message: newMessage,
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, message])
      setNewMessage('')
    }
  }

  const endCall = () => {
    cleanup()
    onEndCall()
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col">
      {/* Main Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video (Main) */}
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          {participants.length > 0 ? (
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-lg">Waiting for participants...</p>
            </div>
          ) : (
            <div className="text-center text-white">
              <Video className="w-24 h-24 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">Call in progress</p>
              <p className="text-sm text-gray-400 mt-2">Meeting URL: {meetingUrl}</p>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {!isVideoOn && (
            <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
              <VideoOff className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Participants List Overlay */}
        {showParticipants && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded-lg max-w-xs">
            <h3 className="font-semibold mb-3">Participants ({participants.length + 1})</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">You</span>
                </div>
                <span className="text-sm">You</span>
                {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-red-500" />}
                {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4 text-red-500" />}
              </div>
              {participants.map(participant => (
                <div key={participant.id} className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">{participant.name[0]}</span>
                  </div>
                  <span className="text-sm">{participant.name}</span>
                  {participant.isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-red-500" />}
                  {participant.isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4 text-red-500" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Overlay */}
        {showChat && (
          <div className="absolute bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Chat</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chatMessages.map(message => (
                <div key={message.id} className="text-sm">
                  <span className="font-medium text-emerald-600">{message.sender}:</span>
                  <span className="ml-2">{message.message}</span>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={sendMessage}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4">
        <div className="flex items-center justify-center space-x-4">
          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${
              isVideoOn ? 'bg-gray-600 text-white' : 'bg-red-600 text-white'
            } hover:opacity-80 transition-opacity`}
          >
            {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>

          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full ${
              isAudioOn ? 'bg-gray-600 text-white' : 'bg-red-600 text-white'
            } hover:opacity-80 transition-opacity`}
          >
            {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`p-3 rounded-full ${
              isScreenSharing ? 'bg-emerald-600 text-white' : 'bg-gray-600 text-white'
            } hover:opacity-80 transition-opacity`}
          >
            {isScreenSharing ? <MonitorOff className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
          </button>

          {/* Participants */}
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="p-3 rounded-full bg-gray-600 text-white hover:opacity-80 transition-opacity"
          >
            <Users className="w-6 h-6" />
          </button>

          {/* Chat */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-3 rounded-full bg-gray-600 text-white hover:opacity-80 transition-opacity"
          >
            <MessageSquare className="w-6 h-6" />
          </button>

          {/* Recording (Host only) */}
          {isHost && (
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-full ${
                isRecording ? 'bg-red-600 text-white' : 'bg-gray-600 text-white'
              } hover:opacity-80 transition-opacity`}
            >
              <div className={`w-6 h-6 rounded-full ${isRecording ? 'bg-white' : 'border-2 border-white'}`} />
            </button>
          )}

          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 rounded-full bg-gray-600 text-white hover:opacity-80 transition-opacity"
          >
            <Settings className="w-6 h-6" />
          </button>

          {/* End Call */}
          <button
            onClick={endCall}
            className="p-3 rounded-full bg-red-600 text-white hover:opacity-80 transition-opacity"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-6 w-80">
          <h3 className="font-semibold mb-4">Call Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Camera
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Default Camera</option>
                <option>Front Camera</option>
                <option>Back Camera</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Microphone
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Default Microphone</option>
                <option>Built-in Microphone</option>
                <option>External Microphone</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speaker
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Default Speaker</option>
                <option>Built-in Speaker</option>
                <option>External Speaker</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


