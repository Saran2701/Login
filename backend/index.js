const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Initialize the app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Updated to match your React development server URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // Allow cookies to be sent with requests
}));

app.use(express.json());

// MongoDB connection
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';

mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/checkUser', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user && req.body.password === user.password) {
      res.send("User Exists");
    } else {
      res.send("User does not exist");
    }
  } catch (err) {
    res.status(500).send('Error: ' + err);
  }
});

app.post('/createUser', async (req, res) => {
  try {
    const newUser = new User({ username: req.body.username, password: req.body.password });
    await newUser.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(500).send('Error: ' + err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
