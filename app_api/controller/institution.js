const mongoose = require("mongoose")
var Institution = mongoose.model("Institution")


const sendJSONResponse = (res, status, content)=>{
    res.status(status)
    res.json(content)
}

module.exports.add_institutions = async(req, res)=>{

    if(!req.body.institution_name || !req.body.institution_address){
        sendJSONResponse(res, 404, {"message":"Please fill in all required fields"})
        return
    }

     var newInstitution = new Institution();
     newInstitution.institution_name = req.body.institution_name
     newInstitution.institution_address = req.body.institution_address
     newInstitution.institution_contact_no = req.body.institution_contact_no
     newInstitution.institution_zone_name = req.body.institution_zone_name
     newInstitution.institution_code = req.body.institution_code

     await newInstitution
     .save()
        .then((institution) => {
            sendJSONResponse(res, 201, institution);
        })
        .catch((error) => {
            console.error(error);
            sendJSONResponse(res, 404, error);
        });
} 



module.exports.institution_list = (req, res)=>{
    Institution
      .find({})
      .exec()
      .then((institution)=>{
            sendJSONResponse(res, 200, institution)
        }).catch((error)=>{
            sendJSONResponse(res, 404, error)
        })

}

module.exports.read_one_institution = (req, res)=>{
    if(!req.params.institutionId){
        sendJSONResponse(res, 404, {"message":"not found, institution id is required!"})
    }else{
        Institution
          .findById(req.params.institutionId)
          .exec()
          .then((institution)=>{
             sendJSONResponse(res, 200, institution)
          }).catch((error)=>{
             sendJSONResponse(res, 404, error)
          })
           
    }

}

module.exports.update_insititution = (req, res)=>{

}