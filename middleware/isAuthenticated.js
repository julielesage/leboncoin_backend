const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      console.log("no header");
      return res.status(401).json({ error: "no headers authorization" });
    } else {
      const user = await User.findOne({
        token: req.headers.authorization.replace("Bearer ", ""),
      });
      if (!user) {
        console.log("no user");
        return res
          .status(401)
          .json({ error: "Unauthorized(there is no such user)" });
      } else {
        //create user key, to then get it in the route
        req.user = user;
        //got back to the route
        return next();
      }
    }
  } catch (error) {
    return res.json({ message: error.message });
  }
};

module.exports = isAuthenticated;
