const mongoose = require("mongoose");

require('dotenv').config(); // Ensure .env variables are loaded

// 1. Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "Festofy",
    });
    console.log(" Connected to DB");
  } catch (err) {
    console.error(" DB Connection Error:", err.message);
    process.exit(1);
  }
}

// 2. Define the User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // <-- was `require`, should be `required`
    trim: true,
    lowercase: true,
    unique: true,
    minlength: [3, 'Username must be at least 3 characters long'],
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    minlength: [13, 'Email must be at least 13 characters long'],
  },
  password: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: false, // password should NOT be unique
    minlength: [5, 'Password must be at least 5 characters long'],
  },
  college_code: {
    type: String,
    require: false,
    trim: true,
    lowercase:true
  }
});

const User = mongoose.model('User', userSchema); // Capitalize model name conventionally
