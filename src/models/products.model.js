const mongoose = require('mongoose')


const productsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    price: {
        type: Number,
        required: true
    },

    image: {
        type: String
    },

    category: {
        type: String,
        required: true
    },

    isAvailable: {
        type: Boolean,
        default: true
    }

})


const productsModel = mongoose.model('products', productsSchema)

module.exports = productsModel