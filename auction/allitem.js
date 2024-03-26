document.addEventListener('DOMContentLoaded', function() {
  const backendBaseUrl = '';

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
        
                  <div class=" ">
                  <div class="relative">
                      <img src="${item.itemImageURL}" alt="${item.itemName}" class="object-cover rounded-lg h-96 w-72 lg:w-[27rem] lg:h-[30rem]  ">
                      

                     <div class=" absolute inset-0 text-black  opacity-100 lg:opacity-0 lg:hover:opacity-100 lg:hover:bg-two-tone transition-opacity duration-300    ">
                          <h2 class="font-anta font-bold text-3xl p-2">${item.itemName}</h2>
                          <p class="font-anta text-lg p-2">${item.itemDescription}</p>
                          </div>
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




//   <div class="flex flex-col items-center min-h-full bg-green-400">


//   <!-- Container for displaying images -->
//   <div id="itemContainer" class="  w-56 h-72 lg:w-56 lg:h-72">
//     images
//   </div>

// </div>