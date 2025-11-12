const express=require('express');
const rateLimit = require('express-rate-limit');

const cors=require('cors');


const authRouter=require("./controllers/auth.controller.js");
const userRouter=require("./controllers/user.controller.js");
const chatRouter=require("./controllers/chat.controller.js");
const messageRouter=require('./controllers/message.controller.js');

const { Socket } = require('socket.io');

const app=express();

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(express.json({
    limit:'50mb'// to handle large size data

}));

app.use(cors());

const server=require('http').createServer(app);

const io=require('socket.io')(server,{cors:{
    origin:'http://localhost:3000',
    methods:['Get','Post']
}});


app.use('/api/', apiLimiter);
app.use('/api/auth', authRouter);
app.use('/api/user',userRouter);
app.use('/api/chat',chatRouter);
app.use('/api/message',messageRouter);

//test scoket connection from client

const onlineUsers=[];
io.on('connection',Socket=>{

    Socket.on('join-room', userid =>{
        Socket.join(userid);
    })
    Socket.on('send-message',(message)=>{
        io
        .to(message.members[0])
        .to(message.members[1])
        .emit('receive-message',message)
    })

    Socket.on('clear-unread-message',data=>{
        io.to(data.members[0]).to(data.members[1]).emit('message-count-clear',data)
    })

    Socket.on('user-typing',data=>{
        io.to(data.members[0]).to(data.members[1]).emit('user-typing-response',data);
    })

    Socket.on('user-login',userId=>{
        if(!onlineUsers.includes(userId)){
            onlineUsers.push(userId);
        }
        Socket.emit('online-users',onlineUsers);
    })

    Socket.on('user-offline',userId=>{
        onlineUsers.slice(onlineUsers.indexOf(userId),1);
        io.emit('updated-online-users',onlineUsers);
    })
})

module.exports=server;