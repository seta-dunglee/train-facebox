const API_URL = 'http://34.87.44.77:8000';

const getConfigs = async () => {
    let url = API_URL + '/configs/';
    const res = await fetch(url, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        }
    });
    const {data} = await res.json();
    return data;
}

const getAll = async () => {
    let url = API_URL + '/users/';
    const res = await fetch(url, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        }
    });
    const {data} = await res.json();
    return data;
}

const storeUser = async (postData) => {
    let url = API_URL + '/users/';
    const res = await fetch(url, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(postData) // 
    });
    const {data} = await res.json();
    return data;
}
const updateUser = async (postData) => {
    let url = API_URL + '/users/update';
    const res = await fetch(url, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(postData) // 
    });
    const {data} = await res.json();
    return data;
}

const deleteUser = async (postData) => {
    let url = API_URL + '/users/delete/';
    const res = await fetch(url, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(postData) // 
    });
    const {data} = await res.json();
    return data;
}

export {
    getAll,
    storeUser,
    updateUser,
    deleteUser,
    getConfigs
};
