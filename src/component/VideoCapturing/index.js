import React from "react";
import * as faceApi from "face-api.js";
import "./index.css";
import {Icon, Button } from "antd";
import { delay } from "./util";

function VideoCapturing({ onCaptureSuccess }) {
  const videoRef = React.useRef();

  const streamRef = React.useRef();
  const imageCaptureRef = React.useRef();
  const ctrack = React.useRef();
  const captureAnimationFrame = React.useRef();

  const [cameraReady, setCameraReady] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [faceActive, setFaceActive] = React.useState(false);
  // const finishRef = React.useRef(finish);

  React.useEffect(() => {
    async function initCamera() {
      ctrack.current = new window.clm.tracker();
      ctrack.current.init(window.pModel);

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
        ctrack.current.start(videoRef.current);
      };
      videoRef.current.srcObject = streamRef.current;
    }
    initCamera();


    return () => {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  }, []);

  React.useEffect(() => {
    if (cameraReady) {
      let umounted = false;
      async function trackingFace() {
        // const result = await faceApi.detectSingleFace(videoRef.current, options);
        const positions = await ctrack.current.getCurrentPosition();
        // console.log(positions);
        (!umounted) && setLoading(false);
        if (positions) {
          const faceHeight = positions[7][1] - positions[33][1];
          const faceAngle = Math.atan((positions[33][0] - positions[7][0]) / (positions[33][1] - positions[7][1]));
          // console.log('detected, ratio, angle',  Date.now() - timeRef.current, faceHeight / 450, faceAngle.toFixed(2));\
          setFaceActive(false);
          if ((faceHeight / 450 > 1 / 3) && (faceHeight / 450 < 1 / 2) && Math.abs(faceAngle) < 0.1) {
            setFaceActive(true);
          }
        }
        captureAnimationFrame.current = (videoRef.current && !umounted) && window.requestAnimationFrame(trackingFace);
      }
      trackingFace();

      return () => {
        umounted = true;
        ctrack.current.stop();
        window.cancelAnimationFrame(captureAnimationFrame.current);
        setTimeout(() => 
          streamRef.current.getTracks().forEach(track => track.stop()),
          1000
        )
      }
    }
  }, [cameraReady]);

  const capturePhoto = React.useCallback(onCaptureSuccess, []);

  const onCapturePhoto = async () => {
    const blob = await imageCaptureRef.current.takePhoto();
    capturePhoto(blob);
  }
  return (
    <div className="video-capturing-wrapper">
      <div className="face-indicator-wrapper">
        <video ref={videoRef} className="stream" width="600" height="450" />
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
