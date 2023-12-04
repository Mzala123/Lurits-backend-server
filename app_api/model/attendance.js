
const mongoose = require("mongoose")

const attendanceSchema = new mongoose.Schema({
      classId:{type: mongoose.Schema.Types.ObjectId},
      learnerId: {type: mongoose.Schema.Types.ObjectId},
      institutionId: {type: Number},
      attendanceDate: {type: Date, 'default': Date.now()},
      isPresent:{type: Boolean, 'default':false},
      status: {type: String}
})

mongoose.model("Attendance", attendanceSchema)