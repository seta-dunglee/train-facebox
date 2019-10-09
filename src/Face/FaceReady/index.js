import React from 'react';
import CountDown from '../../../components/CountDown';
import './index.css';
import { TIMEOUT } from '../../../config';

function FaceReadyScreen({ next }) {
  return (
    <div className="face__countdown">
      <span className="face-step__guide">
        Prepare to look directly into the Camera and follow further instructions
      </span>
      <CountDown
        textColor="white"
        timeout={TIMEOUT.FACE_READY}
        interval={1000}
        onFinish={next}
        text="Ready?"
      />
    </div>
  );
}

export default FaceReadyScreen;
