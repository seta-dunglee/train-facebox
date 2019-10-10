import { get } from 'lodash';

const config = {
    authToken: "63b0d0:c5d3e49aabc740638e7ce84ab0eb9bdec3ac99a9a6a24d7096df5ef17f48d321",
    graphqlUrl: 'https://api.veritone.com/v3/graphql',
};

const createAssetAudio = async (file, speaker_id) => {
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

    const postreqdat = {
        url: signedUri,
        sid: speaker_id,
        clear: 0
    };

    console.log(uploadUrlObj.url);

   
    console.log("start train ", new Date());
   
    return fetch(
        `https://spkverif-veritone-gcloud-gke.com/teach`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postreqdat) // body data type must match "Content-Type" header
        }
    );
};

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

function getWriteUrl() {
    const query = `
      query {
        getSignedWritableUrl {
          url
          unsignedUrl
          getUrl
        }
      }
    `;

    return callGraphQl(config.graphqlUrl, query, {}, config.authToken);
}

export {
    createAssetAudio
};