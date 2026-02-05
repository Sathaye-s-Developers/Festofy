import React, { useCallback, useContext, useState } from 'react'
import { EventAppContext } from '../Context/EventContext'
import axios from 'axios'
import Otp_popup from './Otp_popup'
import { useForm, Controller } from "react-hook-form";
import Forgot_pass from "./Forgotpass_component/Forgot_pass"
import Forgot_OtpPopup from './Forgotpass_component/Forgot_OtpPopup';
import LoginForm from './LoginForm';
import NewPassword_popup from './Forgotpass_component/NewPassword_popup';
import { useNavigate } from 'react-router';
import SetProfile_Popup from './SetProfile_Popup';
import { toast } from 'react-toastify';

const Login_PopUp = () => {
    const { api, setprogress, otp, setotp, password, setpassword, setRegister, setisAuthenticated, fetchUserDetails,setadmin,profile} = useContext(EventAppContext)
    const [login, setlogin] = useState("logout")
    const [Forgototp, setForgototp] = useState(false)
    const [errorMsg, seterrorMsg] = useState("")
    const [newpassword, setnewpassword] = useState(false)
    const [regemail, setregemail] = useState("")
    const [email, setemail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const Navigate = useNavigate()
    const {
        register,
        handleSubmit,
        setValue,
        control
    } = useForm();

    const RenderSmallComponent = () => {
        if (newpassword) return <NewPassword_popup Allclose={Allclose} />

        if (Forgototp) return <Forgot_OtpPopup setForgototp={setForgototp} setnewpassword={setnewpassword} regemail={regemail} />;

        if (password) return <Forgot_pass Forgototp={Forgototp} setForgototp={setForgototp} setregemail={setregemail} />

        if (otp) return <Otp_popup email={email} setotp={setotp} login={login} />

        if (profile) return <SetProfile_Popup  />

        return <LoginForm login={login} setlogin={setlogin} onsubmit={onsubmit} control={control} errorMsg={errorMsg} isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting} setValue={setValue} register={register} handleSubmit={handleSubmit} Controller={Controller} />
    }

    const Allclose = () => {
        setnewpassword(false)
        setForgototp(false)
        setpassword(false)
    }

    const onsubmit = useCallback(async (formData) => {
        seterrorMsg("")
        if (isSubmitting) return;
        setIsSubmitting(true);
        const payload = {
            username: formData.Username,
            email: formData.Email,
            password: formData.Password,
            adminCode: formData.Special_key
        };

        if (login === "login") {
            payload.college_code = formData.college_code;
        }

        let newurl = api.defaults.baseURL;
        if (login === "logout") {
            newurl += "/Festofy/user/login"
        } else {
            newurl += "/Festofy/user/signUp"
        }
        try {
            const response = await axios.post(newurl, payload, {
                withCredentials: true,
            })
            if (login === "logout") {
                if (response.data.role === "admin") {
                    setadmin(true)
                    setprogress(70)
                    setIsSubmitting(true);
                    setRegister(false)
                    setisAuthenticated(true)
                    localStorage.setItem("ULRKGDAPS", "ABCEFG123")
                    await fetchUserDetails()
                    Navigate("/Admin")
                    setprogress(100)
                } else if (response.data.success) {
                    setprogress(70)
                    setIsSubmitting(true);
                    setRegister(false)
                    setisAuthenticated(true)
                    localStorage.setItem("ULRKGDAPS", "ABCEFG123")
                    await fetchUserDetails()
                    toast.success("User logged in successfully !");
                    setprogress(100)
                }
            } else {
                if (response.data.success) {
                    setprogress(70)
                    setotp(true)
                    setemail(formData.Email)
                    setIsSubmitting(true);
                    try {
                        const response = await api.post("/Festofy/user/otp/register-login", { email: formData.Email })
                        if (response.data.success) {
                            setprogress(100)
                        }
                        setIsSubmitting(false);
                        await fetchUserDetails()
                    } catch (err) {
                        setprogress(0);
                        if (err.response && (err.response.status === 409 || err.response.status === 401)) {
                            seterrorMsg(err.response.data.message);
                        }
                        setIsSubmitting(false);
                    }
                }
            }
        } catch (err) {
            if (err.response && (err.response.status === 409 || err.response.status === 401)) {
                seterrorMsg(err.response.data.message);
                setIsSubmitting(false);
            }
        }

    }, [api, login, setprogress])

    return (
        <div className='fixed inset-0 z-50 w-full h-full bg-[#00000090] grid'>
            <div className='place-self-center left-[580px] opacity-80 top-[200px] bg-white rounded-[12px] w-[90%] sm:w-[55%] md:w-[50%] lg:w-[40%] xl:w-[30%] animate-[fadein_0.5s_ease-in-out_forwards] text-white'>

                {RenderSmallComponent()}

            </div>
        </div>
    )
}

export default Login_PopUp
