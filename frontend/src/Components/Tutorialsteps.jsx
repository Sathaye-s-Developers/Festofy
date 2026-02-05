import gsap from 'gsap';
import React, { useRef } from 'react'
import { LuArrowBigDown } from "react-icons/lu";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from '@gsap/react';

function Tutorialsteps() {

    gsap.registerPlugin(ScrollTrigger)
    const cardtutref = useRef([]);
    useGSAP(
        () => {
            const ctx = gsap.context(() => {
                cardtutref.current.forEach((card) => {
                    if (!card) return;

                    gsap.fromTo(
                        card,
                        { y: 20, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.3,
                            ease: "power2.out",
                            stagger: 0.05,
                            scrollTrigger: {
                                trigger: card,
                                start: "top 80%",
                                toggleActions: "play none none reverse",
                                once: true,
                            },
                            clearProps: "transform"
                        }
                    );
                });
            });

            // Cleanup when component unmounts
            return () => ctx.revert();
        },
        [cardtutref]
    );


    return (
        <div className='mb-20' id='Tutorial'>
            <div>

                <p className='text-3xl md:text-4xl font-bold text-white animate-fadeInUp'>Steps To Get  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Special Key / Add College Name</span></p>

                <div className='flex flex-col mt-10 items-center animate-fadeInUp'>

                    <div ref={(el) => (cardtutref.current[0] = el)} className='h-[180px] md:h-[200px] border md:w-[44%]  p-2 rounded-[18px] border-cyan-400/20 hover:border-cyan-400/40 group bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer will-change-transform flex flex-col items-center justify-center'>

                        <p className='text-xl sm:text-[26px] font-bold text-blue-400 '>Step 1 </p>
                        <p className='text-xl md:text-2xl font-bold text-white '>Fill out enquiry form below</p>
                        <p className='text-[15px] md:text-[15px] font-bold text-pink-300 mt-1 flex flex-col items-center justify-center'>(Requests will only be accepted from the Head of Department <br /> or Event In-charge (Teaching Staff)) </p>

                    </div>

                    <LuArrowBigDown color='lightblue' size={70} />

                    <div ref={(el) => (cardtutref.current[1] = el)} className='h-[180px] md:h-[200px] border md:w-[44%]  p-2 rounded-[18px] border-cyan-400/20 hover:border-cyan-400/40 group bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer will-change-transform flex flex-col items-center justify-center'>

                        <p className='text-xl sm:text-[26px] font-bold text-blue-400 '>Step 2 </p>
                        <p className='text-xl md:text-2xl font-bold text-white '>Upload a valid proof</p>
                        <p className='text-[15px] md:text-[15px] font-bold text-pink-300 mt-1'>(Kindly upload a formal letter or valid proof verifying that the<br /> sender  is a faculty member or departmental head) </p>

                    </div>
                    <LuArrowBigDown color='lightblue' size={70} />

                    <div ref={(el) => (cardtutref.current[2] = el)} className='h-[180px] md:h-[200px] border md:w-[44%]  p-2 rounded-[18px] border-cyan-400/20 hover:border-cyan-400/40 group bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer will-change-transform flex flex-col items-center justify-center'>

                        <p className='text-xl sm:text-[26px] font-bold text-blue-400 '>Step 3 </p>
                        <p className='text-xl md:text-2xl font-bold text-white '>We'll Reach Out Within 24 Hours</p>
                        <p className='text-[14px] font-bold text-pink-300 mt-1'>(When your information is verified,the result will be sent to you) </p>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tutorialsteps
