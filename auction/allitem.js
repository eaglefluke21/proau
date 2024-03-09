document.addEventListener('DOMContentLoaded', function() {
  const backendBaseUrl = 'http://localhost:3000';

  // Fetching the item data
  fetch(`${backendBaseUrl}/admin/listimages`)
    .then(response => response.json())
    .then(data => {
      console.log('Received item data:', data);

      // Get the container element where images will be displayed
      const container = document.getElementById('itemContainer');

      // Loop through the images data
      data.items.forEach(item => {

        console.log('Item:', item);

        const itemId = item._id;
         
        console.log("check id :" ,itemId);

        // Create a div to hold each item details
        const div = document.createElement('div');
        div.classList.add('item'); 

        // Set the inner HTML of the div with item details
        div.innerHTML = `
          <h2>Name: ${item.itemName}</h2>
          <p>Description: ${item.itemDescription}</p>
          <img src="${item.itemImageURL}" alt="${item.itemName}">
        `;


        // Add event listener to the div

        div.addEventListener('click', () => {
          // redirecting to new page with item details
          window.location.href=`itemDetails.html?itemId=${itemId}`;
        })

        

        // Append the div to the container
        container.appendChild(div);
      });
    })
    .catch(error => console.error('Error fetching item data:', error));
});





document.getElementById("toggle").addEventListener("click", function () {
    const nav = document.getElementById("nav");
    nav.classList.toggle("-translate-x-full");
  });

  document.getElementById("Items").addEventListener("click", function () {
    const nav = document.getElementById("dropdown");
    nav.classList.toggle("hidden");
  });