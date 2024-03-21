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

        // Append the div to the container
        container.appendChild(div);

        // Set the inner HTML of the div with item details
        div.innerHTML = `
        <div class="relative cursor-pointer rounded-lg h-96 w-80 overflow-hidden">
            <img src="${item.itemImageURL}" alt="${item.itemName}" class="object-cover h-full w-full">
            <div class="absolute inset-0 bg-gradient-to-r from-purple-400  to-purple-300 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
            <div class="absolute bottom-0 left-0 w-full text-white p-4  opacity-0 hover:opacity-100 transition-opacity duration-300 ">
                <h2 class="font-anta font-bold text-3xl">${item.itemName}</h2>
                <p class="font-anta text-lg">${item.itemDescription}</p>
            </div>
        </div>
    `;
    


        // Add event listener to the div

        div.addEventListener('click', () => {
          // redirecting to new page with item details
          window.location.href=`itemDetails.html?itemId=${itemId}`;
        })

        

        
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