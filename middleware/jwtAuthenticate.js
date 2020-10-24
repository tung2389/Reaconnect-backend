const passport = require('passport')

function jwtAuthenticate(req, res, next) {
    passport.authenticate('jwt', {session: false}, (err, user) => {
        if(err) {
            return res.status(500).json({
                message: "Error occured"
            })
        }
        if(!user) {
            return res.status(401).json({
                message: "You must login first"
            })
        }
        req.user = user;
        next();
    })(req, res, next)
}

module.exports = jwtAuthenticate;