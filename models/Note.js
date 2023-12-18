const mongoose=require("mongoose");
const {Schema}=mongoose;
const NoteSchema = new Schema({
    user:{             //this user will act as a foriegn key to user table
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    tags:{
        type: String,
        default: "General"  //will set default value of tag as General  
    },
    date:{
        type: Date,
        defult: Date.now
    }
  });

  module.exports=mongoose.model("notes",NoteSchema);