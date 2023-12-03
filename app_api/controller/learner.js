const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const Classes = mongoose.model("Classes")
const Subjects = mongoose.model("Subjects")
const classSubjects = mongoose.model("classSubjects");
const classAssignments = mongoose.model("classAssignments")
const User = mongoose.model("User")
const Institution = mongoose.model("Institution")

const sendJSONResponse = (res, status, content)=>{
    res.status(status)
    res.json(content)
}


module.exports.get_list_subjects_class_learner = (req, res)=>{
      let userId = req.params.userId
      let institutionId = req.params.institutionId 
      try{
            userId = new ObjectId(userId)
        }catch(error){
        sendJSONResponse(res, 400, {error:'Invalid ObjectId'})
        return;
        }

    Institution
         .aggregate([
            {
                $match: {institution_id: {$eq: +institutionId}}
            },
            {
                $lookup:{
                    from: "people",
                    localField: "institution_id",
                    foreignField: "institutionId",
                    as: "institutionPeople"
                }
            },
            {
                $unwind: "$institutionPeople"
            },
            {
                $lookup:{
                    from: "users",
                    localField: "institutionPeople._id",
                    foreignField: "personId",
                    as: "userDetails",
                }
            },
            {
               $unwind: "$userDetails"
            },
            {
                $match:{
                    "userDetails.usertype_name" : "Learner",
                    "userDetails._id":userId
                }
            },
            {
                $lookup: {
                  from: "grades",
                  localField: "userDetails._id",
                  foreignField: "learnerId",
                  as: "grades",
                },
              },
            
            {
                $unwind:  {
                    path:"$grades",
                    preserveNullAndEmptyArrays: true
                }  // Preserve unmatched documents
            },
             {
                $lookup:{
                      from: "classsubjects",
                      localField: "grades.classSubjectId",
                      foreignField:"_id",
                       as:"classSubjectDoc"
             }
               
           },
            {
                $unwind: "$classSubjectDoc"
            },
            {
                $lookup:{
                    from:'subjects',
                    localField:"classSubjectDoc.subjectId",
                    foreignField:"_id",
                    as:"subject"
                }
            },
            {
                  $unwind: {
                   path:  "$subject",
                   preserveNullAndEmptyArrays: true
                }
            },
          
              {
                $lookup: {
                    from: "users",
                    localField: "grades.teacherId",
                    foreignField: "_id",
                    as: "teacherDetails",
                  },
              },
              {
                $unwind:  "$teacherDetails",
              },
              {
                 $lookup:{
                    from:"people",
                    localField: "teacherDetails.personId",
                    foreignField: "_id",
                    as: "teacher"
                 }
              },
              {
                  $unwind: "$teacher"
              },

              {
                $group: {
                    _id: {
                      institutionId: "$institution_id",
                      learnerId: "$userDetails._id",
                    },
                    institutionName: { $first: "$institution_name" },
                    learnerFirstName: { $first: "$institutionPeople.firstname" },
                    learnerLastName: { $first: "$institutionPeople.lastname" },
                    learnerUsername: { $first: "$userDetails.username" },
                    grades: { $push: { 
                        subjectName: "$subject.subjectName",
                        score: "$grades.score",
                        teacherFirstname: "$teacher.firstname",
                        teacherLastname: "$teacher.lastname"
                      } 
                    },
                    // teacherDetails: { $push: "$teacherDetails" },
                  },
              
              },
            
            {
                $project:{
                    _id: 0, // Exclude the group ID
                    institutionName: 1,
                    learnerFirstName: 1,
                    learnerLastName: 1,
                    learnerUsername: 1,
                    learnerEmail: 1,
                    grades: 1,
                    teacherDetails: 1,
              
                }
                 
            }
        ]).then((learnerResults)=>{
            sendJSONResponse(res, 200, learnerResults)
        }).catch((error)=>{
            sendJSONResponse(res, 404, error)
        })  
 




}