const userModel = require('../models/users.models')
const productModel = require('../models/products.model')
const cartModel = require('../models/cart.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { populate } = require('dotenv')


async function registerUser(req, res) {

    const { fullname, email, username, phonenumber, password, address, role = "user" } = req.body

    const isAlreadyExist = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if (isAlreadyExist) {
        return res.status(409).json({
            message: "User is already exist"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    try {

        const user = await userModel.create({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            username,
            email,
            phonenumber,
            address,
            password: hash,
            role
        })

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET)
        res.cookie('token', token)

        return res.status(201).json({
            message: "user is create successfully",
            user: {
                fullname: user.fullname,
                username: user.username,
                phonenumber: user.phonenumber,
                address: user.address,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {

        console.log(error)

    }
}

async function loginUser(req, res) {
    const { email, username, password } = req.body

    const user = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    }).select("+password")

    if (!user) {
        return res.status(401).json({
            message: "invalid credencial "
        })
    }

    try {
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(409).json({
                message: "invalid credencial "
            })
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET)
        res.cookie('token', token)

        return res.status(200).json({
            message: "User logedin successfully",
            user: {
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                phonenumber: user.phonenumber,
                address: user.address,
                role: user.role
            }
        })


    } catch (error) {
        console.log(error)
    }
}

async function logoutUser(req, res) {
    res.clearCookie('token')
    res.status(200).json({
        message: "loggedout successfully"
    })
}

async function updateAddress(req, res) {

    const { address } = req.body

    const user = await userModel.findOneAndUpdate({ _id: req.user.id }, { address: address }, { returnDocument: "after" })

    if (!user) {
        return res.status(400).json({
            message: "User not found"
        })
    }

    return res.status(200).json({
        message: "User Updated successfully",
        user
    })
}

async function updatePassword(req, res) {

    const { password } = req.body
    const hash = await bcrypt.hash(password, 10)
    const user = await userModel.findOneAndUpdate({ _id: req.user.id }, { password: hash }, { returnDocument: 'after' })

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    return res.status(200).json({
        message: "Password is Updated successfully",
        user
    })

}

async function getProducts(req, res) {

    const allProducts = await productModel.find();
    if (!allProducts) {
        return res.status(404).json({
            message: "No products is found"
        })
    }

    return res.status(200).json({
        message: "All Products is here",
        allProducts
    })


}

async function addToCartCollection(req, res) {

    const productId = req.params.id;
    const { quantity, status } = req.body


    const cart = await cartModel.findOne({ user: req.user.id })

    console.log(cart)

    if (!cart) {
        //cart creat ka code 
        const addToCArt = await cartModel.create({

            user: req.user.id,
            products: [
                {
                    product: productId,
                    quantity: quantity,
                },
            ],
            totalAmount: 0, // when we create a user and user can add something tere is an issu
            status: status
        })

        return res.status(201).json({
            message: "all cart product is here",
            addToCArt
        })
    }

    const existingProduct = cart.products.find(
        item => item.product.toString() === productId
    )
    if (existingProduct) {
        return res.status(200).json({
            message: "Product is already exist"
        })
    }

    cart.products.push({
        product: productId,
        quantity: quantity,
    })

    await cart.save()


    const populateCart = await cart.populate('products.product')
  
    const totalAmount = populateCart.products.reduce((sum,value)=>{
        return sum + value.product.price
    },0)

    cart.totalAmount = totalAmount

    await cart.save()


    return res.status(200).json({
        message: "Product is added successfully",
        cart
    })
}

async function removeToCartCollection(req, res) {

    const productId = req.params.id
    const userCart = await cartModel.findOne({ user: req.user.id })

    if (!userCart) {
        return res.status(404).json({
            message: "Cart not found"
        });
    }

    const products = userCart.products.filter((element) => {
        return element.product._id.toString() !== productId
    })

    if (products.length === userCart.products.length) {
        return res.status(404).json({
            message: "Product not found in cart"
        });
    }

    userCart.products = products  // replace the products db array into new filter product array 

    await userCart.save()


    const popu = await userCart.populate('products.product')
    const totalAmount = popu.products.reduce((sum,value)=>{
        return sum + value.product.price
    },0)

   userCart.totalAmount = totalAmount
   await userCart.save()

    return res.status(200).json({
        message: "Product is deleted successfully",
        userCart
    })
}

async function cartCollection(req, res) {

    const allProducts = await cartModel
        .findOne({ user: req.user.id })
        .populate('products.product', 'name description price')


    if (!allProducts) {
        return res.status(404).json({
            message: "Products not found"
        })
    }

    return res.status(200).json({
        message: "All Product is here",
        allProducts
    })
}




module.exports = { registerUser, loginUser, logoutUser, updateAddress, updatePassword, getProducts, addToCartCollection, cartCollection, removeToCartCollection }