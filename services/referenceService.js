const ReferenceModel= require("../models/reference");
class ReferenceService{
    static async getAll(){
        return ReferenceModel.find({}).sort({createdAt:-1}).exec();
    }
    static async create(data){
        const reference = new ReferenceModel(data);
        return reference.save();
    }
}
module.exports = ReferenceService;