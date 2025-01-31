const jwt = require('jsonwebtoken' );
const User = require("../db/schema");

const Authenticate = async(req , res , next) => {
    try{
      //  const token = res.cookies.jwtoken;
        const token = req.cookies.jwtoken;

        const verifyToken = jwt.verify(token , process.env.SECRETKEY);
        const rootUser = await User.findOne({_id:verifyToken._id , "tokens.token": token});
        console.log(rootUser);

        if(!rootUser){
            throw new Error('USER NOT FOUND')
        }
        req.token = token ;
        req.rootUser = rootUser;
        req.userId = rootUser._id ;

        next()
    }catch(err) {
        res.status(401).send('Unothorized:No token provided')
        console.log(err)
    }

}

module.exports = Authenticate
