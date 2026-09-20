const mongoose = require('mongoose')

//ye sab async cheez hoti pta nhi kitni der me server connect ho to hum async fun bna ke connect karte


async function connectToDb(){
   await mongoose.connect(process.env.DB_URI)
   console.log("DB is connect successfully")
}

module.exports = connectToDb