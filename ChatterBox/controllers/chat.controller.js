const router=require("express").Router();
const chat_model =require("./../models/chat.js");
const authMiddleware =require("../middlewares/auth.middleware.js");

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
        const All_chats=await chat_model.find({members:{$in:req.user.id}});

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
module.exports=router;