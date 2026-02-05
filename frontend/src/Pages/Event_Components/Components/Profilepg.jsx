import React, { useContext, useEffect, useState } from 'react'
import { User, Calendar, Plus, Settings, LogOut, Trash2, Edit3, MapPin, Clock, Users, Star, Trophy, Heart, Bookmark, Share2, ArrowRight, ChevronRight, Camera, Mail, Phone, School, Award, Target, Activity } from 'lucide-react';
import E_Nav_Bac from './E_Nav_Back'
import { EventAppContext } from '../../../Context/EventContext';
import { FiEdit } from "react-icons/fi";
import { Save } from 'lucide-react';
import Cookies from "js-cookie"

const Profilepg = () => {
  const { details, randcolor, api,setdetails} = useContext(EventAppContext)
  const [editable, seteditable] = useState(null)
  const [error, seterror] = useState(null)
  const [lockedFields, setLockedFields] = useState({})

  const [editdata, seteditdata] = useState({
    username: details.username || "",
    phone: details.phone || "",
    department: details.department || "",
    year: details.year || ""
  })

  const handleChange = async (field, value) => {
    seteditdata({ ...editdata, [field]: value });
  };

  const onsave = async (field) => {
    const payload = {
      [field]: editdata[field]
    }
    try {
      const response = await api.post("/Festofy/user/profile/set-profile", payload, { withCredentials: true, })
      setdetails(prev=>({...prev,[field]:editdata[field]}))
      Cookies.set(`edit_${field}`,"locked",{expires:1})
      setLockedFields(prev=>({...prev,[field]:true}))
      seteditable(null)
    } catch (err) {
      if (err.response && (err.response.status === 400 || err.response.status === 404 || err.response.status === 500 || err.response.status === 409)) {
        seterror({ status: err.response.status, message: err.response.data.message });
      }
    }

  }

  useEffect(()=>{
    const storedLocks={
      username:Cookies.get("edit_username") ? true : false, 
      phone:Cookies.get("edit_phone") ? true : false
    }
    setLockedFields(storedLocks)
  },[])

  return (
    <div>
      <div className="min-h-screen bg-black">
        <E_Nav_Bac />

        <div className='flex flex-col items-center'>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight animate-fadeInUp mt-3">
            <span className='bg-gradient-to-r from-cyan-400 via-teal-300 to-white bg-clip-text text-transparent'>Your Profile</span>
          </h1>
          <p className='text-xl md:text-2xl w-[80%] sm:w-[60%] md:w-[55%] text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed hover:text-gray-200 transition-colors duration-300 animate-fadeInUp text-center' style={{ animationDelay: '200ms' }}>Manage your events, create new experiences, and customize your profile</p>

          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-3xl border border-cyan-400/20 p-8 mb-8 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            <div className='md:flex justify-around gap-3 '>
              <div className="flex flex-col justify-center items-center gap-2 p-5">
                <div>
                  <p className='text-white text-8xl font-bold  w-40 h-40 rounded-full flex items-center justify-center border-cyan-200 border-4' style={{ backgroundColor: randcolor }}>{details.username?.charAt(0).toUpperCase()}</p>
                </div>
                <div>
                  <span className='text-center text-blue-100 font-semibold'>{details.username?.charAt(0).toUpperCase() + details.username?.slice(1).toLowerCase()}</span>
                </div>
              </div>
              <form>
                <div className=' p-5 flex flex-col items-center'>
                  <div className='w-full flex flex-col'>
                    <label className='text-white'>Name</label>
                    {editable === "username" ?
                      <div className='flex items-center gap-2'>
                        <input type='text' onChange={(e) => handleChange("username", e.target.value)} className='border-2 w-full border-cyan-300 rounded-[6px] p-2 mt-2 text-white shadow-amber-50' value={editdata.username} />
                        <Save onClick={() =>{
                          seterror("")
                          onsave("username")}} size={38} className='text-cyan-400 group-hover:text-cyan-300 hover:cursor-pointer transition-colors' />
                      </div> :
                      <div className='flex items-center gap-2'>
                        <p className='border-2 w-full border-cyan-300 rounded-[6px] p-2 mt-2 text-white shadow-amber-50'>{details.username}</p>
                        {lockedFields.username ?
                          <Save size={38} className='text-gray-700 group-hover:text-cyan-300 transition-colors' /> :
                          <FiEdit onClick={() => { seteditable("username") }} size={38} className='text-cyan-400 group-hover:text-cyan-300 transition-colors hover:cursor-pointer' />
                        }
                      </div>
                    }
                    
                  </div>
                  <div className='mt-3 w-full hover:cursor-no-drop'>
                    <label className='text-white'>Email</label>
                    <div className='flex items-center gap-2'>
                      <p className='w-full border-2 border-cyan-300 rounded-[6px] p-2 mt-2 text-white shadow-amber-50'>{details.email}</p>
                      <Save size={38} className='text-gray-700 group-hover:text-cyan-300 transition-colors' />
                    </div>
                  </div>

                  <div className='mt-3 w-full'>
                    <label className='text-white'>Phone</label>
                    {editable === "phone" ?
                      <div className='flex items-center gap-2'>
                        <input type='text' onChange={(e) => handleChange("phone", e.target.value)} className='border-2 w-full border-cyan-300 rounded-[6px] p-2 mt-2 text-white shadow-amber-50' value={editdata.phone} />
                        <Save onClick={() => {
                          seterror("")
                          onsave("phone")}} size={38} className='text-cyan-400 group-hover:text-cyan-300 hover:cursor-pointer transition-colors' />
                      </div> :
                      <div className='flex items-center gap-2'>
                        <p className='border-2 w-full border-cyan-300 rounded-[6px] p-2 mt-2 text-white shadow-amber-50'>{details.phone}</p>
                        {lockedFields.phone ?
                          <Save size={38} className='text-gray-700 group-hover:text-cyan-300 transition-colors' /> :
                          <FiEdit onClick={() => { seteditable("phone") }} size={38} className='text-cyan-400 group-hover:text-cyan-300 transition-colors hover:cursor-pointer' />
                        }
                      </div>
                    }
                    {/* {(error?.status === 408 || error) && (<div className='w-[80%] mt-2'><p className='text-red-600'>{error.message}</p></div>)} */}
                  </div>

                  <div className='mt-3 w-full hover:cursor-no-drop'>
                    <label className='text-white'>Department</label>
                    <div className='flex items-center gap-2'>
                      <p className='w-full border-2 border-cyan-300 rounded-[6px] p-2 mt-2 text-white shadow-amber-50'>{details.department}</p>
                      <Save size={38} className='text-gray-700 group-hover:text-cyan-300 transition-colors' />
                    </div>
                    {error?.status === 409 && (<div className='w-[80%] mt-2 '><p className='text-red-600 text-center'>{error.message}</p></div>)}
                  </div>
                </div>
              </form>
            </div>
            <p className='text-gray-500 text-center'>* You Can Only Edit Once In A Day</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profilepg
