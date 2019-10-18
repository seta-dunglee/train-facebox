import React from "react";
import Training from "../component/Training";
import PersonForm from "../component/PersonForm";
import {trainFace, createEntity} from "../services/train";
import {getConfigs} from "../services/user";
import _ from "lodash";

const PERSIONFORM = 0;
const TRAINING = 1;
// libraryId, name, description, profileImageUrl, jsonData, isPublished = false

export default function UserTraining() {
const [step, setStep] = React.useState(0);
  const [person, setPerson] = React.useState();

  const formSubmit = async (name) => {
    setPerson({
      id: "vtn_" + _.toLower(name.replace(" ", "_")),
      name
    });
    const configs = await getConfigs();
    console.log('configs', configs)
    const config = configs.filter(c => c.key === 'LIBRARI_ID');
    const libraryId = _.get(config, [0, 'value'], '')
    const entity = await createEntity(libraryId, name);
    
    console.log('entity', entity)


    // setStep(TRAINING);
  };

  return (
    <div className="container">
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
    </div>
  );
}
