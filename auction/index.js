document.getElementById("toggle").addEventListener("click", function () {
    const nav = document.getElementById("nav");
    nav.classList.toggle("-translate-x-full");
  });

  document.getElementById("Items").addEventListener("click", function () {
    const nav = document.getElementById("dropdown");
    nav.classList.toggle("hidden");
  });

  const images = [
    'svg/ywall.jpg',
    'svg/whitebg.jpg',

    


  ];

  function changeBackgroundImages() {
    const currentIndex = Math.floor(Math.random() * images.length);
    const imageUrl = images[currentIndex];
    document.body.style.backgroundImage = `url(${imageUrl})`
  }

  setInterval(changeBackgroundImages, 5000);