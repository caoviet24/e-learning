'use client';

import { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Video, Mic, MicOff, VideoOff, Send, UserPlus, ScreenShare, Maximize, Minimize } from 'lucide-react';
import { VideoPlayer } from '@/components/video-player';
import { myAccount } from '@/content/data';

// Mock data for messages
const mockMessages = [
    { id: 1, sender: 'Nguyễn Văn A', content: 'Xin chào mọi người!', time: '14:20' },
    { id: 2, sender: 'Trần Thị B', content: 'Chào bạn!', time: '14:21' },
    { id: 3, sender: 'Giảng viên', content: 'Hôm nay chúng ta sẽ học về...', time: '14:22' },
    { id: 4, sender: 'Nguyễn Văn A', content: 'Xin chào mọi người!', time: '14:20' },
    { id: 5, sender: 'Trần Thị B', content: 'Chào bạn!', time: '14:21' },
    { id: 6, sender: 'Giảng viên', content: 'Hôm nay chúng ta sẽ học về...', time: '14:22' },
    { id: 7, sender: 'Nguyễn Văn A', content: 'Xin chào mọi người!', time: '14:20' },
    { id: 8, sender: 'Trần Thị B', content: 'Chào bạn!', time: '14:21' },
    { id: 9, sender: 'Giảng viên', content: 'Hôm nay chúng ta sẽ học về...', time: '14:22' },
    { id: 10, sender: 'Nguyễn Văn A', content: 'Xin chào mọi người!', time: '14:20' },
    { id: 11, sender: 'Trần Thị B', content: 'Chào bạn!', time: '14:21' },
    { id: 12, sender: 'Giảng viên', content: 'Hôm nay chúng ta sẽ học về...', time: '14:22' },
];

// Mock data for participants with streams
const mockParticipants = [
    { id: 1, name: 'Giảng viên', role: 'teacher', stream: null, hasVideo: false },
    { id: 2, name: 'Nguyễn Văn A', role: 'student', stream: null, hasVideo: false },
    { id: 3, name: 'Trần Thị B', role: 'student', stream: null, hasVideo: false },
    { id: 4, ...myAccount, stream: null, hasVideo: false },
];

// Function to find teacher participant
const findTeacherParticipant = () => mockParticipants.find((p) => p.role === 'teacher');

