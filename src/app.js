const express = require('express')
const app = express();
const userRouter = require('./routes/users.routes')
const restorntRouter = require('./routes/restorent.routes')
const cookiesParser = require('cookie-parser')


//hum isi file me sare middleware and api ka prefix bnate he

app.use(express.json())
app.use(cookiesParser())


app.use('/users',userRouter)
app.use('/restorent',restorntRouter)




module.exports = app