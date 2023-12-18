const mongoose=require("mongoose");
const {Schema}=mongoose;
const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true   //does not take the repeated strings must mke email and username as unique
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
  });
  const User=mongoose.model("user",UserSchema);
//   User.createIndexes();  //we cannot send the same data again and again
  module.exports=User;