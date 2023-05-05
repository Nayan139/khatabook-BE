const express = require('express')
const AuthMiddleware = require('../helper/AuthMiddleware')
const { createBorrwerEntry, updateBorrowerEntry, deleteBorrowerEntry, IdByBorrowerEntry, borrowerList, borrowerPayment } = require('../controller/borrowerController')
const router = express.Router()

const api = process.env.API

router.post(`${api}/create/borrower`, AuthMiddleware, createBorrwerEntry)

router.put(`${api}/update/borrower/:id`, AuthMiddleware, updateBorrowerEntry)

router.delete(`${api}/delete/borrower/:id`, AuthMiddleware, deleteBorrowerEntry)

router.get(`${api}/borrower/id/:id`, AuthMiddleware, IdByBorrowerEntry)

router.get(`${api}/borrower/list`, AuthMiddleware, borrowerList)

router.put(`${api}/borrower/paid/:id`,AuthMiddleware,borrowerPayment)

module.exports=router