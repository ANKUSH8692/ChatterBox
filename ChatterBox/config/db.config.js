const mongoose=require('mongoose');

// connection to mongodb
mongoose.connect(process.env.CONN_String);

const db=mongoose.connection;

db.on('connected',()=>{
    console.log("db is connected");
});

db.on('err',()=>{
    console.log("DB Connection failed");
})

module.exports=db;