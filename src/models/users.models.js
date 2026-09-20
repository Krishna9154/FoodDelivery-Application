const mongoose =require("mongoose")


const userSchema = mongoose.Schema({

    fullname:{
        firstname:{
            type:String,
            require:true
        },
        lastname:{
            type:String
        }
    },

    username:{
        type:String,
        require:true,
        unique:true
    },

    phonenumber:{
        type:Number,
        require:true
    },

    email:{
        type:String,
        require:true,
        unique:true
    },

    address:{
        type:String
    },

    password:{
        type:String,
        select:false
    },

    role:{
        type:String,
        enum:['user','admin', 'restorent']
    }

})

const userModel = mongoose.model('user',userSchema)
module.exports = userModel