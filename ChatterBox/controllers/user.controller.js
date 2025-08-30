const router=require('express').Router();
const user=require('./../models/user.js');
const authMidlleware=require("./../middlewares/auth.middleware.js")


router.get('/get-logged-user',authMidlleware,async(req,res)=>{
    try{
        const User=await user.findOne({_id:req.user.id});
        res.status(200).send({
            message:"user fetch successfully",
            success:true,
            data:User
        });
    }catch(err){
        res.status(400).send({
            message:err.message,
            success:false
        });
    }
});

router.get('/get-All-users',authMidlleware,async(req,res)=>{
    try{
        const user_id=req.user.id;
        const All_users=await user.find({_id:{$ne:user_id}});
        res.status(200).send({
            message:"ALL user fetch successfully",
            success:true,
            data:All_users
        });
    }catch(err){
        res.status(400).send({
            message:err.message,
            success:false
        });
    }
});

module.exports=router;