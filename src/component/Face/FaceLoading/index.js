import React from "react";
import "./index.css";

function Faceloading({ className: propClassName, ...rest }) {
  return (
    <div className="face-loading-wapper">
      <div className="face-loading">
        <div className={`loading-indicator ${propClassName || ''}`} />
      </div>
    </div>
  ); 
}

export default Faceloading;
