import React, { useRef, useState, useEffect } from 'react';
import styles from '../styles/userChat.module.css';
import { FaPlay, FaPause } from 'react-icons/fa';

const AudioPlayer = ({ src }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;

        const updateProgress = () => {
            if (audio && audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
                setCurrentTime(audio.currentTime);
            }
        };

        const setAudioDuration = () => {
            if (audio && audio.duration) {
                setDuration(audio.duration);
            }
        };

        const handleAudioEnd = () => {
            setIsPlaying(false);
            setProgress(0); 
            setCurrentTime(0); 
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', setAudioDuration);
        audio.addEventListener('ended', handleAudioEnd);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', setAudioDuration);
            audio.removeEventListener('ended', handleAudioEnd);
        };
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        if (!audio) return;

        const rect = e.target.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newProgress = (clickX / rect.width) * 100;
        const newTime = (newProgress / 100) * duration; 

        audio.currentTime = newTime;
        setProgress(newProgress);
        setCurrentTime(newTime); 
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        handleSeek(e);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            handleSeek(e);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.audioPlayerContainer}>
            <audio ref={audioRef} src={src} preload="none" />
            <button className={styles.audioButton} onClick={togglePlay}>
                {isPlaying ? <FaPause /> : <FaPlay />}
            </button>

            <div
                className={styles.audioTrackWrapper}
                onClick={handleSeek}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div
                    className={styles.audioProgress}
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className={styles.audioTime}>
                {formatTime(currentTime)} / {formatTime(duration)}
            </div>
        </div>
    );
};

export default AudioPlayer;
