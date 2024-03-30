import express from 'express';
import mongoose, { Schema } from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Item } from './dashbackend.js';

const backendapp = express();
const USER = process.env.MONGO_USER;
const PASSWORD = process.env.MONGO_PASSWORD;

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
        res.status(200).send();
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Signin failed', error });
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