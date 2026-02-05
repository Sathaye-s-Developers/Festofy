import React, { useContext, useEffect, useState } from 'react'
import Home from './Pages/Home'
import Login_PopUp from './Components/Login_PopUp'
import { EventAppContext } from './Context/EventContext'
import Event from './Pages/Event_Components/Event'
import { Routes, Route } from "react-router-dom"
import Mobile_Options from './Components/Mobile_Options'
import LoadingBar from "react-top-loading-bar";
import Profilepg from './Pages/Event_Components/Components/Profilepg'
import Loading_comp from "./Components/Loading_comp"
import { ToastContainer, toast } from 'react-toastify';
import InterCollege_Events from './Pages/Event_Components/Event_pg_Components/InterCollege_Events'
import Sub_Event_pg from './Pages/Event_Components/Event_pg_Components/Sub_Event_pg'
import AdminPg from './Pages/Admin/AdminPg'
import SuperKeyPopup from './Pages/Event_Components/Components/SuperKeyPopup'
import Share_Popup from './Components/Share_Popup'
import Voleenter_Popup from './Pages/Event_Components/Components/Voleenter_Popup'
import Participate_popup from './Pages/Event_Components/Components/Participate_popup'
import RegisteredList from './Pages/Admin/RegisteredList'
import Docdata from './Pages/Doc Page/Docdata'

const App = () => {
  const { register, loading, options, setprogress, progress, isAuthenticated, admin, key, share, Voleenter, Participate, eventhead } = useContext(EventAppContext)

  if (loading) {
    return <Loading_comp />;
  }
 
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div>
        <LoadingBar
          color="#ADD8E6"
          progress={progress}
          onLoaderFinished={() => setprogress(0)}
        /></div>
      {register === true ? <Login_PopUp /> : <></>}
      {options === true ? <Mobile_Options /> : <></>}
      {key ? <SuperKeyPopup /> : <></>}
      {share.Isshare ? <Share_Popup /> : <></>}
      {Voleenter ? <Voleenter_Popup /> : <></>}
      {Participate ? <Participate_popup /> : <></>}

      <Routes>
        {/* <Route path='/' element={<Loading_comp><Home /></Loading_comp>} /> */}
        <Route path='/' element={<Home />} />
        <Route path='/Home' element={<Home />} />
        <Route path='/Event/*' element={isAuthenticated ? <Event /> : <Home />} />
        <Route path='/Docs' element={<Docdata/>} />
        {/* <Route path='/Event' element={<Event />} /> */}

        <Route path='/Profile' element={isAuthenticated ? <Profilepg /> : <Home />} />
        <Route path='/InterCollegateEvents' element={isAuthenticated ? <InterCollege_Events /> : <Home />} />
        <Route path='/SubEvent/:eventId' element={isAuthenticated ? <Sub_Event_pg /> : <Home />} />
        <Route path='/Admin/*' element={(isAuthenticated && admin) ? <AdminPg /> : <Home />} />
        <Route path='/EventHead/Registeries' element={(isAuthenticated && eventhead) ? <RegisteredList /> : <Home />} />
      </Routes>
    </div >
  )
}

export default App
