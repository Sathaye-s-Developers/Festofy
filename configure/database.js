const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Festofy", // only needed if not included in URI
    });
    console.log(' Connected to MongoDB');
  } catch (error) {
    console.error(' Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
