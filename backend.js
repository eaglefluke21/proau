import express from 'express';
import mongoose, { Schema } from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Item } from './dashbackend.js';
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

  // defining user schema/database

  const userSchema = new mongoose.Schema({
    email: String,
    password: String
  });

  const User = mongoose.model('User', userSchema);


  

  //Routes for signup

  backendapp.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    
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
        const token = jwt.sign({emailId: user.email}, secretKey);
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
      next();
    });


  }




  // defining bidamount schema

  const bidSchema = new mongoose.Schema({
    email: String,
    bidAmount: Number
  });

  const Bid = mongoose.model('Bid',bidSchema);


// route to add bid amount 
  backendapp.post('/submitBid', authenticateToken, async (req, res) => {
    const { bidAmount } = req.body;
    const email = req.emailId;

    try {
        const user = await User.findById(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Save bid to the database
        const newBid = new Bid({ email, bidAmount }); // Using user's email as userId
        await newBid.save();
        
        res.status(201).json({ message: 'Bid submitted successfully' });
    } catch (error) {
        console.error('Error submitting bid:', error);
        res.status(500).json({ error: 'Error submitting bid' });
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



  // defining bid amount and user schema/database

  

  export default backendapp;