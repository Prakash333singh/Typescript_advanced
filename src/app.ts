import express from "express"; 

const app=express();

//http request
app.get("/",(req,res,next)=>{
    res.json({message:"welcome to my apis"})
})

export default app;