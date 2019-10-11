import React, { useState, useEffect } from 'react'
import { func, number, string, bool } from 'prop-types';
import { Row, Col, Card, Button, Icon, Tag } from 'antd';
import recordAudio from '../heplers/recordAudio';
import speedRecognition from '../heplers/speedRecognition';
import './index.css';

const AudioNoneIcon = <Icon type="audio" />;
const AudioIcon = <Icon type="audio" theme="twoTone" twoToneColor="red" />;
const AudioOffIcon = <Icon type="audio" theme="twoTone" twoToneColor="gray" />;

function Pharse({
    textPhrase = '',
    clean = false,
    onRecord = () => { },
    onReset = () => { }
}) {
    const [phraseVoice, setPhraseVoice] = useState('');
    const [recorder, setRecorder] = useState(null);
    const [iconMic, setIconMic] = useState(AudioNoneIcon);
    const [btnDisabled, setBtnDisabled] = useState(false);

    useEffect(() => {
        if (clean) {
            handleReset();
        }
    }, [clean]);

    useEffect(() => {
        if(recorder) {
            setIconMic(AudioOffIcon);
            setBtnDisabled(true);
        }else {
            setIconMic(AudioNoneIcon);
            setBtnDisabled(false);
        }
    }, [recorder]);

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

        recognition.onerror = ()  => {
            setRecorder(null);
            setPhraseVoice('');
        }

        recognition.onresult = async event => {
            var speechResult = event.results[0][0].transcript.toLowerCase();
            setPhraseVoice(speechResult);
            const resultRecording = await recording.stop();
            setRecorder(resultRecording);
            onRecord(resultRecording);
        }

        recognition.onspeechend = () => {
            recognition.stop();
        }
    }

    const handleClick = () => {
        processVoice(textPhrase);
    }

    const handlePlay = () => {
        if (recorder) {
            recorder.play();
        }
    }

    const handleReset = () => {
        setRecorder(null);
        setPhraseVoice('');
        setBtnDisabled(false);
        setIconMic(AudioNoneIcon);
        onReset(recorder);
    }

    return <Card className={`pharse-wrapper ${recorder ? 'hightlight' : ''}`}>
        <Row>
            <Col span={24}>
                <Button
                    className="btn-phrase"
                    size="large"
                    onClick={handleClick} disabled={btnDisabled}>{iconMic}{textPhrase}</Button>
            </Col>
            <Col span={24}>
                <Row gutter={8}>
                    <Col span={16}>
                        {
                            phraseVoice && <Tag className="phrase-voice" color="gray">
                                <Icon type="message" size="large" /><span>{phraseVoice}</span>
                            </Tag>
                        }
                    </Col>
                    <Col className="btn-action" span={8}>
                        {
                            recorder && <Button size="large" icon="play-circle" shape="circle" onClick={handlePlay} />
                        }
                        {
                            btnDisabled && <Button size="large" icon="reload" shape="circle" onClick={handleReset} />
                        }
                    </Col>
                </Row>
            </Col>
        </Row>
    </Card>
}

Pharse.propTypes = {
    textPhrase: string.isRequired,
    clean: bool,
    onRecord: func.isRequired,
    onReset: func.isRequired,
}

export default Pharse;