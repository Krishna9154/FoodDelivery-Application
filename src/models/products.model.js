const mongoose = require('mongoose')


const productsSchema = mongoose.Schema({

    restorent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        require:true
    },

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