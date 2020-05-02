'use strict';

// Esoteric Resources
const express = require('express');

// Internal Resources
const Model = require('../models/model.js');
const userSchema = require('../models/user-schema.js');
const auth = require('../middleware/auth.js');

// Variables
const UsersModel = new Model(userSchema);
const router = express.Router();

// Route-wide Middleware

router.post('/signup', auth, async (req, res, next) => {
  if (req.user.username && !req.user._id) {
    let user = await UsersModel.create({ ...req.user, ...req.body });
    let token = user.generateToken();
    //let token = jwt.sign({ _id: user._id }, process.env.SECRET);
    res.status(201);
    res.send({ user, token });
    return;
  } else {
    next({ err: 401, msg: 'User already exists' });
  }
});

router.post('/signin', auth, async (req, res, next) => {
  if (req.user._id) {
    res.status(200);
    let token = req.user.generateToken();
    //let token = jwt.sign({ _id: req.user._id }, process.env.SECRET);
    res.send({ user: req.user, token: token });
    return;
  } else {
    next({ err: 401, msg: 'User not found' });
  }
});

router.get('/hidden', auth, async (req, res, next) => {
  console.log(req.user);
  if (req.user._id) {
    res.status(200);
    res.send('Secret information that only logged in users can see');
  } else {
    next({ err: 401, msg: 'Not logged in / invalid token' });
  }
});

// Error Handling
ne
// Exports
module.exports = router;