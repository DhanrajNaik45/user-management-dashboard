// api.js
// this file only handles talking to the API (fetch calls)
// keeping this separate so if API changes, we only touch this file

const API_URL = "https://jsonplaceholder.typicode.com/users";

// fetches all users from server
async function fetchUsers() {
    const res = await fetch(API_URL);

    if (!res.ok) {
        throw new Error("Something went wrong while fetching users");
    }

    const data = await res.json();
    return data;
}

// sends POST request to add a new user
// note: JSONPlaceholder won't actually save this, it just sends back a fake response with an id
async function addUserToServer(user) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    if (!res.ok) {
        throw new Error("Failed to add user");
    }

    const data = await res.json();
    return data;
}

// sends PUT request to update existing user
// note: JSONPlaceholder won't actually update it on server, just simulates success
async function updateUserOnServer(id, user) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    if (!res.ok) {
        throw new Error("Failed to update user");
    }

    const data = await res.json();
    return data;
}

// sends DELETE request for a user
async function deleteUserFromServer(id) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    if (!res.ok) {
        throw new Error("Failed to delete user");
    }

    return true;
}