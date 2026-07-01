// render.js
// this file only handles building/showing UI (cards, status messages)
// keeping UI stuff separate from API calls and main logic

const statusMsg = document.getElementById("statusMsg");
const userContainer = document.getElementById("userContainer");

// shows loading text
function showLoading() {
    statusMsg.innerHTML = `<p class="loading-text">Loading users...</p>`;
}

// shows error text
function showError(message) {
    statusMsg.innerHTML = `<p class="error-text">${message}</p>`;
}

// clears status message (loading/error)
function clearStatus() {
    statusMsg.innerHTML = "";
}

// takes array of users and builds cards for each one
function renderUsers(users) {
    userContainer.innerHTML = "";

    // if no users found (after filter/search maybe)
    if (users.length === 0) {
        userContainer.innerHTML = `<p>No users found.</p>`;
        return;
    }

    users.forEach(user => {
        const card = document.createElement("div");
        card.classList.add("user-card");

        card.innerHTML = `
            <h3>${user.firstName} ${user.lastName}</h3>
            <p>ID: ${user.id}</p>
            <p>Email: ${user.email}</p>
            <p>Department: ${user.department}</p>
            <div class="card-buttons">
                <button class="edit-btn" data-id="${user.id}">Edit</button>
                <button class="delete-btn" data-id="${user.id}">Delete</button>
            </div>
        `;

        userContainer.appendChild(card);
    });

    // attaching click events after cards are added to DOM
    attachCardEvents();
}

// hooks up edit/delete buttons on every card
// this gets called every time renderUsers() runs, since old buttons are removed with innerHTML reset
function attachCardEvents() {
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            handleEditClick(id); // this function lives in app.js
        });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            handleDeleteClick(id); // this function lives in app.js
        });
    });
}