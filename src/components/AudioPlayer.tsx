import React, { useRef } from 'react';

const AudioPlayer: React.FC<{url: string }> = ({ url }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlay = () => {
        if (audioRef.current != null) {
            audioRef.current!.play();
        }
    };

    const handlePause = () => {
        if (audioRef.current != null) {
            audioRef.current!.pause();
        }
    };

    return (
        <div>
            <audio
                ref={audioRef}
                src={url}
                loop
                controls
            />
            <button onClick={handlePlay}>Play</button>
            <button onClick={handlePause}>Pause</button>
        </div>
    );
};

export default AudioPlayer;