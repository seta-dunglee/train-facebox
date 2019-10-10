import React from "react";
import { Row, Input, Icon, Button, Typography } from "antd";
import Gallery from "react-grid-gallery";
import { Spin } from "antd";
import VideoCapturing from "../VideoCapturing";
import trainFace from "../services/train";

const { Text } = Typography;
export default function FaceTraining({
  // savePerson,
  close,
  person
}) {
  const [inputUrl, setinputUrl] = React.useState("");
  const [images, setImages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [takePhoto, setTakePhoto] = React.useState(false);
  const [resultTrain, setResultTrain] = React.useState(null);

  const onSelectImage = index => {
    setImages(images =>
      images.map((image, imageIndex) => {
        if (imageIndex !== index) {
          return image;
        }
        return {
          ...image,
          isSelected: !image.isSelected
        };
      })
    );
  };

  const addFromUrl = async () => {
    if (inputUrl) {
      const meta = await getMeta(inputUrl);
      setImages(images => [...images, meta]);
      setinputUrl("");
    }
  };
  const onInputUrlChange = e => {
    setinputUrl(e.target.value);
  };

  const getMeta = url => {
    return new Promise(resolve => {
      var img = new Image();
      img.onload = function() {
        resolve({
          thumbnailHeight: img.naturalHeight,
          thumbnailWidth: img.naturalWidth,
          thumbnail: url,
          src: url
        });
      };
      img.src = url;
    });
  };

  const getMetafromBlob = blob => {
    const url = URL.createObjectURL(blob);
    return new Promise(resolve => {
      var img = new Image();
      img.onload = function() {
        resolve({
          thumbnailHeight: img.naturalHeight,
          thumbnailWidth: img.naturalWidth,
          thumbnail: url,
          src: url,
          blob: blob
        });
      };
      img.src = url;
    });
  };

  const onCaptureSuccess = React.useCallback(async blob => {
    const meta = await getMetafromBlob(blob);
    setImages(images => [...images, meta]);
  }, []);

  const onTakePhoto = () => {
    setTakePhoto(x => !x);
  };

  const onTrain = async () => {
    setLoading(true);
    const res = await train();
    setResultTrain(res);
    setLoading(false);
  };

  const train = async () => {
    const selectedImages = images.filter(image => image.isSelected);
    return await trainFace({ ...person, images: selectedImages });
  };

  const disabledTrain = images.filter(image => image.isSelected).length === 0;

  return (
    <div className="training-face-step">
      <Row className="input-section">
        <Input
          placeholder="Input url image"
          onChange={onInputUrlChange}
          value={inputUrl}
          addonAfter={
            <Icon
              type="plus"
              style={{ cursor: "pointer" }}
              onClick={addFromUrl}
            />
          }
          style={{ width: "30%" }}
        />
        <Button
          className="take-photo"
          type="primary"
          shape="circle"
          icon="camera"
          onClick={onTakePhoto}
        />
        <Button
          type="primary"
          shape="round"
          icon="setting"
          disabled={disabledTrain}
          loading={loading}
          onClick={onTrain}
        >
          Train
        </Button>
        {resultTrain && (
          <Text type="secondary" style={{marginLeft: 10}}>
            Thành công: {resultTrain.success}/{resultTrain.total}
          </Text>
        )}
      </Row>
      <Row className="result-search">
        {takePhoto && (
          <div className="camera-wapper">
            {<VideoCapturing onCaptureSuccess={onCaptureSuccess} />}
          </div>
        )}
        <div className="gallery-images">
          {loading ? (
            <Spin size="large" />
          ) : (
            <Gallery
              images={images}
              enableImageSelection
              onSelectImage={onSelectImage}
            />
          )}
        </div>
      </Row>
    </div>
  );
}
