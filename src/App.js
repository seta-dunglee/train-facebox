import React from "react";
import "./App.css";
import { Typography, Layout, Menu, Icon } from "antd";
import PersonForm from "./PersonForm";
import Training from "./Training";
import _ from "lodash";

const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;
const PERSIONFORM = 0;
const TRAINING = 1;

function App() {
  const [step, setStep] = React.useState(0);
  const [person, setPerson] = React.useState();

  const formSubmit = name => {
    setPerson({
      id: "vtn_" + _.toLower(name.replace(" ", "_")),
      name
    });
    setStep(TRAINING);
  };
  return (
    <Layout>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0
        }}
      >
        <div className="logo">CSSO</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">
            <Icon type="user" />
            <span>nav 1</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="video-camera" />
            <span>nav 2</span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="upload" />
            <span>nav 3</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="layout">
        <Header className="hearder">
          <Title level={2}>Activate CSSO Training</Title>
        </Header>
        <Content>
          <div className="content-body">
            {/* <div className="container"> */}
            {(function() {
              switch (step) {
                case PERSIONFORM:
                  return <PersonForm formSubmit={formSubmit} />;
                case TRAINING:
                  return <Training person={person} />;
                default:
                  return null;
              }
            })()}
            {/* </div> */}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
