// const User = require("../models/User");

// const isAuthenticated = async (req, res, next) => {
//   if (req.headers.authorization) {
//     const token = req.headers.authorization.replace("Bearer ", "");

//     const user = await User.findOne({ token: token }).selected("account_id");

//     if (!user) {
//       return res.status(401).json({ error: "Unauthorized" });
//     } else {
//       req.user = user;

//       return next();
//     }
//   } else {
//     return res.status(401).json({ error: "Unauthorized" });
//   }
// };

// module.exports = isAuthenticated;
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  // req.header.authorization
  //   console.log(req.headers);
  if (req.headers.authorization) {
    // faire la suite
    const token = req.headers.authorization.replace("Bearer ", "");
    // console.log(token);

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
