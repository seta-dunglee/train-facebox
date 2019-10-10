import React from "react";

import "./index.css";
import { Steps, Icon } from "antd";
import FaceTraining from "./FaceTraining";
import { Typography } from 'antd';

const { Title } = Typography;
const { Step } = Steps;

export default function Training({ person }) {
  const [current, setCurrent] = React.useState(0);
  const steps = [
    {
      title: "Training Face",
      content: <FaceTraining person={person} />,
      icon: <Icon type="user" />
    },
    {
      title: "Training Voice",
      content: "Training Voice",
      icon: <Icon type="sound" />
    }
  ];

  const onChange = current => {
    setCurrent(current);
  };

  return (
    <div>
      <Title level={3}>Training for name: {person.name}</Title>
      <Steps type="navigation" current={current} onChange={onChange}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} icon={item.icon} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
    </div>
  );
}
