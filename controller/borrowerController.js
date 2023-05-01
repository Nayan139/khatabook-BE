const Borrower = require("../models/borrower");
const borrowerValidator = require("../validator/borrowerValidator");

//Add new borrower
exports.createBorrwerEntry = async (req, res) => {
  try {
    const { errors, isValid } = borrowerValidator(req.body);
    console.log('req.user----------------------->',req.user)
    if (!isValid)
      return res.status(400).json({ status: false, message: { errors } });

    const {
      debtorName,
      creditorName,
      paymentMode,
      paymentApplication,
      type,
      paybackDate,
      payDate,
      interestRate,
      principalAmount,
      isInterest,
      isWhatsapp,
      contactNumber,
    } = req.body;

    let interestAmount = 0;
    if (isInterest) {
      interestAmount = (+principalAmount * +interestRate) / 100;
    }
    const borrowerData = new Borrower({
      userId:req.user.id,
      debtorName,
      creditorName,
      paymentMode,
      paymentApplication,
      paybackDate,
      payDate,
      isWhatsapp,
      contactNumber,
      interestAmount,
      principalAmount,
      isInterest,
      interestRate,
      type,
      totalAmount: +principalAmount + interestAmount,
    });

    await borrowerData.save();
    res
      .status(201)
      .json({ status: true, message: "Successfully Created New Entry." });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({
        status: false,
        message: "Create Entry Failed, please try again later.",
      });
  }
};

//update borrower
exports.updateBorrowerEntry = async (req, res) => {
  try {
    const { errors, isValid } = borrowerValidator(req.body);
    if (!isValid)
      return res.status(400).json({ status: false, message: { errors } });

    const _id = req.params.id;
    const exisitingBorrower = await Borrower.findById(_id);
    if (!exisitingBorrower)
      return res
        .status(400)
        .json({ status: false, message: "Please Enter Valid id." });

    const {
      debtorName,
      creditorName,
      type,
      paymentMode,
      paymentApplication,
      paybackDate,
      payDate,
      interestRate,
      principalAmount,
      isInterest,
      isWhatsapp,
      contactNumber,
    } = req.body;

    let interestAmount = 0;
    if (isInterest) {
      interestAmount = (+principalAmount * +interestRate) / 100;
    }
    const borrowerData = {
      debtorName,
      creditorName,
      paymentMode,
      paymentApplication,
      paybackDate,
      payDate,
      isWhatsapp,
      contactNumber,
      interestAmount,
      principalAmount,
      isInterest,
      interestRate,
      type,
      totalAmount: +principalAmount + interestAmount,
    };

    await Borrower.findByIdAndUpdate(_id, borrowerData);
    const updatedBorrower = await Borrower.findById(_id);
    res
      .status(200)
      .json({ status: true, message: " Successfully Update Entry." });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({
        status: false,
        message: "Update Entry Failed, please try again later.",
      });
  }
};

//delete borrower
exports.deleteBorrowerEntry = async (req, res) => {
  try {
    const _id = req.params.id;
    const exisitingBorrower = await Borrower.findById(_id);
    if (!exisitingBorrower)
      return res
        .status(400)
        .json({ status: false, message: "Please Enter Valid id." });

    await Borrower.findByIdAndDelete(_id);
    res
      .status(200)
      .json({ status: true, message: `Successfully delete with ${_id} id.` });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({
        status: false,
        message: "Delete Entry Failed, please try again later.",
      });
  }
};

//ID by borrower
exports.IdByBorrowerEntry = async (req, res) => {
  try {
    const _id = req.params.id;
    const exisitingBorrower = await Borrower.findById(_id);
    if (!exisitingBorrower)
      return res
        .status(400)
        .json({ status: false, message: "Please Enter Valid id." });

    res.status(200).json({ status: true, DebtorInfo: exisitingBorrower });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({
        status: false,
        message: "ID by Entry Failed, please try again later.",
      });
  }
};

//borrower list
exports.borrowerList = async (req, res) => {
  try {
    let { pageNum, pageSize, sortOrder, sortBy, searchByDebtorName, type } =
      req.query;
    if (!pageNum) pageNum = 0;
    if (!pageSize) pageSize = 10;
    if (!sortOrder) sortOrder = {};

    const userId=req.user.id
    let sort_by;
    let sort_order;
    if (sortBy === "debtorName" && sortOrder === "asc") {
      sort_by = "debtorName";
      sort_order = 1;
    } else if (sortBy === "debtorName" && sortOrder === "desc") {
      sort_by = "debtorName";
      sort_order = -1;
    } else if (sortBy === "payDate" && sortOrder === "asc") {
      sort_by = "payDate";
      sort_order = 1;
    } else if (sortBy === "payDate" && sortOrder === "desc") {
      sort_by = "payDate";
      sort_order = -1;
    } else if (sortBy === "paybackDate" && sortOrder === "asc") {
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
    } else {
      sort_by = "createdAt";
      sort_order = -1;
    }

    let sortObject = {};
    sortObject[sort_by] = sort_order;

    let searchobject = { userId:userId,type: type };
    searchobject = searchByDebtorName
      ? { debtorName: {'$regex': `^${searchByDebtorName}$`, $options: 'i'}, type: type }
      : searchobject;

    const borrowers = await Borrower.find(searchobject)
      .sort(sortObject)
      .skip(+pageNum * +pageSize)
      .limit(+pageSize);
    const count = await Borrower.countDocuments(searchobject);
    res.status(200).json({ status: true, Debtor: borrowers, total: count });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "Entry  List Failed, please try again later.",
      });
  }
};
