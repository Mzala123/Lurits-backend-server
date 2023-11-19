const mongoose = require("mongoose")
const { dash } = require("pdfkit")
const Institution = mongoose.model("Institution")
const Person = mongoose.model("Person")
const User = mongoose.model("User")

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

module.exports.update_institution = (req, res)=>{
    if(!req.body.institution_name || !req.body.institution_address){
        sendJSONResponse(res, 404, {"message":"Please fill in all required fields"})
        return
    }

    let institution_name = req.body.institution_name
    let institution_address = req.body.institution_address
    let institution_contact_no = req.body.institution_contact_no
    let institution_zone_name = req.body.institution_zone_name
    let institution_code = req.body.institution_code

    if(!req.params.institutionId){
        sendJSONResponse(res, 404, {"message":"Institution id is required"})
    }else if(req.params && req.params.institutionId){
        Institution
            .updateOne({_id: req.params.institutionId},
                {
                    institution_name:institution_name,
                    institution_address:institution_address,
                    institution_contact_no:institution_contact_no,
                    institution_zone_name:institution_zone_name,
                    institution_code:institution_code

                }
            ).exec()
            .then(()=>{
                sendJSONResponse(res, 200, {"message":"Institution record updated!"})
            }).catch((error)=>{
                sendJSONResponse(res, 404, {"message":"failed to update institution record "+error})
            })
    }

}

module.exports.institution_based_admin_list = (req, res)=>{
    const ObjectId = mongoose.Types.ObjectId
    User
       .aggregate(
        [
          {
            $match:{usertype_name: {$eq:"Head Teacher"}}
          },
          {
            $project:{
                username:1,
                usertype_name:1,
                personId:1,
                institution_name:1,
                institution_address:1,
                nationalId:1,
                firstname:1,
                lastname:1,
                gender:1,
                place_residence:1,
                institutionId:1
            }
          }
          ,{
            $lookup:{
                from:'people',
                localField:'personId',
                foreignField: '_id',
                as: 'adminDocs'
            }
          },
          {
            $unwind: '$adminDocs' // Unwind the array created by $lookup
          },
          {
           $lookup:{
            from:'institutions',
            localField:'adminDocs.institutionId',
            foreignField: 'institution_id',
            as:'userDetails'
           } 
          },
          {
            $unwind:'$userDetails'
          }
        ]).exec()
        .then((data)=>{
          sendJSONResponse(res, 200, data)
        }).catch((error)=>{
            sendJSONResponse(res, 401, error)
        })

}