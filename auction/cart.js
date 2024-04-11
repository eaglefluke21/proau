

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

    
let backendBaseUrl = '';

let cartItems = [];


fetch(`${backendBaseUrl}/cartitems?userEmail=${userEmail}`)
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  cartItems = data.cartItems;
  console.log("Cart items:", cartItems);

  // Loop through cart items and fetch details for each item ID
  cartItems.forEach(item => {
    fetch(`${backendBaseUrl}/admin/getItemDetails?itemId=${item.itemId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(itemDetails => {
        console.log("Item details for", item.itemId, ":", itemDetails);
        // Do something with the item details if needed
      })
      .catch(error => {
        console.error("Couldn't fetch item details for", item.itemId, ":", error);
      });
  });
})
.catch(error => {
  console.error("Couldn't fetch cart items:", error);
});




});





    
    
    
    
    
    
    
    
    
    
    
    document.getElementById("toggle").addEventListener("click", function () {
      const nav = document.getElementById("nav");
      nav.classList.toggle("-translate-x-full");
    });
  
    document.getElementById("Items").addEventListener("click", function () {
      const nav = document.getElementById("dropdown");
      nav.classList.toggle("hidden");
    });
  
  
  
  
 