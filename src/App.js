import React from "react";
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
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

  const onMenuClick = ({ item, key, keyPath, domEvent }) => {
    let route = `/${key}`;
    return <Redirect to={route} />;
  };

  return (
    <BrowserRouter>
      <Layout>
        <Layout className="layout">
          <Header className="header">
            <Title level={2}>Activate CSSO Training</Title>
          </Header>
          <Content>
            <Layout>
              <Sider className="sidebar">
                <Menu
                  className="sidebar-menu"
                  mode="inline"
                  defaultSelectedKeys={["users"]}
                  onSelect={onMenuClick}
                >
                  <Menu.Item key="users">
                    <Link to="/users">
                      <Icon type="user" />
                      <span>Persion</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="configs">
                    <Link to="/configs">
                      <Icon type="setting" />
                      <span>Configs</span>
                    </Link>
                  </Menu.Item>
                </Menu>
              </Sider>
            </Layout>
            <div className="content-body">
              <Switch>
                <Route path="/users" component={Users} />
                {/* <Route path="/reset-password" component={ResetPassword} /> */}
              </Switch>
              {/* <div className="container"> */}
              {/* <Users/> */}
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
    </BrowserRouter>
  );
}

export default App;
