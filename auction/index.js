document.addEventListener('DOMContentLoaded', function () {
  const backendBaseUrl = 'http://localhost:3000';

  // Fetching the item data
  fetch(`${backendBaseUrl}/admin/listimages`)
    .then(response => response.json())
    .then(data => {
      console.log('Received item data:', data);

      // Get the container element where images will be displayed
      const carouselInner = document.getElementById('carousel-inner');

      // Loop through the images data
      data.items.forEach(item => {
        // Create a div to hold each item details
        const itemdiv = document.createElement('div');
        itemdiv.classList.add('item');

        // Append the div to the container
        carouselInner.appendChild(itemdiv);

        // Set the inner HTML of the div with item details

        itemdiv.innerHTML = `
                  
                  <div>
                  
                      <img src="${item.itemImageURL}" alt="${item.itemName}" class=" absolute inset-0 object-cover rounded-lg h-full w-full lg:h-full lg:w-full  ">
                      
                     <div class=" absolute inset-0   text-white  opacity-100 lg:opacity-0 lg:hover:opacity-100 lg:hover:bg-two-tone transition-opacity duration-300    ">
                          <h2 class="font-anta font-bold text-3xl">${item.itemName}</h2>
                          <p class="font-anta text-lg">${item.itemDescription}</p>
                          </div>
                     
                  
                  </div>
              `;

        // Add event listener to the div
        itemdiv.addEventListener('click', () => {
          // redirecting to new page with item details
          window.location.href = `itemDetails.html?itemId=${item._id}`;
        });
      });

      // Show the first slide
      showSlide(0);
    })
    .catch(error => console.error('Error fetching item data:', error));




});

let currentSlide = 0;

function nextSlide() {
  const slides = document.querySelectorAll('#carousel-inner > div');
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  const slides = document.querySelectorAll('#carousel-inner > div');
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}


function showSlide(slideIndex) {
  const slides = document.querySelectorAll('#carousel-inner > div');
  slides.forEach((slide, index) => {
    if (index === slideIndex) {
      slide.classList.remove('hidden');
    } else {
      slide.classList.add('hidden');
    }
  });
}




document.getElementById("toggle").addEventListener("click", function () {
  const nav = document.getElementById("nav");
  nav.classList.toggle("-translate-x-full");
});

document.getElementById("Items").addEventListener("click", function () {
  const nav = document.getElementById("dropdown");
  nav.classList.toggle("hidden");
});
