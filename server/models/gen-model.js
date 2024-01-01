const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GenSchema = new Schema(
  {
    roomId: { type: String, required: true },
    data: [
      {
        prompt: { type: String, require: true },
        response: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Gen = mongoose.model("Gen", GenSchema);
module.exports = Gen;
