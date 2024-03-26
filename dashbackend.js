import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import admin from 'firebase-admin';
import serviceAccount from './key/serviceAccountKey.js';
import { getStorage, ref, listAll , getMetadata} from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getDownloadURL } from "firebase/storage";
import { deleteObject } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC5_CJzmr0Q0uydCXE-2-t_2Dt1U-nEwU0",
  authDomain: "aucitonbid.firebaseapp.com",
  projectId: "aucitonbid",
  storageBucket: "aucitonbid.appspot.com",
  messagingSenderId: "137226311085",
  appId: "1:137226311085:web:2d72f16b1ac252f37d3d24"
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);



const app = express();
const USER = process.env.MONGO_USER;
const PASSWORD = process.env.MONGO_PASSWORD;

console.log('service account:', serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://aucitonbid.appspot.com'
})


const bucket = admin.storage().bucket();
const firebasestorage = getStorage();
const rootRef = ref(firebasestorage);

// MongoDb collection
mongoose.connect(
  `mongodb+srv://${USER}:${PASSWORD}@clusterone.jz6woqs.mongodb.net/?retryWrites=true&w=majority&appName=clusterone`
).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


  //Define schema for item data
const itemSchema = new mongoose.Schema (
  {
    itemName: String,
    itemImageURL: String,
    itemDescription: String

  }
);

// create model from schema   
const Item = mongoose.model('Item', itemSchema);



// Handle POST request for adding item
app.post('/admin/additem', upload.single('itemImage'), (req, res) => {
  const itemName = req.body.itemName;
  const itemDescription = req.body.itemDescription;

  // Upload file to Firebase Storage
  const file = req.file;
  const fileName = file.originalname;
  const fileUpload = bucket.file(fileName);

  fileUpload.save(file.buffer, {
    metadata: {
      contentType: file.mimetype,
      // Add a custom metadata field to store the upload time
      uploadTime: new Date().toISOString() // Store current time as ISO string
    }
  })
  .then(() => {
    // Retrieve all files from Firebase Storage
    return listAll(rootRef);
  })
  .then(result => {
    if (result.items.length === 0) {
      throw new Error("No items found in storage.");
    }
    
  // Fetch metadata for each item and sort them by creation time
  const metadataPromises = result.items.map(item => {
    const itemRef = ref(firebasestorage, item.fullPath);
    return getMetadata(itemRef);
  });

  return Promise.all(metadataPromises)
    .then(metadataList => {
      // Sort items by creation time
      console.log("list of metadata:", metadataList);

            // Combine metadata with items
      const itemsWithMetadata = result.items.map((item, index) => ({
        item,
        metadata: metadataList[index]
      }));

      itemsWithMetadata.sort((a, b) => {
        const timeCreatedA = Date.parse(a.metadata.timeCreated || a.metadata.updated || 0);
        const timeCreatedB = Date.parse(b.metadata.timeCreated || b.metadata.updated || 0);
        return timeCreatedB - timeCreatedA; // Sort in descending order
      });

      // Get download URL for the latest item
      const latestItem = itemsWithMetadata[0].item;
      const latestItemRef = ref(firebasestorage, latestItem.fullPath);
      return getDownloadURL(latestItemRef);
    }); 


  })
  .then(itemImageURL => {
    console.log('URL:', itemImageURL);

    // Create a new item document
    const newItem = new Item({
      itemName,
      itemImageURL,
      itemDescription
    });

    // Save the new item document to the database
    return newItem.save();
  })
  .then(() => {
    res.status(200).json({ message: "Item added successfully" });
  })
  .catch(error => {
    console.error('Error saving item:', error);
    res.status(500).json({ error: "Failed to add item" });
  });
});


  
// Handle GET request for listing images
app.get('/admin/listimages', async (req, res) => {
  try {
    // Fetch items from the database
    const items = await Item.find({}).select('itemName itemDescription itemImageURL');


    res.status(200).json({ items });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});
    
  // Handle Get requests for getting images detail by id

  app.get('/admin/getItemDetails', async(req, res) => {
    try {
      // Fetching itemId from query parameters
      const itemId = req.query.itemId;

      console.log("check id:", itemId);

      // Fetching item details from database based on itemId
      const item = await Item.findById(itemId).select('itemName itemDescription itemImageURL');

      if (!item) {
        return res.status(404).json({ error: "Item not found"});

      }

      res.status(200).json(item);

    } catch(error){
      console.error('Error fetching item Details:', error);
      res.status(500).json({error:"Failed to fetch item details"});
    }
  });

// Handle Delete request for deleting an item by id
app.delete('/admin/deleteItem', async (req, res) => {
  try {
    // Fetch itemId from request body
    const itemId = req.body.itemId;

    const itemImageURL = req.body.itemImageURL;
    

    
      console.log("mainurl:", itemImageURL);

      // Extract the image name from the URL
      const imageName = itemImageURL.substring(itemImageURL.lastIndexOf('/') + 1).split('?')[0];
      console.log("name:", imageName);

      // Create a reference to the file to delete
      const imageRef = ref(firebasestorage, imageName);

      // Delete the file from Firebase Storage
      await deleteObject(imageRef);
   

    // Delete item from the database based on itemId
    const result = await Item.deleteOne({ _id: itemId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "item does not exist" });
    }

    res.status(200).json({ message: "Item and associated image deleted successfully" });
  } catch(error) {
    console.error('Error deleting item and associated image:', error);
    res.status(500).json({ error: "Failed to delete item and associated image" });
  }
});



  export default app;