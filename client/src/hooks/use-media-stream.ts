import { useState, useEffect } from 'react';

interface UseMediaStreamProps {
    type?: 'camera' | 'screen';
}

export const useMediaStream = ({ type = 'camera' }: UseMediaStreamProps = {}) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;

        const enableStream = async () => {
            try {
                let mediaStream: MediaStream;

                if (type === 'screen') {
                    mediaStream = await navigator.mediaDevices.getDisplayMedia({
                        video: true,
                        audio: true
                    });
                } else {
                    mediaStream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: true,
                    });
                }

                if (mounted) {
                    setStream(mediaStream);
                }
            } catch (err) {
                if (mounted) {
                    setError(err as Error);
                }
            }
        };

        enableStream();

        return () => {
            mounted = false;
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [type]);

    return { stream, error };
};
