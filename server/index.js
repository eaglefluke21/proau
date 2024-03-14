// index.js
import express from 'express';

import backendroute from './backend.js';

import dashbackendroute from './dashbackend.js';

import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3300;

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());

// backend.js
app.use('', backendroute);

// dashbackend.js

app.use('', dashbackendroute);

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`You can access the server at http://localhost:${PORT}`);
});
