import React from 'react'
import { Input, Tooltip, Icon } from 'antd';
import Button from "antd/es/button";

export default function PersonForm({formSubmit}) {
    const [name, setName] = React.useState('');

    const onClickSubmit = () => {
        formSubmit(name);
    }

    const onNameChange = (e) => {
        setName(e.target.value);
    }

    return (
        <div>
            <div className="input-name">
              <Input
                placeholder="Enter your name"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                style={{ width: 250 }}
                size="large"
                onChange={onNameChange}
              />
              <div className="btn-submit-name">
                <Button type="primary" onClick={onClickSubmit} disabled={!name}>
                Start training
                </Button>
              </div>
            </div>
        </div>
    )
}
