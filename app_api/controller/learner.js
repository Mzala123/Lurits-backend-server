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


module.exports.get_list_subjects_class_learner = (req, res)=>{

}