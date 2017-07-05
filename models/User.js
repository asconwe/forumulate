const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const formSchema = require('./Form');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        index: { unique: true }
    },
    password: String,
    Forms: [formSchema]
});

userSchema.methods.validatePassword = function comparePassword(password, callback) {
  console.log(this.username, this.password);
  bcrypt.compare(password, this.password).then(callback)
};

userSchema.pre('save', function saveHook(next) {
  const user = this;

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next();


  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError); }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError); }

      // replace a password string with hash value
      user.password = hash;

      return next();
    });
  });
});

const User = mongoose.model('User', userSchema);

module.exports = User;