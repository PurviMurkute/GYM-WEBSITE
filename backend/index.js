import express from "express";
import mongoose, { model, Schema } from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();

import User from './models/User.js';
import Review from './models/review.js' 
import md5 from "js-md5";

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 4000;


const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected")
}
connectDB();
const DB = async () =>{
    await mongoose.connect("mongodb+srv://jainaashika1510:jainaashika@icp6.r7fworh.mongodb.net/feedbacks");
    console.log("DB CONNECTED");
}

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    const user = new User({
        name: name,
        email: email,
        password: md5(password)
    })

    try {
        const savedUser = await user.save();
        res.json({
            success: true,
            data: savedUser,
            message: 'Signup successful'
        })
    }
    catch (e) {
        res.json({
            success: false,
            data: null,
            message: e.message
        })
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const encryptedPassword = md5(password);

    const user = await User.findOne({
        email: email,
        password: encryptedPassword
    }).select('-password')

    if (user) {
        res.json({
            success: true,
            data: user,
            message: 'Login successful'
        })
    }
    else {
        res.json({
            success: false,
            data: null,
            message: 'invalid credentials'
        })
    }
})

app.post("/feedbacks",async(req,res)=>{
    const {name,reviews,ratings}=req.body;
    const newReview = await Review.create({
        "name": name,
        "reviews": reviews,
        "ratings": ratings
    })
    res.json({
        sucess: true,
        message: "Review Added Successfully",
        data: newReview
    })
})
const reviewSchema = new Schema({
    name: String,
    reviews: String,
    ratings: String
});

const Review = model("Review", reviewSchema);

app.get("/feedbacks", async(req, res) => {
    const reviews = await reviewSchema.find();
    res.json({
        sucess: true,
        message: "Notes fetched Successfully",
        data: reviews
    })
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})