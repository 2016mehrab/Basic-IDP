const mongoose = require("mongoose");
const ReferenceSchema = mongoose.Schema(
  {
    did: { type: String, required: true },
    reference: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Reference", ReferenceSchema);
