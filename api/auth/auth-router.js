const express = require("express")
const router = express.Router()
const User = require("../users/users-model.js")
const bcrypt = require("bcryptjs")

const checkPayload = (req,res,next)=>{
    if(!req.body.username || !req.body.password){
        res.status(401).json("Username or password required")
    }
    else{
        next()
    }
}
const checkUserInDB = async (req,res,next)=>{
    try{
        const rows = await User.findBy({username:req.body.username})
        if(!rows.length){
            next()
        }
        else{
            res.status(401).json("Username already exists")
        }
    }catch(e){
        res.status(500).json(`Server error: ${e}`)
    }
}

const checkUserExists = async (req,res,next)=>{
    try{
        const rows = await User.findBy({username:req.body.username})
        // an array [{username:"fred", password:"$2a$10alsjkf;laksjdf;lkj"}] 


        if(rows.length){
            req.userData = rows[0]
            next()
        }
        else{
            res.status(401).json("Username does not exist")
        }
    }catch(e){
        res.status(500).json(`Server error: ${e}`)
    }
}


router.post("/register",checkPayload,checkUserInDB, async (req,res)=>{
    try{
        const hash = bcrypt.hashSync(req.body.password,10) //2 to the 10th power
        const newUser = await User.add({username:req.body.username, password:hash})
        res.status(201).json(newUser)
    }catch(e){
        res.status(500).json({message:e.message})
    }
})

router.post("/login",checkPayload,checkUserExists, (req,res)=>{
    try{
        const verified = bcrypt.compareSync(req.body.password,req.userData.password)
        if(verified){
            console.log("Session here")
        }
        else{
            res.status(401).json("Username or password incorrect")
        }
    }catch(e){
        res.status(500).json({message:e.message})
    }
})

router.get("/logout", (req,res)=>{
    console.log("logout")
})

module.exports = router