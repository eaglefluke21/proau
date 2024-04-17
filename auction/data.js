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
     

  const logout = document.getElementById('logoutbtn');

  logout.addEventListener('click', () =>{

   const token = localStorage.removeItem('token');

   if (token == null) {

    console.log('Token removed. User Logged out',token);

    window.location.href=`account.html`;

   }

   

  })





    const backendBaseUrl = '';
  
    // Fetching the item data
    fetch(`${backendBaseUrl}/useaddress/listdata`)
      .then(response => response.json())
      .then(data => {
        console.log('Received item data:', data);
  
        // Get the container element where images will be displayed
        const container = document.getElementById('dataContainer');
  
        // Loop through the images data
        data.items.forEach(item => {
  
          console.log('Item:', item);
  
          const itemId = item._id;
           
          console.log("check id :" ,itemId);
  
          // Create a div to hold each item details
          const div = document.createElement('div');
          div.classList.add('item'); 
  
          // Append the div to the container
          container.appendChild(div);
  
          // Set the inner HTML of the div with item details
          div.innerHTML = `
          
          <div class="bg-slate-100 rounded-lg h-96 w-72 ">

          <div class="flex flex-row justify-between ">
          <h2 class=" font-anta  text-xl p-2">Customer Name: <span class="font-comic"> ${item.name} </span></h2>
          <button class="deleteBtn" data-item-id="${itemId}"> <img src="/svg/bin.svg" alt="" class="h-8 w-8 "></button>
          </div>

          <p class="font-anta text-lg p-2"> Product Name: <span class="font-comic">   ${item.productname} </span></p>
          <p class="font-anta text-lg p-2">Mobile no:  <span class="font-comic">   ${item.mobileno}</span></p>
          <p class="font-anta text-lg p-2">Pincode:  <span class="font-comic"> ${item.pincode}</span></p>
          <p class="font-anta text-lg p-2">Flat no:  <span class="font-comic"> ${item.flat}</span></p>
          <p class="font-anta text-lg p-2">Area:  <span class="font-comic"> ${item.area}</span></p>
          <p class="font-anta text-lg p-2">Town:  <span class="font-comic"> ${item.town}</span></p>
          <p class="font-anta text-lg p-2">State:  <span class="font-comic"> ${item.state}</span></p>
          

          </div>
                    
      `;



      // Add event listener to delete button
      const deleteButton = div.querySelector('.deleteBtn');
            deleteButton.addEventListener('click', () => {
                deleteItem(itemId);
            });
      
    
          
        });
      })
      .catch(error => console.error('Error fetching item data:', error));



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


      // Function to delete item by ID
  function deleteItem(itemId) {
    fetch(`${backendBaseUrl}/useaddress/deletedata`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ itemId})
    })
    .then(response => {
      if (response.ok) {
        console.log('Item deleted successfully');
        // Optionally, remove the deleted item from the UI
        displayMessageBox("Address Deleted successfully.", "bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400",true);

      } else {
        console.error('Failed to delete item');
      }
    })
    .catch(error => console.error('Error deleting item:', error));
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
  