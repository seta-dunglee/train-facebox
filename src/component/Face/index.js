import React from "react";
import './index.css';
import Face from '../../services/face';
import BMCService from '../../services/bmc';
import VideoCapturing from '../../components/VideoCapturing';
import DoneIcon from '@material-ui/icons/Done';


const delay = (timeOut = 1000) => new Promise(resolve => setTimeout(resolve, timeOut));


const IMAGES_NUMBER = 3;

function FaceScreen({ onFinish }) {
  const [images, setImages] = React.useState([]);
  const canvasRef = React.useRef(null);
  const [composeImage, setComposeImage] = React.useState(0);

  const onCapture = React.useCallback((image) => {
    setImages(x => [...x, image])
  }, []);

  React.useEffect(() => {
    if (images.length < IMAGES_NUMBER) {
      return;
    }
    const context = canvasRef.current.getContext("2d");
    images.forEach((image, index) => {
      const img = new Image(600, 338);
      img.onload = function onLoad() {
        context.drawImage(img, index * 600, 0, 600, 338);
        setComposeImage(x => x + 1);
      };
      img.src = URL.createObjectURL(image);
    })
  }, [images]);

  React.useEffect(() => {
    if (composeImage === IMAGES_NUMBER) {
      canvasRef.current.toBlob(async (blob) => {
        // setLoading(true);
        BMCService.recognizeFace(blob)
        await delay(500);
        onFinish()
        // .then(result => {
        //   setLoading(false);

        // })
      }, "image/jpeg", 1);
    }
  }, [composeImage, onFinish]);

  return (
    <>
      <div className="guide-authentication">
        <p className="guide-text">
          Face forward and look directly into the camera
        </p>
      </div>
      <div className='face-indicator-wrapper'>
        {
          <VideoCapturing
            onCapture={onCapture}
            progressed={(images.length / IMAGES_NUMBER) * 100}
          />
        }
        {
          (images.length === IMAGES_NUMBER) && <DoneIcon className="done-face-icon"/>
        }
      </div>

      <canvas
        ref={canvasRef}
        width="1800"
        height="338"
        style={{ display: "none" }}
      />
    </>
  );
}

export default FaceScreen;
