import React, { useContext } from 'react'
import Login from './Pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css' ;

import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Admin/Dashboard';
import AllAppointments from './Pages/Admin/AllAppointments';
import AddDoctor from './Pages/Admin/AddDoctor';
import DoctorsList from './Pages/Admin/DoctorsList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './Pages/Doctor/DoctorDashboard';
import DoctorAppointment from './Pages/Doctor/DoctorAppointment';
import DoctorProfile from './Pages/Doctor/DoctorProfile';

const App = () => {
  const {aToken}=useContext(AdminContext)
  const {dToken}=useContext(DoctorContext)

  return aToken || dToken ? (
    <div className='bg-[#F8F9D]'
       >
      
   <ToastContainer/>
   <Navbar/>
   <div className='flex items-start'>
    <Sidebar/>
    <Routes>

      //admin routes
      <Route path='/' element={<></>} />
       <Route path='/admin-dashboard' element={<Dashboard/>} />
        <Route path='/all-appointments' element={<AllAppointments/>} />
         <Route path='/add-doctors' element={<AddDoctor/>} />
          <Route path='/doctors-list' element={<DoctorsList/>} />

          //doctor routes
           <Route path='/doctor-dashboard' element={<DoctorDashboard/>} />
          <Route path='/doctor-appointments' element={<DoctorAppointment/>}/>
          <Route path='/doctor-profile' element={<DoctorProfile/>}/>

          

    </Routes>
   </div>
    </div>
  ) : (
    <>
     <Login/>
   <ToastContainer/>
   </>
  )
}

export default App
