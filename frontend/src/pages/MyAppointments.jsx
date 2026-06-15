
import React, { useContext } from 'react'
import {AppContext} from '../context/AppContext'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


const MyAppointments = () => {
const {backendUrl,token,getDoctorsData}= useContext(AppContext)

const [appointments,setAppointments]=useState([])
const navigate= useNavigate()
const months=["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]



const slotDateFormat=(slotDate)=>{
  const dateArray=slotDate.split("_")
  return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
}


const getUserAppointments= async()=>{

  try {
    const {data}=await axios.get(backendUrl + '/api/user/appointments', {headers:{token}})
    if(data.success){
      setAppointments(data.appointments.reverse())
      console.log(data.appointments);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message)
  }
}

const cancelAppointment= async(appointmentId)=>{

  if(!appointmentId){
    console.log("id missing")
    return
  }
  try {
   

console.log("received id", appointmentId);

    const {data}= await axios.post(backendUrl + '/api/user/cancel-appointment',
      {appointmentId:appointmentId},{headers:{"token":token,"Content-Type":"application/json"}})
    if(data.success){
      toast.success(data.message)
      getUserAppointments()
      getDoctorsData()

    }else{
      toast.error(data.message)
    }
    
  } catch (error) {
    console.log(error);
    toast.error(error.message)
  }
}

const initPay=(order)=>{
  console.log("razorpay object:", window.Razorpay)
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
    amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: order.currency,
    name: "Appointment Payment",
    description: "Appointment payment",
    order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    receipt: order.receipt,
    handler:async (response)=>{
      console.log(response);
      
     try {
      const {data}= await axios.post(backendUrl + '/api/user/verifyRazorpay',response,{headers:{token}})
      if(data.success){
        getUserAppointments()
        navigate('/my-appointments')
        toast.success(data.message)
      }
     } catch (error) {
      console.log(error);
      toast.error(error.message)
     }


    }
  }
  const rzp= new window.Razorpay(options)
  rzp.open()
}

const appointmentRazorpay=async(appointmentId)=>{
try {
   const {data}=await axios.post(backendUrl + '/api/user/payment-razorpay', 
    {appointmentId}, {headers:{token}})
   if(data.success){
    initPay(data.order)
   }
} catch (error) {
   console.log(error);
    toast.error(error.message)
}
}


useEffect(()=>{
  if(token){
    getUserAppointments()
  }
},[token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>MY APPOINTMENTS</p>
      <div>
{ appointments.map((item,index)=>(
   
  <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
  <div>
    <img className='w-32 bg-green-200' src={item.docData.image} alt="" />
  </div>
  <div className='flex-1 text-sm text-zinc-800'>
    <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
    <p>{item.docData.speciality}</p>
    <p className='text-zinc-800 font-medium mt-1'>Address:</p>
    <p className='text-xs'>{item.docData.address.line1}</p>
    <p className='text-xs'>{item.docData.address.line2}</p>
    <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>
      Date & Time</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
  </div>
  <div></div>
<div className='flex flex-col gap-2 justify-end'>

  {!item.cancelled && item.payment &&  !item.isCompleted && <button className='sm:min-w-48 py-2 border  rounded text-black bg-green-400'>Paid</button>}

 {!item.cancelled && !item.payment && !item.isCompleted &&<button onClick={()=>{console.log("CLICKED",item._id); appointmentRazorpay(item._id)}}
  className='text-sm text-stone-600 text-center
   sm:min-w-48 py-2 border rounded hover:bg-green-500 hover:text-white transition-all 
   duration-300'>Pay Online</button>}

  {!item.cancelled && !item.isCompleted && <button onClick={()=>{console.log("sending id:",item?._id); cancelAppointment(item._id)}} 
  className='text-sm text-stone-600 text-center sm:min-w-48 py-2 border rounded 
   hover:bg-red-600 hover:text-white transition-all duration-300'>Cancle Appointment</button>}

   {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>}
   {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>}
</div>
  </div>
))}
      </div>
    </div>
  )
}

export default MyAppointments
