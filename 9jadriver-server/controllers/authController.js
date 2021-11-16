const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;


// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Load Driver model
const Driver = require("../models/driverModel");

//Generate OTP
const randomFixedInteger = length => {
  return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
}
let otp = randomFixedInteger(6)

// Send the request to Twilio's servers to Generate OTP
let welcomeMessage = `Welcome to 9jadriver! Your verification code is ${otp}`;
const client = require('twilio')(accountSid, authToken);

const sendSms = (phone, message, userDriver, res) => {
  client.messages
    .create({
       body: message,
       from: process.env.TWILIO_PHONE_NUMBER,
       to: phone
     })
    .then(message => {
      console.log(message.sid)
      console.log(userDriver)
      res.status(201).send({
        message: 'Account created successfully, kindly check your phone to activate your account!',
        data: userDriver
      })
    })
    .catch(err => console.log(err));
}

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
      newDriver
      .save()
      .then(driver => {
        console.log(driver)
        const formattedNo = `+${driver.phoneNumber}`
        console.log(formattedNo)
        sendSms(formattedNo, welcomeMessage, driver, res)
        // res.json(driver)
      })
      .catch(err => console.log(err));
        
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
  // const phoneNumber  = '+2347085897656';
  // const otp = Math.floor(100000 + Math.random() * 900000);
    
  // Find driver by phone number
  await Driver.findOne({ phoneNumber }).then(driver => {
    // Check if driver doesn't exists and verify that the client has included the `number` property in their JSON body
    if (!driver) {
      return res.status(404).json({ numbernotfound: "Phone Number not found. You must supply a registered `number` prop to send the request to" });
    }
    console.log(driver)
    console.log(phoneNumber)
    console.log(otp)
    sendSms(phoneNumber, welcomeMessage, driver, res)

  });
}

exports.verify = async (req, res) => {
  // We require clients to submit a request id (for identification) and an OTP code (to check)
  if (!req.body.otp) {
    return res.status(400).send({message: "You must supply an `OTP` prop to send the request to"})
  }

  //Check and Verify User 
  if (otp == req.body.otp) {
    console.log(otp)
    console.log(req.body.otp)

    res.status(200).send({message: "Verification complete"})
  } else {
    return res.status(400).send({message: "You provided an incorrect OTP"})
  }

  // Run the check against Vonage's servers
  // await vonage.verify.check({
  //     request_id: req.body.requestId,
  //     code: req.body.otp
  // }, (err, result) => {
  //     if (err) {
  //       console.log(err)
  //       return res.status(500).send(err.error_text);
  //     }
  //     console.log(result)
  //     res.send(result);
  // });
}


