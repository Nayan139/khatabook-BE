const express = require('express')
const { signup, signin, forgotPassword } = require('../controller/authController')
const router = express.Router()

const api = process.env.API

router.post(`${api}/signup`, signup)

router.post(`${api}/signin`, signin)

router.put(`${api}/forgot-password`,forgotPassword)

module.exports=router