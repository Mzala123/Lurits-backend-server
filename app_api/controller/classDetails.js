const mongoose = require('mongoose')

const Classes = mongoose.model("Classes")
const Subjects = mongoose.model("Subjects")
const classSubjects = mongoose.model("classSubjects");
const classAssignments = mongoose.model("classAssignments")

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