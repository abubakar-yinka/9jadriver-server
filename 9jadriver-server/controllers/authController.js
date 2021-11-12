const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const keys = require("../config/keys");
// const passport = require("passport");
const Vonage = require('@vonage/server-sdk');

const vonage = new Vonage({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET,
});

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Load Driver model
const Driver = require("../models/driverModel");

// @route POST api/drivers/register
// @desc Register driver
// @access Public
exports.register = async (req, res) => {
    // Form validation
    
    const { errors, isValid } = validateRegisterInput(req.body);
    
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    
    await Driver.findOne({ email: req.body.email }).then(driver => {
      if (driver) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        const newDriver = new Driver({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
          phoneNumber: req.body.phoneNumber
        });
        
        // // Hash password before saving in database
        // bcrypt.genSalt(10, (err, salt) => {
        //   bcrypt.hash(newDriver.password, salt, (err, hash) => {
        //     if (err) throw err;
        //     newDriver.password = hash;
        //     newDriver
        //     .save()
        //     .then(driver => res.json(driver))
        //     .catch(err => console.log(err));
        //   });
        // });
      }
    });
}

// @route POST api/drivers/login
// @desc Login driver and return JWT token
// @access Public
exports.login = async (req, res) => {
    // Form validation
    
    const { errors, isValid } = validateLoginInput(req.body);
    
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    
    const { phoneNumber } = req.body;
    
    // Find driver by phone number
    await Driver.findOne({ phoneNumber }).then(driver => {
      // Check if driver doesn't exists and verify that the client has included the `number` property in their JSON body
      // if (!driver) {
      //   return res.status(404).json({ numbernotfound: "Phone Number not found. You must supply a `number` prop to send the request to" });
      // }
      console.log(driver)
      if (!driver) {
        return res.status(404).json({ numbernotfound: "Phone Number not found. You must supply a registered `number` prop to send the request to" });
      }

      // Send the request to Vonage's servers to Generate OTP
    vonage.verify.request({
      number: req.body.phoneNumber,
      brand: '9jaDriver',
      code_length: '6'
    }, (err, result) => {
      if (err) {
          // If there was an error, return it to the client
          console.log(err)
          return res.status(500).send(err.error_text);
      }
      console.log(result)
      // Otherwise, send back the request id. 
      const requestId = result.request_id;
      console.log('request_id', requestId);
      console.log(`vonage Verify`)
      res.send({requestId});
    });
  });
}

exports.verify = async (req, res) => {
  // We require clients to submit a request id (for identification) and an OTP code (to check)
  if (!req.body.requestId || !req.body.otp) {
    return res.status(400).send({message: "You must supply an `OTP` and `request_id` prop to send the request to"})
  }
  // Run the check against Vonage's servers
  await vonage.verify.check({
      request_id: req.body.requestId,
      code: req.body.otp
  }, (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).send(err.error_text);
      }
      console.log(result)
      res.send(result);
  });
}


