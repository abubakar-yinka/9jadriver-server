const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const Driver = mongoose.model("Drivers");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      Driver.findById(jwt_payload.id)
        .then(driver => {
          if (driver) {
            return done(null, driver);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
