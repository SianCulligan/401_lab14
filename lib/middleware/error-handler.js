'use strict';


const errorHandler = (err, req, res, next) => {
  res.status(500);
  res.statusMessage('Internal Server Error');
  res.end();
};

module.exports = errorHandler;