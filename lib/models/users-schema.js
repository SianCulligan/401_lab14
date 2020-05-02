'use strict';

let model = mongoose.model('users', schema);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const schema = mongoose.Schema({
  username: { type: 'String', required: true, unique: true },
  password: { type: 'String', required: true },
  email: { type: 'String' },
  role: {type: 'String', required: true, default: 'user', enum: ['admin', 'editor', 'user']},
});

//pre-middleware
schema.pre('save', async function() {
  console.log(this);
  this.password =await bcrypt.hash(this.password, saltRounds);
});
schema.methods.generateToken = function () {
  let timeout = Math.floor(Date.now()/1000 + 50000);
  // Date.now() + 50000;
  return jwt.sign(
    { exp: timeout, data: { _id: this._id } },
    process.env.SECRET,
  );
};

schema.pre('find', async function() {


});

//.methods is always about a single record
schema.methods.comparePasswords = async function (plainTextPass) {
  return await bcrypt.compare(plainTextPass, this.password);
};


// statics  - this refers to the model
schema.statics.verifyToken = function (token) {
  try{
    let tokenContents = jwt.verify(token, process.env.SECRET);
    return tokenContents.data;
  } catch (e) {
    console.log('Expired token');

  }
  return {};
};

schema.statics.read = async function (_id) {
  let record = await this.findOne({_id});
  return record;
};


module.exports = model;