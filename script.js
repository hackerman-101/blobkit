function register() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    let message = document.getElementById("message");

    if (!username || !password) {
        message.innerText = "Please enter both username and password!";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username]) {
        message.innerText = "Username already registered! Try logging in.";
    } else {
        users[username] = password;
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", username);
        window.location.href = "stats.html";
    }
}

function login() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    let message = document.getElementById("message");

    if (!username || !password) {
        message.innerText = "Please enter both username and password!";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};

    console.log("Stored Users:", users); // Debugging log

    if (users[username] && users[username] === password) {
        localStorage.setItem("currentUser", username);
        window.location.href = "stats.html";
    } else {
        message.innerText = "Invalid username or password";
    }
}
let clicks = 0;
let tokens = 0;

document.getElementById("clickButton").addEventListener("click", function() {
    clicks++;
    document.getElementById("clicks").textContent = clicks;

    if (clicks % 100 === 0) {
        tokens++;
        document.getElementById("tokens").textContent = tokens;
    }
});

    let clicks = localStorage.getItem("clicks") ? parseInt(localStorage.getItem("clicks")) : 0;
let tokens = localStorage.getItem("tokens") ? parseInt(localStorage.getItem("tokens")) : 0;

document.getElementById("clicks").textContent = clicks;
document.getElementById("tokens").textContent = tokens;

document.getElementById("clickButton").addEventListener("click", function() {
    clicks++;
    document.getElementById("clicks").textContent = clicks;
    localStorage.setItem("clicks", clicks);

    if (clicks % 100 === 0) {
        tokens++;
        document.getElementById("tokens").textContent = tokens;
        localStorage.setItem("tokens", tokens);
    }
});
