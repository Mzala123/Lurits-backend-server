const mongoose = require("mongoose")

const classSchema = new mongoose.Schema({
    className: {type: String, required: true, unique:true}
})
mongoose.model("Classes", classSchema)


const subjectSchema = new mongoose.Schema({
    subjectName: {type: String, required: true, unique: true}
})
mongoose.model("Subjects", subjectSchema)



const classSubjectsSchema = new mongoose.Schema({
    classId: {type: mongoose.Schema.Types.ObjectId},
    subjectId : {type: mongoose.Schema.Types.ObjectId}
})
mongoose.model("classSubjects", classSubjectsSchema)



const classAssignmentsSchema = new  mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId},
    classSubjectId: {type: mongoose.Schema.Types.ObjectId},
    userType: {type: String}      
})

mongoose.model("classAssignments", classAssignmentsSchema)


const gradeSchema = new mongoose.Schema({
    learnerId:{type: mongoose.Schema.Types.ObjectId},
    teacherId: {type: mongoose.Schema.Types.ObjectId},
    classSubjectId: {type: mongoose.Schema.Types.ObjectId},
    score: {type: Number}     
})

mongoose.model("grades", gradeSchema)