import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser());

// routes import

import userRouter from './routes/user.route.js';
import productRouter from "./routes/product.route.js"
import reviewRouter from "./routes/review.route.js"


// routes declaration 

app.use("/api/users", userRouter);

// app.use("/api", productRouter);

app.use("/api", reviewRouter);

export {app} ;