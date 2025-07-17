import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto";
import nodemailer from "nodemailer";
const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//route for user login
const loginUser =async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user= await userModel.findOne({email});
        if (!user) {
            return res.json({success:false,message:"User doesn't exists"})
        }
        if (!user.verified) {
            return res.json({success:false,message:"Please verify your email before logging in."})
        }
        const isMatch= await bcrypt.compare(password,user.password)
        if(isMatch){
            const token=createToken(user._id)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:'Invalid credentials'})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//route for user register
const registerUser =async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        //check already ex users
        const exists= await userModel.findOne({email})
        if (exists) {
            return res.json({success:false,message:"User already exists"})
        }
        //validating email format and strong pass
        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"Please enter a valid email"})
        }
        if (password.length<8) {
            return res.json({success:false,message:"Please enter a strong password"})
        }
        //hashing user password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const newUser=new userModel({
            name,
            email,
            password:hashedPassword,
            verified: false,
            verificationToken
        })
        await newUser.save()

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });
        const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}&email=${email}`;
        await transporter.sendMail({
            to: email,
            subject: 'Verify your email',
            html: `<p>Thank you for registering! Please <a href="${verifyUrl}">click here to verify your email</a>.</p>`
        });

        res.json({success:true, message: 'Registration successful! Please check your email to verify your account.'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Email verification controller
const verifyEmail = async (req, res) => {
    try {
        const { token, email } = req.query;
        const user = await userModel.findOne({ email, verificationToken: token });
        if (!user) return res.send('Invalid or expired verification link.');
        user.verified = true;
        user.verificationToken = undefined;
        await user.save();
        res.send('Email verified! You can now log in.');
    } catch (error) {
        res.send('An error occurred during verification.');
    }
}

//route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
export {loginUser, registerUser, adminLogin, verifyEmail}
