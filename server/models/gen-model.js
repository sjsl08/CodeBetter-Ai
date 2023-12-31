const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GenSchema = new Schema(
  {
    prompt: { type: String, unique: true },
    response: { type: String, required: true },
  },
  { timestamps: true }
);
const Gen = mongoose.model("Gen", GenSchema);
module.exports = Gen;
