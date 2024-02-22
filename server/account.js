/*---sign in / sign up fucntionality --*/


const  httpserver  = require('http')


// storing users data locally 

const usersdata = {};

// function to handle sign up

function signUp(username, password){
    if(!usersdata[username]) {
        usersdata[username] = password;
        return true;
    }
    
}

// function to handle sign in 

function signIn(username, password){
    return users[username] === password;
}


// Creating a basic HTTP server 

const server = httpserver.createServer((req,res) => {
//request handling logic
});
