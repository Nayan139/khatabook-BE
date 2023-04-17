const validator = require('validator')
const isEmpty = require('is-empty')
const moment = require('moment')

module.exports = function borroweValidator(data) {
    let errors = {}
    const mobileRegex= /^[6-9]\d{9}$/gi;

    data.borrowerName = !isEmpty(data.borrowerName) ? validator.trim(data.borrowerName) : ''
    data.moneyLenderName = !isEmpty(data.moneyLenderName) ? validator.trim(data.moneyLenderName) : ''
    data.paymentMode = !isEmpty(data.paymentMode) ? validator.trim(data.paymentMode):''
    data.paybackDate = !isEmpty(data.paybackDate) ? validator.trim(data.paybackDate) : ''
    data.payDate=!isEmpty(data.payDate) ? validator.trim(data.payDate) : ''
    data.principalAmount = !isEmpty(data.principalAmount) ? validator.trim(data.principalAmount) : ''
    data.borrowerNumber = !isEmpty(data.borrowerNumber) ? validator.trim(data.borrowerNumber) : ''
    data.interestRate = !isEmpty(data.interestRate) ? validator.trim(data.interestRate) : ''
    

    if (validator.isEmpty(data.borrowerName)) {
        errors.borrowerName="Borrower name is required"
    }

    if (validator.isEmpty(data.moneyLenderName)) {
        errors.moneyLenderName="Money lender name is required"
    }

    if (validator.isEmpty(data.paymentMode)) {
        errors.paymentMode="Payment mode is required"
    } else if (!['CASH', 'UPI', 'NET BANKING'].includes(data.paymentMode)) {
        errors.paymentMode="Payment mode must be CASH ,UPI ,NET BANKING"
    }

    if (validator.isEmpty(data.payDate)) {
        errors.payDate="Pay date is required"
    }

    if (validator.isEmpty(data.paybackDate)) {
        errors.paybackDate="Pay back date is required"
    }else if(moment(data.paybackDate).utc().format("YYYY-MM-DD HH:mm:ss") < moment(data.payDate).utc().format("YYYY-MM-DD HH:mm:ss")){
        errors.paybackDate = "Pay back date could be after Pay date.";
    }

    if (validator.isEmpty(data.principalAmount)) {
        errors.principalAmount="Principal amount is required"
    }

    if (validator.isEmpty(data.borrowerNumber)) {
        errors.borrowerNumber="Borrower number is required"
    } else if (!mobileRegex.test(data.borrowerNumber)) {
        errors.borrowerNumber = "Mobile number is not valid";
    }

    if (data.isInterest) {
        if (validator.isEmpty(data.interestRate)) {
            errors.interestRate="Interest Rate is required"
        }
    }
    
    return {
        errors,
        isValid:isEmpty(errors)
    }
}