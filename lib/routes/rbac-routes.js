'use strict';

const express = require('express');
const Model = require('../models/model.js');
const userSchema = require('../models/user-schema.js');
const auth = require('../middleware/auth.js');
const roles = require('../../docs/roles.json');
const UsersModel = new Model(userSchema);
const router = express.Router();

router.get('/public', (req, res, next) => {
  res.send('this is a public route');
});

router.get('/private', auth, (req, res, next) => {
  if (req.user && req.user._id)
    res.send('I\'d love to show you this page, but nah.' );
  else next({ err: 401, msg: 'You must be logged in to see this route' });
});

router.get('/superuser', auth, (req, res, next) => {
  if (req.user && req.user._id) {
    if (req.user.hasCapability('superuser')) {
      res.send(
        'Congrats! You can check this page out',
      );
      return;
    }
  }

  next({ err: 403, msg: 'Not today, satan' });
});

router.get('/update', auth, (req, res, next) => {
  if (req.user && req.user._id) {
    if (
      req.user.hasCapability('update') ||
            req.user.hasCapability('superuser')
    ) {
      res.send('Go ahead, update the content');
      return;
    }
  }

  next({ err: 403, msg: 'Not today, satan' });
});

router.get('/read', auth, (req, res, next) => {
  if (req.user && req.user._id) {
    if (
      req.user.hasCapability('read') ||
            req.user.hasCapability('superuser')
    ) {
      res.send('Go ahead, read the content');
      return;
    }
  }

  next({ err: 403, msg: 'Not today, satan' });
});

module.exports = router;