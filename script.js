// User authentication (Register & Login)
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("register")) {
        document.getElementById("register").addEventListener("click", function() {
            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            if (username && password) {
                localStorage.setItem("user_" + username, password);
                localStorage.setItem("tokens_" + username, 0);
                alert("Account created! Please log in.");
            } else {
                alert("Please fill in both fields.");
            }
        });
    }

    if (document.getElementById("login")) {
        document.getElementById("login").addEventListener("click", function() {
            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            if (localStorage.getItem("user_" + username) === password) {
                localStorage.setItem("loggedInUser", username);
                window.location.href = "stats.html";
            } else {
                alert("Invalid login!");
            }
        });
    }
});

// Clicker Game Logic (Only runs on stats.html)
if (document.getElementById("clickButton")) {
    let username = localStorage.getItem("loggedInUser");
    let clicks = localStorage.getItem("clicks_" + username) ? parseInt(localStorage.getItem("clicks_" + username)) : 0;
    let tokens = localStorage.getItem("tokens_" + username) ? parseInt(localStorage.getItem("tokens_" + username)) : 0;

    document.getElementById("clicks").textContent = clicks;
    document.getElementById("tokens").textContent = tokens;

    document.getElementById("clickButton").addEventListener("click", function() {
        clicks++;
        document.getElementById("clicks").textContent = clicks;
        localStorage.setItem("clicks_" + username, clicks);

        if (clicks % 100 === 0) {
            tokens++;
            document.getElementById("tokens").textContent = tokens;
            localStorage.setItem("tokens_" + username, tokens);
        }
    });
}

// Logout button functionality
document.getElementById("logoutButton").addEventListener("click", function() {
    localStorage.removeItem("loggedInUser"); // Clear stored username
    window.location.href = "index.html"; // Redirect to login page
});

