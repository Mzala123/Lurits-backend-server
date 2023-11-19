const mongoose = require("mongoose")
const { dash } = require("pdfkit")
const Institution = mongoose.model("Institution")
const Person = mongoose.model("Person")
const User = mongoose.model("User")

const sendJSONResponse = (res, status, content)=>{
    res.status(status)
    res.json(content)
}


module.exports.learners_list_by_institution_id = (req, res)=>{
    const ObjectId = mongoose.Types.ObjectId
     var institutionId = req.params.institutionId
    console.log("hie there learner! " +institutionId)

    Institution
      .find({}, {institution_id:institutionId})
      .exec()
      .then((data)=>{
        sendJSONResponse(res, 200, data)
      })


    // Institution
    //   .aggregate(
    //     [
    //         {
    //             $match:{institution_id: institutionId}
    //         },
    //         {
    //             $project:{
    //                 username:1,
    //                 usertype_name:1,
    //                 personId:1,
    //                 institution_name:1,
    //                 institution_address:1,
    //                 nationalId:1,
    //                 firstname:1,
    //                 lastname:1,
    //                 gender:1,
    //                 place_residence:1,
    //                 institutionId:1
    //             }
    //         },
    //         {
    //           $lookup:{
    //             from:'people',
    //             localField:'institution_id',
    //             foreignField:'institutionId',
    //             as: 'learnerDocs'
    //           }
    //         },
    //         {
    //             $unwind: '$learnerDocs'
    //         },
    //         {
    //             $lookup:{
    //                 from: 'users',
    //                 localField: 'learnerDocs._id',
    //                 foreignField:'personId',
    //                 as:'userDetails'
    //             }
    //         }
    //     ]
    //   ).exec()
    //   .then((data)=>{
    //     sendJSONResponse(res, 200, data)
    //   }).catch((error)=>{
    //       sendJSONResponse(res, 401, error)
    //   })


}

module.exports.teachers_list_by_institution_id = (req, res)=>{
    const ObjectId = mongoose.Types.ObjectId
    var institutionId = req.params.institutionId

    console.log("hie there teacher! " +institutionId)
    //return institutionId;
    Institution
      .aggregate(
        [
            {
                $match:{institution_id: {$eq: institutionId}}
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
            },
            {
              $lookup:{
                from:'people',
                localField:'institution_id',
                foreignField:'institutionId',
                as: 'learnerDocs'
              }
            },
            {
                $unwind: '$learnerDocs'
            },
            {
                $lookup:{
                    from: 'users',
                    localField: 'learnerDocs._id',
                    foreignField:'personId',
                    as:'userDetails'
                }
            }
        ]
      ).exec()
      .then((data)=>{
        sendJSONResponse(res, 200, data)
      }).catch((error)=>{
          sendJSONResponse(res, 401, error)
      })
}