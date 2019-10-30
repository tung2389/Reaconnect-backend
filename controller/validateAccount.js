const validator = require('validator')

function validateSignup(email, password, confirmPassword, username) {
    let errors = {}
    if(validator.isEmail(email) === false) {
        errors.email = "Invalid email"
    }
    if(password.length < 8) {
        errors.password = "Your password must have at least 8 characters"
    }
    if(password !== confirmPassword) {
        errors.confirmPassword = "Two passwords don't match"
    }
    if(!username) {
        errors.username = "Username cannot be empty"
    }
    if(!errors.hasOwnProperty('email') &&
       !errors.hasOwnProperty('password') &&
       !errors.hasOwnProperty('confirmPassword') &&
       !errors.hasOwnProperty('usernam')
    ) {
        return true;
    }
    else {
        return errors
    }
}

function validateLogin(email, password) {
    let errors = {}
    if(validator.isEmail(email) === false) {
        errors.email = "Invalid email"
    }
    if(password.length < 8) {
        errors.password = "Your password must have at least 8 characters"
    }
    if(!errors.hasOwnProperty('email') &&
       !errors.hasOwnProperty('password')
    ) {
        return true
    }
    else {
        return errors
    }
}

module.exports = { validateSignup, validateLogin }