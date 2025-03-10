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

// Open or create IndexedDB database
let db;
let request = indexedDB.open("GameDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("playerData")) {
        let store = db.createObjectStore("playerData", { keyPath: "username" });
        store.createIndex("clicks", "clicks", { unique: false });
        store.createIndex("tokens", "tokens", { unique: false });
    }
};

request.onsuccess = function(event) {
    db = event.target.result;
};

request.onerror = function(event) {
    console.error("IndexedDB Error:", event.target.errorCode);
};

// Function to save data in IndexedDB
function saveData(username, clicks, tokens) {
    let transaction = db.transaction(["playerData"], "readwrite");
    let store = transaction.objectStore("playerData");
    let data = { username: username, clicks: clicks, tokens: tokens };
    let request = store.put(data);

    request.onsuccess = function() {
        console.log("Game data saved successfully!");
    };

    request.onerror = function(event) {
        console.error("Error saving data:", event.target.error);
    };
}

// Function to load data from IndexedDB
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

    request.onerror = function(event) {
        console.error("Error loading data:", event.target.error);
    };
}

// Get username
let username = localStorage.getItem("loggedInUser");

// Load data when page loads
document.addEventListener("DOMContentLoaded", function() {
    if (!db) return; // Prevent errors if IndexedDB hasn't loaded
    loadData(username, function(clicks, tokens) {
        document.getElementById("clicks").textContent = clicks;
        document.getElementById("tokens").textContent = tokens;
    });
});

// Clicker button functionality
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

// Manual Save Button (Download JSON File)
document.getElementById("saveProgress").addEventListener("click", function() {
    let clicks = parseInt(document.getElementById("clicks").textContent);
    let tokens = parseInt(document.getElementById("tokens").textContent);

    let data = { username: username, clicks: clicks, tokens: tokens };
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    let downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "progress.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
});

// Manual Load Button (Upload JSON File)
document.getElementById("loadProgress").addEventListener("click", function() {
    document.getElementById("fileInput").click();
});

document.getElementById("fileInput").addEventListener("change", function(event) {
    let file = event.target.files[0];
    if (!file) return;
    
    let reader = new FileReader();
    reader.onload = function(event) {
        try {
            let data = JSON.parse(event.target.result);
            if (data.username === username) {
                document.getElementById("clicks").textContent = data.clicks;
                document.getElementById("tokens").textContent = data.tokens;
                saveData(username, data.clicks, data.tokens);
                alert("Progress Loaded!");
            } else {
                alert("This save file does not match your username.");
            }
        } catch (error) {
            alert("Invalid save file!");
        }
    };
    reader.readAsText(file);
});

document.addEventListener("DOMContentLoaded", function() {
    let tokens = parseInt(localStorage.getItem("tokens")) || 0;
    let clicks = 0;
    const tokenDisplay = document.getElementById("tokenCount");
    const clickButton = document.getElementById("clickButton");
    
    tokenDisplay.textContent = tokens;
    
    if (clickButton) {
        clickButton.addEventListener("click", function() {
            clicks++;
            if (clicks >= 100) {
                tokens++;
                localStorage.setItem("tokens", tokens);
                tokenDisplay.textContent = tokens;
                clicks = 0;
            }
        });
    }
});

