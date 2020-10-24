const LocalStrategy =  require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const bcrypt = require('bcryptjs')
const user = require("../model/user")
require('dotenv').config()

module.exports = function(passport) {
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password"
            },
            (email, password, done) => {
                user.findOne({email: email})
                    .then(user => {
                        //Match user
                        if(!user || !user.verified){
                            return done(null, false, { general: "Your email or password is incorrect" });
                        }
                        //Match password
                        bcrypt.compare(password, user.password, (err, isMatch) => {
                            if(err) throw err;
                            if(isMatch){
                                return done(null, user, {message: "Logged in successfully"})
                            }
                            else{
                                return done(null,false, { general: "Your email or password is incorrect" });
                            }
                        });
                    })
                    .catch(err => console.log(err))
        })
    );
    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.JWT_SECRET
            },
            (jwt_payload, done) => {
                user.findById(jwt_payload.id, (err, user) => {
                    if(err) {
                        return done(err, false)
                    }
                    // if the user has changed password, then the old jwt is not valid
                    if(!user || jwt_payload.password !== user.toObject().password) {
                        return done(null, false)
                    }
                    else {
                        return done(null, user)
                    }
                })
            }
        )
    )
}