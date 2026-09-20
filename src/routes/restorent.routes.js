const express = require('express')
const router = express.Router()
const authRestoMiddleware = require('../middleware/authRestorent.middleware')
const restorentController = require('../controllers/restorent.controller')


router.post('/products',authRestoMiddleware.authRestorent,restorentController.createproduct)
router.patch('/products/:id',authRestoMiddleware.authRestorent,restorentController.updateproduct)
router.delete('/products/:id',authRestoMiddleware.authRestorent,restorentController.deleteproduct)

router.get('/products',authRestoMiddleware.authRestorent,restorentController.getproduct)






module.exports = router