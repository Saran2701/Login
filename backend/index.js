const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the app
const app = express();
const port = 5000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://login-using-react.netlify.app'    
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
const dbURI = 'mongodb+srv://saran2701:Saran%402004@cluster0.8ghbjvv.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
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
    if (user.password === req.body.password) {
      res.send("ok");
    } else {
      res.send("nil");
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
