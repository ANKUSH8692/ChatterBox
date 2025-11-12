const router=require("express").Router();
const chat_model =require("./../models/chat.js");
const Message =require('./../models/message.js');
const authMiddleware =require("../middlewares/auth.middleware.js");
const message = require("./../models/message.js");

router.post('/create-new-chat',authMiddleware,async(req,res)=>{
    try{
        const chat=new chat_model(req.body);
        const save_chat=await chat.save();

        res.status(201).send({
            message:"chat created successfully",
            success:true,
            data:save_chat
        });

    }catch(err){
        res.status(400).send({
            message:"Not",
            success:false
        })
    }
});

router.get('/get-all-chats',authMiddleware,async(req,res)=>{
    try{
        const All_chats=await chat_model.find({members:{$in:req.user.id}})
                                        .populate("members")
                                        .populate("lastMessage")
                                        .sort({updatedAt:-1});

        res.status(200).send({
            message:"chat fetched successfully",
            success:true,
            data:All_chats
        });

    }catch(err){
        res.status(400).send({
            message:err.message,
            success:false
        })
    }
});

router.post('/clear_unread_msg',authMiddleware,async(req,res)=>{
    try{
        const chatId=req.body.chatId;
            
        // decrease the unread

        const chat=await chat_model.find({ _id: chatId});
        if(!chat){
            res.send({
                message:"No chat found",
                success:false
            })
        }
  
        const updatedchat=await chat_model.findByIdAndUpdate(chatId,{unreadMessage:0},{new :true}).populate('members','firstname lastname').populate('lastMessage');
        // make read flag true

        await Message.updateMany({chatId:chatId,read:false},{read:true});

        res.send({
            message:"Unread message clear",
            success:true,
            data:updatedchat
        })
    }catch(err){
        res.status(400).send({
            message:err.message,
            success:false
        });
    }
})
module.exports=router;