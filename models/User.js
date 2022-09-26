const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { 
    type: String,
    required: true, 
    unique: true 
  },
  email: { 
    type: String,
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true
  },
  avatar: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  personalDetails:{
    company: {type: String},
    possition: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    country: {type: String},
    aboutMe: {type: String}
  },
  cloudinaryId: {
    type: String
  },
  assignedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  }]
}, {timestamps: true});

// Password hash middleware.

UserSchema.pre('save', async function(next){
  if(this.isModified('password')) this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Helper method for validating user's password.

UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
