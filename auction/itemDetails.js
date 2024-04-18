document.addEventListener('DOMContentLoaded', function() {

     ///Extract item Id from URL query parameters/////////////////////////////////////
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const itemId = urlParams.get('itemId');
console.log('item id:', itemId);


let backendBaseUrl = '';

    updateTimerDisplay();

    fetchitemDetails ();
    
  
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

    // Logout user
  const logout = document.getElementById('logoutbtn');

  logout.addEventListener('click', () =>{

   const token = localStorage.removeItem('token');

   if (token == null) {

    console.log('Token removed. User Logged out',token);

    window.location.href=`account.html`;

   }

   

  })


 

  
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


  const TimerBox = document.getElementById('timerbox');
  const startTimerBtn = document.getElementById('startTimer');
  const daysInput = document.getElementById('days');
  const hoursInput = document.getElementById('hours');
  const minutesInput = document.getElementById('minutes');
  const timerDisplay = document.getElementById('timer');
  
  
  let intervalId;
  let expiryTimestamp;
  
  // Function to update the timer display
  async function updateTimerDisplay() {

        try {

             const response = await fetch(`/get-timer?itemId=${itemId}`);

            if(response.ok){
                const data = await response.json();
                console.log('Response Data:', data);

                const { expiryTimestamp } = data;
                console.log('Expiry Timestamp:', expiryTimestamp);
        

      const now = new Date().getTime();
      console.log('Current Time:', now);

      const distance = expiryTimestamp - now;
      console.log('distance:', distance);
  
      if (distance <= 0) {
        TimerBox.classList.remove('hidden');

          clearInterval(intervalId);
          timerDisplay.textContent = 'Timer Expired!';
          showDialog.disabled = true; // Disable showDialog button when timer expires

          BuyButton.disabled = false;

          return;
      }

      if(distance > 0) {
        BuyButton.disabled = true;
        
        TimerBox.classList.add('hidden');

      }
  
      const remainingDays = Math.floor(distance / (24 * 60 * 60 * 1000));
      const remainingHours = Math.floor((distance % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const remainingMinutes = Math.floor((distance % (60 * 60 * 1000)) / (60 * 1000));
      const remainingSeconds = Math.floor((distance % (60 * 1000)) / 1000);
  
      timerDisplay.textContent = `${remainingDays}d ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;
    } else {
        console.error('Failed to fetch timer:', response.statusText);
    }
} catch (error){
    console.error ('Error fetching timer:',error);
}
  }
  
  startTimerBtn.addEventListener('click', async() => {

    TimerBox.classList.add('hidden');
        

      const days = parseInt(daysInput.value) || 0;
      const hours = parseInt(hoursInput.value) || 0;
      const minutes = parseInt(minutesInput.value) || 0;
  
      const currentTime = new Date().getTime();
      expiryTimestamp = currentTime + (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);

      const timerData = {
        itemId: itemId, // Replace with your item ID or generate dynamically
        expiryTimestamp: expiryTimestamp
      };
    
      try {
        // Send POST request to create timer
        const response = await fetch('/create-timer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(timerData),
        });
    
        if(response.ok){
  
      if (intervalId) {
          clearInterval(intervalId);
      }
  
      intervalId = setInterval(() => {
          updateTimerDisplay();
      }, 1000);
  
      timerDisplay.classList.remove('hidden');

      showDialog.disabled = false; // Enable showDialog button when timer starts
    } else {
        console.error('Failed to create timer:',response.statusText);
    }
} catch(error){
    console.error('Error creating timer:', error);
}
      
  
  });

  
  

 //////////////////////////////////open bid dialog/////////////////////////// 
 const showDialog = document.getElementById('BidButton');
  
  showDialog.addEventListener('click', () => {
      console.log('is it working?');
      let showdialog = document.getElementById('dialog');
      showdialog.classList.remove("hidden");
      showdialog.classList.add("flex");
  });
  

  


 ///////////////////////////////close bid dialog///////////////////////////////
 const closeDialog = document.getElementById('closeBid');
 
 closeDialog.addEventListener('click',() => {
 
     let closedialog = document.getElementById('dialog');
     closedialog.classList.add('hidden');
 
 })
 



    





///Fetch item details from backend using item ID///////////////////////////////////////

fetch(`${backendBaseUrl}/admin/getItemDetails?itemId=${itemId}`)
.then(response => {
    if(!response.ok){
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    
    document.getElementById('itemName').innerText = data.itemName;
    document.getElementById('itemDescription').innerText = data.itemDescription;
    document.getElementById('itemImageURL').src = data.itemImageURL;

    
    const deleteButton = document.getElementById('deleteButton');
    deleteButton.addEventListener('click', function() {
            deleteItem(itemId);
    });


})
.catch(error => console.error('Error fetching item details:', error ));





//////////////////////////////Fetching bid details//////////////////////////////////////////
let highestBidAmount = null;
let highestBidEmail = null;

async function fetchitemDetails () {

await fetch(`${backendBaseUrl}/bidDetails?itemId=${itemId}`)
.then(response => {
    if(!response.ok){
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
  

       
         data.sort((a, b) => b.bidAmount - a.bidAmount);

         
    const highestBid = data[0];

    
    highestBidAmount = highestBid ? highestBid.bidAmount : null;
    highestBidEmail = highestBid ? highestBid.email : null;
       
    data.forEach(bidDetail => {
        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('flex', 'flex-row','p-2' );


        

        const bidValueElement = document.createElement('div');
        bidValueElement.innerHTML = `<div class=" font-anta text-md md:text-xl "> $ <span class="font-anta "> ${bidDetail.bidAmount} </span> </div>`;


        const bidMailElement = document.createElement('div');
        bidMailElement.innerHTML = `<div class="font-anta mb-4  text-md md:text-xl">  <span class="font-anta"> ${bidDetail.email}</span>: </div>`;

        wrapperDiv.appendChild(bidMailElement);
        wrapperDiv.appendChild(bidValueElement);
        

       
        const container = document.getElementById('bidDetailsContainer');
        container.appendChild(wrapperDiv);
        
        
    });


})
.catch(error => console.error('Error fetching item details:', error ));

}




///////////////////////////////////////////// Delete item ///////////////////////////////
function deleteItem(itemId){
    console.log("checking item id:", itemId );
    console.log("checking image URL:", itemImageURL.src );
    fetch(`${backendBaseUrl}/admin/deleteItem`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({itemId: itemId , itemImageURL: itemImageURL.src})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {

        console.log(data.message); 


        displayMessageBox("Item removed successfully.", "bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400",true);

    })
    .catch(error => console.error('Error deleting item:', error));
}




/////////////////////////////////////////// Add to Cart //////////////////////////////////////////////////////////

const CartButton = document.getElementById("CartButton");

CartButton.addEventListener("click", function(){

    fetch(`${backendBaseUrl}/cart`,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userEmail, itemId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add cart');
        }
        return response.json();
    })
    .then(data => {
        console.log('Cart Added successfully',data);
        displayMessageBox("Added to cart  successfully.", "bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400",true);

    })
    .catch(error =>{
        console.error('Error adding to cart:',error);

        displayMessageBox("Unable to add to cart");

    });

})








/////////////////////////////////////////// buy item ///////////////////////////////////////////////////////




const BuyButton = document.getElementById("buybutton");

BuyButton.addEventListener("click",function(){

    if (userEmail === highestBidEmail) {

        window.location.href = `checkout.html?itemId=${itemId}&email=${highestBidEmail}`;
} else {
   
    displayMessageBox("Only the highest bidder can proceed to checkout.");

}   
});



///////////////////////////////////////////// submit bid ///////////////////////////////////////////////////

const submitBid = document.getElementById("submitBidButton");


submitBid.addEventListener("click",function() {
    event.preventDefault();


    const bidAmount = document.getElementById('bidamount').value;
    const token = localStorage.getItem('token'); // Retrieve the token from local storage

    if (!token) {
        console.error('Authorization token not found');
        return;
    }

    fetch(`${backendBaseUrl}/submitBid`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ bidAmount , itemId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Bid submission failed');
        }
        return response.json();
    })
    .then(data => {
        console.log('Bid submitted successfully',data);
        
        closeSubmit();
        displayMessageBox("Bid Submitted successfully.", "bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400",true);

    })
    .catch(error => {
        console.error('Error submitting bid:', error.message);
        
    });
}) 




 ////////////////////////////////close after submit////////////////////////////
 function closeSubmit(){
    let closesubmit = document.getElementById('dialog');
    closesubmit.classList.add('hidden');
}

});




 





document.getElementById("toggle").addEventListener("click", function () {
    const nav = document.getElementById("nav");
    nav.classList.toggle("-translate-x-full");
  });

  document.getElementById("Items").addEventListener("click", function () {
    const nav = document.getElementById("dropdown");
    nav.classList.toggle("hidden");
  });

