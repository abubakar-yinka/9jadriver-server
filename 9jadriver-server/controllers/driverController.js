const Driver = require("../models/driverModel");

  // @route GET api/drivers/
  // @desc Driver Dashboard
  // @access Private
exports.getDriverProfile = async (req, res) => {
    try {
      const driver = await driver.findById(req.driver._id)

      if (driver) {
        res.json(driver)
      } else {
        res.status(404).json({message: 'driver not found'})
      }
      
      
    } catch (error) {
      res.status(404).json({ message: "Driver not found" });
      // console.error(`${error}`)
    }
}
