require('dotenv').config()
const app = require('./src/app')
const connectToDb = require('./src/db/db')



connectToDb()

app.get('/',(req,res)=>{
    res.send("server started successfully")
})

const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log("server is started successfully")
})