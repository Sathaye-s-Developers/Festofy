import React, { useContext, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { EventAppContext } from '../../../Context/EventContext';
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify';
const Voleenter_Popup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [errormsg, seterrorMsg] = useState("")
    const [isSubmitting, setisSubmitting] = useState(false)
    const { setVoleenter, EventNo, setEventNo, subEventNo, setsubEventNo, api, settoastCondition } = useContext(EventAppContext)
    const onsubmit = async (data) => {
        const payload = {
            roll_no: data.RollNo,
            eventId: EventNo,
            subEventId: subEventNo
        }
        try {
            setisSubmitting(true)
            const response = await api.post("/Festofy/user/event/volunteer/register", payload, {
                withCredentials: true,
            })
            if (response.data.success) {
                setVoleenter(false)
                setisSubmitting(false)
                window.location.reload()
            }
            setisSubmitting(false)
        } catch (err) {
            if (err.response && (err.response.status === 409 || err.response.status === 404 || err.response.status === 400)) {
                seterrorMsg(err.response.data.error);
                setisSubmitting(false)
            }
        }
    }
    return (
        <div>
            <div className='fixed inset-0 z-50 w-full h-full bg-[#00000090] grid'>
                <div className='place-self-center left-[580px] opacity-80 top-[200px] bg-white rounded-[12px] w-[90%] sm:w-[55%] md:w-[50%] lg:w-[40%] xl:w-[30%] animate-[fadein_0.5s_ease-in-out_forwards] text-white'>
                    <div className='p-5 flex justify-between font-[Nunito]'>
                        <h1 className='font-bold ml-5 text-[18px] text-black'>Voleenter Register</h1>
                        <RxCross2 onClick={() => { setVoleenter(false) }} color='black' />
                    </div>
                    <div className='font-[Nunito]'>
                        <form onSubmit={handleSubmit(onsubmit)}>
                            <div className='flex flex-col items-center'>
                                <input type="text" placeholder='Your RollNo' className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-4' autoComplete='RollNo' {...register("RollNo", { required: true })} />
                                {/* 
                                <input type="text" placeholder='Your Department' className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-4' autoComplete='email' {...register("Department", { required: true })} /> */}
                                {errormsg && (<div className='w-[80%] mb-3'><p className='text-red-600'>{errormsg}</p></div>)}
                                <button type='submit' disabled={isSubmitting} className={`${isSubmitting
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/25 hover:scale-105 hover:-translate-y-0.3"
                                    } bg-gradient-to-r from-cyan-500 to-blue-600 w-[80%] text-white mb-2 rounded-[15px] cursor-pointer p-1 hover:from-cyan-400 hover:to-blue-500 transition-all duration-100 font-medium shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 hover:-translate-y-0.3 outline-none border-none`}>{isSubmitting ? "Submitting..." : "Submit"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Voleenter_Popup
