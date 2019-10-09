import React from "react";
import { Modal, Row, Input, Icon, Button } from "antd";
import ImageSearch from "./ImageSearch";
import Gallery from "react-grid-gallery";
import { Spin } from "antd";
import VideoCapturing from "./VideoCapturing";
const IMAGES_NUMBER = 10;

const { Search } = Input;

export default function AddModal({ visible, savePerson, close, person = {} }) {
  const imageSearch = new ImageSearch(
    "001221401184127685701:kkx6jzzn9l5",
    "AIzaSyAjYtN-RdATm6AnXhnOqLnx1L4CjzqLi4A"
  );
  const options = { page: 1 };
  const [text, setText] = React.useState(person.text);
  const [inputUrl, setinputUrl] = React.useState("");
  const [images, setImages] = React.useState(person.images);
  const [loading, setLoading] = React.useState(false);
  const [takePhoto, setTakePhoto] = React.useState(false);

  const onSearch = async value => {
    setLoading(true);
    const data = await imageSearch.search(value, options);
    setLoading(false);

    setImages(data);
    setText(value);
  };

  const onChange = e => {
    setText(e.target.value);
  };

  const handleOk = () => {
    const selectedImages = images.filter(image => image.isSelected);
    console.log(selectedImages);
    if (selectedImages.length) {
      if (!text) {
        alert("Input name to the search input");
        return;
      }
      savePerson({ text, images: selectedImages });
      close();
    } else {
      alert("No images selected, please select images");
    }
  };

  const handleCancel = () => {
    close();
  };

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

  console.log(images);
  return (
    <Modal
      title="Add Person"
      visible={visible}
      width="70%"
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
    >
      <Row className="input-section">
        <Search
          placeholder="Search text"
          defaultValue={person.text}
          onSearch={onSearch}
          onChange={onChange}
          style={{ width: "30%" }}
        />
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
          style={{ width: "45%", marginLeft: 20 }}
        />
        <Button
          className="take-photo"
          type="primary"
          shape="circle"
          icon="camera"
          onClick={onTakePhoto}
        />
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
    </Modal>
  );
}
