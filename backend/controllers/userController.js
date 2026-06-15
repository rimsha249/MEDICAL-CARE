import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import mongoose from 'mongoose'
import Razorpay from 'razorpay'
import Anthropic from '@anthropic-ai/sdk'

 const razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET_KEY
        })
console.log("key id:", process.env.RAZORPAY_KEY_ID)
console.log("key secret:", process.env.RAZORPAY_SECRET_KEY)


//api to register a user

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if(!name || !email || !password) {
            return res.json({ success:false, message: 'Please fill all the fields' })
        }

       
        
        //validating email
        if(!validator.isEmail(email)) {
            return res.json({ success:false, message: 'Please enter a valid email' })
        }
        //validating strong password
        if(password.length < 8) {
            return res.json({ success:false, message: 'Password must be at least 8 characters long' })
        }

         //check existing user
        const existingUser=await userModel.findOne({email})
        if(existingUser){
            return res.json({success:false,message:"User already exists"})
        }


        //hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //save the user to the database
        const userData={
            name,
            email,
            password: hashedPassword
        }
    
        const newUser= new userModel(userData)
        const user= await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET )

        return res.json({ success:true, message: 'User registered successfully', token })
        




    } catch (error) {
        console.log(error)
        return res.json({ success:false, message:error.message })
    }
}

// api for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user =await userModel.findOne({ email })
        if(!user) {
            return res.json({ success:false, message: 'User not found' })
        }
        const isMatched = await bcrypt.compare(password, user.password)
        if(isMatched) {
             const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET )
        return res.json({ success:true, message: 'Login successful', token })
        }else{
            return res.json({ success:false, message: 'Invalid credentials' })
        }
       

    } catch (error) {
         console.log(error)
        return res.json({ success:false, message:error.message })
    }
}

//API to get user profile data
  
const getProfile = async (req, res) => {
try {
    const userId = req.userId
    const userData=await userModel.findById(userId).select("-password")
    res.json({success:true, message:"User profile data", data:userData})


} catch (error) {
    console.log(error)

    res.json({success:false, message:error.message})
}
}

//api to update user profile data

const updateProfile = async (req, res) => {
    try {
        const{ name, phone,dob,gender}=req.body
        const address= JSON.parse(req.body.address)
        const userId=req.userId
        const imageFile=req.file
        
       if(!name||!phone||!dob||!gender) {
            return res.json({ success:false, message: 'Please fill all the fields' })
        }

        await userModel.findByIdAndUpdate(userId, {
            name,phone,address,dob,gender})

        if(imageFile){
            //upload image to cloudinary
            const imageUpload=await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
            const imageUrl=imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageUrl })
        }

        res.json({success:true, message:"Profile updated successfully"})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//api to book an appointment

const bookAppointment = async (req, res) => {
try {
    
const {docId,slotDate,slotTime}=req.body  
const userId=req.userId //taking userId, doctorId, slotDate and slotTime from request body        
const userData=await userModel.findById(userId).select("-password") //fetching user data from database using userId
const docData=await doctorModel.findById(docId).select("-password") //fetching doctor data from database using doctorId

if(!docData.available) {
    return res.json({success:false, message:"Doctor is not available at the selected time"})  //checking if the doctor is available at the selected time
}

let slots_booked=docData.slots_booked //taking the already booked slots data from doctor data
 //check if the slot is already booked or available
if(slots_booked[slotDate]) {
    if(slots_booked[slotDate].includes(slotTime)) {
        return res.json({success:false, message:"Slot is already booked"})
    }else{
        slots_booked[slotDate].push(slotTime)
    }
} else{
    slots_booked[slotDate]=[]
    slots_booked[slotDate].push(slotTime)
}

 //fetching user data from database using userId
delete docData.slots_booked //deleting the slots_booked field from doctor data to save only necessary data in appointment data

const appointmentData={   //creating appointment data to save in database
    userId,
    docId,
    slotDate,
    slotTime,
    userData,
    docData,
    userData,
    amount: docData.fees,
    date: Date.now()
}
const newAppointment= new appointmentModel(appointmentData)
await newAppointment.save()

//save new slots data to doctor data
await doctorModel.findByIdAndUpdate(docId, { slots_booked })

res.json({success:true, message:"Appointment booked successfully"})

} catch (error) {
    console.log(error)
        res.json({success:false, message:error.message})
}

}

