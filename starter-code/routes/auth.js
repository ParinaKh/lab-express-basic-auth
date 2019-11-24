const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
const bcrypt = require("bcrypt");

//signup

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const user = req.body;

  if (!user.username || !user.password) {
    res.redirect("/signup");
    return;
  } else {
    userModel
      .findOne({
        username: user.username,
        password: user.password
      })
      .then(dbRes => {
        if (dbRes) {
          res.redirect("/signup");
          return;
        }

        const salt = bcrypt.genSaltSync(10); // cryptography librairie
        const hashed = bcrypt.hashSync(user.password, salt);

        user.password = hashed;
        userModel
          .create(user)
          .then(() => res.redirect("/auth/signin"))
          .catch(dbErr => console.log(dbErr));
      })
      .catch(dbErr => {
        next(dbErr);
      });
  }
});

// login
router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/signin", (req, res, next) => {
  const user = req.body;
  console.log(user);
  if (!user.username || !user.password) {
    console.log("first error");
    return res.redirect("/auth/signin");
  }
  userModel
    .findOne({
      username: user.username
    })
    .then(dbRes => {
      if (!dbRes) {
        console.log("not found");
        return res.redirect("/auth/signin");
      }
      console.log("cool : found", dbRes);

      const passwordCheck = bcrypt.compareSync(user.password, dbRes.password);

      console.log(passwordCheck);

      if (passwordCheck) {
        req.session.currentUser = dbRes;
        console.log(req.session);

        console.log(
          "on a bien écrit l'user connecté dans la session... du coup c'est dispo partout dasn le serveur"
        );

        return res.redirect("/admin");
      } else {
        console.log("bad password get");
        res.redirect("/auth/signin");
      }
    })
    .catch(dbErr => {
      next(dbErr);
    });
});

router.get("/main", protectUserRoute, (req, res) => {
  res.render("main");
});

router.get("/private", protectUserRoute, (req, res) => {
  res.render("private");
});

module.exports = router;
