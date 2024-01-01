const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: { type: String, unique: true },
    password: { type: String, required: true },
    username: { type: String, require: true,unique: true },
  },
  { timestamps: true }
);
const User = mongoose.model("Users", UserSchema);
module.exports = User;
