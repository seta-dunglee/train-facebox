import React, { useState, useEffect } from 'react';
import { Button, Empty, Row, Col, Typography } from 'antd';
import { object } from 'prop-types';
import Phrase from '../Phrase';
import { createAssetAudio } from '../../services/audio';

function VoiceTraning({ person }) {
    const defaultDisable = -1;
    const [phrases] = useState([
        "I can drink coffee everyday",
        "We can join this meeting",
        "What time does it take"
    ]);
    const [recorders, setRecorders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [resultTrain, setResultTrain] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(defaultDisable);

    useEffect(() => {
        const timeId = setTimeout(() => {
            setResetLoading(false);
        }, 1000);

        return () => {
            clearTimeout(timeId);
        }
    }, [resetLoading]);

    const handleClick = recoder => {
        if(recoder) {
            let arrRecorders = [...recorders, recoder];
            setRecorders(arrRecorders);
        }

        setSelectedIndex(defaultDisable);
    }

    const handleReset = recoder => {
        if (recoder) {
            const newArr = recorders.filter(item => item.audioUrl !== recoder.audioUrl);
            setRecorders(newArr);
        }

        setSelectedIndex(defaultDisable);
    }

    const handleSubmit = async () => {
        setLoading(true);
        setResultTrain('');
        const result = await Promise.all(recorders.map(recorder => {
            if (recorder && person.id) {
                const fileName = "activate-" + new Date().toISOString() + ".webm";
                const file = new File([recorder.audioBlob], fileName, {
                    type: 'audio/webm'
                });

                try {
                    return createAssetAudio(file, person.id);
                } catch (err) {
                    //filter by reponse success {ok : true}
                    return { ok: false };
                }
            }
        }));

        const total = recorders.length;
        const success = result.filter(el => el.ok).length;
        setLoading(false);
        setResultTrain(`${success}/${total}`);

        console.log('==========Result', result);
    }

    const handleReload = () => {
        setResetLoading(true);
        setRecorders([]);
        setLoading(false);
        setResultTrain('');
        setSelectedIndex(defaultDisable);
    }

    const handleActiveItem = index => {
        setSelectedIndex(index);
    }

    return <Row className="voice-training">
        <Col xs={24} md={12} className="input-section">
            <Button
                type="primary" shape="round" icon="setting"
                disabled={!(recorders.length > 0)}
                loading={loading}
                onClick={handleSubmit}
            >
                Train
            </Button>
            <Button
                type="primary" shape="round" icon="reload"
                loading={resetLoading}
                onClick={handleReload}
            >
                Reset
            </Button>
            {
                resultTrain && (
                    <Typography.Text type="secondary">
                        Success: {resultTrain}
                    </Typography.Text>
                )
            }
        </Col>
        <Col xs={24} md={12}>
            {
                phrases.length > 0 ?

                    phrases.map((el, index) =>
                        <Phrase
                            key={index}
                            keyPhrase={index}
                            textPhrase={el}
                            onRecord={handleClick}
                            onReset={handleReset}
                            onActive={handleActiveItem}
                            clean={resetLoading}
                            disabled={selectedIndex !== defaultDisable && selectedIndex !== index}
                        />
                    )
                    : <Row><Empty description={'No data'} image={Empty.PRESENTED_IMAGE_SIMPLE} /></Row>
            }
        </Col>
    </Row>
}

VoiceTraning.propTypes = {
    person: object.isRequired
}

export default VoiceTraning;