const API_URL = 'https://cuddly-catfish-79.localtunnel.me';

const getAll = async () => {
    let url = API_URL + '/users';
    const res = await fetch(url, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        }
    });

    console.log(res)
    return await res.json();
}

export {
    getAll
};
