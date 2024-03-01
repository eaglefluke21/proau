import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';

const app = express();
const PORT  = process.env.PORT || 3300;

// MongoDb collection
mongoose.connect(
  'mongodb+srv://eaglefluke2106:passwordcluster@clusterone.jz6woqs.mongodb.net/?retryWrites=true&w=majority&appName=clusterone'
  ).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Directory where files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
  
  const upload = multer({ storage: storage });

  //Define schema for item data
const itemSchema = new mongoose.Schema (
  {
    itemName: String,
    itemImage: String,
    itemDescription: String

  }
);

// create model from schema   
const Item = mongoose.model('Item', itemSchema);

  
  // Handle POST request for adding item
  app.post('/admin/additem', upload.single('itemImage'), (req, res) => {
    console.log('Received item data:', req.body);
    const itemName = req.body.itemName;
    const itemImage = req.file.path; // Contains information about the uploaded file
    const itemDescription = req.body.itemDescription;
  
    // Create a new item document
     
    const newItem = new Item({
      itemName,
      itemImage,
      itemDescription
    });

    // saving the item to the database

    newItem.save()
      .then(() => {
        res.status(200).json({ message: "Item added successfully" });
      })
      .catch(error => {
        console.error('Error saving item:', error);
        res.status(500).json({error: "Failed to add item"});

      });
  
    });
    
      //Route to get the latest added item
app.get('/admin/getlatestitem', (req, res) => {
  // find the latest added item from the database
  Item.findOne().sort({ _id: -1 }).exec()
      .then(latestItem => {
          if (!latestItem) {
              console.error('Error fetching latest item: No item found');
              res.status(404).json({ error: "No latest item found" });
          } else {
              // Send the latest item data to the client
              res.status(200).json(latestItem);
          }
      })
      .catch(err => {
          console.error('Error fetching latest item:', err);
          res.status(500).json({ error: "Failed to fetch latest item" });
      });
});

    
  




  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });