const  jwt = require("jsonwebtoken")

const AuthMiddleware = (req,res,next) => {
    const SECRET=process.env.SECRET
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.replace("Bearer ", "");
        console.log('token is ',token)
        if (token==null) return res.status(403).json({ "status": false, message: "Access denied" })
        jwt.verify(token, SECRET, (err, user) => {
            console.log(err)
            console.log('user',user)
            if (err) res.sendStatus(403)
            req.user = user
            next()
        })
    } catch (error) {
        res.status(400).json({"status":false,message:"Invalid token"})
    }
}

module.exports=AuthMiddleware