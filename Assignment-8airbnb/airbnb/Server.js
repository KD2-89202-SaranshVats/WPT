const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const result = require('./utils/result')
const Config = require('./Config/Config')
const userRouter = require('./routes/User')
const propertyRouter = require('./routes/Property')
const bookingRouter = require('./routes/Booking')
const categoryRouter = require('./routes/Category')
const app = express()


app.use(cors())

app.use(express.json())

app.use((request,response,next)=>{
    if(
        request.url == '/user/login' ||
        request.url == '/user/registration' ||
        request.url.startsWith('/image/')
    ){
        next()
    }
    else{
        const token = request.headers.token
        if(token){
            try{
                const payload = jwt.verify(token,Config.secret)
                request.headers.id = payload.id
                next()
            }
            catch(error){
                response.send(result.createErrorResult('Token is invalid'))
            }
        }
        else{
            response.send(result.createErrorResult('Token is missing'))
        }
    }
})

app.use('/user',userRouter)
app.use('/property',propertyRouter)
app.use('/category',categoryRouter)
app.use('/',bookingRouter)


app.listen(4000,'localhost',()=>{
    console.log("Server started at port 4000")
})