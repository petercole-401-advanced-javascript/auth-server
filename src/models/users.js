
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET = process.env.SECRET || 'changeme';

const userSchema = new mongoose.Schema({  // WHEN I RUN THE SIGN IN ROUTE, THIS IS USED
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', autopopulate: true }
})

userSchema.plugin(require('mongoose-autopopulate'));

userSchema.pre('save', async function (){
  if (this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 5)
  }
})

 // add jwt timeout stuff here, expiration, LASTS 10 SECONDS
userSchema.methods.generateToken = function (){
  const tokenData = {
    id: this._id,
    username: this.username,
    permissions: this.role.permissions || [] // ERR 2.53 trying to read null here
  }
  return jwt.sign(tokenData, SECRET, { expiresIn: '1hr' })  // OPTION FOR EXPIRES IN, takes 1h, 1d, or INTEGER MILLISECONDS
}

userSchema.statics.authenticateBasic = function (username, password){
  return this.findOne({ username }).populate('role') // look for role, if its a role, shove it in response
    .then(result => result && result.comparePassword(password))
    .catch(console.error)
}

userSchema.statics.authenticateToken = async function (token){   // authenticate bearer
  try {
    const tokenObject = jwt.verify(token, SECRET)
    console.log(tokenObject)
    // if the token has a username, try to get and return that user
    if (!tokenObject.username) {
      return Promise.reject(new Error('Token is malformed'))
    }
    const user = await this.findOne({ username: tokenObject.username })
    return user
  } catch (error){
    return Promise.reject(error)
  }
}

userSchema.methods.comparePassword = function (password){
  // Compare a given password against the stored hashed password
  // If it matches, return the user instance, otherwise return null
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null)
    .catch(console.error)
}

module.exports = mongoose.model('User', userSchema)
