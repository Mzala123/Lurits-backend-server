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

            Institution.aggregate([
                {
                $match: {institution_id: {$eq: +institutionId}}
                },
                {
                $project: {
                    institution_id: 1,
                    institution_name: 1,
                    username:1,
                    nationalId:1,
                    firstname:1,
                    lastname:1,
                    gender:1,
                    dob:{ $dateToString:{format: "%Y-%m-%d", date: "$dob" } }
                }
                },
                {
                    $lookup:{
                        from:'people',
                        localField:'institution_id',
                        foreignField:'institutionId',
                        as:'learnerDocs'
                    }
                },
                {
                    $unwind:'$learnerDocs'
                },
                {
                    $lookup:{
                        from:'users',
                        localField:'learnerDocs._id',
                        foreignField:'personId',
                        as:'userDetails'
                    }
                },
                {
                    $unwind:'$userDetails'
                },
                {
                    $lookup:{
                        from:'classes',
                        localField:'userDetails.classId',
                        foreignField:'_id',
                        as:'classDetails'
                    }
                },
                {
                    $unwind:'$classDetails'
                }
                ,
                {
                    $match:{'userDetails.usertype_name':'Learner'}
                }
                ,
                {
                    $match: { 'userDetails.classId': { $exists: true, $ne: null } } // Add this condition
                }
            ]).exec()
                .then((data) => {
                sendJSONResponse(res, 200, data);
                })
                .catch((error) => {
                console.error(error);
                sendJSONResponse(res, 401, error);
                });


}

module.exports.unassigned_class_learners_list_by_institution_id = (req, res)=>{

    const ObjectId = mongoose.Types.ObjectId
    var institutionId = req.params.institutionId
    console.log("hie there learner! " +institutionId)

           Institution.aggregate([
               {
               $match: {institution_id: {$eq: +institutionId}}
               },
               {
               $project: {
                   institution_id: 1,
                   institution_name: 1,
                   username:1,
                   nationalId:1,
                   firstname:1,
                   lastname:1,
                   gender:1,
                   dob:{ $dateToString:{format: "%Y-%m-%d", date: "$dob" } }
               }
               },
               {
                   $lookup:{
                       from:'people',
                       localField:'institution_id',
                       foreignField:'institutionId',
                       as:'learnerDocs'
                   }
               },
               {
                   $unwind:'$learnerDocs'
               },
               {
                   $lookup:{
                       from:'users',
                       localField:'learnerDocs._id',
                       foreignField:'personId',
                       as:'userDetails'
                   }
               },
               {
                   $unwind:'$userDetails'
               }
               ,
               {
                   $match:{'userDetails.usertype_name':'Learner'}
               }
               ,
               {
                   $match: { 'userDetails.classId': { $exists: false, $eq: null } } // Add this condition
               }
           ]).exec()
               .then((data) => {
               sendJSONResponse(res, 200, data);
               })
               .catch((error) => {
               console.error(error);
               sendJSONResponse(res, 401, error);
               });



}

module.exports.teachers_list_by_institution_id = (req, res)=>{

    const ObjectId = mongoose.Types.ObjectId
     var institutionId = req.params.institutionId
     console.log("hie there learner! " +institutionId)

            Institution.aggregate([
                {
                $match: {institution_id: {$eq: +institutionId}}
                },
                {
                $project: {
                    institution_id: 1,
                    institution_name: 1,
                    username:1,
                    nationalId:1,
                    firstname:1,
                    lastname:1,
                    gender:1,
                    dob:{ $dateToString:{format: "%Y-%m-%d", date: "$dob" } },
                }
                },
                {
                    $lookup:{
                        from:'people',
                        localField:'institution_id',
                        foreignField:'institutionId',
                        as:'learnerDocs'
                    }
                },
                {
                    $unwind:'$learnerDocs'
                },
                {
                    $lookup:{
                        from:'users',
                        localField:'learnerDocs._id',
                        foreignField:'personId',
                        as:'userDetails'
                    }
                },
                {
                    $unwind:'$userDetails'
                }
                ,
                {
                    $match:{'userDetails.usertype_name':'Teacher'}
                }
            ]).exec()
                .then((data) => {
                sendJSONResponse(res, 200, data);
                })
                .catch((error) => {
                console.error(error);
                sendJSONResponse(res, 401, error);
                });


}



module.exports.learners_by_gender_by_institution_id = (req, res)=>{
    var institutionId = req.params.institutionId;
        Person.aggregate([
            { $match: { institutionId: { $eq: +institutionId } } },
            {
              $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: 'personId',
                as: 'learnerDocs'
              }
            },
            {
              $unwind: '$learnerDocs'
            },
            {
              $match: { 'learnerDocs.usertype_name': 'Learner' }
            },
            {
              $group: {
                _id: '$gender',
                countByGender: { $sum: 1 } // Count learners by gender
              }
            },
            {
              $group: {
                _id: null, // No grouping
                genderCounts: {
                  $push: {
                    gender: '$_id',
                    count: '$countByGender'
                  }
                },
                totalLearners: { $sum: '$countByGender' } // Sum the counts to get total
              }
            },
            {
              $project: {
                genderCounts: {
                  $concatArrays: [
                    '$genderCounts',
                    [{ gender: 'Total', count: '$totalLearners' }]
                  ]
                }
              }
            }
          ]).exec()
            .then((learnerGender) => {
              sendJSONResponse(res, 200, learnerGender[0]);
            })
            .catch((error) => {
              sendJSONResponse(res, 404, error);
            });

}


module.exports.teachers_by_gender_by_institution_id = (req, res)=>{
    var institutionId = req.params.institutionId;
    Person.aggregate([
        { $match: { institutionId: { $eq: +institutionId } } },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: 'personId',
                as: 'learnerDocs'
            }
        },
        {
            $unwind: '$learnerDocs'
        },
        {
            $match: { 'learnerDocs.usertype_name': 'Teacher' }
        },
        {
            $group: {
                _id: '$gender',
                countByGender: { $sum: 1 } // Count learners by gender
            }
        },
        {
            $group: {
                _id: null, // No grouping
                totalTeachers: { $sum: '$countByGender' }, // Sum the counts by gender to get total
                genderCounts: { $push: { gender: '$_id', count: '$countByGender' } }, // Array of gender counts
            }
        },
        {
            $project:{
                genderCounts:{
                    $concatArrays: [
                        '$genderCounts',
                        [{gender:'Total', count:'$totalTeachers'}]
                    ]
                }
            }
        }
        
    ]).exec()
        .then((TeacherGender) => {
            sendJSONResponse(res, 200, TeacherGender[0]);
        })
        .catch((error) => {
            sendJSONResponse(res, 404, error);
        });

}