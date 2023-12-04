const mongoose = require("mongoose")
const Attendance = mongoose.model("Attendance")
const Person = mongoose.model("Person")
const User = mongoose.model("User")

const sendJSONResponse = (res, status, content)=>{
    res.status(status)
    res.json(content)
}

module.exports.log_student_attendance = (req, res)=>{
    let classId = req.body.classId
    let learnerId = req.body.learnerId
    let isPresent = req.body.isPresent
    let institutionId = req.body.institutionId

     const attendance = new Attendance()
     attendance.classId  = classId
     attendance.learnerId = learnerId
     attendance.isPresent = isPresent
     attendance.institutionId = institutionId
     attendance.status =  attendance.isPresent  ? 'Present' : 'Absent' 

     attendance
       .save()
       .then((attendee)=>{
          sendJSONResponse(res, 201, {"message":"Attendance logged successfully", data:attendee} )
       }).catch((error)=>{
          sendJSONResponse(res, 404, error)
       })

}

// module.exports.attendance_list = (req, res)=>{
//     //   let institutionId = req.params.institutionId
//     //   Attendance
//     //     .find({institutionId: {$eq: +institutionId}})
//     //     .exec()
//     //     .then((attendanceList)=>{
//     //         sendJSONResponse(res, 200, attendanceList)
//     //     }).catch((error)=>{
//     //         sendJSONResponse(res, 404, error)
//     //     })
// }
// 

module.exports.attendance_list = (req, res) => {
    let institutionId = req.params.institutionId;

    Attendance.aggregate([
        {
            $match: {
                institutionId: +institutionId,
            },
        },
        {
            $group: {
                _id: {
                    learnerId: "$learnerId",
                },
                details: {
                    $push: {
                        _id: "$_id",
                        isPresent: "$isPresent",
                        classId: "$classId",
                        status: "$status",
                        attendanceDate: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$attendanceDate",
                            },
                        }
                       // attendance_date: "$attendanceDate"
                    },
                },
            },
        },
        {
          $lookup: {
              from: "users",
              localField:'_id.learnerId',
              foreignField:'_id',
              as: 'userData'
          }
        },
        {
            $unwind: "$userData"
        },
        {
           $lookup:{
            from:"people",
            localField:"userData.personId",
            foreignField:"_id",
            as:'personData'
           }
        },
        {
         $unwind: "$personData"
        },
       
        {
            $project: {
                _id: 0,
                learnerId: "$_id.learnerId",
                learnerCode:"$userData.username",
                firstname:"$personData.firstname",
                lastname:"$personData.lastname",
                details: "$details"
                // attendanceDetails: 1,
            },
        },
    ])
        .exec()
        .then((result) => {
            sendJSONResponse(res, 200, result);
        })
        .catch((error) => {
            sendJSONResponse(res, 404, error);
        });
}; 




