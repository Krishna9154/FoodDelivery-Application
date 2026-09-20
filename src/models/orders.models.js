const mongoose = require('mongoose')


const ordersSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: Number
        }
    ],

    totalAmount: Number,

    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending"
    }

})


const ordersModel = mongoose.model('orders', ordersSchema)

module.exports = ordersModel