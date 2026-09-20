const productModel = require('../models/products.model')



async function createproduct(req,res){

    const{name,description,price,image,category,isAvailable} = req.body

    const product = await productModel.create({
        name,
        description,
        price,
        image,
        category, 
        isAvailable,
        restorent:req.user.id
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

async function deleteproduct(req,res){ //yha me check karuga restro owner id jo store he product me and jo restro logged in he uski id dono match he agar match he to delete karne duga 

    const productId = req.params.id

    const product = await productModel.findById(productId)
    if(!product){
        return res.status(404).json({
            message:"product is not found"
        })
    }

    if(product.restorent.toString()!==req.user.id){ // is condition se dusra restaurant wala kisi dure restaurant ke products delete nhi kar sakta 
        return res.status(404).json({
            message:"Can't delete other restaurant's products"
        }) 
    }

    const deletedproduct = await productModel.findOneAndDelete({_id:productId})

    return res.status(200).json({
        message:"product delete successfully",
        deletedproduct
    })

}

async function getproduct(req,res){

    const products = await productModel.find({restorent:req.user.id})

    if(!products){
        return res.status(404).json({
            message:"products not found"
        })
    }
    return res.status(200).json({
        message:"Your All Product is here",
        products
    })
}



module.exports = {createproduct,updateproduct,deleteproduct,getproduct}