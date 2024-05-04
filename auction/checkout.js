
document.addEventListener('DOMContentLoaded', function() {

    const token = localStorage.getItem('token');

    const tokenParts = token.split('.');
  
    const decodedPayload = JSON.parse(atob(tokenParts[1]));
  
    const userEmail = decodedPayload.emailId;
  
    console.log(userEmail);
  
    if (token) {
        
        console.log('Token exists:', token);
  
    } else {
        
        console.log('Token does not exist');
    }
       
  
    const logout = document.getElementById('logoutbtn');
  
    logout.addEventListener('click', () =>{
  
     const token = localStorage.removeItem('token');
  
     if (token == null) {
  
      console.log('Token removed. User Logged out',token);
  
      window.location.href=`account.html`;
  
     }
  
     
  
    })
  



let prodname;
    
// Extract item Id from URL query parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const itemId = urlParams.get('itemId');
const amount = urlParams.get('amount');
console.log('item id:', itemId);
console.log('amount:', amount);



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

    prodname = data.itemName; // assigning value to prod name

    console.log('checking name ', prodname);


})
.catch(error => console.error('Error fetching item details:', error ));


// fetching data of delivery address and posting it to database
    
const AddAddressBtn = document.getElementById('addAddressBtn');

AddAddressBtn.addEventListener('click', addAddress);

    ///////////////////////////////  alert message //////////////////////////////////////////////////////////
    const messageBox = document.getElementById("messageBox");
    const messageText = document.getElementById("messageText");
    const alertText = document.getElementById("alertmessageText");
    const messageContent = document.getElementById("messageContent");
    
    
    function displayMessageBox(message,colorClass,removeExisting = false){
        alertText.classList.remove('hidden');
        messageBox.classList.add('flex');
        messageText.textContent = message;
    
        if(removeExisting){
    
            messageContent.className = `p-4 mb-4 text-sm rounded-lg ${colorClass}`;    }
    
        messageBox.style.display = "block";
    
        setTimeout(function() {
            messageBox.style.display = "none";
        }, 2000); 
    }


 
function addAddress() {
    const name = document.getElementById('customerName').value;
    const mobileno = document.getElementById('customerMobileno').value;
    const pincode = document.getElementById('pinCode').value;
    const flat = document.getElementById('flatNo').value;
    const area = document.getElementById('Area').value;
    const town = document.getElementById('Town').value;
    const state = document.getElementById('State').value;
    const productname = prodname;



    const isValid = name && mobileno && pincode && flat && area && town && state && productname;


  

    fetch(`${backendBaseUrl}/useaddress`, { // Corrected endpoint URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, mobileno, pincode ,flat,area,town,state, productname })
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

    if (isValid) {
        displayMessageBox("Delivery address added Successfuly", "bg-green-50 text-green-800 ",true);

    } else {
        console.error('One or more fields are empty');
        displayMessageBox("Please fill in all required fields.");
    }
    
}



//////////////////////////////////////////////////////////////// stripe /////////////////////////////////////////////////////////


const STRIPE_PUBLIC_KEY = 'pk_test_51OURt4SIANzm4t2kI3Uij8JRDaNvgqTQuuhOY1QbNhKvHnwRsuD9f6s6xFKCnIqcR2FXeQ0t8m8cVdMLmpsYrHxw00WenAPqtW';


// Initialize Stripe with public key
const stripe = window.Stripe(STRIPE_PUBLIC_KEY);
const elements = stripe.elements();

const cardElement = elements.create('card');

cardElement.mount('#cardnum');




const AddPayButton = document.getElementById('paybutton');

    

AddPayButton.addEventListener('click', async () => {

  // Get input values
  const paymentcardName = document.getElementById('paymentcardName').value;
    
  const amountInCents = amount*100;
  const currency = 'usd';

  

if (!paymentcardName || !cardElement){

    displayMessageBox("please enter your Name and Card Details");
    console.log('please enter your Name and Card Details');

    return; 
}


  // Create Payment Method
  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });

  if (error) {
    console.error('Error:', error.message);
    return;
  }

  const data = {
    amount: amountInCents,
    currency: currency,
    paymentMethodId: paymentMethod.id
  };


  fetch(`${backendBaseUrl}/stripeService`, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
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
  .catch(error => console.error('Error fetching item details:', error ));

});



/////////////////////////////// stripe  ends //////////////////////////////////////////////////////////////////




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
