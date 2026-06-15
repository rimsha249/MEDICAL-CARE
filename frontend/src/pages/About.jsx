import React from 'react'
import { assets } from '../assets/assets'

const about = () => {
  return (
    <div>
      <div className='text-center text-3xl pt-10 text-gray-600'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

<div className='my-10 flex flex-col md:flex-row gap-12'>
  <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
  <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 '>
    <p>Welcome to Medical Care, your trusted platform for managing healthcare needs easily and efficiently. At Medical Care, we understand the challenges people face when it comes to finding the right doctors and scheduling medical appointments. Our platform is designed to simplify the healthcare process by allowing patients to browse experienced doctors from different specialties and book appointments quickly and conveniently.</p>
    <p>Medical Care is committed to improving healthcare accessibility through technology. We continuously work to enhance our platform, providing a smooth and user-friendly experience for patients. Whether you are booking your first appointment or managing ongoing medical care, Medical Care is here to support you every step of the way.</p>
    <b className='text-gray-800'>OUR VISION</b>
    <p>Our vision at Medical Care is to create a seamless digital healthcare experience for everyone. We aim to bridge the gap between patients and healthcare providers by making medical services more accessible, efficient, and reliable. Our goal is to ensure that every patient can easily connect with trusted doctors and receive the care they need at the right time.</p>
  </div>
</div>
<div className='text-xl my-4'>
  <p>Why Choose <span className='text-gray-700 font-semibold'>Medical Care?</span></p>
</div>
<div className='flex flex-col md:flex-row mb-20'>
  <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-green-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
    <b>EFFICIENCY :</b>
    <p>Steamlined Appointment Scheduling that fits into your busy lifestyle.</p>
  </div>

  <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-green-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
     <b>CONVENIENCE :</b>
    <p>Access to a network of trusted healthcare professionals in your area.</p>
  </div>

  <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-green-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
     <b>PERSONALIZATION :</b>
    <p>Tailored recommendations and reminders to help you stay on top of your healthcare needs.</p>
  </div>

</div>

    </div>
  )
}

export default about
