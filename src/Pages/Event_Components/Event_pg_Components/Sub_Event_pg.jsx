import React, { useContext, useEffect, useMemo, useState } from 'react'
import { EventAppContext } from '../../../Context/EventContext'
import { Calendar, Clock, MapPin, Users, Star, Filter, Search, ChevronDown, Heart, Share2, Bookmark, ArrowRight, Tag, Trophy, Music, Palette, Code, Gamepad2, BookOpen, Mic, Camera, Zap, X, CheckCircle } from 'lucide-react';
import { GoCodeReview } from "react-icons/go";
import { Link } from "react-router-dom"
import { FaIndianRupeeSign } from "react-icons/fa6";
import axios from 'axios';
import E_Nav_Back from '../Components/E_Nav_Back';
import { useNavigate, useParams } from 'react-router';
import { useCallback } from 'react';
import { LiaUniversitySolid } from "react-icons/lia";
import { AiOutlineGlobal } from "react-icons/ai";
import { MdOutlineDescription } from "react-icons/md";
import Loading_comp2 from '../../Admin/loading_comp2';
import StarRating from "../../../Components/StarRating"
import { IoLocationSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const Sub_Event_pg = () => {
  const { api, setVoleenter, setEventNo, setsubEventNo, setParticipate, details, subEventNo, eventhead, seteventhead, settoastCondition, toastCondition } = useContext(EventAppContext)
  const { eventId } = useParams();
  const [EventInfo, setEventInfo] = useState(null)
  const [subEventInfo, setsubEventInfo] = useState(null)
  const [loading, setloading] = useState(true)
  const randomRating = Math.floor(Math.random() * 3) + 3
  const [PrizesPopup, setPrizesPopup] = useState(false)
  const [Prizes, setPrizes] = useState(null)
  const [eventHeadPopup, seteventHeadPopup] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, seterrorMsg] = useState(false)
  const [qrpopup, setqrpopup] = useState(false)
  const [qrimg,setqrimg]=useState(null)
  const [showqr,setshowqr]=useState(false)

  const Navigate = useNavigate()
  const FetchsingleEvent = async () => {
    try {
      const response = await api.get(`/Festofy/user/event/${eventId}`, { withCredentials: true, })
      setEventInfo(response.data.event)
      setsubEventInfo(response.data.event.subEvents)
      setEventNo(eventId)
    } catch (err) {
      console.log(err)
    } finally {
      setloading(false);
    }
  }
  const onsubmit = async (data) => {
    const payload = {
      subEventHeadCode: data.SubHeadKey,
      subEventId: subEventNo
    }
    setIsSubmitting(true)
    try {
      const response = await api.post("/Festofy/user/role_admin", payload, { withCredentials: true, })
      if (response.data.success) {
        Navigate("/EventHead/Registeries")
        seteventHeadPopup(false)
        seteventhead(true)
        setIsSubmitting(false)
      }

    } catch (err) {
      if (err.response && (err.response.status === 404 || err.response.status === 403)) {
        seterrorMsg(err.response.data.error);
        setTimeout(() => {
          seterrorMsg("");
        }, 2000);
        setIsSubmitting(false)
      }
    }
  }

  const getqrcode = async () => {
    const payload = {
      eventId: eventId,
      subEventId: subEventNo
    }
    setshowqr(true)
    setIsSubmitting(true)
    try {
      const response = await api.post(`Festofy/user/attendance/qrcode`, payload, { withCredentials: true, })
      setqrimg(response.data.qrCode)
      setIsSubmitting(false)
    } catch (err) {
      console.log(err)
      setIsSubmitting(false)
      setshowqr(false)
    }
  }


  const isVolunteerRegistered = (volunteers) => {
    if (!volunteers || !details?.volunteers) return false;
    return volunteers.some(id => details.volunteers.includes(String(id)));
  };

  const isParticipantsRegistered = (participants) => {
    if (!participants || !details?.participations) return false;
    return participants.some(id => details.participations.includes(String(id)));
  };

  // helper: check one role only
  const getRegistrationStatus = (participants, volunteers) => {
    if (isVolunteerRegistered(volunteers)) return "volunteer";
    if (isParticipantsRegistered(participants)) return "participant";
    return null;
  };


  const registeredEvents = subEventInfo?.filter(subEvent =>
    isVolunteerRegistered(subEvent.volunteers) || isParticipantsRegistered(subEvent.participants)
  );

  const availableEvents = subEventInfo?.filter(subEvent =>
    !isVolunteerRegistered(subEvent.volunteers) && !isParticipantsRegistered(subEvent.participants)
  );



  const getColorClasses = (color) => {
    const colorMap = {
      cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-400/30 text-cyan-400',
      pink: 'from-pink-500/20 to-pink-600/20 border-pink-400/30 text-pink-400',
      blue: 'from-blue-500/20 to-blue-600/20 border-blue-400/30 text-blue-400',
      green: 'from-green-500/20 to-green-600/20 border-green-400/30 text-green-400',
      purple: 'from-purple-500/20 to-purple-600/20 border-purple-400/30 text-purple-400',
      orange: 'from-orange-500/20 to-orange-600/20 border-orange-400/30 text-orange-400',
      indigo: 'from-indigo-500/20 to-indigo-600/20 border-indigo-400/30 text-indigo-400',
      red: 'from-red-500/20 to-red-600/20 border-red-400/30 text-red-400'
    };
    return colorMap[color] || colorMap.cyan;
  };
  const getSubEventIcon = useCallback((type) => {
    const icons = {
      workshop: Code,
      competition: Trophy,
      talk: Mic,
      performance: Music,
      ceremony: Star
    };
    return icons[type] || Code;
  }, []);

  const getSubEventTypeColor = useCallback((type) => {
    const typeColors = {
      workshop: 'from-blue-500/20 to-blue-600/20 border-blue-400/30 text-blue-400',
      competition: 'from-red-500/20 to-red-600/20 border-red-400/30 text-red-400',
      talk: 'from-green-500/20 to-green-600/20 border-green-400/30 text-green-400',
      performance: 'from-purple-500/20 to-purple-600/20 border-purple-400/30 text-purple-400',
      ceremony: 'from-yellow-500/20 to-yellow-600/20 border-yellow-400/30 text-yellow-400'
    };
    return typeColors[type] || typeColors.workshop;
  }, []);


  const getAvailabilityStatus = (current, max) => {
    if (!max) {
      return { status: 'open', color: 'text-green-400', text: 'Open Registration' };
    }

    const percentage = (current / max) * 100;

    if (percentage >= 100) {
      return { status: 'full', color: 'text-red-400', text: 'Fully Booked' };
    }

    if (percentage >= 80) {
      return { status: 'limited', color: 'text-yellow-400', text: 'Limited Spots' };
    }

    return { status: 'available', color: 'text-green-400', text: 'Available' };
  };

  const getCategoryColor = (category) => {
    const colors = {
      Technical: "text-blue-400 bg-blue-500/20",
      Cultural: "text-pink-400 bg-pink-500/20",
      Sports: "text-green-400 bg-green-500/20",
      Arts: "text-purple-400 bg-purple-500/20",
      Gaming: "text-orange-400 bg-orange-500/20",
      Academic: "text-indigo-400 bg-indigo-500/20",
      Entertainment: "text-amber-400 bg-amber-500/20"
    };
    return colors[category] || "text-cyan-400 bg-cyan-500/20";
  };

  const getCategoryTextColor = (category) => {
    const colors = {
      Technical: "text-blue-400",
      Cultural: "text-pink-400",
      Sports: "text-green-400",
      Arts: "text-purple-400",
      Gaming: "text-orange-400",
      Academic: "text-indigo-400",
      Entertainment: "text-amber-400"
    };
    return colors[category] || "text-cyan-400";
  };

  useEffect(() => {
    FetchsingleEvent();
  }, []);

  // React to changes in 'toast'
  useEffect(() => {
    if (toastCondition) {
      const fetchData = async () => {
        try {
          console.log("w")
          await FetchsingleEvent();
          toast.success("Registered Successfully !");
        } catch (error) {
          console.error("Error fetching event:", error);
        } finally {
          settoastCondition(false);
        }
      };
      fetchData();
    }
  }, [toastCondition, FetchsingleEvent, settoastCondition]);

  return (
    <div className='min-h-screen bg-black'>

      {loading ? <Loading_comp2 loading={loading} /> : <div>
        <E_Nav_Back />
        {EventInfo && (
          < div>
            <div className="w-full overflow-hidden animate-scaleIn ">
              <div className="p-8 lg:ml-12 mr-12 mt-2 rounded-3xl">
                <div className='flex items-center gap-4 ml-4'>
                  <img
                    src={EventInfo.bannerUrl}
                    alt={EventInfo.title}
                    loading="lazy"
                    className="object-contain rounded-xl w-15 h-15"
                  />
                  <h2 className={`text-3xl md:text-4xl font-playfair font-bold flex gap-2 i ${getCategoryTextColor(EventInfo.department)}  mb-3`}>{EventInfo.title}</h2>

                </div>
                <div className='flex items-center gap-4 ml-4 mt-3'>
                  <StarRating rating={randomRating} />
                </div>
                <div className='flex items-center gap-1 ml-4 mt-3 text-gray-500'>
                  <IoLocationSharp />
                  <span>{EventInfo.location}</span>
                </div>
                <div className="flex flex-col items-start md:flex-row gap-6 rounded-[20px] overflow-hidden">
                  <div className="flex flex-col p-4 items-start w-full">
                    <p className="text-gray-300 mb-4 font-bold">Event Details :</p>
                    <div className='flex gap-2'>
                      <MdOutlineDescription className="w-6 h-6 text-cyan-400" />
                      <p className="text-gray-300 mb-4">{EventInfo.description}</p>
                    </div>
                    <div className='flex gap-2'>
                      <div>
                        {EventInfo.visibility === "college" ? <LiaUniversitySolid className="w-6 h-6 text-cyan-400" /> : <AiOutlineGlobal className="w-6 h-6 text-cyan-400" />}
                      </div>
                      <p className="text-gray-300 mb-4">Participants Allowed : {EventInfo.visibility === "college" ? "Only Your College Students Allowed" : "All College Students Allowed"}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {EventInfo?.tags?.slice(0, 3).map((tag, tagIndex) => (
                        <div key={tagIndex} className="flex items-center space-x-1 px-3 py-1 bg-slate-700/50 rounded-lg">
                          <Tag className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">{tag}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-400 mb-4">~~ Hosted By {EventInfo.organiser_name}</p>
                    <div className={`px-4 py-1 bg-gradient-to-r ${getCategoryColor(EventInfo.department)} rounded-full border`}>
                      <span className="text-sm font-semibold text-center">{EventInfo.department}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
        }

        {
          subEventInfo?.length === 0 && (
            <div className="text-gray-400 text-center mt-16 text-4xl">No SubEvents Found</div>
          )
        }


        {/* subevent comp */}
        {registeredEvents?.length > 0 &&
          <div className="w-full mt-10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Registered Events
            </h2>
            <div className='flex flex-col items-center mt-3'>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-10 w-full md:w-[80%]">
                {registeredEvents?.map((subEvent, index) => {
                  const SubEventIcon = getSubEventIcon(subEvent.subEventCategory);
                  const typeColorClasses = getSubEventTypeColor(subEvent.subEventCategory);
                  const availability = getAvailabilityStatus(subEvent.currentParticipants, subEvent.maxParticipants);

                  return (
                    <div
                      key={subEvent._id}
                      className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-cyan-400/20 p-6 hover:border-cyan-400/40 transition-all duration-300 transform hover:scale-105 animate-fadeInUp w-full h-auto"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => {
                        setPrizes(subEvent?.prizes)
                        setPrizesPopup(true)
                      }}
                    >
                      {/* Sub-event Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 bg-gradient-to-r ${typeColorClasses} rounded-xl border`}>
                          <SubEventIcon className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className={`px-3 py-1 bg-gradient-to-r ${typeColorClasses} rounded-lg border text-xs font-semibold capitalize`}>
                            {subEvent.subEventCategory}
                          </div>
                          <div className={`px-2 py-1 rounded-lg text-xs font-medium ${availability.color} bg-current/10`}>
                            {availability.text}
                          </div>
                        </div>
                      </div>

                      {/* Sub-event Details */}
                      <h3 className="text-xl font-bold text-white mb-2">{subEvent.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{subEvent.description}</p>

                      {/* Time and Location */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-3 text-gray-300 text-sm">
                          <Clock className="w-4 h-4 text-cyan-400" />
                          <span>{subEvent.time}</span>
                          <span className="text-gray-500">({subEvent.duration})</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-300 text-sm">
                          <MapPin className="w-4 h-4 text-cyan-400" />
                          <span>{subEvent.location}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-300 text-sm">
                          <FaIndianRupeeSign className="w-4 h-4 text-cyan-400" />
                          <span>Entry Fee: {subEvent.price === 0 ? "Free" : subEvent.price}</span>
                        </div>
                      </div>


                      {/* Requirements */}
                      {subEvent.requirements && (
                        <div className="mb-4 p-3 bg-slate-700/30 rounded-xl border border-gray-600/30">
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm font-medium text-cyan-400">Requirements</span>
                          </div>
                          <p className="text-xs text-gray-400">{subEvent.requirements}</p>
                        </div>
                      )}


                      {/* <Link to="">
                    <button
                      disabled={availability.status === 'full'}
                      className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${availability.status === 'full'
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500'
                        }`}
                    >
                      {availability.status === 'full' ? (
                        <>
                          <span>Fully Booked</span>
                        </>
                      ) : (
                        <>
                          <span>Register Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </Link> */}


                      {(() => {
                        const status = getRegistrationStatus(subEvent.participants, subEvent.volunteers)

                        if (status === "volunteer") {
                          return (
                            <div>
                              <button
                                type="button"
                                disabled
                                className="mt-5 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-gray-400 rounded-xl cursor-not-allowed font-semibold"
                              >
                                <span>Registered as Volunteer</span>
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <div className='sm:flex gap-5'>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setsubEventNo(subEvent._id)
                                    setqrpopup(true)
                                  }}
                                  className="mt-5 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transform hover:scale-105 active:scale-95 transition-all duration-300 font-semibold"
                                >
                                  <span>Mark Attendance</span>
                                  <CheckCircle className="w-4 h-4" />
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    seteventHeadPopup(true)
                                    setsubEventNo(subEvent._id)
                                  }}
                                  className="mt-5 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transform hover:scale-105 active:scale-95 transition-all duration-300 font-semibold"
                                >
                                  <span>Login For Event Head</span>
                                </button>
                              </div>

                            </div>
                          )
                        }

                        if (status === "participant") {
                          return (
                            <div >
                              <button
                                type="button"
                                disabled
                                className="mt-5 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-gray-400 rounded-xl cursor-not-allowed font-semibold"
                              >
                                <span className='whitespace-nowrap text-sm sm:text-base'>Registered as Participant</span>
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                disabled
                                className="mt-5 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-gray-400 rounded-xl cursor-not-allowed font-semibold"
                              >
                                <span>View Details</span>

                              </button>
                            </div>
                          )
                        }

                        return (
                          <div>
                            <button type='button' onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setParticipate(true)
                              setsubEventNo(subEvent._id)
                            }} className="mt-5 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transform hover:scale-105 active:scale-95 transition-all duration-300 font-semibold">
                              <span>Participate Now</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setVoleenter(true);
                                setsubEventNo(subEvent._id);
                              }}
                              className="mt-5 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transform hover:scale-105 active:scale-95 transition-all duration-300 font-semibold"
                            >
                              <span>Apply For Volunteer</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                          </div>
                        )

                      })()}


                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        }
        {availableEvents?.length > 0 &&
          <div className="w-full mt-10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Available SubEvents
            </h2>
            <div className='flex flex-col items-center mt-3'>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-10 w-full md:w-[80%]">
                {availableEvents?.map((subEvent, index) => {
                  const SubEventIcon = getSubEventIcon(subEvent.subEventCategory);
                  const typeColorClasses = getSubEventTypeColor(subEvent.subEventCategory);
                  const availability = getAvailabilityStatus(subEvent.currentParticipants, subEvent.maxParticipants);

                  return (
                    <div
                      key={subEvent._id}
                      className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-cyan-400/20 p-6 hover:border-cyan-400/40 transition-all duration-300 transform hover:scale-105 animate-fadeInUp w-full h-auto"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => {
                        setPrizes(subEvent?.prizes)
                        setPrizesPopup(true)
                      }}
                    >
                      {/* Sub-event Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 bg-gradient-to-r ${typeColorClasses} rounded-xl border`}>
                          <SubEventIcon className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className={`px-3 py-1 bg-gradient-to-r ${typeColorClasses} rounded-lg border text-xs font-semibold capitalize`}>
                            {subEvent.subEventCategory}
                          </div>
                          <div className={`px-2 py-1 rounded-lg text-xs font-medium ${availability.color} bg-current/10`}>
                            {availability.text}
                          </div>
                        </div>
                      </div>

                      {/* Sub-event Details */}
                      <h3 className="text-xl font-bold text-white mb-2">{subEvent.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{subEvent.description}</p>

                      {/* Time and Location */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-3 text-gray-300 text-sm">
                          <Clock className="w-4 h-4 text-cyan-400" />
                          <span>{subEvent.time}</span>
                          <span className="text-gray-500">({subEvent.duration})</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-300 text-sm">
                          <MapPin className="w-4 h-4 text-cyan-400" />
                          <span>{subEvent.location}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-300 text-sm">
                          <FaIndianRupeeSign className="w-4 h-4 text-cyan-400" />
                          <span>Entry Fee: {subEvent.price === 0 ? "Free" : subEvent.price}</span>
                        </div>
                      </div>

                    

                      {/* Requirements */}
                      {subEvent.requirements && (
                        <div className="mb-4 p-3 bg-slate-700/30 rounded-xl border border-gray-600/30">
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm font-medium text-cyan-400">Requirements</span>
                          </div>
                          <p className="text-xs text-gray-400">{subEvent.requirements}</p>
                        </div>
                      )}

                      {(() => {
                        const status = getRegistrationStatus(subEvent.participants, subEvent.volunteers)

                        if (status === "volunteer") {
                          return (
                            <button
                              type="button"
                              disabled
                              className="mt-5 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-gray-400 rounded-xl cursor-not-allowed font-semibold"
                            >
                              <span>Registered as Volunteer</span>
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )
                        }

                        if (status === "participant") {
                          return (
                            <button
                              type="button"
                              disabled
                              className="mt-5 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-gray-400 rounded-xl cursor-not-allowed font-semibold"
                            >
                              <span>Registered as participant</span>
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )
                        }

                        return (
                          <div>
                            <button type='button' onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setParticipate(true)
                              setsubEventNo(subEvent._id)
                            }} className="mt-5 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transform hover:scale-105 active:scale-95 transition-all duration-300 font-semibold">
                              <span>Participate Now</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setVoleenter(true);
                                setsubEventNo(subEvent._id);
                              }}
                              className="mt-5 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transform hover:scale-105 active:scale-95 transition-all duration-300 font-semibold"
                            >
                              <span>Apply For Volunteer</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                          </div>
                        )

                      })()}

                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        }
      </div>
      }
      {eventHeadPopup && (
        <div className='fixed inset-0 z-50 w-full h-full bg-[#00000090] grid'>
          <div className='place-self-center left-[580px] opacity-80 top-[200px] bg-white rounded-[12px] w-[90%] sm:w-[55%] md:w-[50%] lg:w-[40%] xl:w-[30%] animate-[fadein_0.5s_ease-in-out_forwards] text-white'>
            <div className='p-5 flex justify-between font-[Nunito]'>
              <h1 className='font-bold ml-5 text-[18px] text-black'>SubEvent Login</h1>
              <RxCross2 color='black' onClick={() => seteventHeadPopup(false)} />
            </div>
            <form onSubmit={handleSubmit(onsubmit)}>
              <div className='flex flex-col items-center'>

                <input type="text" placeholder='Your SubEvent Head Key' className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-2' autoComplete='SuperKey' {...register("SubHeadKey", { required: "Enter the SubEvent Head Key First !" })} />

                {errorMsg && (<div className='w-[80%] mb-3'><p className='text-red-600'>{errorMsg}</p></div>)}

                {errors.SubHeadKey && (
                  <p className="text-red-500 text-md mb-1">{errors.SubHeadKey.message}</p>
                )}

                <button type='submit' disabled={isSubmitting} onClick={() => {
                }} className={`${isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/25 hover:scale-105 hover:-translate-y-03"
                  } bg-gradient-to-r from-cyan-500 to-blue-600 w-[80%] text-white mb-2 rounded-[15px] cursor-pointer p-1 hover:from-cyan-400 hover:to-blue-500 transition-all duration-100 font-medium shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 hover:-translate-y-0.3 outline-none border-none`}>{isSubmitting ? "Submitting..." : "Submit"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {
        qrpopup &&
        <div className='fixed inset-0 z-50 w-full h-full bg-[#00000090] grid'>
          <div className='place-self-center left-[580px] opacity-80 top-[200px] bg-white rounded-[12px] w-[90%] sm:w-[55%] md:w-[50%] lg:w-[40%] xl:w-[30%] animate-[fadein_0.5s_ease-in-out_forwards] text-white'>
            <div className='p-5 flex justify-between font-[Nunito]'>
              <h1 className='font-bold ml-5 text-[18px] text-black text-center'>Qr Code</h1>
              <RxCross2 color='black' onClick={() => setqrpopup(false)} />
            </div>
            <div className='flex flex-col items-center'>
              {qrimg && <img src={qrimg} className='w-2xs'/>}
              <button type='submit' disabled={showqr} onClick={() => {
                getqrcode()
              }} className={`${showqr
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/25 hover:scale-105 hover:-translate-y-03"
                } bg-gradient-to-r from-cyan-500 to-blue-600 w-[80%] text-white mb-2 rounded-[15px] cursor-pointer p-1 hover:from-cyan-400 hover:to-blue-500 transition-all duration-100 font-medium shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 hover:-translate-y-0.3 outline-none border-none`}>Show Qr Code</button>
            </div>
          </div>
        </div>
      }

      {PrizesPopup && (
        <div className="fixed inset-0 opacity-90  bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-600 rounded-xl max-w-4xl w-[90%] sm:w-[50%] md:w-[45%] lg:w-[35%] xl:[30%] max-h-[90vh] overflow-y-auto">
            <div className='p-6'>
              <div className="w-full">
                {Prizes && Prizes.length > 0 && (
                  <div className="mb-2">
                    <div className="flex  justify-between pl-2 pr-2 mb-3">
                      <div className='flex items-center gap-2'>
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <p className="text-sm font-medium text-yellow-400">Prizes & Rewards</p>
                      </div>
                      <RxCross2 onClick={() => { setPrizesPopup(false) }} color='black' />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {Prizes.map((prize, prizeIndex) => (
                        <div key={prizeIndex} className="flex items-center space-x-3 p-2 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
                          <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {prizeIndex + 1}
                          </div>
                          <span className="text-yellow-400 text-sm font-medium">{prize.replace(/\$/g, '')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {Prizes && Prizes.length === 0 && (
                  <div>
                    <div className="flex  justify-between pl-2 pr-2 mb-3">
                      <div className='flex items-center gap-2'>
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <p className="text-sm font-medium text-yellow-400">Prizes & Rewards</p>
                      </div>
                      <RxCross2 onClick={() => { setPrizesPopup(false) }} color='black' />
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
                      <p className='text-yellow-400 text-sm font-medium'>No Prizes or Rewards Available</p>
                    </div>

                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </div >
  )
}

export default Sub_Event_pg
