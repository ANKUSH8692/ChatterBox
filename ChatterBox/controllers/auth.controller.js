const router = require('express').Router();
const bcrypt = require("bcryptjs");
const JWT = require('jsonwebtoken');

const user = require('./../models/user.js');
const message = require('../models/message.js');


router.post('/signup', async (req, res) => {
    try {
        //1 user exists check 
        
        const user_find = await user.findOne({ email: req.body.email });

        if (user_find) {
            return res.status(400).send({
                message: "User already exists.",
                success: false
            });
        }

        //3 if user not exists encrpty the password

        const hash_pass = await bcrypt.hash(req.body.password, 10);

        //4 modify the password
        req.body.password = hash_pass;

        //create new user

        const new_user = await new user(req.body);

        // save to database
        await new_user.save();

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: {
                new_user
            }
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        //1 check if user exists

        const user_mail = await user.findOne({ email: req.body.email }).select('+password');
        if (!user_mail) {
            return res.status(400).send({
                message: "User doesn't exists",
                success: false
            });
        }

        //2 check if the password is correct
        const is_valid = await bcrypt.compare(req.body.password, user_mail.password);
        if (!is_valid) {
            return res.status(400).send({
                message: "password is incorrect",
                success: false
            });
        }

        // if auth confirm assign auth JWT tocken
        const token = JWT.sign({ userId: user_mail._id }, process.env.secret_key, { expiresIn: "1d" });

        res.status(201).send({
            message: "user logged in successfully",
            success: true,
            token: token
        });

    } catch (err) {
        res.status(400).send({
            message: err.message,
            success: false
        })
    }
});

module.exports = router;
