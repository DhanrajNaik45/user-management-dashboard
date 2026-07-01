# User Management Dashboard

This is a simple project where you can view, add, edit and delete users. Made this using plain HTML, CSS and JavaScript for the JavaScript Basics assignment.

## What it does

- Shows all users in cards
- Can add a new user using a form
- Can edit a user
- Can delete a user
- Shows error message if something fails
- Basic form validation (checks empty fields and email format)
- Works fine on mobile too

## Tech used

- HTML
- CSS
- JavaScript (no framework, plain JS)
- Fetch API to call the backend
- JSONPlaceholder (fake API) - https://jsonplaceholder.typicode.com/

## Files

- `index.html` - main page
- `style.css` - all css
- `api.js` - all the fetch calls (get, add, update, delete)
- `render.js` - code that builds the cards and shows them on page
- `app.js` - main file, connects everything, has all click events

I split the JS into 3 files just so it's not all in one big file and easy to check.

## How to run

1. Clone the repo
```
git clone https://github.com/DhanrajNaik45/user-management-dashboard.git
```
2. Open the folder
```
cd user-management-dashboard
```
3. Open `index.html` in browser. That's it, no npm install or anything needed.

## Live link

[https://user-management-dashboard-aduz.onrender.com/]

## Assumptions I made

- JSONPlaceholder is a fake API so it doesn't really save/update/delete anything on their side. So after calling the API, I just update my own local array so it looks like it worked on the UI.
- Every time you add a new user, JSONPlaceholder always sends back id as 11 (since it's fake data), so I made my own counter for new user ids instead of using what API returns.
- Used `company.name` from the API as Department, since there's no actual department field in this API.
- The API gives full name like "Leanne Graham", so I just split it by space to get first name and last name. This might not work properly if someone has only 1 name or more than 2 words in their name.

## Challenges I faced

- Since this API doesn't actually save data, had to manage everything locally after calling API so UI updates properly.
- Using same form for both Add and Edit was confusing at first. Fixed it by using a hidden input for user id - if empty its Add, if it has value its Edit.
- Had to be careful with event listeners since cards get re-rendered every time, so listeners were getting added again and again if not handled properly.


