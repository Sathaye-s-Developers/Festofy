import React, { useContext, useState } from 'react'
import { CiViewList } from "react-icons/ci"
import { TbSquareRoundedPlus } from "react-icons/tb";
import { NavLink, Routes, Route } from 'react-router-dom';
import E_Nav_Back2 from '../Event_Components/Components/E_Nav_Back2';
import YourEvent from './YourEvent';
import { EventAppContext } from '../../Context/EventContext';
import Home from '../Home';
import CreateEventPage from '../Admin/CreateEventPage'
import CreateSub_EventPg from './CreateSub_EventPg';
import Admin_SubEvent from './Admin_SubEvent';
import RegisteredList from './RegisteredList';
import Editableevent from './Editableevent';
import EditableSubevent from './EditableSubevent';


const AdminPg = () => {
    const [ActiveTab, setActiveTab] = useState("YourEvents")
    const { isAuthenticated } = useContext(EventAppContext)
    return (
        <div className='bg-black text-white'>
            <E_Nav_Back2 />
            <div className='flex'>
                <div className='mt-0.5 min-h-screen w-[15%] sm:w-[26%] md:w-[22%] lg:w-[17%] flex flex-col  items-center bg-[#282828] shadow-lg shadow-black/50 border-r border-gray-700 rounded-[5px]'>
                    <div className='w-[86%] mt-6 flex flex-col gap-3'>
                        <NavLink to="/Admin/MyEvents" className={`hover:cursor-pointer flex p-2  rounded-[5px] justify-center items-center gap-2 ${ActiveTab === "YourEvents" ? "bg-[rgb(31,31,31)] text-cyan-400" : "bg-[#282828]"}`} onClick={() => setActiveTab("YourEvents")}>
                            <CiViewList />
                            <p className='sm:block hidden'>Your Events</p>
                        </NavLink>
                        <NavLink to="/Admin/CreateEvent" className={`hover:cursor-pointer flex p-2 rounded-[5px] justify-center items-center gap-2 ${ActiveTab === "CreateEvents" ? "bg-[rgb(31,31,31)] text-cyan-400" : "bg-[#282828]"}`} onClick={() => setActiveTab("CreateEvents")}>
                            <TbSquareRoundedPlus />
                            <p className='sm:block hidden'>Create Events</p>
                        </NavLink>
                    </div>
                </div>
                <div className='w-full overflow-y-auto h-[calc(100vh-64px)]'>
                    <Routes>
                        <Route path='' element={isAuthenticated ? <YourEvent /> : <Home />} />
                        <Route path='CreateEvent' element={isAuthenticated ? <CreateEventPage /> : <Home />} />
                        <Route path='MyEvents' element={isAuthenticated ? <YourEvent /> : <Home />} />
                        <Route path="CreateSubEvent/:eventId" element={isAuthenticated ? <CreateSub_EventPg /> : <Home />} />
                        <Route path="AdminSubEvent/:eventId" element={isAuthenticated ? <Admin_SubEvent /> : <Home />} />
                        <Route path="AdminSubEvent/:eventId/:subeventId" element={isAuthenticated ? <RegisteredList /> : <Home />} />
                        <Route path="Editevent/:eventId" element={isAuthenticated ? <Editableevent /> : <Home />} />
                        <Route path="EditSubevent/:SubeventId" element={isAuthenticated ? <EditableSubevent /> : <Home />} />
                    </Routes>
                </div>

            </div>
        </div>
    )
}

export default AdminPg
