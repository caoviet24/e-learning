"use client"

import { useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Video, Mic, MicOff, VideoOff, Send, UserPlus, ScreenShare } from "lucide-react"
import { VideoPlayer } from "@/components/video-player"
import { useMediaStream } from "@/hooks/use-media-stream"

// Mock data for messages
const mockMessages = [
  { id: 1, sender: "Nguyễn Văn A", content: "Xin chào mọi người!", time: "14:20" },
  { id: 2, sender: "Trần Thị B", content: "Chào bạn!", time: "14:21" },
  { id: 3, sender: "Giảng viên", content: "Hôm nay chúng ta sẽ học về...", time: "14:22" }
]

// Mock data for participants with streams
const mockParticipants = [
  { id: 1, name: "Giảng viên", role: "teacher", stream: null },
  { id: 2, name: "Nguyễn Văn A", role: "student", stream: null },
  { id: 3, name: "Trần Thị B", role: "student", stream: null },
]

export default function ClassDetail() {
  const [message, setMessage] = useState("")
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  
  const { stream: cameraStream, error: cameraError } = useMediaStream({ 
    type: 'camera' 
  })
  const { stream: screenStream, error: screenError } = useMediaStream({ 
    type: 'screen' 
  })

  // Use screen share stream if active, otherwise use camera stream
  const currentStream = isScreenSharing ? screenStream : cameraStream

  const toggleVideo = () => {
    if (currentStream) {
      currentStream.getVideoTracks().forEach(track => {
        track.enabled = !videoEnabled
      })
      setVideoEnabled(!videoEnabled)
    }
  }

  const toggleAudio = () => {
    if (currentStream) {
      currentStream.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled
      })
      setAudioEnabled(!audioEnabled)
    }
  }

  const toggleScreenShare = async () => {
    setIsScreenSharing(!isScreenSharing)
  }

  // Update mock participants with real stream for the current user
  const participantsWithStreams = mockParticipants.map((p, index) => {
    if (index === 0) { // Assume current user is first
      return { ...p, stream: currentStream }
    }
    return p
  })

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsSharing(true);

      // Stop sharing when the stream ends
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        setIsSharing(false);
      });
    } catch (err) {
      console.error("Error sharing screen:", err);
    }
  };

  return (
    <div className="container py-6">
        <div className="p-4 space-y-4">
      <button
        onClick={startScreenShare}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow"
        disabled={isSharing}
      >
        {isSharing ? "Đang chia sẻ..." : "Bắt đầu chia sẻ màn hình"}
      </button>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-96 border border-gray-300 rounded-lg shadow"
      />
    </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content - Video area */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Video Meeting</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={toggleVideo}
                >
                  {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={toggleAudio}
                >
                  {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant={isScreenSharing ? 'secondary' : 'outline'}
                  size="icon"
                  onClick={toggleScreenShare}
                >
                  <ScreenShare className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {participantsWithStreams.map((participant) => (
                  <div
                    key={participant.id}
                    className="aspect-video bg-muted rounded-lg overflow-hidden"
                  >
                    {participant.stream ? (
                      <VideoPlayer 
                        stream={participant.stream} 
                        muted={participant.id === 1} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">{participant.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Participants list */}
          <Card>
            <CardHeader>
              <CardTitle>Participants ({mockParticipants.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {participantsWithStreams.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                  >
                    <span>{participant.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground capitalize">
                        {participant.role}
                      </span>
                      {participant.stream && (
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-xs text-muted-foreground">Live</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat sidebar */}
        <Card className="h-[calc(100vh-6rem)]">
          <CardHeader>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {mockMessages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{msg.sender}</span>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-sm">{msg.content}</p>
                </div>
              ))}
            </div>

            {/* Message input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && message) {
                    // Handle send message
                    setMessage("")
                  }
                }}
              />
              <Button 
                size="icon"
                onClick={() => {
                  if (message) {
                    // Handle send message
                    setMessage("")
                  }
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
