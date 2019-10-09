

async function trainFace(person) {
    for (let index = 0; index < person.images.length; index++) {
        const image = person.images[index];
        await trainSingleImg(image.src, person.text);
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


export default trainFace;