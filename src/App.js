import React from "react";
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import "./App.css";
import { Typography, Layout, Menu, Icon } from "antd";
import PersonForm from "./component/PersonForm";
import Training from "./component/Training";
import Users from "./component/Users";
import UserTraining from "./pages/UserTraining";
import _ from "lodash";

const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;


function App() {
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
                <Route path="/users/:id" component={Training} />
                <Route path="/new" component={UserTraining} />
                <Redirect exact from="/" to="/users" />
                {/* <Route path="/reset-password" component={ResetPassword} /> */}
              </Switch>
              
            </div>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
