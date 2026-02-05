import React, { useContext, useState } from 'react'
import { CgProfile } from "react-icons/cg";
import { EventAppContext } from '../../../Context/EventContext';
import { Calendar, LogOut, Settings, Globe } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Link } from "react-router-dom"

const EventOptions = ({ popupRef }) => {
    const Navigate = useNavigate()
    const { details, randcolor, settoken, profileOptions, setprofileOptions, api, setdetails, setisAuthenticated, key, setkey } = useContext(EventAppContext)

    const logout = async (e) => {
        try {
            e.preventDefault();
            await api.post("/Festofy/user/logout", { withCredentials: true });
            setdetails({ username: "", email: "", role: "" });
            setisAuthenticated(false)
            localStorage.removeItem("ULRKGDAPS")
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <div ref={popupRef}>
            <div className={`h-full fixed top-2 right-0 lg:w-[28vw] xl:w-[22vw] sm:w-[44vw] md:w-[35vw] w-[60vw] max-w-[60vw] z-50 transition-transform ease-in-out transform ${profileOptions ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="rounded-[18px] h-full bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-r border-cyan-400/20 shadow-2xl">
                    <div className='h-full px-4 py-6 sm:px-6 sm:pt-8 flex flex-col items-center'>
                        <div className='flex flex-col items-center space-y-3 text-center'>
                            {details.username ? (
                                <div className={`border-slate-200  border-2 w-14 h-14 rounded-[50%] flex items-center justify-center`} style={{ backgroundColor: randcolor }}>
                                    <p className='text-3xl text-center text-gray-200 font-bold drop-shadow-sm'>{details.username?.charAt(0).toUpperCase()}</p>
                                </div>
                            ) : (
                                <CgProfile className='text-slate-400' size={60} />
                            )}

                            <p className='text-slate-50 font-bold m-1 sm:text-lg text-sm break-all'>Welcome , {details.username?.charAt(0).toUpperCase() + details.username?.slice(1).toLowerCase()}
                            </p>
                            <p className='text-slate-300 text-sm  break-all'>{details.email}</p>

                        </div>
                        <hr className='border-t border-white mt-5 w-full' />
                        <div className='w-full flex flex-col justify-between h-full mt-2'>
                            <div className='flex flex-col'>
                                <Link onClick={() => { setprofileOptions(false) }} to="/Profile">
                                    <div className="flex items-center justify-center gap-2 text-slate-300 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-all duration-300 w-full group mb-1">
                                        <CgProfile className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                                        <span className="font-medium">Your Profile</span>
                                    </div>
                                </Link>

                                <Link onClick={() => {
                                    if (details.role !== "admin") {
                                        setkey(true)
                                    }
                                    setprofileOptions(false)
                                }} to={details.role === "admin" ? "/Admin" : "/Event"}>
                                    <button className="flex items-center justify-center gap-2 text-slate-300 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-all duration-300 w-full group mb-1">
                                        <Calendar className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                                        <span className="font-medium">Your Events</span>
                                    </button>
                                </Link>

                                <Link onClick={() => { setprofileOptions(false) }} to="/InterCollegateEvents">
                                    <button className="flex items-center justify-center gap-3 text-slate-300 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-all duration-300 w-full group mb-1">
                                        <Globe className="w-4 h-4 text-pink-400 group-hover:text-pink-300 transition-colors" />
                                        <span className="font-medium">InterCollegate Events</span>
                                    </button>
                                </Link>

                                {/* <button className="flex items-center justify-center gap-3 text-slate-300 hover:text-white p-3 rounded-xl hover:bg-white/5 transition-all duration-300 w-full group mb-1">
                                    <Settings className="w-4 h-4 text-pink-400 group-hover:text-pink-300 transition-colors" />
                                    <span className="font-medium">Settings</span>
                                </button> */}

                            </div>
                            <button className="w-full bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 border border-red-400/30 hover:border-red-400/50 text-red-400 hover:text-red-300 p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group" onClick={logout}>
                                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>

                    </div>

                </div>

                {/* </div>
        </div> */}
            </div >
        </div >
    )
}

export default EventOptions