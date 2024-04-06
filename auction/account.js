document.addEventListener('DOMContentLoaded', function() {
    const signupBtn = document.getElementById('signupBtn');
    const signinBtn = document.getElementById('signinBtn');

    signupBtn.addEventListener('click', signup);
    signinBtn.addEventListener('click', signin);
});

///////////////////////////////  alert message //////////////////////////////////////////////////////////
const messageBox = document.getElementById("messageBox");
const messageText = document.getElementById("messageText");
const alertText = document.getElementById("alertmessageText");
const messageContent = document.getElementById("messageContent");


function displayMessageBox(message,colorClass,removeExisting = false){
    alertText.classList.remove('hidden');
    messageText.textContent = message;

    if(removeExisting){

        messageContent.className = `p-4 mb-4 text-sm rounded-lg ${colorClass}`;    }

    messageBox.style.display = "block";

    setTimeout(function() {
        messageBox.style.display = "none";
    }, 2000); 
}

 // Assuming backend is hosted locally on port 3000
 const backendBaseUrl = '';

 
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
        displayMessageBox("Sign Up Successful", "bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400",true);


    })
    .catch(error => {
        console.error('Error:', error);
        displayMessageBox("Invalid Email or Password.");
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
        if (response.ok) {
            return response.json();

        } else if (response.status === 401) {
            displayMessageBox("Incorrect Email or Password.");
            throw new Error('Unauthorized');
        } else {
            throw new Error('Signin failed');
        }
    })
    .then(data => {
        // Store the token in local storage
        localStorage.setItem('token', data.token);
        // Redirect to index.html upon successful authentication
        displayMessageBox("Sign in Successful", "bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400",true);

        window.location.href = 'index.html'; 
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
