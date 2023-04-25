const mongoose = require('mongoose')
const Schema = mongoose.Schema

const borrowerSchema = new Schema({
    debtorName: {
        type: String,
        trim: true,
        required:true
    },
    creditorName: {
        type: String,
        trim: true,
        required:true
    },
    paymentMode: {
        type: String,
        enum:['CASH','UPI','NET BANKING']
    },
    paymentApplication: {
        type:Object
    },
    paybackDate: {
        type: Date,
        required:true
    },
    payDate: {
        type:Date,
        default: Date.now 
    },
    principalAmount: {
        type: String,
        required:true
    },
    isInterest: {
        type: Boolean,
        default: false
    },
    interestRate: {
        type: String,
        default:null
    },
    interestAmount: {
        type: String,
        default:null
    },
    totalAmount: {
        type: String,
        default:null
    },
    isWhatsapp: {
        type: Boolean,
        default:false
    },
    debtorNumber: {
        type: String,
        required:true
    },
    isPaid: {
        type: Boolean,
        default:false
    },
    type: {
        type:String
    }

},{
    timestamps:true
})

const Borrower = mongoose.model("Borrower", borrowerSchema)
module.exports=Borrower