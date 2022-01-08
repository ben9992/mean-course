const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const User = require("../models/user")
const user = require('../models/user')

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    })

    user.save().then(result => {
      res.status(201).json(result)
    }).catch(err => {
      res.status(201).json(err)
    })
  })
});

module.exports = router
