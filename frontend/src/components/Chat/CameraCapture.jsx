import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/userChat.module.css';
import { FaCamera } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { FaRegStopCircle } from "react-icons/fa";
import { RxCross2 } from 'react-icons/rx';

const CameraCapture = ({ onCapture, onClose }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    setStream(mediaStream);
                }
            } catch (err) {
                console.error('Error accessing camera:', err);
                onClose();
            }
        };

        if (!stream) startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream, onClose]);

    const handleCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);

            // Convert canvas to Blob instead of dataURL
            canvas.toBlob((blob) => {
                if (blob) {
                    onCapture(blob); // Send image as Blob
                } else {
                    console.error('Failed to create image Blob');
                }
            }, 'image/png');
        }
    };

    const handleStartRecording = () => {
        if (!stream) return;

        const options = MediaRecorder.isTypeSupported('video/webm')
            ? { mimeType: 'video/webm' }
            : {};

        const recorder = new MediaRecorder(stream, options);
        const chunks = [];

        recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                chunks.push(e.data);
                setRecordedChunks((prev) => [...prev, e.data]);
            }
        };

        recorder.onstop = () => {
            if (chunks.length === 0) {
                alert('No recording data available!');
                return;
            }

            const blob = new Blob(chunks, { type: 'video/webm' });
            onCapture(blob); // Video is already sent as Blob
            setRecordedChunks([]);
        };

        recorder.start(1000);
        setMediaRecorder(recorder);
        setIsRecording(true);
    };

    const handleStopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const handleClose = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        onClose();
    };

    return (
        <div className={styles.cameraOverlay}>
            <div className={styles.videoBg}>
                <button className={styles.closeButton} onClick={handleClose}>
                    <RxCross2 />
                </button>

                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className={styles.videoFeed}
                    style={{ transform: 'scaleX(-1)' }}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                <div className={styles.cameraControls}>
                    <button onClick={handleCapture}><FaCamera /></button>
                    {!isRecording ? (
                        <button onClick={handleStartRecording}><FaVideo /></button>
                    ) : (
                        <button onClick={handleStopRecording}><FaRegStopCircle /></button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CameraCapture;