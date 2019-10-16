
import * as faceapi from 'face-api.js';

const faceDetectionNet = faceapi.nets.tinyFaceDetector
// const faceDetectionNet = faceapi.nets.ssdMobilenetv1

// SsdMobilenetv1Options
const minConfidence = 0.5

// TinyFaceDetectorOptions
const inputSize = 480
const scoreThreshold = 0.5

// MtcnnOptions
const minFaceSize = 50
const scaleFactor = 0.8

export function getFaceDetectorOptions(net) {
  return net === faceapi.nets.ssdMobilenetv1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : (net === faceapi.nets.tinyFaceDetector
      ? new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
      : new faceapi.MtcnnOptions({ minFaceSize, scaleFactor })
    )
}

export const faceDetectionOptions = getFaceDetectorOptions(faceDetectionNet)

export function getCurrentFaceDetectionNet() {
  // return faceapi.nets.ssdMobilenetv1
  return faceapi.nets.tinyFaceDetector
}

export function getSSDMobileNetOptions() {
  return new faceapi.SsdMobilenetv1Options({ minConfidence })
}

export const IMAGES_NUMBER = 3;