export default function ClassDetail() {
    const [message, setMessage] = useState('');
    const [videoEnabled, setVideoEnabled] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isWebcamMaximized, setIsWebcamMaximized] = useState(false);
    const [focusedParticipant, setFocusedParticipant] = useState<number | null>(null);
    const [localParticipants, setLocalParticipants] = useState(mockParticipants);

    // Set initial focus on teacher
    useEffect(() => {
        const teacher = findTeacherParticipant();
        if (teacher) {
            setFocusedParticipant(teacher.id);
        }
    }, []);

    // Update participant video state when local video is toggled
    useEffect(() => {
        setLocalParticipants((prev) => prev.map((p) => (p.id === 1 ? { ...p, hasVideo: videoEnabled } : p)));
    }, [videoEnabled]);

    // Initialize video and audio streams
    const initializeMedia = async () => {
        try {
            if (videoEnabled && audioEnabled) {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: videoEnabled,
                    audio: audioEnabled,
                });
                setLocalStream(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }
        } catch (err) {
            console.error('Error accessing media devices:', err);
        }
    };

    // Toggle video
    const toggleVideo = () => {
        if (!videoEnabled && !localStream) {
            setVideoEnabled(true);
            initializeMedia();
        } else if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoEnabled;
                setVideoEnabled(!videoEnabled);
            }
        }
    };

    // Toggle audio
    const toggleAudio = () => {
        if (!audioEnabled && !localStream) {
            setAudioEnabled(true);
            initializeMedia();
        } else if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioEnabled;
                setAudioEnabled(!audioEnabled);
            }
        }
    };

    // Screen sharing
    const toggleScreenShare = async () => {
        if (isScreenSharing) {
            if (localStream && videoRef.current) {
                videoRef.current.srcObject = localStream;
            }
            setIsScreenSharing(false);
        } else {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true,
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = screenStream;
                }
                setIsScreenSharing(true);

                screenStream.getVideoTracks()[0].addEventListener('ended', () => {
                    if (videoRef.current && localStream) {
                        videoRef.current.srcObject = localStream;
                    }
                    setIsScreenSharing(false);
                });
            } catch (err) {
                console.error('Error sharing screen:', err);
            }
        }
    };

    // Cleanup when component unmounts
    useEffect(() => {
        return () => {
            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [localStream]);

    return (
        <div className=" px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main content - Video area */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Video Meeting</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative w-full">
                                {/* Main video area */}
                                <div className="relative w-full aspect-video rounded-lg bg-black overflow-hidden">
                                    {isScreenSharing ? (
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            {focusedParticipant ? (
                                                <>
                                                    {localParticipants.find((p) => p.id === focusedParticipant)
                                                        ?.hasVideo ? (
                                                        <VideoPlayer stream={localStream} />
                                                    ) : (
                                                        <div className="text-white text-2xl">
                                                            {
                                                                localParticipants.find(
                                                                    (p) => p.id === focusedParticipant,
                                                                )?.name
                                                            }
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-white text-xl">No participant focused</div>
                                            )}
                                        </div>
                                    )}

                                    {/* Small video overlay */}
                                    {!isScreenSharing && videoEnabled && (
                                        <div
                                            className={`absolute top-4 left-4 transition-all duration-300 ${
                                                isWebcamMaximized ? 'w-full h-full' : 'w-64'
                                            }`}
                                        >
                                            <div className="relative group" style={{ aspectRatio: '16/9' }}>
                                                <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden">
                                                    {videoEnabled ? (
                                                        <VideoPlayer stream={localStream} />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white">
                                                            {localParticipants[0].name}
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Resize control */}
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => setIsWebcamMaximized(!isWebcamMaximized)}
                                                >
                                                    {isWebcamMaximized ? (
                                                        <Minimize className="h-4 w-4" />
                                                    ) : (
                                                        <Maximize className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Participants list */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <span className="w-52 text-lg font-bold">Tham gia ({mockParticipants.length})</span>
                            <Input placeholder="Tìm kiếm" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {localParticipants.map((participant) => (
                                    <div
                                        key={participant.id}
                                        className={`flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors ${
                                            focusedParticipant === participant.id ? 'bg-accent' : ''
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                {participant.role === 'teacher' ? '👨‍🏫' : '👤'}
                                            </div>
                                            <div>
                                                <div className="font-medium flex items-center gap-2">
                                                    {participant.name}
                                                    {participant.role === 'teacher' && (
                                                        <span className="text-xs bg-primary/10 px-2 py-0.5 rounded">
                                                            Teacher
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {participant.hasVideo ? 'Camera On' : 'Camera Off'}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant={focusedParticipant === participant.id ? 'secondary' : 'outline'}
                                            size="sm"
                                            onClick={() => setFocusedParticipant(participant.id)}
                                        >
                                            Focus
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Chat and preview sidebar */}
                <div className="space-y-4 flex flex-col h-[calc(100vh-6rem)]">
                    {/* Local Preview */}
                    <Card className="shrink-0">
                        <CardHeader>
                            <CardTitle>Your Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video rounded-lg bg-black overflow-hidden mb-4">
                                {videoEnabled ? (
                                    <VideoPlayer stream={localStream} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white text-lg">
                                        {myAccount.name}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2  justify-center">
                                <Button variant="outline" size="icon" onClick={toggleVideo}>
                                    {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                                </Button>
                                <Button variant="outline" size="icon" onClick={toggleAudio}>
                                    {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                                </Button>
                                <Button
                                    variant={isScreenSharing ? 'secondary' : 'outline'}
                                    size="icon"
                                    onClick={toggleScreenShare}
                                >
                                    <ScreenShare className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                    <UserPlus className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Chat */}
                    <Card className="flex-1 h-44">
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
                                        if (e.key === 'Enter' && message) {
                                            // Handle send message
                                            setMessage('');
                                        }
                                    }}
                                />
                                <Button
                                    size="icon"
                                    onClick={() => {
                                        if (message) {
                                            // Handle send message
                                            setMessage('');
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
        </div>
    );
}
