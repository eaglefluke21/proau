import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import admin from 'firebase-admin';
import serviceAccount from '../key/serviceAccountKey.js';
import { getStorage, ref, listAll } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getDownloadURL } from "firebase/storage";






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
const PORT  = process.env.PORT || 3300;
const USER = process.env.MONGO_USER;
const PASSWORD = process.env.MONGO_PASSWORD;

console.log('service acount:', serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://aucitonbid.appspot.com'
})


const bucket = admin.storage().bucket();
const firebasestorage = getStorage();


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
  app.post('/admin/additem', upload.single('itemImage'), async (req, res) => {
    try {
    const itemName = req.body.itemName;
    const itemDescription = req.body.itemDescription;

    // upload file to firebase storage
    const file = req.file;
    const fileName =file.originalname;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata:{
        contentType: file.mimetype
      }
    });
    
    const itemImageURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  
    // Create a new item document
     
    const newItem = new Item({
      itemName,
      itemImageURL,
      itemDescription
    });

    // saving the item to the database

    await newItem.save()
      
        res.status(200).json({ message: "Item added successfully" });
  }
      catch(error)  {
        console.error('Error saving item:', error);
        res.status(500).json({error: "Failed to add item"});

      }
  
    });
    
    import { getMetadata } from "firebase/storage";

app.get('/admin/listimages', async (req, res) => {
  try {
    const rootRef = ref(firebasestorage);

    listAll(rootRef)
      .then(async (result) => {
        const imagesData = [];

        for (const item of result.items) {
          const metadata = await getMetadata(item);
          imagesData.push({
            name: metadata.name,
            fullPath: metadata.fullPath,
            contentType: metadata.contentType,
            size: metadata.size,
            downloadURL: await getDownloadURL(item)
          });
        }

        res.status(200).json({ images: imagesData });
      })
      .catch((error) => {
        console.error('Error listing images:', error);
        res.status(500).json({ error: "Failed to list images" });
      });
  } catch (err) {
    console.error('Error listing images:', err);
    res.status(500).json({ error: "Failed to list images" });
  }
});

    
  




  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });