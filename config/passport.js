const LocalStrategy =  require('passport-local').Strategy
const { JwtStrategy, ExtractJwt  } = reqquire('passport-jwt')
const bcrypt = require('bcryptjs')
const user = require("../model/user")

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
                        if(!user){
                            return done(null, false, { message: "That email is not registerd" });
                        }
                        //Match password
                        bcrypt.compare(password, user.password, (err, isMatch) => {
                            if(err) throw err;
                            if(isMatch){
                                return done(null, user, {message: "Logged in successfully"})
                            }
                            else{
                                return done(null,false, { message: "Password is incorrect" });
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
                    else {
                        return done(null, user)
                    }
                })
            }
        )
    )
}