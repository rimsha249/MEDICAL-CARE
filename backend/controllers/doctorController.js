import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"





const changeAvailability=async(req,res)=>{
    try {
        const docId=req.docId
        console.log("docId received:",docId)

        if(!docId){
            return res.json({success:false, message:"docId missing"})
        }
        const docData=await doctorModel.findById(docId)
        if(!docData){
              return res.json({success:false, message:"Doctor not found"})
        }
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
        res.json({success:true, message:'Availibilty changed'})        


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

const doctorList= async(req,res)=>{
    try {
        const doctors= await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true, doctors})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

//api for doctor login

const loginDoctor=async (req,res)=>{
    try {
        const {email,password}=req.body
        const doctor=await doctorModel.findOne({email})

        if(!doctor){
            return res.json({success:false,message:'Invalid credentials'})
        }
        const isMatch=await bcrypt.compare(password,doctor.password)

        if(isMatch){
            const token=jwt.sign({id:doctor._id},process.env.JWT_SECRET)
         res.json({success:true,token})


        }else{
             return res.json({success:false,message:'Invalid credentials'})
        }

    } catch (error) {
         console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to get doctor appointments for doctor panel

const appointmentsDoctor=async(req,res)=>{
    try {
      const docId=req.docId
      const appointments=await appointmentModel.find({docId}).populate('docId')

      res.json({success:true,appointments})



        
    } catch (error) {
         console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to mark appointment completed for doc panel 
const appointmentComplete=async(req,res)=>{
    try {
        const docId=req.docId
        const {appointmentId}=req.body
        const appointmentData= await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId.toString()===docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})

            return res.json({success:true, message:'Appointment Completed'})
        }
        else{
            return res.json({success:false, message:'Mark Failed'})
        }
    } catch (error) {
         console.log(error)
        res.json({success:false,message:error.message})
    }
}
//api to cancel appointment for doc panel
const appointmentCancel=async(req,res)=>{
    try {
        const docId=req.docId
        const {appointmentId}=req.body
        const appointmentData= await appointmentModel.findById(appointmentId)

        if(!appointmentData){
            return res.json({success:false, message:"Appointment not found"})
        }

        if(appointmentData && appointmentData.docId.toString()===docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

            return res.json({success:true, message:'Appointment Cancelled successfully'})
        }
        else{
            return res.json({success:false, message:'Cancellation Failed'})
        }
    } catch (error) {
         console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to get dashboard data for doc panel 
 
const doctorDashboard=async(req,res)=>{
    try {
          const docId=req.docId
          const appointments= await appointmentModel.find({docId})
          let earning=0
    
          appointments.map((item)=>{
            if(item.isCompleted || item.payment){
                earning+=item.amount

            }
          })

          let patients=[]

          appointments.map((item)=>{
          if(!patients.includes(item.userId)){
           patients.push(item.userId)

          }
          })

          const dashData={
            earning,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0,5)
          }
res.json ({success:true, dashData})


    } catch (error) {
         console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to get doctor profile for doc panel 
const doctorProfile=async(req,res)=>{
    try {

       const docId=req.docId
       const profileData=await doctorModel.findById(docId).select('-password')
       res.json({success:true,profileData})
        
    } catch (error) {
          console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

//API to update doc profile data from doc panel 

const updateDoctorProfile=async(req,res)=>{
    try {
const docId=req.docId
const {fees,address,available}=req.body
await doctorModel.findByIdAndUpdate(docId,{fees,address,available})

res.json({success:true,message:'Profile Updated'})

        
    } catch (error) {
         console.log(error)
        res.json({success:false,message:error.message})
    }
}


export {changeAvailability,
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    appointmentComplete,
    doctorDashboard,
updateDoctorProfile,
doctorProfile}