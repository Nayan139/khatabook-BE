const Borrower = require("../models/borrower")
const borrowerValidator = require("../validator/borrowerValidator")

//Add new borrower
exports.createBorrwerEntry =async (req,res) => {
    try {
        const { errors, isValid } = borrowerValidator(req.body)
        if (!isValid) return res.status(400).json({ "status": false, message: { errors } })

        const { borrowerName, moneyLenderName, paymentMode, paymentApplication, paybackDate, payDate,interestRate, principalAmount, isInterest, isWhatsapp, borrowerNumber } = req.body
        
        let interestAmount = 0
        if (isInterest) {
            interestAmount= (+principalAmount) * (+interestRate)/100
        }
        const borrowerData = new Borrower({
            borrowerName,
            moneyLenderName,
            paymentMode,
            paymentApplication,
            paybackDate,
            payDate,
            isWhatsapp,
            borrowerNumber, 
            interestAmount,
            principalAmount,
            isInterest,
            interestRate,
            totalAmount: +principalAmount + interestAmount
        })
         
        await borrowerData.save()
        res.status(201).json({status:true,BorrowerInfo:borrowerData})
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ status: false, message: "Create Borrower Entry Failed, please try again later." });   
    }
}

//update borrower
exports.updateBorrowerEntry = async (req, res) => {
    try {
        const { errors, isValid } = borrowerValidator(req.body)
        if (!isValid) return res.status(400).json({ "status": false, message: { errors } })

        const _id = req.params.id;
        const exisitingBorrower = await Borrower.findById(_id)
        if(!exisitingBorrower) return res.status(400).json({ "status": false, message: "Please Enter Valid Borrower id." })

        const { borrowerName, moneyLenderName, paymentMode, paymentApplication, paybackDate, payDate,interestRate, principalAmount, isInterest, isWhatsapp, borrowerNumber } = req.body
        
        let interestAmount = 0
        if (isInterest) {
            interestAmount= (+principalAmount) * (+interestRate)/100
        }
        const borrowerData = {
            borrowerName,
            moneyLenderName,
            paymentMode,
            paymentApplication,
            paybackDate,
            payDate,
            isWhatsapp,
            borrowerNumber, 
            interestAmount,
            principalAmount,
            isInterest,
            interestRate,
            totalAmount: +principalAmount + interestAmount
        }
        
        await Borrower.findByIdAndUpdate(_id, borrowerData)
        const updatedBorrower = await Borrower.findById(_id)
        res.status(200).json({status:true,BorrowerInfo:updatedBorrower})
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ status: false, message: "Update Borrower Entry Failed, please try again later." });   
    }
}
 
//delete borrower
exports.deleteBorrowerEntry = async (req, res) => {
    try {
        const _id = req.params.id;
        const exisitingBorrower = await Borrower.findById(_id)
        if (!exisitingBorrower) return res.status(400).json({ "status": false, message: "Please Enter Valid Borrower id." })
        
        await Borrower.findByIdAndDelete(_id)
        res.status(200).json({status:true,message:`Borrower delete with ${_id} id.`})
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ status: false, message: "Delete Borrower Entry Failed, please try again later." });   
    }
}

//ID by borrower
exports.IdByBorrowerEntry = async (req, res) => {
    try {
        const _id = req.params.id;
        const exisitingBorrower = await Borrower.findById(_id)
        if (!exisitingBorrower) return res.status(400).json({ "status": false, message: "Please Enter Valid Borrower id." })
        
        res.status(200).json({status:true,BorrowerInfo:exisitingBorrower})
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ status: false, message: "ID by Borrower Failed, please try again later." });   
    }
}

//borrower list
exports.borrowerList = async (req, res) => {
    try {
        let { pageNum, pageSize, sortOrder ,sortBy, searchByBorrowerName  } = req.query;
        if (!pageNum) pageNum = 0;
        if (!pageSize) pageSize = 10;
        if (!sortOrder) sortOrder = {}
        console.log('pageNum, pageSize, sortObject , search', pageNum, pageSize, sortOrder, searchByBorrowerName)
        
        let sort_by;
        let sort_order;
        if (sortBy === "borrowerName" && sortOrder === "asc") {
          sort_by = "borrowerName";
          sort_order = 1;
        } else if (sortBy === "borrowerName" && sortOrder === "desc") {
          sort_by = "borrowerName";
          sort_order = -1;
        } else if (sortBy === "payDate" && sortOrder === "asc") {
          sort_by = "payDate";
          sort_order = 1;
        } else if (sortBy === "payDate" && sortOrder === "desc") {
          sort_by = "payDate";
          sort_order = -1;
        }else if (sortBy === "paybackDate" && sortOrder === "asc") {
          sort_by = "paybackDate";
          sort_order = 1;
        } else if (sortBy === "paybackDate" && sortOrder === "desc") {
          sort_by = "paybackDate";
          sort_order = -1;
        } else if (sortBy === "isPaid" && sortOrder === "asc") {
          sort_by = "isPaid";
          sort_order = 1;
        } else if (sortBy === "isPaid" && sortOrder === "desc") {
          sort_by = "isPaid";
          sort_order = -1;
        } 
        else {
          sort_by = "createdAt";
          sort_order = -1;
        }
    
        let sortObject = {};
        sortObject[sort_by] = sort_order;

        let searchobject=searchByBorrowerName?{"borrowerName":searchByBorrowerName}:{}

        const borrowers = await Borrower.find(searchobject).sort(sortObject).skip((+pageNum) * (+pageSize)).limit(+pageSize)
        
        res.status(200).json({status:true,Borrowers:borrowers})
    } catch (error) {
        res.status(500).json({ status: false, message: "Borrower List Failed, please try again later." });   
    }
}

