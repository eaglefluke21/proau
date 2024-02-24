const expressframe = require('express');
const parsing = require('body-parser');

const app = expressframe();
const port = 3000;

// Parse JSON requests
app.use(parsing.json());

// Handle GET requests
app.get('/', (req, res) =>{
 res.send('Hello World');
});



//Handle POST requests
app.post('/postman', (req,res) =>{

    const receivedData = req.body;

    // here you can access the data sent from postman in req.body
    console.log('Data received from postman:',receivedData);
    // send a response back
    res.send({ receivedData});
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);

});