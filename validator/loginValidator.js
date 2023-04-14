const validator = require('validator')
const isEmpty = require('is-empty')

module.exports = function loginvalidator(data) {
    let errors = {}
    
    data.email = !isEmpty(data.email) ? validator.trim(data.email) : ''
    data.password=!isEmpty(data.password)?validator.trim(data.password):''
    
    // isEmpty !isEmail
    if (validator.isEmpty(data.email)) {
      errors.email = "Email is required";
    } else if (!validator.isEmail(data.email)) {
      errors.email = "Email address is not valid";
    }

    // Password checks
    if (validator.isEmpty(data.password)) {
      errors.password = "Password is required";
    } else if (!validator.isStrongPassword(data.password, [{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, }])) {
      errors.password = "Password must be at least 8 characters, with min 1 lowercase, min 1 uppercase, 1 number and 1 symbol";
    }

    return {
        errors,
        isValid:isEmpty(errors)
    }
}