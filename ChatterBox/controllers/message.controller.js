const router=require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware.js');
const chat =require('./../models/chat.js')
const Message =require('../models/message.js');


router.post('/new-message', authMiddleware, async (req, res) => {
    try {
        
        const new_message = new Message(req.body);
        const saved_message = await new_message.save();
        const updatedChat = await chat.findOneAndUpdate({
            _id: req.body.chatId
        },{
                lastMessage:saved_message._id,
                $inc:{unreadMessage: 1}
            }
        );


        res.status(201).send({
            message: "Successfully sent message",
            success: true,
            data: saved_message
        });
    } catch (err) {
        console.error("Error in new-message:", err);
        res.status(400).send({

            message: err.message,
            success: false,
        });
    }
});

router.get('/get_message/:chatId',authMiddleware,async(req,res)=>{
    try{

        const allMessage=await Message.find({chatId:req.params.chatId}).sort({createdAt:1});

        res.status(200).send({
            message:"Message fetched succesfully",
            success:true,
            data:allMessage
        });

    }catch(err){
        res.status(400).send({
            message:err.message,
            success:false
        });
    }
});
module.exports = router; 