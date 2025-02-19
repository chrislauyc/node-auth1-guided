const router = require("express").Router();
const userModel = require("../users/users-model");
const bcryptjs = require("bcryptjs"); //bcript do the salting
const checkPayloadShape=(req,res,next)=>{
    if(!req.body.username || !req.body.password){
        res.status(401).json({message:"username and password required"});
    }
    else{
        next();
    }
};
const userMustNotExist=async(req,res,next)=>{
    const users = await userModel.findBy({username:req.body.username});
    if(users.length !== 0){
        res.status(400).json({message:"user already exists"});
    }
    else{
        next();
    }
};
const userMustExist=async(req,res,next)=>{
    const users = await userModel.findBy({username:req.body.username});
    if(users.length === 0){
        res.status(404).json({message:"user not found"});
    }
    else{
        req.user = users[0];
        next();
    }
};
router.post("/register",checkPayloadShape,userMustNotExist,async(req,res,next)=>{
    try{
        req.body.password = bcryptjs.hashSync(req.body.password, 14); //run 2^14 times
        const {username,password} = req.body;
        const user = await userModel.add({username,password});
        res.status(201).json(user);
    }
    catch(err){
        next(err);
    }

});

// var sessions = require("client-sessions");
// app.use(sessions({
//   cookieName: 'mySession', // cookie name dictates the key name added to the request object
//   secret: 'blargadeeblargblarg', // should be a large unguessable string
//   duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
//   activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
// }));
 
// app.use(function(req, res, next) {
//   if (req.mySession.seenyou) {
//     res.setHeader('X-Seen-You', 'true');
//   } else {
//     // setting a property will automatically cause a Set-Cookie response
//     // to be sent
//     req.mySession.seenyou = true;
//     res.setHeader('X-Seen-You', 'false');
//   }
// });

router.post("/login",checkPayloadShape,userMustExist,(req,res,next)=>{
    try{
        if(bcryptjs.compareSync(req.body.password, req.user.password)){
            req.session.user = req.user;
            res.status(200).json({message:"login successful"});
        }
        else{
            res.status(403).json({message: "invalid credentials"});
        }
    }
    catch(err){
        next(err);
    }
});
router.get("/logout",(req,res,next)=>{
    if(req.session){
        req.session.destroy(err=>{
            if(err){
                res.json("cant log out");
            }
            else{
                res.json("you are logged out");
            }
        })
    }
    else{
        res.json("no session found");
    }
});


module.exports = router;