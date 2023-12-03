const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const Classes = mongoose.model("Classes")
const Subjects = mongoose.model("Subjects")
const classSubjects = mongoose.model("classSubjects");
const classAssignments = mongoose.model("classAssignments")
const User = mongoose.model("User")
const Grade = mongoose.model("grades")

const sendJSONResponse = (res, status, content)=>{
    res.status(status)
    res.json(content)
}


module.exports.read_subjects_classes_to_add_grades = (req, res)=>{
    const ObjectId = mongoose.Types.ObjectId
    let userId = req.params.userId
    let classId = req.params.classId

    try{
        userId = new ObjectId(userId)
        classId = new ObjectId(classId)
    }catch(error){
       sendJSONResponse(res, 400, {error:'Invalid ObjectId'})
       return;
    }
    classAssignments
       .aggregate(
        [
            {
                $match: {
                    userId: userId,   
                    userType:"Teacher"
                  }
            },
            {
                $lookup: {
                  from: "classsubjects",
                  localField: "classSubjectId",
                  foreignField: "_id",
                  as: "assignedSubjects"
                }
            },
              {
                $unwind: "$assignedSubjects"
            },
            {
                $match:{
                    'assignedSubjects.classId': classId
                }
            },
            {
                $lookup: {
                    from: "classes",
                    localField: "assignedSubjects.classId",
                    foreignField: "_id",
                    as: "classInfo"
                }
            },
            {
               $lookup:{
                from:"subjects",
                localField: "assignedSubjects.subjectId",
                foreignField: "_id",
                as:"subjectInfo"
               }
            },
            {
                $project:{
                    "classSubjectId": "$assignedSubjects.classSubjectId",
                    "classId": "$assignedSubjects.classId",
                    "subjectId": "$assignedSubjects.subjectId",
                    "className": { $arrayElemAt: ["$classInfo.className", 0] }, // A
                    "SubjectName": {$arrayElemAt: ["$subjectInfo.subjectName", 0]}
                }
            }

        ]).exec()
        .then((teacherSubjects)=>{
            sendJSONResponse(res, 200, teacherSubjects)
        }).catch((error)=>{
           sendJSONResponse(res, 404, error)
        })

}

module.exports.add_learner_subject_grade = async(req, res)=>{
        let learnerId = req.body.userId // learners id
        let teacherId = req.body.teacherId
        let subjectId = req.body.subjectId
        let classId = req.body.classId
        let score = req.body.score
        
        const classSubjectExist = await classSubjects.findOne({classId: classId, subjectId:subjectId})

        var grade = new Grade()
       
        grade.learnerId = learnerId
        grade.teacherId = teacherId
        grade.score = score
        grade.classSubjectId = classSubjectExist._id

        //const gradeExist = await Grade.find()
        await
          grade
          .save()
          .then((grades)=>{
            sendJSONResponse(res, 201, {"message":"Learner grades added successfully"})    
          }).catch((error)=>{
             sendJSONResponse(res, 404, error)
          })
          
}