
document.addEventListener('DOMContentLoaded', function() {
    

    

});


document.getElementById("edit").addEventListener("click", function () {
    const addresstog = document.getElementById("delivery");
    addresstog.classList.toggle("hidden");


  });

 
document.getElementById("toggle").addEventListener("click", function () {
    const nav = document.getElementById("nav");
    nav.classList.toggle("-translate-x-full");
  });

  document.getElementById("Items").addEventListener("click", function () {
    const nav = document.getElementById("dropdown");
    nav.classList.toggle("hidden");
  });
