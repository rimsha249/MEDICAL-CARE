import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/* left section */}
        <div>
<img className='mb-5 w-50'src={assets.logo1}alt="" />
<p className='w-full md:w-2/3 text-gray-600 leading-6 '>Our mission is to make healthcare more accessible by allowing users to easily find doctors,book appointments and manage their health with convenience and confidence.</p>
        </div>

        {/* center section */}
        <div>
            <p className='text-xl font-medium mb-3'>COMPANY</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Contacts</li>
                <li>Privacy policy</li>
            </ul>
        </div>

        {/* right section */}
        <div>
            <p className='text-xl font-medium mb-3'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+91-01-223417</li>
                <li>support@medicohub.com</li>
            </ul>
        </div>
      </div>
      <div>
        {/*----copyright text----*/}

        <div>
            <hr className='h-[3px] bg-gray-200 ' />
            <p className='py-5 text-sm text-center'>Copyright © 2026 Medical Care. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Footer
