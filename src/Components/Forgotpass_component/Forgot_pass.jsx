import React, { useContext, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { EventAppContext } from '../../Context/EventContext';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const Forgot_pass = ({ Forgototp, setForgototp, setregemail }) => {
    const { setRegister, api, password, setpassword } = useContext(EventAppContext)
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onsubmit = async (formData) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const response = await api.post("/Festofy/user/otp/forgot", { email: formData.Email })
            if (response) {
                setForgototp(true)
                setregemail(formData.Email)
            }
            setIsSubmitting(false);

        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError("Email", {
                    type: "manual",
                    message: "Email is not registered.",
                });
            } else {
                console.log(err);
            }
            setIsSubmitting(false);
        }

    }
    return (
        <div className='mb-3'>
            <div className='p-5 flex justify-between font-[Nunito]'>
                <h1 className='font-bold ml-5 text-[18px] text-black'>Forgot Password</h1>
                <RxCross2 onClick={() => { setpassword(false) }} color='black' />
            </div>
            <div className='font-[Nunito]'>
                <form onSubmit={handleSubmit(onsubmit)}>
                    <div className='flex flex-col items-center'>
                        <label className='w-[80%] mb-2 text-black' htmlFor="email">Enter Registered Email :</label>
                        <input type="email" placeholder='Your Email' className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-4' autoComplete='email' {...register("Email", { required: true })} />
                        {errors.Email && <p className="text-red-500 text-sm mb-2 -mt-2">{errors.Email.message}</p>}
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

export default Forgot_pass