//API to get user appointments data

const listAppointments= async(req, res) => {
    try {
        const userId=req.userId
        const appointments=await appointmentModel.find({userId})
        res.json({success:true, appointments})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//API to cancel appointment

const cancelAppointment= async(req, res) => {
    try {
        
   const { appointmentId}=req.body
   const userId=req.userId
   const appointmentData=await appointmentModel.findById(appointmentId)
   

   if(!appointmentData){
    console.log("id not found:",appointmentId)
    return res.json({success:false, message:"Appointment not found"})
   }

   //verify appoointment belongs to user
    if(appointmentData.userId.toString()!==userId.toString()){
        return res.json({success:false, message:"You are not authorized to cancel this appointment"})
    }
  await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

  //releasing doctor slots

  const {docId, slotDate, slotTime}=appointmentData
  const doctorData=await doctorModel.findById(docId)
  let slots_booked=doctorData.slots_booked

  slots_booked[slotDate]=slots_booked[slotDate].filter(e => e !== slotTime)
    await doctorModel.findByIdAndUpdate(docId, {slots_booked})

  res.json({success:true, message:"Appointment cancelled successfully"})


    } catch (error) {
          console.log(error)
        res.json({success:false, message:error.message})
    }
}
 
//API to get online payment using razorpay

const paymentRazorpay= async(req, res) => {
try { 
    const { appointmentId }=req.body
    console.log("received appointment id:", appointmentId)
  const appointmentData=await appointmentModel.findById(appointmentId)
  console.log("appointment data:", appointmentData)
  console.log("appointment amount:", appointmentData.amount)
    if(!appointmentData||appointmentData.cancelled){
        return res.json({success:false, message:"Apoointment not found or cancelled"})
    }
    //creating options for razorpay payment
    const options={
        amount: appointmentData.amount * 100, //amount in paise
        currency: process.env.CURRENCY,
        receipt:appointmentId,
    }
  
  //creating order in razorpay
  const order= await razorpayInstance.orders.create(options)
    res.json({success:true, order})    
} catch (error) {
    console.log(error)
        res.json({success:false, message:error.message})
}

 
 

}

//api to verify payment of razarpay

const verifyRazorpay= async(req, res) => {
    try {
        const { razorpay_order_id}=req.body
        const orderInfo= await razorpayInstance.orders.fetch(razorpay_order_id)
        console.log("order info:", orderInfo)
        if(orderInfo.status==="paid"){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {payment:true})
            return res.json({success:true, message:"Payment verified successfully"})
         }else{
            return res.json({success:false, message:"Payment  failed"})
         }
        



    } catch (error) {
         console.log(error)
        res.json({success:false, message:error.message})
    }
}

const chatAI = async (req, res) => {
  console.log("chat route hit")
  try {
    const { messages } = req.body
    
    // Filter to only user/assistant messages, skip first assistant greeting
    const filteredMessages = messages.filter(m => !(m.role === 'assistant'))
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a friendly health and appointment assistant for MediCare platform." },
          ...filteredMessages
        ]
      })
    })
    
    const data = await response.json()
    console.log("GROQ DATA:", JSON.stringify(data))
    res.json({ success: true, message: data.choices[0].message.content })
  } catch (error) {
    console.log("ERROR:", error)
    res.json({ success: false, message: error.message })
  }
}

export { registerUser, loginUser, getProfile,
     updateProfile,bookAppointment, listAppointments, cancelAppointment, paymentRazorpay,
      verifyRazorpay,chatAI }