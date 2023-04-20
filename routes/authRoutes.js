const express = require("express");
const passport = require("passport");
const {
  signup,
  signin,
  forgotPassword,
} = require("../controller/authController");
const router = express.Router();

const api = process.env.API;

function isLoggedIn(req, res, next) {
  console.log('req._passport.session.user;', req._passport.session)
   console.log(`req.session in isloggedin: ${JSON.stringify(req.session)}`);
  console.log(`req.user in isloggedin: ${JSON.stringify(req.user)}`);
  req.user ? next() : res.sendStatus(401);
}
// =======================================================================================================
router.get(
 `${api}/google`,
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  `/auth/google/callback`,
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/",
    failureRedirect: "/login/failed",
  })
);

router.get("/logout", (req, res) => {
  req.logout();
});


router.get("/login/success",isLoggedIn, (req, res) => {
  console.log('req,user',req.user)
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      //   cookies: req.cookies
    });
    res.redirect('http://localhost:3000/');
  }
});

router.get('/login/failed',(req,res)=>res.status(401).json({success:false,message:"Something went to wrong.please try agian."}))


// =======================================================================================================
router.post(`${api}/signup`, signup);

router.post(`${api}/signin`, signin);

router.put(`${api}/forgot-password`, forgotPassword);

module.exports = router;
