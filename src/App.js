import React from "react";
import Button from "antd/es/button";
import "./App.css";
import { Typography, Layout, Breadcrumb } from "antd";
import AddModal from "./AddModal";
import { Card } from "antd";
import trainFace from "./train";

const { Title } = Typography;
const { Header, Content, Footer } = Layout;
const { Meta } = Card;

function App() {
  const [AddModalOpen, setAddModalOpen] = React.useState(false);
  const [training, setTraining] = React.useState(false);
  const [peopleSet, setPeopleSet] = React.useState({
    people: [],
    personIndex: 0
  });

  const add = () => {
    setPeopleSet(({ people, personIndex }) => ({
      people: [...people, { text: "", images: [], id: new Date() }],
      personIndex: people.length,
    }));
    setAddModalOpen(true);
  };

  const savePerson = ({ text, images }) => {
    console.log({ text, images });
    setPeopleSet(({ people, personIndex }) => ({
      personIndex,
      people: people.map((p, pIndex) => {
        console.log("map");
        if (pIndex !== personIndex) {
          return p;
        }
        return {
          ...p,
          text,
          images,
        };
      })
    }));
  };

  const close = () => {
    setAddModalOpen(false);
  };

  const edit = (event) => {
    const personIndex = parseInt(event.currentTarget.dataset.index, 10);
    setPeopleSet(({ people }) => ({
      people,
      personIndex
    }))
    setAddModalOpen(true);
  };

  const onTrain = async () => {
      setTraining(true);
      await train();
      setTraining(false);
  }

  const train = async () => {
    for (let index = 0; index < peopleSet.people.length; index++) {
      const person = peopleSet.people[index];
      await trainFace(person);
    }
  }
  return (
    <Layout className="layout">
      <Header>
        <Title level={2}>Facebox Training</Title>
      </Header>
      <Content>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
        </Breadcrumb>
        <div className="content-body">
          <div className="container">
            <div className="list-people">
              {peopleSet.people
                .filter(p => p.text.length > 0)
                .map((person, index) => (
                  <Card
                    key={person.id}
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src={person.images[0].thumbnail} />}
                    className="person"
                    data-index={index}
                    onClick={edit}
                  >
                    <Meta title={person.text} description="www.google.com" />
                  </Card>
                ))}
              <Button
                type="primary"
                shape="circle"
                icon="plus"
                size="large"
                onClick={add}
              />
            </div>
            <div className="action">
              {peopleSet.people.length > 0 && (
                <Button
                  type="primary"
                  shape="round"
                  icon="setting"
                  size="large"
                  loading={training}
                  onClick={onTrain}
                >
                  Train
                </Button>
              
              )}
            </div>
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Copyright ©2019 Created by Dung Lee
      </Footer>
      {AddModalOpen && (
        <AddModal
          visible={AddModalOpen}
          savePerson={savePerson}
          close={close}
          person={peopleSet.people[peopleSet.personIndex]}
        />
      )}
    </Layout>
  );
}

export default App;
