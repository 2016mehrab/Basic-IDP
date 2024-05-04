const ReferenceModel = require("../models/reference");
class ReferenceService {
  static async getAll() {
    return ReferenceModel.find({}).sort({ createdAt: -1 }).exec();
  }
  static async create(data) {
    const reference = new ReferenceModel(data);
    return reference.save();
  }
  static async exists(reference) {
    const existingReference = await ReferenceModel.findOne({ reference });
    return existingReference !== null;
  }
}
module.exports = ReferenceService;
