// const passport = require("passport")
// const LocalStrategy = require("passport-local").Strategy
// const mongoose = require("mongoose")
// const User = mongoose.model('User')

// passport.use(new LocalStrategy({
// usernameField:'username'
// }, function(username, password, done){
//     User.findOne({username: username}, function(err, user){
//         if(err){
//             return done(err)
//         }if(!user){
//             return done(null, false, {
//                 message:"incorrect username"
//             })
//         }
//         if(!user.validPassword(password)){
//             return done(null, false,{
//                 message:"incorrect password"
//             })
//         }
//         return done(null, user)
//     })
// }
// ))

var passport = require("passport")
var LocalStrategy = require('passport-local').Strategy
var mongoose = require('mongoose')
var User = mongoose.model('User')

passport.use(new LocalStrategy({
    usernameField: 'username'
}, function(username, password, done){
    User.findOne({username: username}, function(err, user){
        if(err){
            return done(err)
        }
        if(!user){
            return done(null, false,{
                message: "incorrect username"
            })
        }
        //console.log(user.salt);
        if(!user.validPassword(password)){
            return done(null, false,{
                message: "incorrect password"
            })
        }
        return done(null, user)
    })
}
))