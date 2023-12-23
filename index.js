const express = require('express')
const userRoute = require('./routes/user')
const todoRoute = require('./routes/todo')
const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.get('/', (req,res)=>
{
  res.json({sucess: true})
})

app.use('/user', userRoute)
app.use('/todo', todoRoute)

const port = 8080
app.listen (port, ()=>
{
    console.log(`server is running on http://localhost:${port}`)
})