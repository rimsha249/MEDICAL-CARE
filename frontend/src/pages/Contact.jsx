import React from 'react'
import { assets } from '../assets/assets'

const contact = () => {

  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="Contact" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-lg text-gray-800'>OUR OFFICE</p>
          <p className='text-gray-600'>123 Healthcare Avenue, Medical City</p>
          <p className='text-gray-600'> Phone: (123) 456-7890 <br />Email: info@medicalcare.com</p>
          <p className='text-gray-600'>Hours: Mon-Fri 9AM-6PM</p>
          <p className='text-gray-600'>Learn more about our services and job openings.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>
    </div>
  )
}

export default contact
