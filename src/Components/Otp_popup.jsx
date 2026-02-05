import React, { useContext, useEffect, useRef, useState } from 'react'
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { EventAppContext } from '../Context/EventContext';
import axios from 'axios';

const Otp_popup = ({ email }) => {
    const { api, setRegister, setprogress, otp, setotp, setisAuthenticated ,isAuthenticated,setprofile} = useContext(EventAppContext)
    const [errorMsg, seterrorMsg] = useState("")
    const [timerKey, setTimerKey] = useState(0);
    const [displayTime, setDisplayTime] = useState("2:59");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const timeDisplayRef = useRef("2:59");
    const timerRef = useRef(null)
    const minutesRef = useRef(2)
    const secondsRef = useRef(59)


    const inputs = useRef([])

    useEffect(() => {
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            if (secondsRef.current > 0) {
                secondsRef.current -= 1;
            } else {
                if (minutesRef.current > 0) {
                    minutesRef.current -= 1;
                    secondsRef.current = 59;
                } else {
                    clearInterval(timerRef.current);
                }
            }

            const formattedTime = `${minutesRef.current}:${secondsRef.current < 10 ? '0' + secondsRef.current : secondsRef.current}`;
            timeDisplayRef.current = formattedTime;
            setDisplayTime(formattedTime);


        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [timerKey]);



    const getOtpValue = async (e) => {
        e.preventDefault()
        if (isSubmitting) return;
        setIsSubmitting(true);
        const otp = inputs.current.map(input => input?.value).join("");

        try {
            const response = await api.post("/Festofy/user/otp/verify-otp", { email: email, otp: otp }, {
                withCredentials: true, // 👈 sends cookies
            })
            if (response.data.success) {
                setprogress(50)
                setotp(false)
                setprogress(100)
                setisAuthenticated(true)
                localStorage.setItem("ULRKGDAPS","ABCEFG123")
                setprofile(true)
            }
            setIsSubmitting(false);
        } catch (err) {
            if (err.response && (err.response.status === 400)) {
                seterrorMsg(err.response.data.message);
                setprogress(0)
                setIsSubmitting(false);
            }
        }
    };

    const onsubmit = async (e) => {
        try {
            const response = await api.post("/Festofy/user/otp/send-otp", { email })

        } catch (err) {
            if (err.response && (err.response.status === 409 || err.response.status === 401)) {
                seterrorMsg(err.response.data.message);
            }
        }
    }

    const onresend = () => {
        minutesRef.current = 2;
        secondsRef.current = 59;
        setDisplayTime("2:59");
        setTimerKey(prev => prev + 1);
        onsubmit()
    }
    const handleChange = (e, index) => {
        const value = e.target.value;
        if (value && index < inputs.current.length - 1) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    return (
        <div>
            <form onSubmit={getOtpValue}>
                <div className='relative p-5 pb-2 flex justify-between font-[Nunito]'>
                    <p className='absolute' onClick={() => { setotp(false) }} ><IoArrowBackCircleSharp color='black' onClick={() => { setprogress(0) }} size={30} /></p>
                    <div className='flex justify-center w-full'>
                        <p className='font-bold text-[18px] text-black'>Enter Otp</p>
                    </div>
                </div>
                <div className='ml-10 mr-10'>
                    <p className='text-[12px] text-center text-gray-500'>Otp sent on <br /> {email}</p>
                </div>
                <div className='flex flex-col items-center'>
                    <div className='flex mb-3 justify-center gap-3 m-5'>
                        {[...Array(6)].map((_, i) => (
                            <input
                                key={i}
                                ref={(el) => (inputs.current[i] = el)}
                                type="text"
                                maxLength={1}
                                className="border-2 border-gray-300 rounded-[5px] w-10 h-10 text-center  p-1 cursor-pointer text-black"
                                pattern="[0-9]*"
                                inputMode="numeric"
                                required
                                autoComplete='auto'
                                onChange={(e) => handleChange(e, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                            />
                        ))}
                    </div>
                    {errorMsg &&
                        <div>
                            <p className=' text-red-500 text-[14px] text-left'>{errorMsg}</p>
                        </div>}
                </div>

                <div className='ml-5 md:ml-6 lg:ml-11 mt-3 flex justify-between w-[85%] md:w-[80%]'>
                    <div className='flex items-center justify-center gap-1'>
                        <p className='font-semibold text-[12px] text-center text-black'>Time Remaining : </p>
                        <p className={`font-extrabold text-[12px] text-center ${displayTime.startsWith("0:") && parseInt(displayTime.split(":")[1]) < 20 ? "text-red-500" : "text-black"}`}>
                            {displayTime}
                        </p>

                    </div>
                    <div>
                        <button
                            onClick={onresend}
                            disabled={!(timeDisplayRef.current === "0:00")}
                            className={`text-[14px] underline ${displayTime === "0:00" ? "text-white cursor-pointer" : "text-[#B0B0B0] cursor-not-allowed"
                                }`}
                        >
                            Resend-otp
                        </button>
                    </div>
                </div>
                <div className='flex justify-center  mt-3'>
                    <button type='submit' disabled={isSubmitting} className={`${isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/25 hover:scale-105 hover:-translate-y-0.3"
                        } bg-gradient-to-r from-cyan-500 to-blue-600 w-[80%] text-white mb-2 rounded-[15px] cursor-pointer p-1 hover:from-cyan-400 hover:to-blue-500 transition-all duration-100 font-medium shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 hover:-translate-y-0.3 outline-none border-none`}>{isSubmitting ? "Submitting..." : "Submit"}</button>
                </div>

            </form>
        </div>
    )
}

export default React.memo(Otp_popup)