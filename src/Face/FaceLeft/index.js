import React from "react";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { useCountDown } from '../../../hooks';
import { TIMEOUT } from '../../../config';

function FaceLeftScreen({ next }) {
  console.log(`useCountDown - next: ${next}  timeout: TIMEOUT.FACE_SWITCH_SCREEN=${TIMEOUT.FACE_SWITCH_SCREEN}`);
  useCountDown(next, TIMEOUT.FACE_SWITCH_SCREEN);

  return (
    <div className="face-step face-step--left">
      <ArrowBack />&nbsp;Look Left
    </div>
  );
}

export default FaceLeftScreen;
