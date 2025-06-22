import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomeButton from "../components/HomeButton";
import BackButton from "../components/BackButton";

function InterviewPage() {
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [recording, setRecording] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [loading, setLoading] = useState(false); // <-- Added for "Generating..."

  const location = useLocation();
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const jobTitle = location.state?.jobTitle || "Not specified";
  const hasDescription =
    location.state?.description && location.state.description.trim() !== "";

  useEffect(() => {
    const initCamera = async () => {
      try {
        setCameraError("");
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera not supported in this browser");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: true,
        });

        if (videoRef.current) {
          streamRef.current = stream;
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setCameraReady(true);
            videoRef.current.play().catch(console.error);
          };
        }
      } catch (error) {
        setCameraError(`Camera access failed: ${error.message}`);
        if (error.name === "NotAllowedError") {
          setCameraError(
            "Camera permission denied. Please allow camera access and refresh the page."
          );
        } else if (error.name === "NotFoundError") {
          setCameraError(
            "No camera found. Please ensure a camera is connected."
          );
        } else if (error.name === "NotReadableError") {
          setCameraError("Camera is already in use by another application.");
        }
      }
    };

    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let interval = null;
    if (recording) {
      interval = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [recording]);

  const formatTime = (s) =>
    `0${Math.floor(s / 60)}`.slice(-2) + ":" + `0${s % 60}`.slice(-2);

  const startRecording = () => {
    if (!streamRef.current) {
      alert("Camera not ready. Please wait.");
      return;
    }

    try {
      let mimeType = "video/webm;codecs=vp9";
      if (!MediaRecorder.isTypeSupported(mimeType))
        mimeType = "video/webm;codecs=vp8";
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = "video/webm";

      const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType });
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        setRecordedChunks([blob]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `interview-recording-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      mediaRecorder.onerror = (event) => {
        alert("Recording error: " + event.error);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
      setRecording(true);
      setTime(0);
    } catch (error) {
      alert("Failed to start recording: " + error.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handlePlayPause = () => {
    recording ? stopRecording() : startRecording();
  };

  const handleStop = () => {
    stopRecording();
  };

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/results", { state: { jobTitle } });
    }, 6000); // Wait 8 seconds
  };

  return (
    <div className="page interview-page">
      <HomeButton />
      <BackButton />
      <h2>Mock Question</h2>
      <p className="question-content">
        Describe a time you had to debug a particularly challenging issue in a
        software project. Walk me through your process, the tools you used, and
        the outcome.
      </p>

      <div className="camera-box">
        {cameraError ? (
          <div style={{ color: "red", padding: "20px", textAlign: "center" }}>
            <h3>Camera Error</h3>
            <p>{cameraError}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "20px",
                backgroundColor: "#000",
                display: cameraReady ? "block" : "none",
              }}
            />
            {!cameraReady && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0,0,0,0.8)",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "20px",
                }}
              >
                <h3>CAMERA</h3>
                <p>Loading camera...</p>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "4px solid #333",
                    borderTop: "4px solid white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    marginTop: "20px",
                  }}
                ></div>
              </div>
            )}
            {cameraReady && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  background: "rgba(0,0,0,0.7)",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "15px",
                  fontSize: "0.8rem",
                }}
              >
                ● LIVE
              </div>
            )}
            {recording && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "red",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "15px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  animation: "blink 1s infinite",
                }}
              >
                ● REC
              </div>
            )}
          </>
        )}

        <div
          className="controls"
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            display: "flex",
            gap: "0.5rem",
          }}
        >
          <button onClick={handlePlayPause} disabled={!cameraReady}>
            {recording ? "⏸" : "▶"}
          </button>
          <button onClick={handleStop} disabled={!recording}>
            ⏹
          </button>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            fontSize: "1.7rem",
            fontWeight: "bold",
            color: recording ? "red" : "white",
            background: "rgba(0, 0, 0, 0.5)",
            padding: "5px 10px",
            borderRadius: "10px",
          }}
        >
          {formatTime(time)}
        </div>
      </div>

      <div className="job-info">
        You Have Selected: {jobTitle}
        <br />
        Job Description: {hasDescription ? "(Included)" : "(Not Included)"}
      </div>

      <button
        className="continue-button"
        onClick={handleContinue}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          fontSize: "1rem",
          borderRadius: "8px",
          opacity: loading ? 0.6 : 1,
          cursor: loading ? "wait" : "pointer",
        }}
      >
        {loading ? "Generating..." : "Continue"}
      </button>

      <div className="footer-copyright">
        © 2025 Promptly @ SpurHacks. Made by Dhruv Joshi, Nikhil Doal, and
        Abhinav Dave. All rights reserved.
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}

export default InterviewPage;
