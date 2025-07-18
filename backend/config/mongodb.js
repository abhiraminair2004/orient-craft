import mongoose from "mongoose";

const connectDB= async()=>{
    mongoose.connection.on('connected',()=>{
        console.log("DB Connected")
    })
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI)
}
export default connectDB;