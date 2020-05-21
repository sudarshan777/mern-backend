const router = require("express").Router();
let User = require("../models/user.model");
const bcrypt = require("bcryptjs");

// @route GET /users
// @desc Register New User
// @access Public
router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const { name, email, password } = req.body;

  //Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // Check for existing user
  User.findOne({ email: email }).then((user) => {
    if (user) return res.status(400).json({ msg: "User already exists" });
    const newUser = new User({ name, email, password });

    //Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((user) =>
            res.json({
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
              },
            })
          )
          .catch((err) => res.status(400).json("Error: " + err));
      });
    });
  });
});

module.exports = router;
