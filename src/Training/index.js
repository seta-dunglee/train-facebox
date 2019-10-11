import React from "react";

import "./index.css";
import { Tabs, Icon } from "antd";

import FaceTraining from "./FaceTraining";
import { Typography } from "antd";
import VoiceTraining from "./VoiceTraning";

const { TabPane } = Tabs;
const { Title } = Typography;

export default function Training({ person }) {
  return (
    <div>
      <Title level={3}>Training for name: {person.name}</Title>
      <Tabs>
        <TabPane
          tab={
            <span>
              <Icon type="user" />
              Training Face
            </span>
          }
          key="1"
        >
          <FaceTraining person={person} />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="sound" />
              Training Voice
            </span>
          }
          key="2"
        >
          <VoiceTraining person={person} />
        </TabPane>
      </Tabs>
    </div>
  );
}
