import mongoose from "mongoose"
import {config} from "./config"



const connectDB=async()=>{
    try {
        mongoose.connection.on('connected',()=>{
            console.log("connected to database sucessfully");
        });


        mongoose.connection.on("error",(err)=>{
            console.log("Failed to connet to database",err);
        });
        
        await  mongoose.connect(config.databaseUrl as string); 
       
    } 
    catch (err) {
        console.error("falied to connect to database",err);
        process.exit(1);
    }

}

export default connectDB;