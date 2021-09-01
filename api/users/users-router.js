const router = require("express").Router();

const Users = require("./users-model.js");

const restricted = (req,res,next) =>{
  if(req.session && req.session.user){
    next();
  }
  else{
    res.status(403).json({message:"no cookie"})
  }
};

router.get("/", restricted, (req, res, next) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(next);
});

module.exports = router;
