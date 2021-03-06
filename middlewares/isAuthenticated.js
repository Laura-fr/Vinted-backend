const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    // faire la suite
    const token = req.headers.authorization.replace("Bearer ", "");

    // Chercher dans la BDD le user qui possède ce token
    const user = await User.findOne({ token: token }).select("account _id");
    // console.log(user);
    if (user) {
      // J'ajoute une clé user à l'objet req, contenant les infos du user
      req.user = user;
      return next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
