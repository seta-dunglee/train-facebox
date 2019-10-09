export function validateFace(result) {
  if (result.detection._box._width / result.detection._imageDims._width < 0.2) {
    // return "Move close to the screen";
    return false;
  }
  // else if (result.detection._box._height / result.detection._imageDims._height > 0.8) {
  //   return "Move far away to the screen"
  // }
  else if ((result.detection._box._x / result.detection._imageDims._width) < 0.1) {
    // return "You are too far to the edge";
    return false;
  }
  else if ((result.detection._box._y / result.detection._imageDims._height) < 0.1) {
    // return "You are too far to the edge";
    return false;
  }
  else if (((result.detection._box._x + result.detection._box._width) / result.detection._imageDims._width) > 0.9) {
    // return "You are too far to the edge";
    return false;
  }
  else if (((result.detection._box._y + result.detection._box._height) / result.detection._imageDims._height) > 0.9) {
    // return "You are too far to the edge";
    return false;
  }
  // else if ((result.landmarks.relativePositions[0]._y - result.landmarks.relativePositions[16]._y) > 0.1) {
  //   return "Keep your face straight forward";
  // }
  // else if ((result.landmarks.relativePositions[0]._y - result.landmarks.relativePositions[16]._y) < -0.1) {
  //   return "Keep your face straight forward";
  // }
  // else if ((result.landmarks.relativePositions[8]._x - result.landmarks.relativePositions[0]._x) <
  //   (result.landmarks.relativePositions[16]._x - result.landmarks.relativePositions[8]._x - 0.1)) {
  //   return "Keep your face straight forward";
  // }
  // else if ((result.landmarks.relativePositions[16]._x - result.landmarks.relativePositions[8]._x) <
  //   (result.landmarks.relativePositions[8]._x - result.landmarks.relativePositions[0]._x - 0.1)) {
  //   return "Keep your face straight forward";
  // }
  return true;
}

export function delay(timeOut = 1000) {
  return new Promise(resolve => setTimeout(resolve, timeOut))
};
