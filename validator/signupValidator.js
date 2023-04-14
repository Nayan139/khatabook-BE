const validator = require('validator')
const isEmpty = require('is-empty')

module.exports = function singupValidator(data){
    let errors={}

    // Convert empty fields to an empty string so we can use validator functions
    data.firstname = !isEmpty(data.firstname) ? validator.trim(data.firstname) : "";
    data.lastname = !isEmpty(data.lastname) ? validator.trim(data.lastname) : "";
    data.email = !isEmpty(data.email) ? validator.trim(data.email) : ''
    data.password = !isEmpty(data.password) ? validator.trim(data.password) : ''
    data.mobileno = !isEmpty(data.mobileno) ? validator.trim(data.mobileno) : ''
    
    if (validator.isEmpty(data.firstname)) {
        errors.firstname="First name is required."
    } else if (!validator.isLength(data.firstname, { min: 3 })) {
        errors.firstname="First name must be at least 3 characters."
    } else if (!validator.isLength(data.firstname, { max: 50 })) {
         errors.firstname="First name may not be grater then 50 characters."
    }

    if (validator.isEmpty(data.lastname)) {
        errors.lastname="Last name is required."
    } else if (!validator.isLength(data.lastname, { min: 3 })) {
        errors.lastname="Last name must be at least 3 characters."
    } else if (!validator.isLength(data.lastname, { max: 50 })) {
         errors.lastname="Last name may not be grater then 50 characters."
    }

    if (validator.isEmpty(data.email)) {
         errors.email="Email is required."
    } else if (!validator.isEmail(data.email)) {
        errors.email="Email address is not valid"
    }

    if (validator.isEmpty(data.password)) {
         errors.password="Password is required."
    } else if (!validator.isStrongPassword(data.password, [{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, }])) {
        errors.password = "Password must be at least 8 characters, with min 1 lowercase, min 1 uppercase, 1 number and 1 symbol";
    }

    if (validator.isEmpty(data.mobileno)) {
        errors.mobileno = "Mobile number is required";
    } else if (!validator.isMobilePhone(data.mobileno)) {
        errors.mobileno = "Mobile number is not valid";
    }
    

    return {
        errors,
        isValid:isEmpty(errors)
    }
}