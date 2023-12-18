const mongoose=require('mongoose');

const mongoURI="mongodb://127.0.0.1:27017/inotebook";  //URI of mongo db  use this instead of localhost

const connectToMongo=()=>{
    mongoose.connect(mongoURI).then(()=>console.log("Connected")).catch((e)=>console.log(e.message));  //use to connect monodb
}

module.exports=connectToMongo;