const express = require("express");
const router = express.Router();
const { getDriverProfile } = require("../../controllers/driverController")
const { register, login } = require("../../controllers/authController")
const { protect } = require("../../middleware/authMiddleware")


// Load Driver model
const Driver = require("../../models/driverModel");


// @route POST api/drivers/register
// @desc Register Driver
// @access Public
router.route("/register").post(register);

// @route POST api/drivers/login
// @desc Login Driver and return JWT token
// @access Public
router.route("/login").post(login);

// @route GET api/drivers/:id
// @desc Get Single Driver for Dashboard
// @access Private 
router.route("/:id").get(getDriverProfile)
  
module.exports = router;
  