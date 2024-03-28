import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

  // defining user schema/database

  const userSchema = new mongoose.Schema({
    email: String,
    password: String
  });

  const User = mongoose.model('User', userSchema);


  

  //Routes for signup

  app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const user = await User.create({ email, password });
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      res.status(400).json({ message: 'Failed to create user', error });
    }
  });

  //Routes for signin

  app.post('/signin', async (req, res) => {
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
    state: String
  });

  const Delivery = mongoose.model('delivery', deliverySchema);


  // Routes for customer address

  app.post('/useaddress', async (req, res) => {
    const { name, mobileno, pincode , flat , area, town ,state } = req.body;
    
    try {
      const delivery = await Delivery.create({ name, mobileno, pincode , flat ,area ,town ,state });
      res.status(201).json({ message: ' Delivery address added successfully', delivery });
    } catch (error) {
      res.status(400).json({ message: 'Failed to add delivery address', error });
    }
  });

  

  export default app;