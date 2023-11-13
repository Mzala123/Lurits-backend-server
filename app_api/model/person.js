const mongoose =  require("mongoose")

const personSchema = new mongoose.Schema({
   nationalId: {type: String, required: true},
   firstname: {type: String, required: true},
   lastname: {type: String, required: true},
   gender: {type: String, required: true},
   email: {type: String},
   phonenumber: {type: String},
   dob: {type: Date},
   age: {type: Number, required: false},
   profile_photo: {type:String, 'default': 'null photo'},
   address: {type:String, 'default':'N/A'},
   place_residence: {type: String, 'default':'N/A'},
   institutionId: {type: Number, required: true}
})

mongoose.model("Person", personSchema)