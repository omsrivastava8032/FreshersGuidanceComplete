import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';

interface VideoCallProps {
  mentorName: string;
  onEndCall: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ mentorName, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const initializeCall = async () => {
      try {
        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Initialize WebRTC
        peerConnection.current = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
          ]
        });

        // Add local stream to peer connection
        stream.getTracks().forEach(track => {
          if (peerConnection.current) {
            peerConnection.current.addTrack(track, stream);
          }
        });

        // Handle incoming stream
        peerConnection.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Simulate connection (in a real app, you'd implement signaling)
        setTimeout(() => {
          setIsConnecting(false);
        }, 2000);

      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeCall();

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  const toggleMute = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleEndCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    onEndCall();
  };

  return (
    <div className="fixed inset-0 bg-background z-50">
      <div className="container mx-auto h-full flex flex-col">
        <div className="flex-1 relative">
          {/* Remote Video */}
          <div className="absolute inset-0 bg-muted rounded-lg overflow-hidden">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* Local Video */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-muted rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>

          {/* Connecting Overlay */}
          {isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium">Connecting with {mentorName}...</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="py-4">
          <Card>
            <CardContent className="flex items-center justify-center gap-4 p-4">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMute}
                className={isMuted ? 'bg-destructive/10 text-destructive' : ''}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleVideo}
                className={isVideoOff ? 'bg-destructive/10 text-destructive' : ''}
              >
                {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={handleEndCall}
              >
                <Phone className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoCall; 