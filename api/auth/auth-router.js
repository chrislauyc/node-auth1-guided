const express = require("express")
const router = express.Router()
const User = require("../users/users-model.js")

const checkPayload = (req,res,next)=>{
    if(!req.body.username || !req.body.password){
        res.status(401).json("Username or password required")
    }
    else{
        next()
    }
}

router.post("/register",checkPayload,checkUserInDB, (req,res)=>{
    console.log("registering")
})

router.post("/login", (req,res)=>{
    console.log("login")
})

router.get("/logout", (req,res)=>{
    console.log("logout")
})

module.exports = router