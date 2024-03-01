document.addEventListener('DOMContentLoaded', function() {
    // Your code here
    const addItem = document.getElementById('addItem');
    if (addItem) {
        addItem.addEventListener('click', additem);
    }
});


// Assuming backend is hosted locally on port 3000
const backendBaseUrl = 'http://localhost:3300';

function additem() {
    const itemName = document.getElementById("itemName").value;
    const itemImage = document.getElementById("itemImage").files[0];
    const itemDescription = document.getElementById("itemDescription").value;

    const itemData = new FormData();
    itemData.append("itemName", itemName);
    itemData.append("itemImage", itemImage);
    itemData.append("itemDescription", itemDescription);

    // Send data to backend
    fetch(`${backendBaseUrl}/admin/additem`, {
        method: 'POST',
        body: itemData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Item added successfully:', data);
        
    })
    .catch(error => {
        console.error('There was a problem adding the item:', error);
        // Handle errors
    });


};

 // fetching the newly added item data 
 fetch(`${backendBaseUrl}/admin/getlatestitem`)
 .then(response => response.json())
 .then(data => {
     console.log('Received item data:', data);
     // Assuming you have elements with IDs in item.html to display the item data
     document.getElementById('itemName').innerText = data.itemName;
     document.getElementById('itemDescription').innerText = data.itemDescription;
     document.getElementById('itemImage').src = `${backendBaseUrl}/${data.itemImage}`;
     
 })
 .catch(error => console.error('Error fetching latest item:', error));









document.getElementById("toggle").addEventListener("click", function () {
    const nav = document.getElementById("nav");
    nav.classList.toggle("-translate-x-full");
  });

  document.getElementById("Items").addEventListener("click", function () {
    const nav = document.getElementById("dropdown");
    nav.classList.toggle("hidden");
  });