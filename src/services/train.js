

async function trainFace(person) {
    console.log(person);
    let count = 0;
    for (let index = 0; index < person.images.length; index++) {
        const image = person.images[index];
        console.log(image)
        if(image.blob){
            const file = blobToFile(image.blob, `${person.name.replace(' ', '_')}.png`)
            const res = await trainSingleImgByFile(file, person);
            res === 'success' && count++;
        }else{
            const res = await trainSingleImg(image.src, person);
            res === 'success' && count++;
        }
    }
    return {
        success: count,
        total: person.images.length
    }
    
}

async function trainSingleImg(imgUrl, person) {
    let url = `https://facebox-gcloud-gke-veritone.com/facebox/teach`;
    const rawResponse = await fetch(url, {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "url": imgUrl,
        "id": person.id,
        "name": person.name})
    });
    const content = await rawResponse.json();
    if (content.success) {
        console.log(`SUCCESS - Train image ${imgUrl.substring(0, 40)}... for person name ${person.name}.`);
        return "success";
    }else{
        console.log(`ERROR - Train image ${imgUrl.substring(0, 40)}... for person name ${person.name} ${content.error}.`);
        return "failed";
    }
}

async function trainSingleImgByFile(file, person) {
    const url = `https://facebox-gcloud-gke-veritone.com/facebox/teach?name=${person.name}&id=${person.id}`;
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
        console.log(`SUCCESS - Train image ${file.name}... for person name ${person.name}.`);
        return "success";
    }else{
        console.log(`ERROR - Train image ${file.name}... for person name ${person.name} ${content.error}.`);
        return "failed";
    }
}

function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

export default trainFace;