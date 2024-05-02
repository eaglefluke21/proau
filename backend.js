import express from 'express';
import mongoose, { Schema } from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';


const backendapp = express();
const USER = process.env.MONGO_USER;
const PASSWORD = process.env.MONGO_PASSWORD;
const secretKey = 'abcxy';

// MongoDb collection
mongoose.connect(
  `mongodb+srv://${USER}:${PASSWORD}@clusterone.jz6woqs.mongodb.net/?retryWrites=true&w=majority&appName=clusterone`
).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});


//Middleware
backendapp.use(bodyParser.urlencoded({ extended: true }));
backendapp.use(bodyParser.json());
backendapp.use(cors());


// timer schema
const timerSchema = new mongoose.Schema({

  itemId: String,
  expiryTimestamp: Number,
});

const Timer = mongoose.model('Timer', timerSchema);

// api for creating a timer 

backendapp.post('/create-timer', async (req,res) => {
  const { itemId , expiryTimestamp } = req.body;

  try {
    const timer = new Timer({ itemId, expiryTimestamp});
    await timer.save();
    res.status(201).send(timer);
  } catch(err){
    res.status(500).send(err);
  }
});

// get all timers
backendapp.get('/get-timer', async(req,res) => {
  const { itemId } = req.query;

  try {
    const timer = await Timer.findOne({ itemId: itemId});
    if (timer){
      res.send({ expiryTimestamp: timer.expiryTimestamp});
    } else {
      res.status(404).send({mesasge: 'Timer not found'});
    }
  } catch (err) {
    res.status(500).send({message: 'Error fetching timer', error: err});
  }
});


// defining cart schema 
const cartSchema = new mongoose.Schema({
  userEmail: String,
  itemId: String
});

const Cart = mongoose.model('Cart',cartSchema);


// routes for adding cart items 

backendapp.post('/cart',async(req,res)=>{

    const {userEmail , itemId} = req.body;

    if (!userEmail || !itemId) {
      return res.status(400).json({ message: "Both userEmail and itemId are required." });
  }

      try{
        const cart = await Cart.create({userEmail, itemId});
        res.status(201).json({ message:"Added to cart sucessfully", cart});

      }
      catch(error){

        res.status(400).json({message:"Unable to add cart Item",error});

      }



})

//routes for fetching add cart item id 
backendapp.get('/cartitems',async(req,res) => {

  const userEmail = req.query.userEmail;

  if(!userEmail){
    return res.status(400).json({message: "userEmail is required"});
  }

  try {
    const cartItems = await Cart.find({userEmail: userEmail }, 'itemId');
    res.status(200).json({ cartItems});
  } catch (error) {
    res.status(400).json({message: "Unable to fetch cart items"})
  }



});



 // Route for  deleting cart item
 backendapp.delete('/cartitems/delete', async(req,res) =>{

  const itemId = req.body.itemId;

  const userEmail = req.body.userEmail;

  console.log("look for :", itemId);

  try {
    const cartitem = await Cart.findOneAndDelete({ userEmail: userEmail, itemId: itemId  });;
    if (!cartitem) {
      return res.status(404).json({ message: "cart item not found" });
    }
    res.status(200).json({ message:" cart item deleted successfully" });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: "Failed to delete cart item" });
  }
});








  // defining user schema/database

  const userSchema = new mongoose.Schema({
    email: String,
    password: String
  });

  const User = mongoose.model('User', userSchema);


  

  //Routes for signup

  backendapp.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
      return res.status(400).json({message:"both email and password are required"});
    }
    
    try {
      const user = await User.create({ email, password });
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      res.status(400).json({ message: 'Failed to create user', error });
    }
  });

  //Routes for signin

  backendapp.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const user = await User.findOne({ email, password });
      if (user) {
        const token = jwt.sign({emailId: user.email , userId: user._id}, secretKey);
        console.log('Token created succesfully:', token);


        res.status(200).json({token});
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Signin failed', error });
    }
  });

  function authenticateToken(req,res, next){
    const token = req.headers.authorization;
    if(!token) {
      return res.status(401).json({message: "Authorization token is required"});
    }

    jwt.verify(token, secretKey, (err, decoded) => {
      if(err) {
        return res.status(403).json({message: 'Invalid token'});
      }
      req.emailId = decoded.emailId;
      req.userId = decoded.userId;

      next();
    });


  }




  // defining bidamount schema

  const bidSchema = new mongoose.Schema({
    userid: String,
    itemId:String,
    email: String,
    bidAmount: Number
  });

  const Bid = mongoose.model('Bid',bidSchema);


// route to add bid amount 
  backendapp.post('/submitBid', authenticateToken, async (req, res) => {
    const { bidAmount } = req.body;
    const { itemId } = req.body;
    const email = req.emailId;
    const userid = req.userId;

    try {
        const user = await User.findOne({ email});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Save bid to the database
        const newBid = new Bid({ email,userid, bidAmount ,itemId }); // Using user's email as userId
        await newBid.save();
        
        res.status(201).json({ message: 'Bid submitted successfully' });
    } catch (error) {
        console.error('Error submitting bid:', error);
        res.status(500).json({ error: 'Error submitting bid' });
    }
});


// route to fetch biddetails ( bidamount , email )

backendapp.get('/bidDetails',async(req, res) => {
  try {


    // Fetching itemId from query parameters
    const itemId = req.query.itemId;
    console.log("check bid item id:", itemId);

    // Fetching item details from database based on itemId
    const biddetails = await Bid.find({itemId}).select(' bidAmount email').sort({ bidAmount:1});

    console.log('checking biddetails', biddetails);

    if (!biddetails || biddetails.length === 0) {
      return res.status(404).json({ error: "Item not found"});

    }

    res.status(200).json(biddetails);

  } catch(error){
    console.error('Error fetching item Details:', error);
    res.status(500).json({error:"Failed to fetch item details"});
  }
});


  // defining deliveryaddress schema/database

  const deliverySchema = new mongoose.Schema({
    name: String,
    mobileno: String,
    pincode: String,
    flat: String,
    area: String,
    town: String,
    state: String,
    productname: String
    
  });

  const Delivery = mongoose.model('delivery', deliverySchema);


  // Route for  adding customer address

  backendapp.post('/useaddress', async (req, res) => {
    const { name, mobileno, pincode , flat , area, town ,state , productname } = req.body;
    
    try {
      const delivery = await Delivery.create({ name, mobileno, pincode , flat ,area ,town ,state, productname });
      res.status(201).json({ message: ' Delivery address added successfully', delivery });
    } catch (error) {
      res.status(400).json({ message: 'Failed to add delivery address', error });
    }
  });


  // Route for  getting customer address
  backendapp.get('/useaddress/listdata', async(req,res) =>{
    try{
      // fetch items from database
      const items = await Delivery.find({}).select('name mobileno pincode flat area town state productname ');

      res.status(200).json({items});
    } catch(error){
      console.error('Error fetching items:', error);
      res.status(500).json({ error: "Failed to fetch items"});
    }
  });

 // Route for  deleting customer address
 backendapp.delete('/useaddress/deletedata', async(req,res) =>{

          const deliveryId = req.body.itemId;

          try {
            const deleteDelivery = await Delivery.findByIdAndDelete(deliveryId);
            if (!deleteDelivery) {
              return res.status(404).json({ message: "Delivery address not found" });
            }
            res.status(200).json({ message: "Delivery address deleted successfully" });
          } catch (error) {
            console.error('Error deleting delivery address:', error);
            res.status(500).json({ error: "Failed to delete delivery address" });
          }
});


  

  export default backendapp;