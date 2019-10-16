import { get } from "lodash";

const config = {
  authToken:
    "63b0d0:c5d3e49aabc740638e7ce84ab0eb9bdec3ac99a9a6a24d7096df5ef17f48d321",
  graphqlUrl: "https://api.veritone.com/v3/graphql"
};

async function trainFace(person) {
  let count = 0;
  for (let index = 0; index < person.images.length; index++) {
    const image = person.images[index];
    const file = blobToFile(
    image.blob,
      `${person.name.replace(" ", "_")}.png`
    );
      const res = await trainSingleImgByFile(file, person);
      res === "success" && count++;
  }
  return {
    success: count,
    total: person.images.length
  };
}

// async function trainSingleImg(imgUrl, person) {
//   let url = `https://facebox-gcloud-gke-veritone.com/facebox/teach`;
//   const rawResponse = await fetch(url, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ url: imgUrl, id: person.id, name: person.name })
//   });
//   const content = await rawResponse.json();
//   if (content.success) {
//     console.log(
//       `SUCCESS - Train image ${imgUrl.substring(0, 40)}... for person name ${
//         person.name
//       }.`
//     );
//     return "success";
//   } else {
//     console.log(
//       `ERROR - Train image ${imgUrl.substring(0, 40)}... for person name ${
//         person.name
//       } ${content.error}.`
//     );
//     return "failed";
//   }
// }

async function trainSingleImgByFile(file, person) {
  const { tdoId, signedUri } = await createAssetAudio(file);
  let url = `https://facebox-gcloud-gke-veritone.com/facebox/teach`;
  const rawResponse = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url: signedUri, id: person.id, name: person.name })
  });
  const content = await rawResponse.json();
  if (content.success) {
    console.log(
      `SUCCESS - Train image ${signedUri.substring(0, 40)}... for person name ${
        person.name
      }.`
    );
    return "success";
  } else {
    console.log(
      `ERROR - Train image ${signedUri.substring(0, 40)}... for person name ${
        person.name
      } ${content.error}.`
    );
    return "failed";
  }
}

function blobToFile(theBlob, fileName) {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

function getWriteUrl() {
  const query = `
      query {
        getSignedWritableUrl {
          url
          key
          bucket
          expiresInSeconds
          getUrl
          unsignedUrl
        }
      }
    `;

  return callGraphQl(config.graphqlUrl, query, {}, config.authToken);
}
function createEntity(libraryId, name, description, profileImageUrl, jsonData, isPublished = false){
  const query = `
  mutation ($newEntity: CreateEntity!) {
    createEntity (input: $newEntity) {
      id
      libraryId
    }
  }`;

  const newEntity = {
    libraryId: libraryId,
    name: name,
    jsondata: jsonData,
    description: description,
    profileImageUrl: profileImageUrl,
    isPublished: isPublished
  };

  return callGraphQl(config.graphqlUrl, query, {newEntity: newEntity}, config.authToken).then(response => {
    const result = get(response, 'data.createEntity');
    return {
      entityId: result.id,
      libraryId: result.libraryId
    };
  });
}

function updateEntity(entityId, name, description, profileImageUrl, jsonData){
  const query = `
  mutation ($updateData: UpdateEntity!) {
    updateEntity(input: $updateData) {
      id
      libraryId
    }
  }`;

  const updateData = {
    id: entityId,
    name: name,
    jsondata: jsonData,
    description: description,
    profileImageUrl: profileImageUrl
  };

  return callGraphQl(config.graphqlUrl, query, {updateData: updateData}, config.authToken).then(response => {
    const result = get(response, 'data.updateEntity');
    return {
      entityId: result.id,
      libraryId: result.libraryId
    };
  });
}

function deleteEntity(entityId){
  const query = `
  mutation ($entityId: ID!) {
    deleteEntity(id: $entityId) {
      id
      message
    }
  }`;

  return callGraphQl(config.graphqlUrl, query, {entityId: entityId}, config.authToken);
}

function createEntityIdentifier(entityId, identifierTypeId, title, dataUrl, jsonData, contentType, isPriority = false){
  const query = `
  mutation ($newIdentifier: CreateEntityIdentifier!) {
    createEntityIdentifier(input: $newIdentifier) {
      id
      entityId
    }
  }`;

  const newIdentifier = {
    entityId: entityId,
    identifierTypeId: identifierTypeId,
    title: title,
    isPriority: isPriority,
    url: dataUrl,
    jsondata: jsonData,
    contentType: contentType,
    //file: "",
    //entityType: "",
    //profileUpdateMode: ""
  };

  return callGraphQl(config.graphqlUrl, query, {newIdentifier: newIdentifier}, config.authToken);
}

async function callGraphQl(graphqlUrl, query, variables, token) {
  const response = await fetch(graphqlUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ query, variables })
  });

  const { errors, data } = await response.json();

  if (errors && errors.length > 0) {
    return [errors, data];
  }

  return [null, data];
}

const createAssetAudio = async file => {
  const [error, data] = await getWriteUrl(config);
  if (error) {
    return [error];
  }

  const uploadUrlObj = await get(data, "getSignedWritableUrl", {});

  if (!uploadUrlObj.url) {
    return ["No url found!"];
  }

  await fetch(uploadUrlObj.url, {
    method: "PUT",
    body: file
  });

  const createTDOQuery = `mutation($input: CreateTDOWithAsset) {
      createTDOWithAsset(input: $input) {
        id
        primaryAsset(assetType: "media") {
          signedUri
        }
      }
    }`;

  const createTDOVariables = {
    input: {
      uri: uploadUrlObj.unsignedUrl,
      contentType: file.type,
      startDateTime: Date.now(),
      stopDateTime: Date.now()
    }
  };
  console.log("start create tdo", new Date());
  const [err, createTDOResult] = await callGraphQl(
    config.graphqlUrl,
    createTDOQuery,
    createTDOVariables,
    config.authToken
  );
  console.log(createTDOResult);

  console.log("end create tdo", new Date());
  if (err != null) {
    console.log("Error create TDO");
    return;
  }

  const {
    id: tdoId,
    primaryAsset: { signedUri }
  } = get(createTDOResult, "createTDOWithAsset", {});

  console.log("tdoId:", tdoId);
  console.log("signedUri", signedUri);
  return {
    tdoId,
    signedUri
  };
};

export default trainFace;
