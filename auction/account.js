document.addEventListener('DOMContentLoaded', function() {
    const signupBtn = document.getElementById('signupBtn');
    const signinBtn = document.getElementById('signinBtn');

    signupBtn.addEventListener('click', signup);
    signinBtn.addEventListener('click', signin);
});

 // Assuming backend is hosted locally on port 3000
 const backendBaseUrl = 'http://localhost:3000';

 
function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;

   

    fetch(`${backendBaseUrl}/signup`, { // Corrected endpoint URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function signin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;

    fetch(`${backendBaseUrl}/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (response.status === 200) {
            // Redirect to index.html upon successful authentication
            window.location.href = 'index.html'; 
        } else if (response.status === 401) {
            document.getElementById('error-message').innerText = 'Incorrect email or password.';
        } else {
            throw new Error('Signin failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}




document.getElementById("toggle").addEventListener("click", function () {
    const nav = document.getElementById("nav");
    nav.classList.toggle("-translate-x-full");
  });

  document.getElementById("Items").addEventListener("click", function () {
    const nav = document.getElementById("dropdown");
    nav.classList.toggle("hidden");
  });
