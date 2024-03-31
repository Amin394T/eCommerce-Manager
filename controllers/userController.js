const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      username: req.body.username,
      password: hash,
    });

    user
      .save()
      .then(() => {
        res.status(201).json({ message: "User registered successfully!" });
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  });
};

exports.login = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ error: new Error("Username not found.") });
      }

      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ error: new Error("Password is incorrect.") });
          }
          const token = jwt.sign({ userId: user._id }, "SECRET_KEY", {
            expiresIn: "24h",
          });
          res.status(200).json({
            user: user._id,
            token: token,
          });
        })
        .catch((error) => {
          res.status(500).json({ error: error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};
