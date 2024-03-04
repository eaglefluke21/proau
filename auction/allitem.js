document.addEventListener('DOMContentLoaded', function() {
  const backendBaseUrl ='http://localhost:3300'; // Replace 'your_backend_base_url' with your actual backend base URL

  // Fetching the newly added item data
  fetch(`${backendBaseUrl}/admin/getlatestitem`)
  .then(response => response.json())
  .then(data => {
      console.log('Received item data:', data);

      // Construct the image URL
      const imageUrl = `${backendBaseUrl}/${data.itemImage.replace(/\\/g, '/')}`;
      console.log('Image URL:', imageUrl);

      // Set the item name and description
      document.getElementById('itemName').innerText = data.itemName;
      document.getElementById('itemDescription').innerText = data.itemDescription;

      // Set the image source
      document.getElementById('itemImage').src = imageUrl;
  })
  .catch(error => console.error('Error fetching latest item:', error));
});







document.getElementById("toggle").addEventListener("click", function () {
    const nav = document.getElementById("nav");
    nav.classList.toggle("-translate-x-full");
  });

  document.getElementById("Items").addEventListener("click", function () {
    const nav = document.getElementById("dropdown");
    nav.classList.toggle("hidden");
  });