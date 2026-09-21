const jwt = require("jsonwebtoken")

async function authUser(req, res, next) {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized user"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role !== 'user') {
            return res.status(403).json({
                message: "you dont have permission"
            })
        }

        req.user = decoded
        next()

    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized user"
        })
    }

}

module.exports ={authUser}