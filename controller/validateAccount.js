const validator = require('validator')

function validateAccount(email, password, confirmPassword, username) {
    let errors = []
    if(validator.isEmail(email) === false) {
        errors.push("Invalid email")
    }
    if(password.length < 8) {
        errors.push("Your password must have at least 8 characters")
    }
    if(password !== confirmPassword) {
        errors.push("Two passwords don't match")
    }
    if(username === undefined) {
        errors.push("Username cannot be empty")
    }
    if(errors.length === 0) {
        return true;
    }
    else {
        return errors
    }
}

module.exports = validateAccount