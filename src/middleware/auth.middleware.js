const jwt = require('jsonwebtoken')


async function authUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "unauthrized User"
        })
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        // if(user.role!='user'){
        //     return res.status(403).json({
        //         message:"you dont have permission"
        //     })
        // }

        req.user = user;
        next()

    } catch (error) {

        return res.status(401).json({
            message: "unauthrized User"
        })
    }

}

module.exports={authUser}
