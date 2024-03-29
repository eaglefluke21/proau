
document.addEventListener('DOMContentLoaded', function() {
    
// Extract item Id from URL query parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const itemId = urlParams.get('itemId');
console.log('item id:', itemId);



const backendBaseUrl = '';


// Fetch item details from backend using item ID
fetch(`${backendBaseUrl}/admin/getItemDetails?itemId=${itemId}`)
.then(response => {
    if(!response.ok){
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    
    document.getElementById('itemImageURL').src = data.itemImageURL;


})
.catch(error => console.error('Error fetching item details:', error ));


// fetching data of delivery address and posting it to database
    
const AddAddressBtn = document.getElementById('addAddressBtn');

AddAddressBtn.addEventListener('click', addAddress);



 
function addAddress() {
    const name = document.getElementById('customerName').value;
    const mobileno = document.getElementById('customerMobileno').value;
    const pincode = document.getElementById('pinCode').value;
    const flat = document.getElementById('flatNo').value;
    const area = document.getElementById('Area').value;
    const town = document.getElementById('Town').value;
    const state = document.getElementById('State').value;

    




   

    fetch(`${backendBaseUrl}/useaddress`, { // Corrected endpoint URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, mobileno, pincode ,flat,area,town,state })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



});



// Delivery address
document.getElementById("editdelivery").addEventListener("click", function () {
    const addresstog = document.getElementById("delivery");
    addresstog.classList.toggle("hidden");


     // Hide other sections
     document.getElementById("payment").classList.add("hidden");
     document.getElementById("offer").classList.add("hidden");
     document.getElementById("Itemsdeli").classList.add("hidden");

  });

  // payment 
document.getElementById("editpayment").addEventListener("click", function () {
  const paymenttog = document.getElementById("payment");
  paymenttog.classList.toggle("hidden");

   // Hide other sections
   document.getElementById("delivery").classList.add("hidden");
   document.getElementById("offer").classList.add("hidden");
   document.getElementById("Itemsdeli").classList.add("hidden");

});


  // offer
  document.getElementById("editoffer").addEventListener("click", function () {
    const offertog = document.getElementById("offer");
    offertog.classList.toggle("hidden");

     // Hide other sections
   document.getElementById("delivery").classList.add("hidden");
   document.getElementById("payment").classList.add("hidden");
   document.getElementById("Itemsdeli").classList.add("hidden");
  
  
  });
  

    // items & delivery
    document.getElementById("editItemsdeli").addEventListener("click", function () {
      const offertog = document.getElementById("Itemsdeli");
      offertog.classList.toggle("hidden");

       // Hide other sections
   document.getElementById("delivery").classList.add("hidden");
   document.getElementById("offer").classList.add("hidden");
   document.getElementById("payment").classList.add("hidden");
    
    
    });
    

// navbar
 
document.getElementById("toggle").addEventListener("click", function () {
    const nav = document.getElementById("nav");
    nav.classList.toggle("-translate-x-full");
  });

  document.getElementById("Items").addEventListener("click", function () {
    const nav = document.getElementById("dropdown");
    nav.classList.toggle("hidden");
  });
