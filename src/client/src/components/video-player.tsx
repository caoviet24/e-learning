"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoPlayerProps {
  stream: MediaStream | null
  muted?: boolean
  className?: string
}

export function VideoPlayer({ stream, muted = false, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  const handleFullscreenChange = () => {
    if (document.fullscreenElement) {
      setIsFullscreen(true)
    } else {
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    if (!videoRef.current) return

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await videoRef.current.requestFullscreen()
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err)
    }
  }

  return (
    <>
      <div className="relative group">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className={`w-full h-full object-cover rounded-lg cursor-pointer ${className}`}
          onClick={() => setDialogOpen(true)}
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-black/50 hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation()
              toggleFullscreen()
            }}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-screen-lg w-[90vw] h-[80vh] p-0">
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={muted}
              className="w-full h-full object-contain"
            />
            <div className="absolute top-4 right-4">
              <Button 
                variant="secondary" 
                size="icon" 
                className="bg-black/50 hover:bg-black/70"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}