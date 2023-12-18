var jwt = require('jsonwebtoken');
const jwt_signetur = "hellowIamJwtsign@sign";  //secure jwt tocken signeture
const fetchuser=(req,res,next)=>{
    //Get the user from the jwt tocken and id to request object
    const tocken=req.header('auth-tocken');
    if(!tocken)
    {
        res.status(401).send("Access denied");
    }
    try {
        const data=jwt.verify(tocken,jwt_signetur);
        req.user=data.user;   //the req is from the parent router method...now parent router got the requested user
        next();
    } catch (error) {
        res.status(401).send({error:"Access denied"});
    }
}

module.exports=fetchuser;