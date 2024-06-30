import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";



const app = express();
app.use(express.json());
// it is middleaware used for json parsing 

//http request
app.get("/", (req, res, next) => {
    res.json({ message: "welcome to my apis", next })
})

app.use("/api/users", userRouter)

//global error handler
app.use(globalErrorHandler);


export default app;