const express = require('express')
const router = express.Router()
const userController = require('../controllers/users.controller')
const authMiddleware= require('../middleware/auth.middleware')
const authUserMiddleware = require('../middleware/authUser.middleware')


router.post('/register',userController.registerUser)
router.post('/login',userController.loginUser)
router.post('/logout',userController.logoutUser)

router.patch('/address',authMiddleware.authUser,userController.updateAddress)
router.patch('/password',authMiddleware.authUser,userController.updatePassword)

router.get('/',authMiddleware.authUser,userController.getProducts)


router.post('/cart/:id',authUserMiddleware.authUser,userController.addToCartCollection)
router.get('/cart/:id',authUserMiddleware.authUser,userController.removeToCartCollection)

router.get('/cart',authUserMiddleware.authUser,userController.cartCollection)




module.exports = router