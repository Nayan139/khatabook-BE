const express = require("express");
const passport=require('passport')
const {
  signup,
  signin,
  forgotPassword,
} = require("../controller/authController");
const router = express.Router();

const api = process.env.API;

router.get(`${api}/google`, passport.authenticate('google', { scope: ['email', 'profile'] }),(req,res)=> console.log('req',req))

router.get(`/auth/google/callback`, 
  passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        console.log()
    // Successful authentication, redirect home.
    res.redirect('/');
});

router.post(`${api}/signup`, signup);

router.post(`${api}/signin`, signin);

router.put(`${api}/forgot-password`, forgotPassword);

module.exports = router;
