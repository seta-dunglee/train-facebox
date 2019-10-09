import React from "react";
import { useCountDown } from "../../../hooks";
import { TIMEOUT } from '../../../config';

function FaceCenterScreen({ next }) {
  console.log(`useCountDown - next: ${next}  timeout: TIMEOUT.FACE_SWITCH_SCREEN=${TIMEOUT.FACE_SWITCH_SCREEN}`);
  useCountDown(next, TIMEOUT.FACE_SWITCH_SCREEN);

  return (
    <div className="face-step face-step--forward">
      Look forward
    </div>
  );
}

export default FaceCenterScreen;
