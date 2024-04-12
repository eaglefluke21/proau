

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

    ///////////////////////////////  alert message //////////////////////////////////////////////////////////
const messageBox = document.getElementById("messageBox");
const messageText = document.getElementById("messageText");
const alertText = document.getElementById("alertmessageText");
const messageContent = document.getElementById("messageContent");


function displayMessageBox(message,colorClass,removeExisting = false){
    alertText.classList.remove('hidden');
    messageBox.classList.add('flex');
    messageText.textContent = message;

    if(removeExisting){

        messageContent.className = `p-4 mb-4 text-sm rounded-lg ${colorClass}`;    }

    messageBox.style.display = "block";

    setTimeout(function() {
        messageBox.style.display = "none";
    }, 2000); 
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
       
        const container = document.getElementById('cartContainer');

       let itemId = itemDetails._id;

       console.log('checking item id:', itemId);

       const div = document.createElement('div');

       container.appendChild(div);

       div.innerHTML = `
       
       
       <div class="relative">
           <img src="${itemDetails.itemImageURL}" alt="${itemDetails.itemName}" class="object-cover rounded-lg h-96 w-72 lg:w-[27rem] lg:h-[30rem]  ">
           
           

          <div class=" absolute inset-0 text-black  opacity-100 lg:opacity-0 lg:hover:opacity-100 lg:hover:bg-two-tone transition-opacity duration-300 ">

            <h2 class="font-anta font-bold text-3xl p-2">${itemDetails.itemName}</h2>

               <p class="font-anta text-lg p-2">${itemDetails.itemDescription}</p>
      
            </div>

            <div class="absolute top-0 right-0 z-50 ">
            <button class="deleteBtn" data-item-id="${itemId}"> <img src="/svg/bin.svg" alt="" class="h-8 w-8 "></button>
          </div>

               </div>

  
       
       `;

       //navigate to itemdetails page

       div.addEventListener('click', () =>{
        window.location.href=`itemDetails.html?itemId=${itemId}`;
       })


       // adding event listener to delete button
       const deleteButton = div.querySelector('.deleteBtn');
       deleteButton.addEventListener('click',() =>{

      
        event.stopPropagation();
        console.log("am i reciving itemId:",itemId);
        
        deleteItem(userEmail,itemId);
       })



      })
      .catch(error => {
        console.error("Couldn't fetch item details for", item.itemId, ":", error);
      });
  });
})
.catch(error => {
  console.error("Couldn't fetch cart items:", error);
});



// function to remove items from cart

function deleteItem(userEmail,itemId){
  console.log("Deleting item with ID:", itemId);

  fetch(`${backendBaseUrl}/cartitems/delete`,{
    method: 'DELETE',
    headers:{
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userEmail, itemId})
  })
  .then(response => {
    if (response.ok) {
      console.log('Item removed from cart successfully');
      // Optionally, remove the deleted item from the UI
      displayMessageBox("Removed from cart successfully.", "bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400",true);

    } else {
      console.error('Failed to remove from cart');
    }
  })
  .catch(error => console.error('Error removing from cart:', error));
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
  
  
  
  
 