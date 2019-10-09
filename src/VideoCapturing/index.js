import React from "react";
import * as faceApi from "face-api.js";
import "./index.css";
import {Icon, Button } from "antd";

function VideoCapturing({ onCaptureSuccess }) {
  const videoRef = React.useRef();

  const streamRef = React.useRef();
  const imageCaptureRef = React.useRef();

  const [cameraReady, setCameraReady] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [faceActive, setFaceActive] = React.useState(false);

  
  React.useEffect(() => {
    async function initCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 600, height: 450 }
      });
      streamRef.current = stream;
      imageCaptureRef.current = new window.ImageCapture(
        stream.getVideoTracks()[0]
      );
      videoRef.current.onloadedmetadata = function onPlay() {
        videoRef.current.play();
      };
      videoRef.current.onplay = () => {
        setCameraReady(true);
      };
      videoRef.current.srcObject = streamRef.current;
    }
    initCamera();


    return () => {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  }, []);

  const capturePhoto = React.useCallback(onCaptureSuccess, []);

  const onCapturePhoto = async () => {
    const blob = await imageCaptureRef.current.takePhoto();
    capturePhoto(blob);
  }

  return (
    <div className="video-capturing-wrapper">
      <div className="face-indicator-wrapper">
        <video ref={videoRef} className="stream" />
        <svg
          viewBox="0 0 100 100"
          width="200"
          height="200"
          className="face-indicator-frame"
        >
          <path
            strokeWidth="2px"
            stroke={faceActive ? "#00C853" : "grey"}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M30,10 L10,10 L10,30 M10,70 L10,90 L30,90 M70,90 L90,90 L90,70 M90,30 L90,10 L70,10"
          />
        </svg>
      </div>
      <div className="action-capture">
        <Button
          type="primary"
          icon="camera"
          onClick={onCapturePhoto}
        >
          Capture Photo
        </Button>
      </div>
    </div>
  );
}

export default VideoCapturing;
