import React, { useState } from 'react'
import { Star, ArrowRight } from "lucide-react";
import Cultural1 from "../Websites data/Event Galary/Cultural1.jpeg"
import Sports1 from "../Websites data/Event Galary/Sports1.jpeg"
import Tech4 from "../Websites data/Event Galary/Tech4.jpeg"
import Cultural2 from "../Websites data/Event Galary/Cultural2.jpeg"
import Sports2 from "../Websites data/Event Galary/Sports2.jpeg"
import Tech2 from "../Websites data/Event Galary/Tech2.jpeg"

import { Event_List, Featured_Event_List } from '../Websites data/Event Galary/FeaturedImages';

const EventGalary = () => {
    const [activeGalleryImage, setActiveGalleryImage] = useState(null);
    const [category, setCategory] = useState("all")


    const galleryImages = [
        Cultural1,
        Sports1,
        Tech4,
        Cultural2,
        Sports2,
        Tech2
    ];

    return (
        <div className="mb-20 flex flex-col items-center" id='Gallary'>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fadeInUp">
                Event <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Gallery</span>
            </h2>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                Discover the amazing events our platform has helped bring to life
            </p>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((image, index) => {
                    const isActive = activeGalleryImage === index;
                    return (
                        <div
                            key={index}
                            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer transform animate-fadeInUp ${isActive
                                    ? 'border-cyan-400/60 scale-105 -translate-y-2 shadow-lg shadow-cyan-500/20'
                                    : 'border-cyan-400/20 hover:border-cyan-400/40 hover:scale-105 hover:-translate-y-2'
                                }`}
                            style={{ animationDelay: `${index * 100}ms` }}
                            onClick={() => setActiveGalleryImage(isActive ? null : index)}
                            onTouchStart={() => setActiveGalleryImage(index)}
                            onTouchEnd={() => setTimeout(() => setActiveGalleryImage(null), 3000)}
                        >
                            <img
                                src={image}
                                alt={`Event ${index + 1}`}
                                className={`w-full h-64 object-cover transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'
                                    }`}
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}></div>
                            <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${isActive ? 'translate-y-0 opacity-100' : 'transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100'
                                }`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-white font-semibold">Featured Event</h4>
                                        <p className="text-cyan-300 text-sm">College Festival</p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-white text-sm">4.9</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div> */}

            <div className='flex justify-center gap-5'>
                {Featured_Event_List.map((item, index) => {
                    return (
                        <div
                            onClick={() =>
                                setCategory(prev =>
                                    prev === item.Event_Category ? "all" : item.Event_Category
                                )
                            }
                            key={index}
                            className="flex flex-col items-center cursor-pointer"
                        >
                            <img
                                src={item.Event_image}
                                alt={item.Event_Category}
                                className={`w-20 h-20 sm:w-40 sm:h-40 rounded-[50%] transition duration-200 
                           ${category === item.Event_Category ? "ring-2 ring-blue-500 scale-105" : ""}`}
                            />
                            <p className="mt-2 text-gray-300 text-[max(1.4vw,16px)]">
                                {item.Event_Category}
                            </p>
                        </div>
                    );
                })}
            </div>
            <hr className='m-12' />


            {/* grid gap-x-[30px] gap-y-[50px] mt-[30px] grid-cols-[repeat(auto-fill,minmax(240px,1fr))] */}



            <div className='grid mt-[30px] gap-x-[30px] gap-y-[50px] 
                grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {Event_List.map((item, index) => {
                    const isActive = category === item.Category; // you can define logic for active state
                    if (category === "all" || isActive) {
                        return (
                            <div
                                key={index}
                                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer transform animate-fadeInUp ${isActive
                                    ? "border-cyan-400/60 scale-105 -translate-y-2 shadow-lg shadow-cyan-500/20"
                                    : "border-cyan-400/20 hover:border-cyan-400/40 hover:scale-105 hover:-translate-y-2"
                                    }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                                onClick={() => setActiveGalleryImage(isActive ? null : index)}
                                onTouchStart={() => setActiveGalleryImage(index)}
                                onTouchEnd={() => setTimeout(() => setActiveGalleryImage(null), 3000)}
                            >
                                <img
                                    src={item.Event_image}
                                    alt={item.Category}
                                    className={`w-[280px] h-64 object-cover transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"
                                        }`}
                                />
                                {/* Gradient Overlay */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${isActive
                                        ? "opacity-100"
                                        : "opacity-0 group-hover:opacity-100"
                                        }`}
                                ></div>

                                {/* Bottom Text Info */}
                                <div
                                    className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${isActive
                                        ? "translate-y-0 opacity-100"
                                        : "transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-white font-semibold">{item.Category} Event</h4>
                                            <p className="text-cyan-300 text-sm">College Festival</p>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4 text-yellow-400 fill-current"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.383 2.46a1 1 0 00-.364 1.118l1.287 3.965c.3.922-.755 1.688-1.54 1.118l-3.384-2.46a1 1 0 00-1.176 0l-3.383 2.46c-.786.57-1.841-.196-1.541-1.118l1.287-3.965a1 1 0 00-.364-1.118L2.045 9.393c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.288-3.966z" />
                                            </svg>
                                            <span className="text-white text-sm">4.9</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}

            </div>

        </div>
    )
}

export default EventGalary
