const mongoose=require('mongoose');

// const backupHistorySchema = new mongoose.Schema({
//   date: {
//     type: Date,
//     required: true
//   },
//   backupId: {
//     type: String,
//     required: true
//   },
//   chatCount: {
//     type: Number,
//     default: 0
//   },
//   messageCount: {
//     type: Number,
//     default: 0
//   },
//   fileSize: {
//     type: String,
//     default: '0 MB'
//   }
// });

const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        select:false,

    },
    profilePic:{
        type:String,
        required:false
    }
},{timestamps:true});

// // Virtual for full name
// userSchema.virtual('fullname').get(function() {
//   return `${this.firstname} ${this.lastname}`;
// });

// // Method to get user profile data (without sensitive info)
// userSchema.methods.getProfile = function() {
//   return {
//     _id: this._id,
//     firstname: this.firstname,
//     lastname: this.lastname,
//     email: this.email,
//     profilepic: this.profilepic,
//     createdAt: this.createdAt,
//     updatedAt: this.updatedAt,
//     lastBackup: this.lastBackup,
//     backupHistory: this.backupHistory
//   };
// };

module.exports=mongoose.model('users',userSchema);