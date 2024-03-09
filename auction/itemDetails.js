document.addEventListener('DOMContentLoaded', function() {

// Extract item Id from URL query parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const itemId = urlParams.get('itemId');
console.log('item id:', itemId);

// Fetch item details from backend using item ID
const backendBaseUrl = 'http://localhost:3000';
fetch(`${backendBaseUrl}/admin/getItemDetails?itemId=${itemId}`)
.then(response => {
    if(!response.ok){
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    // filling html elements with details
    document.getElementById('itemName').innerText = data.itemName;
    document.getElementById('itemDescription').innerText = data.itemDescription;
    document.getElementById('itemImageURL').src = data.itemImageURL;


})
.catch(error => console.error('Error fetching item details:', error ));


});


document.getElementById("toggle").addEventListener("click", function () {
    const nav = document.getElementById("nav");
    nav.classList.toggle("-translate-x-full");
  });

  document.getElementById("Items").addEventListener("click", function () {
    const nav = document.getElementById("dropdown");
    nav.classList.toggle("hidden");
  });

