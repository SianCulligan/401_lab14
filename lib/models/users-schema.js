'use strict';

let model = mongoose.model('users', schema);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const rModel = mongoose.model('roles', rSchema);
const roles = require('../../docs/roles.json');

const rSchema = mongoose.Schema({
  role: { type: 'String', required: true, default: 'user', enum: ['admin', 'editor', 'user']},
  capabilities: { required: false },
});

const schema = mongoose.Schema({
  username: { type: 'String', required: true, unique: true },
  password: { type: 'String', required: true },
  email: { type: 'String' },
  role: {type: 'String', required: true, default: 'user', enum: ['admin', 'editor', 'user']},
});

schema.virtual('roleObj', {
  ref: 'roles',
  localField: 'role',
  foreignField: 'role',
});

//pre-middleware
schema.pre('save', async function() {
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

schema.methods.comparePasswords = async function (plainTextPass) {
  return await bcrypt.compare(plainTextPass, this.password);
};

schema.methods.hasCapability = function (capability) {
  this.populate('roleObj');
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].role === this.role)
      return roles[i].capabilities.includes(capability);
  }
  return false;
};

schema.methods.hasCapability = function (capability) {
  this.populate('roleObj');
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].role === this.role)
      return roles[i].capabilities.includes(capability);
  }
  return false;
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

// schema.statics.read = async function (_id) {
//   let record = await this.findOne({_id});
//   return record;
// };

module.exports = mongoose.model('users', schema);