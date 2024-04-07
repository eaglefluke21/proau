document.addEventListener('DOMContentLoaded', function() {

    const token = localStorage.getItem('token');

    const tokenParts = token.split('.');

    // Get the payload part (index 1) and decode it
    const decodedPayload = JSON.parse(atob(tokenParts[1]));

    // Extract the email from the decoded payload
    const userEmail = decodedPayload.emailId;

    // Now you have the user's email extracted from the token
    console.log(userEmail);

    if (token) {
        // Token exists
        console.log('Token exists:', token);
        // You can perform further actions here, such as making authenticated requests
    } else {
        // Token does not exist
        console.log('Token does not exist');
        // You might redirect the user to the login page or perform other actions as needed
    }
       
// Extract item Id from URL query parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const itemId = urlParams.get('itemId');
console.log('item id:', itemId);


let backendBaseUrl = '';

// Fetch item details from backend using item ID

fetch(`${backendBaseUrl}/admin/getItemDetails?itemId=${itemId}`)
.then(response => {
    if(!response.ok){
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    // filling html elements with details
    document.getElementById('itemName').innerText = data.itemName;
    document.getElementById('itemDescription').innerText = data.itemDescription;
    document.getElementById('itemImageURL').src = data.itemImageURL;

    // Add event listener for delete button
    const deleteButton = document.getElementById('deleteButton');
    deleteButton.addEventListener('click', function() {
            deleteItem(itemId);
    });


})
.catch(error => console.error('Error fetching item details:', error ));

//.................................Fetching bid details.........................................
let highestBidAmount = null;
let highestBidEmail = null;

fetch(`${backendBaseUrl}/bidDetails?itemId=${itemId}`)
.then(response => {
    if(!response.ok){
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
  

        // Sort bid details by bid amount in descending order
         data.sort((a, b) => b.bidAmount - a.bidAmount);

         // Take the first bid detail as the highest bid
    const highestBid = data[0];

    // Set highest bid amount and email
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
        

        // Append the elements to some container in your HTML
        const container = document.getElementById('bidDetailsContainer');
        container.appendChild(wrapperDiv);
        
        
    });


})
.catch(error => console.error('Error fetching item details:', error ));






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
        // Handle success
        console.log(data.message); // Log success message

        // Redirect or display success message to the user
        displayMessageBox("Item removed successfully.", "bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400",true);

    })
    .catch(error => console.error('Error deleting item:', error));
}

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
        // Handle success response here if needed
        closeSubmit();
        displayMessageBox("Bid Submitted successfully.", "bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400",true);

    })
    .catch(error => {
        console.error('Error submitting bid:', error.message);
        // Handle error here if needed
    });
}) 




});


// open bid dialog 
function showDialog(){

    console.log('is it working?');
    let showdialog = document.getElementById('dialog');
    showdialog.classList.remove("hidden");
    showdialog.classList.add("flex");
    
};

//close bid dialog
function closeDialog(){
    let closedialog = document.getElementById('dialog');
    closedialog.classList.add('hidden');
    
}

//close after submit
function closeSubmit(){
    let closesubmit = document.getElementById('dialog');
    closesubmit.classList.add('hidden');
}












document.getElementById("toggle").addEventListener("click", function () {
    const nav = document.getElementById("nav");
    nav.classList.toggle("-translate-x-full");
  });

  document.getElementById("Items").addEventListener("click", function () {
    const nav = document.getElementById("dropdown");
    nav.classList.toggle("hidden");
  });

