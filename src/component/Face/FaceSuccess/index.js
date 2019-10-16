import React from 'react';
import { useCountDown } from '../../../hooks';
import Check from "@material-ui/icons/Check";
import { TIMEOUT } from '../../../config';

function FaceSuccessScreen({ gotoResetPasswordScreen }) {
  console.log(`useCountDown - next: ${gotoResetPasswordScreen}  timeout: TIMEOUT.RESET_PASSWORD=${TIMEOUT.RESET_PASSWORD}`);
  useCountDown(gotoResetPasswordScreen, TIMEOUT.RESET_PASSWORD);

  return (
    <Check className="result-check" />
  );
}

export default FaceSuccessScreen;
