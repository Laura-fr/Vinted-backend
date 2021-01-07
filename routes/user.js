const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");

// Importation models
const User = require("../models/User");
const Offer = require("../models/Offer");

// création de la route user/signup (post)

router.post("/user/signup", async (req, res) => {
  try {
    const { email, username, phone, password } = req.fields;

    // vérification de l'email (si il est unique)
    const user = await User.findOne({ email: email });

    if (user) {
      res.status(409).json({ message: "This email has been used already" });
    } else {
      if (email && username && password) {
        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(password + salt).toString(encBase64);

        const newUser = new User({
          email: email,
          account: { username: username, phone: phone },
          token: token,
          hash: hash,
          salt: salt,
        });

        await newUser.save();

        res.status(200).json({
          _id: newUser._id,
          email: newUser.email,
          account: newUser.account,
          token: newUser.token,
        });
      } else {
        res.status(400).json({ message: "Missing parameters" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// création de la route user/login

router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.fields;
    // Quel est le user qui souhaite se loguer ?
    const user = await User.findOne({ email: email });
    console.log(user);
    // S'il existe dans la BDD
    if (user) {
      const testHash = SHA256(password + user.salt).toString(encBase64);
      if (testHash === user.hash) {
        res.status(200).json({
          _id: user._id,
          token: user.token,
          account: user.account,
        });
        // Le mot de passe n'est pas bon
      } else {
        res.status(401).json({
          message: "Unauthorized",
        });
      }
    } else {
      // Sinon => erreur
      res.status(400).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
