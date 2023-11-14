const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a Name"],
  },
  email: {
    type: String,
    required: [true, "Please enter a Email"],
    unique: [true, "Email already exists"],
  },
  avatar: {
    public_id: {
      type: String,
      url: String,
    },
  },
  password: {
    type: String,
    required: [true, "Please enter a Password"],
    unique: [true, "Email already exists"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  posts: [
    {
      post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function(password){
  console.log(password+"  "+this.password);
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function(){
  console.log(process.env.JWT_SECRET);
  return await jwt.sign({_id:this._id},process.env.JWT_SECRET);
}
module.exports = mongoose.model("User", userSchema);
