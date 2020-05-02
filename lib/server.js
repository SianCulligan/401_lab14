'use strict';

// Esoteric Resources
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

// Internal Resources
const authRouter = require('./routes/auth-router.js');
const generateSwagger = require('../docs/swagger.js');

// Application-wide Middleware
const app = express();

generateSwagger(app);

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Routes

/**
 * This route gives us a simple "Homepage" message
 * @route GET /
 * @returns {String} 200 - The string "Homepage"
 */
app.get('/', (req, res, next) => {
  res.send('Homepage');
});

app.use(authRouter);

// Error Handling

const errorHandler = (error, req, res, next) => {
  res.status(error.err);
  res.send(error.msg);
};

app.use(errorHandler);

// Exports
module.exports = {
  server: app,
  start: (port, mongodb_uri) => {
    app.listen(port, () => {
      console.log('Server is up and running on port', port);
    });

    // stuff to connect to MongoDB
    let options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };

    mongoose.connect(mongodb_uri, options);
  },
};