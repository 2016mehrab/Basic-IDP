const mongoose = require("mongoose");
const ReferenceSchema = mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Reference", ReferenceSchema);
