document.addEventListener('DOMContentLoaded', function() {
  const backendBaseUrl ='http://localhost:3000'; // Replace 'http://localhost:3300' with your actual backend base URL

  // Fetching the item data
  fetch(`${backendBaseUrl}/admin/listimages`)
  .then(response => response.json())
  .then(data => {
      console.log('Received item data:', data);

      // Get the container element where images will be displayed
      const container = document.getElementById('itemContainer');

      // Loop through the images data
      data.images.forEach(image => {
          // Create a div to hold each image details
          const div = document.createElement('div');
          div.classList.add('item'); // Add a CSS class for styling if needed

          // Set the inner HTML of the div with image details
          div.innerHTML = `
              <h2>Name: ${image.name}</h2>
              <p>Description: ${image.description}</p>
              <img src="${image.downloadURL}" alt="${image.name}">
          `;

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