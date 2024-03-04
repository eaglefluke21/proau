import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT  = process.env.PORT || 3000;


// Mongo DB Connection

mongoose.connect(
    'mongodb+srv://eaglefluke2106:passwordcluster@clusterone.jz6woqs.mongodb.net/?retryWrites=true&w=majority&appName=clusterone'
    ).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

  // defining user schema/database

  const userSchema = new mongoose.Schema({
    email: String,
    password: String
  });

  const User = mongoose.model('User', userSchema);


  //Middleware
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());

  //Routes

  app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const user = await User.create({ email, password });
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      res.status(400).json({ message: 'Failed to create user', error });
    }
  });

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




  // Starting the server

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`You can access the server at http://localhost:${PORT}`);

  });
  