import React from "react";
import ArrowForward from "@material-ui/icons/ArrowForward";
import { useCountDown } from '../../../hooks';
import { TIMEOUT } from '../../../config';

function FaceRightScreen({ next, stopRecording }) {
  console.log(`useCountDown - next: ${next}  timeout: TIMEOUT.FACE_SWITCH_SCREEN=${TIMEOUT.FACE_SWITCH_SCREEN}`);
  useCountDown(() => {
    next();
    stopRecording();
  }, TIMEOUT.FACE_SWITCH_SCREEN);

  return (
    <div className="face-step face-step--right">
      Look&nbsp;Right <ArrowForward />
    </div>
  );
}

export default FaceRightScreen;
