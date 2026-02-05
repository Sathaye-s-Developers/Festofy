import React from 'react'
import Navbar from "../Components/Navbar"
import Header from './Header';
import Features from "../Components/Features"
import EventGalary from './EventGalary';
import About from '../Pages/About';
import EnquiryOption from "./EnquiryOption"
import Tutorialsteps from './Tutorialsteps';

const Navbar_Design = () => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-black" style={{

        }}>

            <Navbar />

            <main className="relative z-10 flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="max-w-7xl mx-auto">
                    <Header />
                    <Features />
                    <Tutorialsteps />
                    <EventGalary />
                    <About />
                    <EnquiryOption />
                </div>

            </main>
        </div>
    )
}

export default Navbar_Design
