

async function trainFace(person) {
    for (let index = 0; index < person.images.length; index++) {
        const image = person.images[index];
        console.log(image)
        if(image.blob){
            const file = blobToFile(image.blob, `${person.text.replace(' ', '_')}.png`)
            await trainSingleImgByFile(file, person.text);
        }else{
            await trainSingleImg(image.src, person.text);
        }
    }
}

async function trainSingleImg(imgUrl, name) {
    let url = `https://facebox-gcloud-gke-veritone.com/facebox/teach`;
    const rawResponse = await fetch(url, {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "url": imgUrl,
        "id": "seta_train_" + name.replace(' ', '_'),
        "name": name})
    });
    const content = await rawResponse.json();
    if (content.success) {
        console.log(`SUCCESS - Train image ${imgUrl.substring(0, 40)}... for person name ${name}.`);
    }else{
        console.log(`ERROR - Train image ${imgUrl.substring(0, 40)}... for person name ${name} ${content.error}.`);

    }
}

async function trainSingleImgByFile(file, name) {
    const id = "seta_train_" + name.replace(' ', '_');
    const url = `https://facebox-gcloud-gke-veritone.com/facebox/teach?name=${name}&id=${id}`;
    const formData = new FormData();
    formData.append('file', file);
    const rawResponse = await fetch(url, {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        },
        body: formData
    });
    const content = await rawResponse.json();
    if (content.success) {
        console.log(`SUCCESS - Train image ${file.name}... for person name ${name}.`);
    }else{
        console.log(`ERROR - Train image ${file.name}... for person name ${name} ${content.error}.`);

    }
}

function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

export default trainFace;