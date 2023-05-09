const Borrower = require("../models/borrower");
const borrowerValidator = require("../validator/borrowerValidator");

//Add new borrower
exports.createBorrwerEntry = async (req, res) => {
  try {
    const { errors, isValid } = borrowerValidator(req.body);
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
      userId: req.user.id,
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
    res.status(500).json({
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
    res.status(500).json({
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
    res.status(500).json({
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
    res.status(500).json({
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

    const userId = req.user.id;
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

    let searchobject = { userId: userId, type: type };
    searchobject = searchByDebtorName
      ? {
          debtorName: { $regex: `^${searchByDebtorName}$`, $options: "i" },
          type: type,
        }
      : searchobject;

    const borrowers = await Borrower.find(searchobject)
      .sort(sortObject)
      .skip(+pageNum * +pageSize)
      .limit(+pageSize);
    const count = await Borrower.countDocuments(searchobject);
    res.status(200).json({ status: true, Debtor: borrowers, total: count });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Entry  List Failed, please try again later.",
    });
  }
};

exports.borrowerPayment = async (req, res) => {
  try {
    const _id = req.params.id;
    const { paidAmount } = req.body;
    const exisitingBorrower = await Borrower.findById(_id);
    if (!exisitingBorrower)
      return res
        .status(400)
        .json({ status: false, message: "Please Enter Valid id." });

    if (!paidAmount)
      return res
        .status(400)
        .json({ status: false, message: "Paid Amount is Required" });

    if (paidAmount > exisitingBorrower.totalAmount) {
      return res.status(400).json({
        status: false,
        message: "Paid Amount should be less then total amount",
      });
    }
    let isInstallment,
      isPaid = false;
    const isRemaining =
      exisitingBorrower.totalAmount - exisitingBorrower.paidAmount;
    if (
      exisitingBorrower.totalAmount == paidAmount ||
      isRemaining == paidAmount
    ) {
      isInstallment = false;
      isPaid = true;
    } else {
      isInstallment = true;
    }

    const paymentUpdate = {
      paidAmount: +exisitingBorrower.paidAmount + +paidAmount,
      isInstallment,
      isPaid,
      // totalAmount: exisitingBorrower.totalAmount - paidAmount,
    };
    await Borrower.findByIdAndUpdate(_id, paymentUpdate);
    res.status(200).json({ status: true, message: " Successfully Payment." });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Payment Failed, please try again later.",
    });
  }
};

exports.borrowerTotalPaid = async (req, res) => {
  try {
    let { type = "DEBT" } = req.query;

    const TotalState = await Borrower.aggregate([
      { $match: { type: type, userId: req.user.id } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
          totalPaidAmount: { $sum: "$paidAmount" },
          totalInterestAmount: { $sum: "$interestAmount" },
          averageInterestRate: { $avg: "$interestRate" },
          averageInterestAmount: { $avg: "$interestAmount" },
          paid: {
            $sum: {
              $cond: ["$isPaid", 1, 0],
            },
          },
          notPaid: {
            $sum: {
              $cond: ["$isPaid", 0, 1],
            },
          },
        },
      },
    ]);
    let state;
    if (TotalState.length > 0) {
      state = {
        totalAmount: TotalState[0].totalAmount.toFixed(2),
        totalPaidAmount: TotalState[0].totalPaidAmount.toFixed(2),
        totalInterestAmount: TotalState[0].totalInterestAmount.toFixed(2),
        totalDueAmount:
          TotalState[0].totalAmount.toFixed(2) -
          TotalState[0].totalPaidAmount.toFixed(2),
        averageInterestRate: `${TotalState[0].averageInterestRate.toFixed(
          2
        )} %`,
        averageInterestAmount: TotalState[0].averageInterestAmount.toFixed(2),
        paid: TotalState[0].paid,
        notPaid: TotalState[0].notPaid,
      };
    } else {
      return res.status(400).json({
        status: false,
        message: "Something went to wrong.please try again.",
      });
    }
    return res.status(200).json({
      status: true,
      message: "State is fetched successfully.",
      state: state,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Something went to wrong.please try again.",
    });
  }
};

exports.chartState = async (req, res) => {
  try {
    let { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({
        status: false,
        message: "Something went to wrong.please try again.",
      });
    }

    const chartState = await Borrower.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(start), $lte: new Date(end) },
          userId: req.user.id,
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            type: "$type",
          },
          totalAmount: { $sum: "$totalAmount" },
          averageAmount: { $avg: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.type",
          type: {
            $push: {
              totalAmount: "$totalAmount",
              averageAmount: "$averageAmount",
              count: "$count",
              date: "$_id.date",
            },
          },
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      message: `Chart data are successfully fetched between ${start} to ${end}.`,
      state: chartState,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({
      status: false,
      message: "Something went to wrong.please try again.",
    });
  }
};
