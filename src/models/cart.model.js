const mongoose = require('mongoose')


const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    products: [
        
        {
            _id:false,
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                
            },
            quantity: Number,
        }
    ],

    totalAmount: Number,

    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending"
    }

})


const cartsModel = mongoose.model('cartCollection', cartSchema)

module.exports = cartsModel