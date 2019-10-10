import React, { useState } from 'react'
import { func, number, string } from 'prop-types';
import { Row, Col, Card, Button, Icon, Tag } from 'antd';
import recordAudio from '../heplers/recordAudio';
import speedRecognition from '../heplers/speedRecognition';
import './index.css';

const AudioNoneIcon = <Icon type="audio" />;
const AudioIcon = <Icon type="audio" theme="twoTone" twoToneColor="red" />;
const AudioOffIcon = <Icon type="audio" theme="twoTone" twoToneColor="gray" />;

function Pharse(props) {
    const [highlight, setHighlight] = useState(false);
    const [phraseVoice, setPhraseVoice] = useState('');
    const [recorder, setRecorder] = useState(null);
    const [iconMic, setIconMic] = useState(AudioNoneIcon);
    const [btnDisabled, setBtnDisabled] = useState(false);

    const processVoice = async dataPhrase => {
        const recording = await recordAudio();
        const recognition = speedRecognition(dataPhrase);
        recognition.start();
        recording.start();

        recognition.onstart = () => {
            setBtnDisabled(true);
            setIconMic(AudioIcon);
        }

        recognition.onend = () => {
            setIconMic(AudioOffIcon);
        }

        recognition.onresult = event => {
            var speechResult = event.results[0][0].transcript.toLowerCase();
            setPhraseVoice(speechResult);
        }

        recognition.onspeechend = async () => {
            recognition.stop();
            const resultRecording = await recording.stop();
            setRecorder(resultRecording);
            props.onRecord(resultRecording, props.keyPhrase);
        }
    }

    const handleClick = () => {
        setHighlight(true);
        processVoice(props.textPhrase);
    }

    const handlePlay = () => {
        if (recorder) {
            recorder.play();
        }
    }

    const handleReset = () => {
        setRecorder(null);
        setPhraseVoice('');
        setHighlight(false);
        setBtnDisabled(false);
        setIconMic(AudioNoneIcon);
        props.onReset(props.keyPhrase);
    }

    return <Card className={`pharseWrapper ${highlight ? 'hightlight' : ''}`} hoverable={true}>
        <Row>
            <Col md={16} xs={24}>
                <Button
                    size="large"
                    onClick={handleClick} disabled={btnDisabled}>{iconMic}{props.textPhrase}</Button>
                {
                    phraseVoice && <Tag className="phraseVoice" color="gray">
                        <Icon type="message" size="large" theme="twoTone" color="white" />{phraseVoice}
                    </Tag>
                }
            </Col>
            <Col md={8} xs={24}>
                {
                    recorder && <Button size="large" icon="play-circle" shape="circle" onClick={handlePlay} />
                }
                {
                    btnDisabled && <Button size="large" icon="reload" shape="circle" onClick={handleReset} />
                }
            </Col>
        </Row>
    </Card>
}

Pharse.propTypes = {
    keyPhrase: number.isRequired,
    textPhrase: string.isRequired,
    onRecord: func.isRequired,
    onReset: func.isRequired,
}

export default Pharse;