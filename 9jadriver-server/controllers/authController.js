const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");

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
    
    Driver.findOne({ email: req.body.email }).then(driver => {
      if (driver) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        const newDriver = new Driver({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        
        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newDriver.password, salt, (err, hash) => {
            if (err) throw err;
            newDriver.password = hash;
            newDriver
            .save()
            .then(driver => res.json(driver))
            .catch(err => console.log(err));
          });
        });
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
    
    const { email, password } = req.body;
    
    // Find driver by email
    Driver.findOne({ email }).then(driver => {
      // Check if driver doesn't exists
      if (!driver) {
        return res.status(404).json({ emailnotfound: "Email not found" });
      }
  
      // Check password
      bcrypt.compare(password, driver.password).then(isMatch => {
        if (isMatch) {
          // Driver matched
          // Create JWT Payload
          const payload = {
            id: driver._id,
            name: driver.name
          };
          
          // Sign token
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                id: driver._id,
                name: driver.name,
                email: driver.email,
                isAdmin: driver.isAdmin,
                token: `Bearer ${token}`
              });
            }
            );
          } else {
            return res
            .status(401)
            .json({ passwordincorrect: "Password incorrect" });
          }
        });
    });
}


