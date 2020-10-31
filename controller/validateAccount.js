const validator = require('validator')
const bcrypt = require('bcryptjs')
const userModel = require("../model/user")

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

function validateEditUserProfile(username) {
    if(!username) {
        errors.username = "Username cannot be empty"
    }
    
}

async function validateChangePassword(userId, oldPassword, newPassword, confirmPassword) {
    let errors = {}
    const user = await userModel.findById(userId).exec()
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    
    if(!isMatch){
        errors.oldPassword = "Your old password is incorrect"
    }
    if(newPassword.length < 8) {
        errors.newPassword = "Your password must have at least 8 characters"
    }
    if(newPassword !== confirmPassword) {
        errors.confirmPassword = "Two passwords are not match"
    }
    if(!errors.hasOwnProperty('oldPassword') &&
       !errors.hasOwnProperty('newPassword') &&
       !errors.hasOwnProperty('confirmPassword')
    ) {
        return true
    }
    else {
        return errors
    }
}

module.exports = { validateSignup, validateLogin, validateChangePassword }