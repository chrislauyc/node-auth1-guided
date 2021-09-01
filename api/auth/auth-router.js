const express = require("express")
const router = express.Router()

const checkPayload = (req,res,next)=>{
    
}

router.post("/register",checkPayload, (req,res)=>{
    console.log("registering")
})

router.post("/login", (req,res)=>{
    console.log("login")
})

router.get("/logout", (req,res)=>{
    console.log("logout")
})

module.exports = router