var passport = require("passport")
var LocalStrategy = require('passport-local').Strategy
var mongoose = require('mongoose')
var User = mongoose.model('User')

passport.use(new LocalStrategy({
    usernameField: 'username'
}, function(username, password, done) {
    User.findOne({ username: username }).exec()
        .then(function(user) {
            if (!user) {
                return done(null, false, {
                    message: "incorrect username"
                });
            }

            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: "incorrect password"
                });
            }

            return done(null, user);
        })
        .catch(function(err) {
            return done(err);
        });
}));