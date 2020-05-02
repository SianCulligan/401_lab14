'use strict';

const express = require('express');
const Model = require('../models/model.js');
const userSchema = require('../models/user-schema.js');
const auth = require('../middleware/auth.js');
const UsersModel = new Model(userSchema);
const router = express.Router();


router.post('/signup', auth, async (req, res, next) => {
  if (req.user.username && !req.user._id) {
    let user = await UsersModel.create({ ...req.user, ...req.body });
    let token = user.generateToken();
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
    res.send({ user: req.user, token: token });
    return;
  } else {
    next({ err: 401, msg: 'User not found' });
  }
});

router.get('/hidden', auth, async (req, res, next) => {
  if (req.user && req.user._id) {
    res.status(200);
    res.send('Secret information that only logged in users can see');
  } else {
    next({ err: 401, msg: 'Not logged in / invalid token' });
  }
});

module.exports = router;
