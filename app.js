// app.js
// this is the main file - connects api.js and render.js together
// all event listeners and main logic goes here

const showUsersBtn = document.getElementById("showUsersBtn");
const addUserBtn = document.getElementById("addUserBtn");

const formOverlay = document.getElementById("formOverlay");
const userForm = document.getElementById("userForm");
const formTitle = document.getElementById("formTitle");
const cancelBtn = document.getElementById("cancelBtn");

const userIdInput = document.getElementById("userId");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const departmentInput = document.getElementById("department");

// storing users locally so we don't have to call API again and again for delete/edit
let allUsers = [];

// keeping a counter for new users we add locally (since JSONPlaceholder always returns id: 11)
let nextLocalId = 100;

// when Show Users button is clicked
showUsersBtn.addEventListener("click", () => {
    loadUsers();
});

// when Add User button is clicked - open empty form
addUserBtn.addEventListener("click", () => {
    openForm(); // no user passed, means its "add" mode
});

// when Cancel button inside form is clicked
cancelBtn.addEventListener("click", () => {
    closeForm();
});

// when form is submitted (works for both Add and Edit)
userForm.addEventListener("submit", (e) => {
    e.preventDefault(); // stop page from reloading
    handleFormSubmit();
});


// main function to get users and show them
async function loadUsers() {
    try {
        showLoading(); // from render.js

        const data = await fetchUsers(); // from api.js

        // converting API data into simpler format
        // splitting "name" into firstName and lastName
        allUsers = data.map(user => {
            const nameParts = user.name.split(" ");
            return {
                id: user.id,
                firstName: nameParts[0],
                lastName: nameParts[1] || "",
                email: user.email,
                department: user.company.name
            };
        });

        clearStatus();
        renderUsers(allUsers); // from render.js

    } catch (err) {
        console.log(err);
        showError("Failed to load users. Please try again.");
    }
}

// opens the form - if user object is passed, its Edit mode. otherwise Add mode
function openForm(user) {
    userForm.reset();
    clearFormErrors();

    if (user) {
        // EDIT mode - fill form with existing data
        formTitle.textContent = "Edit User";
        userIdInput.value = user.id;
        firstNameInput.value = user.firstName;
        lastNameInput.value = user.lastName;
        emailInput.value = user.email;
        departmentInput.value = user.department;
    } else {
        // ADD mode - empty form
        formTitle.textContent = "Add New User";
        userIdInput.value = "";
    }

    formOverlay.classList.remove("hidden");
}

// closes the form and resets it
function closeForm() {
    formOverlay.classList.add("hidden");
    userForm.reset();
    clearFormErrors();
}

// clears all error texts in the form
function clearFormErrors() {
    document.getElementById("firstNameError").textContent = "";
    document.getElementById("lastNameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("departmentError").textContent = "";
}

// checks form fields before submitting, returns true if all good
function validateForm() {
    let isValid = true;
    clearFormErrors();

    if (firstNameInput.value.trim() === "") {
        document.getElementById("firstNameError").textContent = "First name is required";
        isValid = false;
    }

    if (lastNameInput.value.trim() === "") {
        document.getElementById("lastNameError").textContent = "Last name is required";
        isValid = false;
    }

    // simple email check - just checking it has @ and a . after it
    const emailValue = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue === "") {
        document.getElementById("emailError").textContent = "Email is required";
        isValid = false;
    } else if (!emailPattern.test(emailValue)) {
        document.getElementById("emailError").textContent = "Please enter a valid email";
        isValid = false;
    }

    if (departmentInput.value.trim() === "") {
        document.getElementById("departmentError").textContent = "Department is required";
        isValid = false;
    }

    return isValid;
}

// runs when form is submitted - handles both add and edit
async function handleFormSubmit() {
    const isValid = validateForm();
    if (!isValid) return;

    const userData = {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        department: departmentInput.value.trim()
    };

    const id = userIdInput.value;

    if (id) {
        // EDIT mode - id exists
        await handleUpdateUser(id, userData);
    } else {
        // ADD mode - no id yet
        await handleAddUser(userData);
    }
}

// adds new user - calls API then updates local array
async function handleAddUser(userData) {
    try {
        // sending to API in the "name" format it expects
        const payload = {
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            company: { name: userData.department }
        };

        await addUserToServer(payload); // from api.js
        // JSONPlaceholder always returns id: 11 for every new user, so we use our own local counter instead
        nextLocalId++;

        const newUser = {
            id: nextLocalId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            department: userData.department
        };

        allUsers.push(newUser);
        renderUsers(allUsers);
        closeForm();

    } catch (err) {
        console.log(err);
        alert("Something went wrong while adding the user");
    }
}

// updates existing user - calls API then updates local array
async function handleUpdateUser(id, userData) {
    try {
        const payload = {
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            company: { name: userData.department }
        };

        await updateUserOnServer(id, payload); // from api.js

        // updating the user in our local array
        allUsers = allUsers.map(user => {
            if (user.id == id) {
                return { ...user, ...userData };
            }
            return user;
        });

        renderUsers(allUsers);
        closeForm();

    } catch (err) {
        console.log(err);
        alert("Something went wrong while updating the user");
    }
}

// called when edit button is clicked on a card
function handleEditClick(id) {
    const user = allUsers.find(u => u.id == id);
    if (user) {
        openForm(user);
    }
}

// called when delete button is clicked on a card
async function handleDeleteClick(id) {
    try {
        const confirmDelete = confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        await deleteUserFromServer(id); // from api.js

        // JSONPlaceholder doesn't actually delete on their server
        // so removing it from our local array manually and re-rendering
        allUsers = allUsers.filter(user => user.id != id);
        renderUsers(allUsers);

    } catch (err) {
        console.log(err);
        alert("Something went wrong while deleting the user");
    }
}