
const mongoose=require(mongoose);
const {Schema}=mongoose;

const login=new Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})