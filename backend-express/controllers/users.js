// controllers/users.js - Controllers for user routes

const bcrypt = require("bcryptjs");
const User = require("../models/user");

const SALT_ROUNDS = 10;

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      }),
    )
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch(next);
};

module.exports = {
  createUser,
};
