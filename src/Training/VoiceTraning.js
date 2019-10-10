import React, { useState } from 'react';
import { Button, Icon, Empty, Row, Col } from 'antd';
import { object } from 'prop-types';
import Phrase from '../Phrase';
import { createAssetAudio } from '../services/audio';

function VoiceTraning({ person }) {
    const [phrases] = useState([
        "I can drink coffee everyday",
        "We can join this meeting",
        "What time does it take"
    ]);
    const [recorders, setRecorders] = useState([]);

    const handleClick = (recoder, indexPhrase) => {
        let arrRecorders = [...recorders];
        arrRecorders[indexPhrase] = recoder;
        setRecorders(arrRecorders);
    }

    const handleReset = indexPhrase => {
        let arrRecorders = [...recorders];
        arrRecorders.splice(indexPhrase);
        setRecorders(arrRecorders);
    }

    const handleSubmit = async () => {
        const result = await Promise.all(recorders.map(recorder => {
            if (recorder && person.id) {
                const fileName = "activate-" + new Date().toISOString() + ".webm";
                const file = new File([recorder.audioBlob], fileName, {
                    type: 'audio/webm'
                });

                return createAssetAudio(file, person.id);
            }
        }));

        console.log('==========Result', result);
    }

    return <>
        {
            phrases.length > 0 ?
                <Row>
                    {
                        phrases.map((el, index) => <Col md={12} xs={24} key={index}>
                            <Phrase
                                keyPhrase={index}
                                textPhrase={el}
                                onRecord={handleClick}
                                onReset={handleReset}
                            />
                        </Col>)
                    }
                </Row>
                : <Empty description={'No data'} />
        }
        <Button onClick={handleSubmit} className="uploadButton" disabled={!phrases.length > 0}><Icon type="upload" size="large" /></Button>
    </>
}

VoiceTraning.propTypes = {
    person: object.isRequired
}

export default VoiceTraning;