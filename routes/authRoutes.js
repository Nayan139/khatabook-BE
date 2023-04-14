const express = require('express')
const { signup, login } = require('../controller/authController')
const router = express.Router()

const api = process.env.API

router.post(`${api}/signup`, signup)

router.post(`${api}/login`,login)

module.exports=router