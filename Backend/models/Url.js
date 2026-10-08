// models/Url.js

import mongoose from 'mongoose';

// Define the schema for our URL model
const urlSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: true,
  },

  shortUrl: {
    type: String,
    required: true,
  },

  urlCode: {
    type: String,
    required: true,
    unique: true,
  },

  clicks: {
    type: Number,
    required: true,
    default: 0,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  // Relationship between URL and the user who created it
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
});

// Create the Url model
const Url = mongoose.model('Url', urlSchema);

// ES Module export
export default Url;