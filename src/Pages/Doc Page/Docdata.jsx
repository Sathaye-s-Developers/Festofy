import React, { useState } from 'react';
import { Search, Menu, X, ChevronRight, ChevronDown, Sun, Moon, Book, Github, ExternalLink, Copy, Check, Calendar } from 'lucide-react';
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { Link } from "react-router-dom"
import p2 from "../../assets/t1/p2.png"
import t3 from "../../assets/t1/t3.png"
import t4 from "../../assets/t1/t4.mp4"
import t5 from "../../assets/t1/t5.mp4"

const Docdata = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSections, setExpandedSections] = useState(['getting-started']);
    const [copiedCode, setCopiedCode] = useState('');

    const navigation = [
        {
            title: 'Getting Started',
            id: 'getting-started',
            items: [
                { title: 'Introduction', href: '#introduction' },
                { title: 'Tutorial 1: Login & signup tutorial', href: '#Tutorial1' },
                { title: 'Tutorial 2: Special key access', href: '#Tutorial2' },
                { title: 'Tutorial 3: Steps to become a sub-eventhead', href: '#Tutorial3' },
                { title: 'Tutorial 4: Steps to create event & subevent', href: '#Tutorial4' },
                { title: 'Tutorial 5: Steps to mark attendance', href: '#Tutorial5' },
            ]
        }
    ]
    //     },
    //     {
    //         title: 'API Reference',
    //         id: 'api-reference',
    //         items: [
    //             { title: 'Authentication', href: '#authentication' },
    //             { title: 'Endpoints', href: '#endpoints' },
    //             { title: 'Rate Limiting', href: '#rate-limiting' },
    //         ]
    //     },
    //     {
    //         title: 'Guides',
    //         id: 'guides',
    //         items: [
    //             { title: 'Best Practices', href: '#best-practices' },
    //             { title: 'Error Handling', href: '#error-handling' },
    //             { title: 'Examples', href: '#examples' },
    //         ]
    //     },
    //     {
    //         title: 'Resources',
    //         id: 'resources',
    //         items: [
    //             { title: 'Changelog', href: '#changelog' },
    //             { title: 'FAQ', href: '#faq' },
    //             { title: 'Support', href: '#support' },
    //         ]
    //     }
    // ];

    const toggleSection = (sectionId) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(''), 2000);
    };

    const codeExample = `npm install @company/api-client

import { ApiClient } from '@company/api-client';

const client = new ApiClient({
  apiKey: 'your-api-key',
  environment: 'production'
});

const result = await client.users.list({
  limit: 10,
  page: 1
});`;
    return (
        <div>
            <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
                {/* Header */}
                <header className={`sticky w-full top-0 z-50 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className={`lg:hidden p-2 rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                                </button>
                                <div className="flex items-center space-x-2">
                                    {/* <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-400/40 group-hover:bg-cyan-500/30 group-hover:border-cyan-400/60 transition-all duration-300 group-hover:scale-110">
                                            <Calendar className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
                                        </div> */}
                                    <span className={`font-bold text-[28px] ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Festofy
                                    </span>
                                </div>
                            </div>
                            {/* 
                                <nav className="hidden md:flex items-center space-x-8">
                                    <a href="#docs" className={`font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                                        Documentation
                                    </a>
                                    <a href="#api" className={`font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                                        API Reference
                                    </a>
                                    <a href="#guides" className={`font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                                        Guides
                                    </a>
                                    <a href="#support" className={`font-medium ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                                        Support
                                    </a>
                                </nav> */}

                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className={`p-2 rounded-md ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                                </button>

                                <Link to="/" className={`flex items-center gap-1  ${darkMode ? 'text-gray-300' : 'text-gray-600 '}`}><IoChevronBackCircleSharp size={28} /><span className={`text-[20px] ${darkMode ? 'text-white' : 'text-gray-900'}`}>Back</span></Link>

                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex">
                    {/* Sidebar */}
                    <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 transition-transform duration-200 ease-in-out ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        } border-r overflow-y-auto pt-16 lg:pt-0`}>
                        <nav className="px-4 py-8">
                            {navigation.map((section) => (
                                <div key={section.id} className="mb-6">
                                    <button
                                        onClick={() => toggleSection(section.id)}
                                        className={`flex items-center justify-between w-full text-left font-medium text-sm mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'
                                            }`}
                                    >
                                        {section.title}
                                        {expandedSections.includes(section.id) ? (
                                            <ChevronDown size={16} />
                                        ) : (
                                            <ChevronRight size={16} />
                                        )}
                                    </button>
                                    {expandedSections.includes(section.id) && (
                                        <ul className="space-y-2 ml-4">
                                            {section.items.map((item) => (
                                                <li key={item.href}>
                                                    <a
                                                        href={item.href}
                                                        className={`block text-sm py-1 hover:text-blue-600 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                                            }`}
                                                    >
                                                        {item.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* Overlay */}
                    {sidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    {/* Main Content */}
                    <main className="flex-1 w-full transition-all duration-200">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            {/* Breadcrumb */}
                            <nav className="flex items-center space-x-2 text-sm mb-8">
                                <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                                    Docs
                                </a>
                                <ChevronRight size={16} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Getting Started</span>
                            </nav>

                            {/* Content */}
                            <article className="prose prose-lg max-w-none">
                                <div id='introduction'>
                                    <h1 className={`text-4xl text-center font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Introduction
                                    </h1>
                                    <p className={`text-xl leading-8 mb-8 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Welcome to Festofy

                                        Festofy is a complete college event management platform designed to simplify the way colleges organize and manage events. With Festofy, students and administrators can seamlessly connect in one place.<br />
                                    </p>
                                </div>

                                <div id='Tutorial1'>
                                    <h2 className={`text-2xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-900 '}`}>
                                        Tutorial 1 : Login & SignUp Tutorial
                                    </h2>
                                    <p className={`mb-2 ml-10  font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <li className='text-xl'> How to SignUp our Website ?</li>
                                    </p>
                                    <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Please ensure that you provide your accurate personal information during signup.
                                        When selecting your college name, choose carefully, as it cannot be changed after registration. Submitting incorrect details may affect your account verification and access.
                                    </p>

                                    <p className={`mb-2  ml-10 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <li className='text-xl'> How to Login our Website ?</li>
                                    </p>
                                    <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Please use your valid credentials to log in to the website.
                                        If you are an event admin and have been provided with a special access key, you can log in directly by entering the key in the Special Key field.
                                    </p>
                                    <img src={p2} className='mb-6' alt="tutorial1" />
                                </div>

                                <div id='Tutorial2'>
                                    <h2 className={`text-2xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-900 '}`}>
                                        Tutorial 2 : Special Key Access
                                    </h2>
                                    <p className={`mb-2  ml-10 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <li className='text-xl'>  How to get special key ?</li>
                                    </p>
                                    <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Currently, access to the Admin Page is restricted to teachers and event management staff only.
                                        To obtain access, you must request a special access key by emailing us along with valid proof (e.g., an authorization letter or your college ID).
                                    </p>
                                </div>

                                <div id='Tutorial3'>
                                    <h2 className={`text-2xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-900 '}`}>
                                        Tutorial 3 : Steps to Become a Sub-Event Head
                                    </h2>
                                    <p className={`mb-2  ml-10 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <li className='text-xl'>  How to become a subevent head in events ?</li>
                                    </p>
                                    <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        To access the Sub-Event Head role, click on Login as Event Head as show in below and enter the access key provided by the Event Admin for that specific sub-event.
                                    </p>
                                    <img src={t3} className='mb-6' alt="tutorial1" />
                                </div>

                                <div id='Tutorial4' className='mb-5'>
                                    <h2 className={`text-2xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-900 '}`}>
                                        Tutorial 4 : Steps to Create a event and subevent
                                    </h2>
                                    <p className={`mb-2  ml-10 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <li className='text-xl'>  How to Create a event and subevent ?</li>
                                    </p>
                                    <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        To create event and subevent you need admin key of the website
                                    </p>
                                    <video  autoPlay loop muted controls>
                                        <source src={t4} type="video/mp4" />
                                    </video>
                                </div>

                                <div id='Tutorial5' className='mb-5'>
                                    <h2 className={`text-2xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-900 '}`}>
                                        Tutorial 5 : Steps to Marks the attendance
                                    </h2>
                                    <p className={`mb-2  ml-10 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <li className='text-xl'>  How to Mark the volunter attendance ? </li>
                                    </p>
                                    <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        To mark attendance go to your events → select event → select subevent → and click on suitable mark attendance method
                                    </p>
                                    <video autoPlay loop muted controls onVolumeChange={(e) => e.target.muted = true}>
                                        <source src={t5} type="video/mp4" />
                                    </video>
                                </div>
                            </article>

                        </div>
                    </main>
                </div>
            </div>
            {/* Back to Top Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed flex flex-col items-center justify-center bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50 w-12 h-12"
            >
                <span className='text-[20px] text-center font-bold'>↑</span>
            </button>
        </div>
    )
}

export default Docdata
