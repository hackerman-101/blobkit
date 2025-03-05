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

// Open or create the database
let db;
let request = indexedDB.open("GameDB", 1);

// Runs if database needs an upgrade (first time opening)
request.onupgradeneeded = function(event) {
    db = event.target.result;
    let store = db.createObjectStore("playerData", { keyPath: "username" });
    store.createIndex("clicks", "clicks", { unique: false });
    store.createIndex("tokens", "tokens", { unique: false });
};

// Runs when the database successfully opens
request.onsuccess = function(event) {
    db = event.target.result;
};

// If an error happens
request.onerror = function(event) {
    console.log("Error opening IndexedDB:", event.target.errorCode);
};

function saveData(username, clicks, tokens) {
    let transaction = db.transaction(["playerData"], "readwrite");
    let store = transaction.objectStore("playerData");

    let data = { username: username, clicks: clicks, tokens: tokens };
    store.put(data);
}

function loadData(username, callback) {
    let transaction = db.transaction(["playerData"], "readonly");
    let store = transaction.objectStore("playerData");

    let request = store.get(username);
    request.onsuccess = function(event) {
        let data = event.target.result;
        if (data) {
            callback(data.clicks, data.tokens);
        } else {
            callback(0, 0); // Default values if no data found
        }
    };
}

let username = localStorage.getItem("loggedInUser");

document.addEventListener("DOMContentLoaded", function() {
    loadData(username, function(clicks, tokens) {
        document.getElementById("clicks").textContent = clicks;
        document.getElementById("tokens").textContent = tokens;
    });
});

document.getElementById("clickButton").addEventListener("click", function() {
    let clicks = parseInt(document.getElementById("clicks").textContent) + 1;
    let tokens = parseInt(document.getElementById("tokens").textContent);

    if (clicks % 100 === 0) {
        tokens++;
    }

    document.getElementById("clicks").textContent = clicks;
    document.getElementById("tokens").textContent = tokens;

    saveData(username, clicks, tokens);
});


