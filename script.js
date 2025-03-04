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
        message.innerText = "Invalid username or password!";
    }
}

// Existing logic for login/register...

// Daily Wheel Logic
const wheel = document.getElementById('wheel');
const spinButton = document.getElementById('spin-button');

if (spinButton) {
  spinButton.addEventListener('click', async () => {
    spinButton.disabled = true; // Disable button during spin
    const response = await fetch('/api/spin-wheel', { method: 'POST' });
    const result = await response.json();

    if (result.success) {
      const randomRotation = 360 * 5 + result.rotation; // Spin multiple times
      wheel.style.transform = `rotate(${randomRotation}deg)`;
      setTimeout(() => {
        alert(`You won ${result.tokens} tokens!`);
        spinButton.disabled = false; // Re-enable button
      }, 3000); // Match the duration of the spin animation
    } else {
      alert(result.message); // Show error message
      spinButton.disabled = false; // Re-enable button
    }
  });
}
