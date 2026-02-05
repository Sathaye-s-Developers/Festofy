import React from 'react'
import { RxCross2 } from "react-icons/rx";
import { FaShareAlt } from "react-icons/fa";
import { useContext } from 'react';
import { EventAppContext } from '../Context/EventContext';
import { Copy } from "lucide-react";
import { useState } from 'react';

const Share_Popup = () => {
    const { setshare, share } = useContext(EventAppContext)
    const [copy,setcopied]=useState(false)
    const link = `https://festofy-frontend.onrender.com/SubEvent/${share.eventId}`;
    const handleCopy=async()=>{
        try{
            await navigator.clipboard.writeText(link)
            setcopied(true)
            setTimeout(()=>setcopied(false),2000)
        }catch(err){
            console.log(err)
        }
    }
    return (
        <div>
            <div className='fixed inset-0 z-50 w-full h-full bg-[#00000090] grid'>
                <div className='place-self-center bg-white rounded-[12px] w-[85%] max-w-sm sm:max-w-md  animate-[fadein_0.5s_ease-in-out_forwards] text-white'>
                    <div className='p-5 flex justify-between font-[Nunito]'>
                        <h1 className='font-bold ml-5 text-[18px] text-black flex gap-3 items-center'><FaShareAlt />Share Link</h1>
                        <RxCross2 color='black' onClick={() => setshare({ Isshare: false, eventId: "" })} />
                    </div>
                    <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 px-4 pb-4'>
                        <div className='flex-1 text-black outline-none border-2 border-gray-300 rounded-[5px] p-1 overflow-hidden'>
                            <p className='text-xs sm:text-sm text-gray-700 truncate w-full'>
                                {link}
                            </p>
                        </div>
                        <button onClick={handleCopy}
                            className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition whitespace-nowrap"
                        >
                            <Copy className="w-4 h-4" color="white" />
                            {copy?"Copied":"Copy"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Share_Popup
