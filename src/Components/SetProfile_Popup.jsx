import React, { useContext } from 'react'
import { RxCross2 } from "react-icons/rx";
import { useForm } from 'react-hook-form';
import { EventAppContext } from '../Context/EventContext';
import { useState } from 'react';
import { toast } from 'react-toastify';
const SetProfile_Popup = () => {
    const { api, setRegister, setshare,setprogress,fetchUserDetails,setprofile,setpopup} = useContext(EventAppContext)
    const { register, handleSubmit } = useForm()
    const [errorMsg, seterrorMsg] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onsubmit = async (data) => {
        setIsSubmitting(true)
        setprogress(0)
        const payload = {
            department: data.Department,
            year: data.Year,
            phone: data.Phone
        }
        try {
            const response = await api.post("/Festofy/user/profile/set-profile", payload, { withCredentials: true, })
            console.log(response.data)
            if (response.data.success) {
                setRegister(false)
                setshare(false)
                setprofile(false)
                setpopup(false)
                setprogress(100)
                await fetchUserDetails()
                toast.success("User Registered Successfully")
                setIsSubmitting(false);
            }
        } catch (err) {
            if (err.response && (err.response.status === 400 || err.response.status === 404 || err.response.status === 500)) {
                seterrorMsg(err.response.data.message);
            }
        }
    }
    return (
        <div>
            <div className='fixed inset-0 z-50 w-full h-full bg-[#00000090] grid '>
                <div className='place-self-center left-[580px] opacity-90 top-[200px] bg-white rounded-[12px] w-[90%] sm:w-[55%] md:w-[50%] lg:w-[40%] xl:w-[30%] animate-[fadein_0.5s_ease-in-out_forwards] text-white'>
                    <div className='p-5 flex justify-between font-[Nunito]'>
                        <h1 className='font-bold ml-5 text-[18px] text-black'>Set Your Profile</h1>
                    </div>
                    <div className='font-[Nunito]'>
                        <form onSubmit={handleSubmit(onsubmit)}>
                            <div className='flex flex-col items-center'>
                                <input type="text" placeholder='Your Department' className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-4' autoComplete='username' {...register("Department", { required: true })} />

                                <input type="text" placeholder='Your College Year (FY,SY,TY)' className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-4' autoComplete='Year' {...register("Year", { required: true })} />

                                <input type="number" placeholder='Your Phone No ' className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-4' autoComplete='email' {...register("Phone", { required: true })} />

                                {errorMsg && (<div className='w-[80%] mb-3 '><p className='text-red-600'>{errorMsg}</p></div>)}

                                <button type='submit' disabled={isSubmitting} className={`bg-gradient-to-r from-cyan-500 to-blue-600 w-[80%] text-white mb-4 rounded-[15px] cursor-pointer p-1 hover:from-cyan-400 hover:to-blue-500 transition-all duration-100 font-medium shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 hover:-translate-y-0.3 outline-none border-none`}>{isSubmitting ? "Submitting..." : "Submit"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SetProfile_Popup
