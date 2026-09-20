const productModel = require('../models/products.model')



async function createproduct(req,res){

    const{name,description,price,image,category,isAvailable} = req.body

    const product = await productModel.create({
        name,
        description,
        price,
        image,
        category, 
        isAvailable
    })

    return res.status(201).json({
        message:"product is created successfully",
        product
    })

}

async function updateproduct(req,res){

    const updateProduct = await productModel.findByIdAndUpdate({_id:req.params.id},req.body,{returnDocument: "after"})

    return res.status(200).json({
        message:"Products is Updated Successfully",
        updateProduct
    })

}

async function deleteproduct(req,res){

    const productId = req.params.id

    const product = await productModel.findOneAndDelete({_id:productId})

    return res.status(200).json({
        message:"product delete successfully",
        product
    })

}



module.exports = {createproduct,updateproduct,deleteproduct}