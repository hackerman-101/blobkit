function register() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
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
