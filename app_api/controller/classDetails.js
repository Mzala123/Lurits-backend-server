const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const Classes = mongoose.model("Classes")
const Subjects = mongoose.model("Subjects")
const classSubjects = mongoose.model("classSubjects");
const classAssignments = mongoose.model("classAssignments")
const User = mongoose.model("User")

const sendJSONResponse = (res, status, content)=>{
    res.status(status)
    res.json(content)
}


module.exports.configure_classes = (req, res)=>{
    if(!req.body.className){
       sendJSONResponse(res, 404, {"message":"Please fill in the required field!"})
    }

    const classes = new Classes()
    classes.className = req.body.className

     Classes
     .findOne({className: req.body.className})
     .exec()
     .then((success)=>{
         if(success){
            sendJSONResponse(res, 200, {"message":"Institution class Already available!, configure a new class"})
         }
         else{
            classes
                .save()
                .then((classe)=>{
                    sendJSONResponse(res, 201, classe)
                }).catch((error)=>{
                    sendJSONResponse(res, 404, error)
                })
         }
     })
           
}

module.exports.configure_subjects = (req, res)=>{
       if(!req.body.subjectName){
        sendJSONResponse(res, 404, {"message":"Please fill in the reqquired field!"})
       }
       const subjects = new Subjects()
       subjects.subjectName = req.body.subjectName

       Subjects
         .findOne({subjectName: req.body.subjectName})
         .exec()
         .then((success)=>{
            if(success){
                sendJSONResponse(res, 200, {"message":"Subject Already available!, configure a new subject!"})
            }else{
                subjects
                  .save()
                  .then((subject)=>{
                    sendJSONResponse(res, 201, subject)
                  }).catch((error)=>{
                    sendJSONResponse(res, 404, error)
                  })
            }
         })
}

module.exports.read_list_classes = (req, res)=>{
    Classes
      .find({})
      .exec()
      .then((classes)=>{
        sendJSONResponse(res, 200, classes)
      }).catch((error)=>{
        sendJSONResponse(res, 404, error)
      })

}

module.exports.read_list_subjects = (req, res)=>{
    Subjects
     .find({})
     .exec()
     .then((subjects)=>{
        sendJSONResponse(res, 200, subjects)
     }).catch((error)=>{
        sendJSONResponse(res, 404, error)
     })

}

module.exports.configure_class_subjects = (req, res)=>{
     if(!req.body.classId || !req.body.subjectId){
         sendJSONResponse(res, 404, {"message":"Please fill in all required fields!"})
         return;
     }
     const class_subjects = new classSubjects()
     class_subjects.classId = req.body.classId
     class_subjects.subjectId = req.body.subjectId
     
        class_subjects
           .save()
           .then((classSubject)=>{
            sendJSONResponse(res, 201, classSubject)
           }).catch((error)=>{
            sendJSONResponse(res, 404, error)
           })
}

module.exports.read_subjects_available_in_class = (req, res)=>{
    const ObjectId = mongoose.Types.ObjectId
    var classId = req.params.classId
    try{
       classId = new ObjectId(classId)
    }catch(error){
       sendJSONResponse(res, 400, {error:'Invalid ObjectId'})
       return;
    }

    classSubjects
       .aggregate(
        [
            {$match: {classId: {$eq:classId}}},
            {
                $project:{
                    classId:1,
                    subjectId:1,
                    className:1,
                   subjectName:1
                }
            },
            {
               $lookup:{
                from:'classes',
                localField: 'classId',
                foreignField: '_id',
                as: 'classDocs'
               }   
            },
            {
                $unwind: '$classDocs'
            },
            {
               $lookup: {
                 from:'subjects',
                 localField:'subjectId',
                 foreignField: '_id',
                 as:'subjectDocs'
               }
            },
            {
                $unwind: '$subjectDocs'
            }
        ]
       ).exec()
         .then((data)=>{
            sendJSONResponse(res, 200, data)
         }).catch((error)=>{
            sendJSONResponse(res, 401, error)
         })
}

module.exports.assign_student_class = async (req, res)=>{
    const ObjectId = mongoose.Types.ObjectId
    let userId = req.params.userId
    let classId = req.body.classId
    try{
        userId = new ObjectId(userId)
    }catch(error){
       sendJSONResponse(res, 400, {error:'Invalid ObjectId'})
       return;
    }
     const userExist = await User.findOne({_id:userId})
     const classExist = await classSubjects.findOne({classId:classId})

     var class_assignements =  new classAssignments()
     class_assignements.userType = userExist.usertype_name;
     class_assignements.userId = userId
     class_assignements.classSubjectId = classExist._id

     if(!userExist.classId){

     const class_assigned =  await class_assignements.save()
      if(class_assigned){
        User
        .updateOne({_id:userId},
          {
              classId: classId
          }
          ).exec()
           .then((class_assignee)=>{ 
                 sendJSONResponse(res, 200, { message: 'Class assigned to learner successfully',data: class_assignee});
           }).catch((error)=>{
              sendJSONResponse(res, 404, {"message":"Failed to assign class to learner"})
           })
      }else{
        return;
      }
       
     }else{
        sendJSONResponse(res, 200, {"message":"Student already assigned a class!"})
     }   
}


module.exports.assign_class_to_teacher = async(req, res)=>{

    const ObjectId = mongoose.Types.ObjectId
    let userId = req.params.userId
    let classId = req.body.classId
    let subjectId = req.body.subjectId
    try{
        userId = new ObjectId(userId)
    }catch(error){
       sendJSONResponse(res, 400, {error:'Invalid ObjectId'})
       return;
    }

    const userExist = await User.findOne({_id:userId})
    const classExist = await classSubjects.findOne({classId:classId, subjectId: subjectId })

    var class_assignements =  new classAssignments()
    class_assignements.userType = userExist.usertype_name;
    class_assignements.userId = userId
    class_assignements.classSubjectId = classExist._id
    
    const countSubjectAssignedToTeacher = await classAssignments.countDocuments({userId:userId})
    //sendJSONResponse(res, 200, countSubjectAssignedToTeacher)
    
    if(countSubjectAssignedToTeacher <= 4){
        const subject_teacher_assigned = await class_assignements.save()
        if(subject_teacher_assigned){
           sendJSONResponse(res, 200, {"message":"Subject assigned to teacher successfully"})
        }else{
           sendJSONResponse(res, 404, {"message":"Failed to assign a subject to a teacher"})
        }
    }else {
        sendJSONResponse(res, 200, {"message":"Teacher should have a maximum of three Subjects"})
    }

}






