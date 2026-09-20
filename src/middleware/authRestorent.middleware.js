const jwt = require("jsonwebtoken")


async function authRestorent(req,res,next){
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            message:"unauthorized user"
        })
    }

    const user = jwt.verify(token,process.env.JWT_SECRET)
    if(!user){
        return res.status(404).json({
            message:"user not found"
        })
    }

    if(user.role!=='restorent'){
        return res.status(403).json({
            message:"you dont have permission"
        })
    }

    req.user = user
    next()
}

module.exports = {authRestorent}