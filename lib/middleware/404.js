'use strict';

const notFound = (req, res, next) => {
  res.status(404);
  res.end();
};

module.exports = notFound;