document.addEventListener('DOMContentLoaded', function() {
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
          
          <div>

          <h2 class="font-anta font-bold text-xl p-2">Customer Name ${item.name}</h2>
          <p class="font-anta text-lg p-2"> Product Name ${item.productname}</p>
          <p class="font-anta text-lg p-2">Mobile no ${item.mobileno}</p>
          <p class="font-anta text-lg p-2">Pincode ${item.pincode}</p>
          <p class="font-anta text-lg p-2">Flat no ${item.flat}</p>
          <p class="font-anta text-lg p-2">Area ${item.area}</p>
          <p class="font-anta text-lg p-2">Town ${item.town}</p>
          <p class="font-anta text-lg p-2">State ${item.state}</p>
          <button class="deleteBtn" data-item-id="${itemId}"> <img src="/svg/bin.svg" alt="" class="h-8 w-8 "></button>
          

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

      // Function to delete item by ID
  function deleteItem(itemId) {
    fetch(`${backendBaseUrl}/useaddress/${itemId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        console.log('Item deleted successfully');
        // Optionally, remove the deleted item from the UI
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
  