import React from "react";
import "./App.css";
import { Typography, Layout, Menu, Icon } from "antd";
import PersonForm from "./component/PersonForm";
import Training from "./component/Training";
import Users from "./component/Users";
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
      <Layout className="layout">
        <Header className="header">
          <Title level={2}>Activate CSSO Training</Title>
        </Header>
        <Content>
          <Layout>
            <Sider className="sidebar">
              <Menu className="sidebar-menu" mode="inline" defaultSelectedKeys={["1"]}>
                <Menu.Item key="1">
                  <Icon type="user" />
                  <span>Persion</span>
                </Menu.Item>
                <Menu.Item key="2">
                  <Icon type="setting" />
                  <span>Configs</span>
                </Menu.Item>
              </Menu>
            </Sider>
          </Layout>
          <div className="content-body">
            {/* <div className="container"> */}
            <Users/>
            {/* {(function() {
              switch (step) {
                case PERSIONFORM:
                  return <PersonForm formSubmit={formSubmit} />;
                case TRAINING:
                  return <Training person={person} />;
                default:
                  return null;
              }
            })()} */}
            {/* </div> */}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
