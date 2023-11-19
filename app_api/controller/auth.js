const mongoose = require("mongoose")
const { token } = require("morgan")
const User = mongoose.model("User")
const Person = mongoose.model("Person")
const passport = require("passport")
const nodemailer = require("nodemailer")

const PDFDocument = require("pdfkit")
const fs = require("fs")
const path = require("path")
const { error } = require("console")

var sendJSONresponse = function (res, status, content) {
    res.status(status)
    res.json(content)
}

var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        type:'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.CLIENTID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN
    }
})

module.exports.register_user = (req, res)=>{

  
    if(!req.body.nationalId || !req.body.firstname || !req.body.lastname || 
        !req.body.gender || !req.body.dob || !req.body.email || !req.body.usertype_name){
            sendJSONresponse(res, 404, {"message":"please fill in all required fields!"})
        }
        
        const user = new User()
        const person = new Person()
    
        let password = Math.random().toString(36).slice(-8)
        user.setPassword(password)
    
        person.nationalId = req.body.nationalId
        person.firstname = req.body.firstname
        person.lastname = req.body.lastname
        person.gender = req.body.gender
        person.email = req.body.email
        person.phonenumber = req.body.phonenumber
        person.dob = req.body.dob
        //person.age = req.body.age
        person.profile_photo = req.body.profile_photo
        person.address = req.body.address
        person.place_residence = req.body.place_residence
        person.institutionId = req.body.institutionId
        
        //username // either email or learners code.
        user.usertype =  req.body.usertype // employee or learner 
        user.usertype_name = req.body.usertype_name // can be Head Master, Teacher, Super Admin or Learner
        // personId // generated after creating person
    
        let mailOptions = {
            from: 'justicemwanzamj@gmail.com',
            to: req.body.email,
            subject: "User account credentials",
            text: 'username: '+req.body.email +'\r\nuser password: '+password
        }
    
        User
          .findOne({username: req.body.email})
          .exec()
          .then(async(user_detail)=>{
            if(user_detail){
                sendJSONresponse(res, 200, {"message":"User or Person with such username already exists"})
            }else {
    
                   if(req.body.usertype === "Employee"){
                      user.username = req.body.email
                      person
                      .save()
                      .then((person)=>{
                        user.personId = person._id
                        console.log("The last inserted Id is"+user.personId)
                        console.log("The password is "+password)
                           user
                           .save()
                           .then((user_data)=>{
                              let token;
                              token = user.generateJwt()
                              transporter.sendMail(mailOptions, function(err, data){
                                if(err){
                                    sendJSONresponse(res, 404, err)
                                }else{
                                    sendJSONresponse(res, 201, {"message":"User Account created check your email for credentials", 'user':user_data, 'person': person})
                                }
                            })
                           }).catch((error)=>{
                              sendJSONresponse(res, 404, {message:"Failed to create user"+error})
                           })   
    
                      }).catch((error)=>{
                         sendJSONresponse(res, 404, {"message":"An error while adding person details"+error})
                      })
    
                   }else if(req.body.usertype === "Learner"){
                        let learnerId = Math.floor(1000 + Math.random() * 9000);
                        let unique = true
                        while(unique){
                            const learner = await User.findOne({username: learnerId})
                            if(!learner){
                                unique = false
                            }
                        }
                        user.username = (person.gender === "Male") ? "M"+learnerId : "F"+learnerId;
                      
                        const pdfFileName = person.firstname+" "+person.lastname+' credentials.pdf';
                        const filePath = path.join(__dirname, pdfFileName);
                        if(!fs.existsSync(filePath)){
                            fs.writeFileSync(filePath, '')
                        }

                        const existingPDFContent = fs.readFileSync(filePath, 'utf-8')
                        const pdfDoc = new PDFDocument()

                        const pdfStream = fs.createWriteStream(filePath)
                        pdfDoc.pipe(pdfStream)

                        pdfDoc.text(existingPDFContent)

                        pdfDoc.text('User Credentials for :'+person.firstname+" "+person.lastname, 100, 100);
                        pdfDoc.text(`Username: ${user.username}`, 100, 120);
                        pdfDoc.text(`Password: ${password}`, 100, 140);
 
                        pdfDoc.end();
                        pdfStream.on('finish', () => {
                            
                            person
                            .save()
                            .then((person)=>{
                                user.personId = person._id
                                user
                                  .save()
                                  .then((user_data)=>{
                                    let token;
                                    token = user.generateJwt()
                                    sendJSONresponse(res, 201, {'Info':"Learner created successfully",'message': `PDF saved to ${filePath}`, 'user':user_data, 'person': person})
                                  }).catch((error)=>{
                                    sendJSONresponse(res, 404, {"message":"An error while creating system user"+error})
                                  })

                            }).catch((error)=>{
                                sendJSONresponse(res, 404, {"message":"An error while adding person details"+error})
                            })
                        });
                
                   }
            }
          })
          
    }

module.exports.login = (req, res)=>{
    if(!req.body.username || !req.body.password){
        sendJSONresponse(res, 400, {
            "message": "All fields are required"
        })
        return;
    }
    passport.authenticate('local', function(err, user, info){
        var token
        if(err){
            sendJSONresponse(res, 400, err)
            console.log(err)
            return;
        }if(user){
            token = user.generateJwt()
            sendJSONresponse(res, 200,{
                "token":token,
                "user":user
            })
        }else{
            sendJSONresponse(res, 401, {"message":info})
        }
    })(req, res);

}
