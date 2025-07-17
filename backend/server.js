import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import multer from 'multer'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

//app config
const app=express()
const port= process.env.PORT||4000
connectDB()
connectCloudinary()

//middlewares
app.use(express.json())

const allowedOrigins = [
  'https://orient-craft-2itv9cebb-abhirami301204-gmailcoms-projects.vercel.app', // main frontend
  'http://localhost:5174', // local frontend
  'https://orient-craft-admin.vercel.app' // admin panel
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

//api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ success: false, message: 'Too many files uploaded.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ success: false, message: 'Unexpected file field.' });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ success: false, message: error.message });
  }
  
  console.error('Error:', error);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(port,()=> console.log('Server started on PORT:'+port))