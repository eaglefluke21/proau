document.addEventListener('DOMContentLoaded', function() {

    const token = localStorage.getItem('token');

    const tokenParts = token.split('.');

    const decodedPayload = JSON.parse(atob(tokenParts[1]));

    const userEmail = decodedPayload.emailId;

    console.log(userEmail);

    if (token) {
        
        console.log('Token exists:', token);

    } else {
        
        console.log('Token does not exist');
    }

});
    
    
    
    
    
    
    
    
    
    
    
    document.getElementById("toggle").addEventListener("click", function () {
      const nav = document.getElementById("nav");
      nav.classList.toggle("-translate-x-full");
    });
  
    document.getElementById("Items").addEventListener("click", function () {
      const nav = document.getElementById("dropdown");
      nav.classList.toggle("hidden");
    });
  
  
  
  
 