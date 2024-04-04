document.addEventListener('DOMContentLoaded', function() {

    const token = localStorage.getItem('token');

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


fetch(`${backendBaseUrl}/bidDetails?itemId=${itemId}`)
.then(response => {
    if(!response.ok){
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    // filling html elements with details
    data.forEach(bidDetail => {
        // Create HTML elements to display each bid detail

        const bidValueElement = document.createElement('div');
        bidValueElement.innerHTML = `<div class="font-anta text-2xl"> $ <span class="font-anta"> ${bidDetail.bidAmount} </span> </div>`;


        const bidMailElement = document.createElement('div');
        bidMailElement.innerHTML = `<div class="font-anta mb-4"> <span class="text-xl"> By: </span> <span class="font-anta text-md"> ${bidDetail.email}</span> </div>`;

       

        // Append the elements to some container in your HTML
        const container = document.getElementById('bidDetailsContainer');
        container.appendChild(bidMailElement);
        container.appendChild(bidValueElement);
    });


})
.catch(error => console.error('Error fetching item details:', error ));






// .............................Delete item............................................................
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
    })
    .catch(error => console.error('Error deleting item:', error));
}

//buy item
const BuyButton = document.getElementById("buybutton");

BuyButton.addEventListener("click",function(){

    window.location.href=`checkout.html?itemId=${itemId}`;

});

//submit bid 

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












document.getElementById("toggle").addEventListener("click", function () {
    const nav = document.getElementById("nav");
    nav.classList.toggle("-translate-x-full");
  });

  document.getElementById("Items").addEventListener("click", function () {
    const nav = document.getElementById("dropdown");
    nav.classList.toggle("hidden");
  });

