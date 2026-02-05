import React, { useContext } from 'react'
import { House, DollarSign, Image, Calendar1, User } from 'lucide-react';
import { X } from 'lucide-react';
import { EventAppContext } from '../Context/EventContext';
import { Link } from "react-router-dom"

const Mobile_Options = () => {
    const { setoptions, setRegister, isAuthenticated,api,setisAuthenticated,setdetails} = useContext(EventAppContext)
    const toggleoption = () => {
        setoptions(false)
    }
    const toggleLogin = () => {
        setoptions(false)
        setRegister(true)
    }
    const logout = async (e) => {
        try {
            e.preventDefault();
            await api.post("/Festofy/user/logout", { withCredentials: true }); // backend clears the cookie
            setdetails({ username: "", email: "" }); // clear context user
            setisAuthenticated(false)
            localStorage.removeItem("ULRKGDAPS")
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <div>
            <div className='fixed inset-0 z-50 w-full h-full grid'>
                <div className='md:hidden place-self-center left-[580px] opacity-100 top-[200px] bg-black w-[80%] sm:w-[50%] rounded-[15px] animate-[fadein_0.5s_ease-in-out_forwards] text-white ]'>
                    <div className='flex flex-col items-end mt-5 mr-7'>
                        <button className='p-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-xl' onClick={toggleoption}> <X className={` w-6 h-6 text-cyan-400 transition-all duration-300'}`} /></button>
                    </div>

                    <div className='flex flex-col items-center mt-3'>
                        <p className='group p-5 border-2 border-transparent w-[80%] ml-3 mr-3 rounded-[15px] font-bold flex items-center gap-3 relative text-gray-300 transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-600/20 hover:border-cyan-400/20 hover:text-cyan-300'><House className={` inset-0 w-6 h-6 text-cyan-400 `} />Home</p>

                        {isAuthenticated ?
                            <p className='group p-5 border-2 border-transparent w-[80%] ml-3 mr-3 rounded-[15px] font-bold flex items-center gap-3 relative text-gray-300 transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-600/20 hover:border-cyan-400/20 hover:text-cyan-300' onClick={() => { setoptions(false) }}><DollarSign className={`inset-0 w-6 h-6 text-cyan-400 `} /><Link to="/Event">Events</Link></p>
                            :
                            <></>
                        }

                        {/* Optional Future
                        <p className='group p-5 border-2 border-transparent w-[80%] ml-3 mr-3 rounded-[15px] font-bold flex items-center gap-3 relative text-gray-300 transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-600/20 hover:border-cyan-400/20 hover:text-cyan-300'><DollarSign className={`inset-0 w-6 h-6 text-cyan-400 `} />Pricing</p> */}

                        <a onClick={toggleoption} href='#Gallary' className='group p-5 border-2 border-transparent w-[80%] ml-3 mr-3 rounded-[15px] font-bold flex items-center gap-3 relative text-gray-300 transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-600/20 hover:border-cyan-400/20 hover:text-cyan-300'><Image className={`inset-0 w-6 h-6 text-cyan-400 `} />Gallery</a>

                        <a onClick={toggleoption} href='#About' className='group p-5 border-2 border-transparent w-[80%] ml-3 mr-3 rounded-[15px] font-bold flex items-center gap-3 relative text-gray-300 transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-600/20 hover:border-cyan-400/20 hover:text-cyan-300'><Image className={`inset-0 w-6 h-6 text-cyan-400 `} />About</a>

                        {isAuthenticated ? <></> :
                            <a onClick={toggleoption} href='#Enquiry' className='group p-5 border-2 border-transparent w-[80%] ml-3 mr-3 rounded-[15px] font-bold flex items-center gap-3 relative text-gray-300 transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-600/20 hover:border-cyan-400/20 hover:text-cyan-300'><Image className={`inset-0 w-6 h-6 text-cyan-400 `} />Enquiry</a>}

                        {/* <p className='p-5 border-2 w-[80%] ml-3 mr-3 rounded-[15px] font-bold flex items-center gap-3 relative'>About</p> */}

                        <hr className='border-2 m-5 w-[80%]' />

                        {isAuthenticated ? <button className='p-4 border-2 mb-5 w-[80%] ml-3 mr-3  flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl font-semibold rounded-full hover:from-cyan-400 hover:to-blue-500 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/40 relative overflow-hidden' onClick={logout}><User />Logout</button> :

                            <button className='p-4 border-2 mb-5 w-[80%] ml-3 mr-3  flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl font-semibold rounded-full hover:from-cyan-400 hover:to-blue-500 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/40 relative overflow-hidden' onClick={toggleLogin}><User />Login</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Mobile_Options
