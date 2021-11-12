const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const DriverSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  phoneNumber: {
    type: Number,
    required: true
  }
}, {
    timestamps: true,
    collection: 'Drivers'
});

module.exports = User = mongoose.model("Drivers", DriverSchema);
