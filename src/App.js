import React from "react";
import "./App.css";
import { Typography, Layout } from "antd";
import PersonForm from "./PersonForm";
import Training from "./Training";

const { Title } = Typography;
const { Header, Content, Footer } = Layout;
const PERSIONFORM = 0;
const TRAINING = 1;

function App() {
  const [step, setStep] = React.useState(0);
  const [person, setPerson] = React.useState();

  const formSubmit = (name) => {
    setPerson({
      id: "vtn" + name.replace(' ', '_'),
      name
    })
    setStep(TRAINING)
  }
  
  return (
    <Layout className="layout">
      <Header>
        <Title level={2}>Biometric Enrollment</Title>
      </Header>
      <Content>
        <div className="content-body">
          {/* <div className="container"> */}
            {
              (function () {
                switch (step) {
                  case PERSIONFORM:
                    return <PersonForm formSubmit={formSubmit} />
                  case TRAINING:
                    return <Training person={person} />
                  default:
                    return null
                }
              })()
            }
          {/* </div> */}
        </div>
      </Content>
    </Layout>
  );
}

export default App;
