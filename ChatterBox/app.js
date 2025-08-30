const express=require('express');

const app=express();

const authRouter=require("./controllers/auth.controller.js");
const userRouter=require("./controllers/user.controller.js");
const chatRouter=require("./controllers/chat.controller.js");
const messageRouter=require('./controllers/message.controller.js');

app.use(express.json());

console.log("Auth router loaded");


app.use('/api/auth', authRouter);
app.use('/api/user',userRouter);
app.use('/api/chat',chatRouter);
app.use('/api/message',messageRouter);
module.exports=app;