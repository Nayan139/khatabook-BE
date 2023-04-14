const jwt = require("jsonwebtoken");
const bcrypt=require('bcrypt')
const User = require("../models/users");
const signupValidator = require("../validator/signupValidator");
const loginValidator = require("../validator/loginValidator");
const HttpError = require("../models/http-error");

exports.signup = async(req,res) => {
    try {
        const { errors, isValid } = signupValidator(req.body)
        
        //check validation
        if (!isValid) {
            return res.status(400).json({ status: false, message: { errors } });
        }

        const { firstname, lastname, email, password, mobileno } = req.body
        let isExisiting;
        try {
            isExisiting = await User.findOne({ $or: [{ email },{ mobileno }] })
        } catch (error) {
          return res.status(500).json({ status: false, message: "Signing up failed, please try again later." });          
        }

        if (isExisiting) {
            return res.status(422).json({
                "status": false,
                "message": {
                  "errors": {
                    "email": "User exists already, please login instead."
                  }
                }
            });
        }

        let hashedPassword;
        try {
          hashedPassword = await bcrypt.hash(password, 12);
        } catch (err) {
          return res.status(500).json({ status: false, message: "Could not create user, please try again." });
        }

        const createdUser = new User({
            firstname,
            lastname,
            email,
            mobileno,
            password:hashedPassword,
        })


        try {
            await createdUser.save()
        } catch (error) {
            return res.status(500).json({ status: false, message: "Signup failed, please try again." });
        }
        // created token
        let token;
        token = jwt.sign({
            id: createdUser._id,
            name: `${createdUser.firstname} ${createdUser.lastname}`,
            email:createdUser.email
        },
        process.env.SECRET,
        {
            expiresIn:process.env.EXPIRE_TOKEN
        })

        res.status(201).json({ status: true, token: "Bearer " + token, userInfo: createdUser });
    } catch (error) {
        console.log('error-signup',error)
        res.status(500).json({ status: false, message: "Signing up failed, please try again later." });   
    }
}

exports.signin = async (req, res, next) => {
    try {
        const {errors,isValid}=loginValidator(req.body)
        const { email, password } = req.body    
        if (!isValid) {
            return res.status(400).json({ status: false, message: { errors } });
        }
        const isExisiting = await User.findOne({ email })
        if (!isExisiting) {
            const error = new HttpError('Login Failed, Please check your email address.', 422);
            next(error)
        }
        const isValidatePassword =await bcrypt.compare(password, isExisiting.password)
        if (!isValidatePassword) {
            const error = new HttpError('Logining in Failed, Please check your password.', 422);
            return next(error);
        }
        // created token
        let token;
        token = jwt.sign({
            id: isExisiting._id,
            name: `${isExisiting.firstname} ${isExisiting.lastname}`,
            email:isExisiting.email
        },
        process.env.SECRET,
        {
            expiresIn:process.env.EXPIRE_TOKEN
        })
         res.json({ success: true, token: "Bearer " + token, userInfo: isExisiting });
    } catch (error) {
        console.log('error login',error)
        const errors = new HttpError('Logging in failed, please try again later.', 500);
        return next(errors);
    }
        
}

exports.forgotPassword = async (req, res, next) => {
    try {
        const {errors,isValid}=loginValidator(req.body)
        const { email, password } = req.body    
        if (!isValid) {
            return res.status(400).json({ status: false, message: { errors } });
        }
        
        const isExisiting = await User.findOne({ email })
        if (!isExisiting) {
            const error = new HttpError('Forgot Password Failed, Please check your email address.', 422);
            next(error)
         }
        
        const isValidatePassword = await bcrypt.compare(password, isExisiting.password)
        if (isValidatePassword) {
            const error = new HttpError('New Password should be different from previous password.', 422);
            return next(error);
        }
        let hashedPassword;
        try {
          hashedPassword = await bcrypt.hash(password, 12);
        } catch (err) {
          return res.status(500).json({ status: false, message: "Could not update password, please try again." });
        }
        const isUpdated = await User.findOneAndUpdate(email, { password: hashedPassword })
        if (isUpdated) {
            res.json({ success: true, message:"Password updated" });
        }
    } catch (error) {
        console.log('error',error)
    }
}