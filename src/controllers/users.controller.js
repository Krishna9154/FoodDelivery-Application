const userModel = require('../models/users.models')
const productModel = require('../models/products.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


async function registerUser(req, res) {

    const { fullname, email, username,phonenumber, password, address, role = "user" } = req.body

        const isAlreadyExist =await userModel.findOne({
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
                phonenumber:user.phonenumber,
                address:user.address,
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

        if(!isMatch){
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
                phonenumber:user.phonenumber,
                address:user.address,
                role: user.role
            }
        })


    } catch (error) {
        console.log(error)
    }
}

async function logoutUser(req,res){
    res.clearCookie('token')
    res.status(200).json({
        message:"loggedout successfully"
    })
}

async function updateAddress(req,res){

    const {address}=req.body
    
    const user = await userModel.findOneAndUpdate({_id:req.user.id},{address:address},{ returnDocument: "after" })

    if(!user){
        return res.status(400).json({
            message:"User not found"
        })
    }

    return res.status(200).json({
        message:"User Updated successfully",
        user
    })
}

async function updatePassword(req,res){

    const {password} = req.body
    const hash = await bcrypt.hash(password,10)
    const user = await userModel.findOneAndUpdate({_id:req.user.id},{password:hash},{returnDocument:'after'})

    if(!user){
        return res.status(404).json({
            message:"User not found"
        })
    }

    return res.status(200).json({
        message:"Password is Updated successfully",
        user
    })

}

async function getProducts(req,res){

    const allProducts = await productModel.find();
    if(!allProducts){
        return res.status(404).json({
            message:"No products is found"
        })
    }

    return res.status(200).json({
        message:"All Products is here",
        allProducts
    })


}

module.exports = { registerUser, loginUser ,logoutUser,updateAddress, updatePassword,getProducts}