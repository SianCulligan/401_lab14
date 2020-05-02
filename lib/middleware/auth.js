'use strict';


// const badAuth = ( req, res, next) => {
//   res.status(403);
//   res.statusMessage('Forbidden!!');
//   res.end();
// };

const Model = require('../models/model.js');
const userSchema = require('../models/user-schema.js');
const UsersModel = new Model(userSchema);


/**
 * A fuction that takes a base64 encoded string of the format username:password, retunrs  an object with those key-values in plain text
 * @function
 * @param {string} encodedString
 * @return {object} 
 * @throws {object} 
 */
const base64Decoder = (encodedString) => {
  let data = {
    username: '',
    password: '',
  };
  let decodedString = Buffer.from(encodedString, 'base64').toString();
  let dataPieces = decodedString.split(':');
  data.username = dataPieces[0];
  data.password = dataPieces[1];
  return data;
};


/**
 * A fuction that takes a base64 encoded string of the format username:password, retunrs  an object with those key-values in plain text
 * @function
 * @param {string} encodedString
 * @return {object} data
 */
const getUserFromCredentials = async (userData) => {
  let possibleUsers = await UsersModel.readByQuery({
    username: userData.username,
  });
  for (let i = 0; i < possibleUsers.length; i++) {
    let isSame = possibleUsers[i].comparePasswords(userData.password);
    if (isSame) {
      return possibleUsers[i];
    }
  }
  return userData;
};

/**
 * Auth middleware that finds a user based on credentials
 * @function
 * @param {string} req.headers.authorization
 * @return {object} req.user
 * @throws {error} the user does not exist
 */

const auth = async (req, res, next) => {
  if (!req.headers.authorization) {
    next({ err: 401, msg: 'Missing auth headers' });
    return;
  }
  let authPieces = req.headers.authorization.split(' ');
  if (authPieces.length === 2) {
    if (authPieces[0] === 'Basic') {
      let authData = base64Decoder(authPieces[1]);
      // eslint-disable-next-line require-atomic-updates
      req.user = await getUserFromCredentials(authData);
      next();
      return;
    }
    else if (authPieces[0] === 'Bearer') {

      let tokenData = UsersModel.verifyToken(authPieces[1]);
      if (tokenData && tokenData._id) {
        // eslint-disable-next-line require-atomic-updates
        req.user = await UsersModel.read(tokenData._id);
      }
      next();
      return;
    }
  }
  next({ err: 401, msg: 'Missing correct authorization header' });
};

module.exports = auth;