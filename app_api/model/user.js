const mongoose = require("mongoose")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    username:{type: String, required: true, unique: true},
    usertype:{type: String, required: true},
    usertype_name:{type: String, required: true},
    personId:{type: mongoose.Schema.Types.ObjectId, required:true},
    classId:{type: mongoose.Schema.Types.ObjectId},
    created_at:{type: Date, 'default':Date.now()},
    hash: String,
    salt: String
})

userSchema.methods.setPassword = function(password){

    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('base64'); 
}

userSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('base64');
    return this.hash === hash
}


userSchema.methods.generateJwt = function(){
    var expiry = new Date()
    expiry.setDate(expiry.getDate()+2);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        personId: this.personId,
        exp: parseInt(expiry.getTime()/1000),
    }, process.env.JWT_SECRET)
}

mongoose.model("User", userSchema)