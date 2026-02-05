import React, { useContext, useState } from 'react'
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx";
import { EventAppContext } from '../../Context/EventContext';
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from 'axios';

const NewPassword_popup = ({ Allclose }) => {

  const { register, handleSubmit, watch, setError } = useForm();
  const { closePopup, api, setprogress } = useContext(EventAppContext)
  const [changepassword, setchangepassword] = useState(false)
  const [confirmpassword, setconfirmpassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onsubmithandler = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (data.NewSPassword !== data.Password) {
      setError("Password", {
        type: "manual",
        message: "Passwords do not match"
      });
      return;
    }
    try {
      const response = await api.patch("/Festofy/user/password/reset-password", { email: data.Email, newPassword: data.Password })
      if (response) {
        setprogress(100)
        Allclose()
      }
      setIsSubmitting(false);
    }
    catch (err) {
      console.log(err)
      setIsSubmitting(false);
    }

  }
  return (
    <div>
      <div className='p-5 flex justify-between font-[Nunito]'>
        <h1 className='font-bold ml-5 text-[18px] text-black'>Set New Password</h1>
        <RxCross2 onClick={closePopup} color='black' />
      </div>
      <div className='font-[Nunito]'>
        <form onSubmit={handleSubmit(onsubmithandler)}>
          <div className='flex flex-col items-center'>
            <input type="email" placeholder='Enter Email' className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-4' autoComplete='email' {...register("Email", { required: true })} />

            <div className='flex w-[80%] justify-around items-center relative mb-4'>
              <input type={changepassword ? "text" : "password"} placeholder='Set New Password' className='text-black outline-none border-2 border-gray-300 w-full rounded-[5px] p-1' autoComplete='password' {...register("NewSPassword", { required: true })} />
              <p
                onClick={() => setchangepassword(prev => !prev)}
                className='absolute top-2.5 right-3 cursor-pointer text-gray-500'
              >{changepassword ? <FiEyeOff /> : <FiEye />}</p>
            </div>

            <div className='flex w-[80%] justify-around items-center relative mb-4'>
              <input type={confirmpassword ? "text" : "password"} placeholder='Confirm New Password' className='text-black outline-none border-2 border-gray-300 w-full rounded-[5px] p-1' autoComplete='password' {...register("Password", { required: true })} />
              <p
                onClick={() => setconfirmpassword(prev => !prev)}
                className='absolute top-2.5 right-3 cursor-pointer text-gray-500'
              >{confirmpassword ? <FiEyeOff /> : <FiEye />}</p>
            </div>
            {watch("NewSPassword") !== watch("Password") && watch("Password") && (
              <p className='text-red-500 text-sm mb-2 -mt-2'>Passwords do not match</p>
            )}

            {/* <input type="password" placeholder='Confirm New Password' className='outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-4' autoComplete='password' {...register("Password", { required: true })} /> */}

            <button type='submit' disabled={isSubmitting} className={`${isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/25 hover:scale-105 hover:-translate-y-0.3"
              } bg-gradient-to-r from-cyan-500 to-blue-600 w-[80%] text-white mb-2 rounded-[15px] cursor-pointer p-1 hover:from-cyan-400 hover:to-blue-500 transition-all duration-100 font-medium shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 hover:-translate-y-0.3 outline-none border-none`}>{isSubmitting ? "Submitting..." : "Submit"}</button>
          </div>

        </form>
      </div>

    </div>
  )
}

export default NewPassword_popup
