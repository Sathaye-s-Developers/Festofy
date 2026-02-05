import React, { useContext, useEffect, useState } from 'react';
import { Users, Search, Filter, Calendar, MapPin, Clock, User, Mail, Phone, School, Award, Trophy, Star, Code, Mic, Music, ChevronDown, ChevronRight, Eye, Download, UserCheck, UserPlus, Crown, Shield, Heart, QrCode, Camera, Smartphone, X, AlertCircle } from 'lucide-react';
import { EventAppContext } from '../../Context/EventContext';
import { useParams } from 'react-router';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx";
import E_Nav_Back from '../Event_Components/Components/E_Nav_Back';
import { FaRegIdCard } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from 'react-toastify';

const RegisteredList = () => {
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { api, eventhead, subEventNo } = useContext(EventAppContext)
  const { eventId, subeventId } = useParams();
  const [studentData, setstudentData] = useState([])
  const [eventheadpopup, seteventheadpopup] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)
  const [showQrscan, setshowQrscan] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [volId, setvolId] = useState("")
  const [scanningVolunteer, setScanningVolunteer] = useState(null);
  const [registerHours, setregisterHours] = useState(false)
  const [registerManualHours, setregisterManualHours] = useState(false)
  const [hours, setHours] = useState("");
  const [volAttendancedata, setvolAttendancedata] = useState([])

  console.log(subEventNo)

  const onsubmithours = (e) => {
    e.preventDefault();
    setisSubmitting(true);
    setregisterHours(false)
    setshowQrscan(true);
    setisSubmitting(false);
  };

  const onsubmithours1 = async (e) => {
    e.preventDefault();
    setisSubmitting(true);
    console.log("Worked Hours Submitted:", hours);

    const payload = {
      hours: hours,
      status: "present",
      volunteerId: volId,
      subEventId: subeventId,
      eventId: eventId,
      date: new Date().toISOString()
    }
    try {
      const response = await api.post("/Festofy/user/attendance/mark", payload, { withCredentials: true })
      if (response.data.success) {
        toast.success("Attendance marked successfully!");
        setregisterManualHours(false)
        setisSubmitting(false)
      }
    } catch (err) {
      toast.error(err.response.data.error)
      setregisterManualHours(false)
    }
  };

  const onchangehours = (e) => {
    setHours(e.target.value);
  };

  const onchangehours1 = (e) => {
    setHours(e.target.value);
  };


  const onsubmit = async (data) => {
    const subeventid = eventhead ? subEventNo : subeventId;
    const payload = {
      headKey: data.EventHeadKey,
      subEventId: subeventid
    }

    setisSubmitting(true)
    try {
      const response = await api.post("/Festofy/user/event/subevent/set_SubEventHead", payload, { withCredentials: true })
      if (response.data.success) {
        seteventheadpopup(false)
        setisSubmitting(false)
      }
    } catch (err) {
      console.log(err)
      setisSubmitting(false)
    }
  }

  const deleteVolunteer = async (volunteerId) => {
    try {
      const response = await api.delete(`/Festofy/user/event/volunteer/delete/${volunteerId}`, { withCredentials: true })
      if (response.data.success) {
        window.location.reload()
      }
    } catch (err) {
      console.log(err)
    }
  }
  const deleteParticipant = async (participantId) => {
    try {
      const response = await api.delete(`/Festofy/user/event/participation/delete/${participantId}`, { withCredentials: true })
      if (response.data.success) {
        window.location.reload()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'volunteer': return Heart;
      case 'organizer': return Crown;
      case 'participant': return User;
      default: return User;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'volunteer': return 'text-pink-400 bg-pink-500/20 border-pink-400/30';
      case 'organizer': return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
      case 'participant': return 'text-cyan-400 bg-cyan-500/20 border-cyan-400/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-500/20 border-green-400/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
      case 'cancelled': return 'text-red-400 bg-red-500/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  const QRScanner = ({ onSuccess, onError }) => {
    useEffect(() => {
      const scanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10, // scan frames per second
        qrbox: { width: 250, height: 250 },
      });

      scanner.render(
        (decodedText) => {
          onSuccess(decodedText);
          scanner.clear(); // stop after success
        },
        (err) => {
          if (onError) onError(err);
        }
      );

      return () => {
        scanner.clear().catch(() => { });
      };
    }, [onSuccess, onError]);

    return <div id="qr-reader" style={{ width: "100%" }} />;
  };

  const filteredParticipants = (studentData || []).filter(participant => {
    const name = participant.name || participant.participantName || "";
    const email = participant.email || participant.participantEmail || "";
    const college = participant.college || "";
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === 'all' || participant.position === selectedRole;

    return matchesSearch && matchesRole;
  })
    .map(participant => ({
      ...participant,
      name: participant.name || participant.participantName || "",
      email: participant.email || participant.participantEmail || "",
      phone: participant.phone || participant.participantPhone || ""
    }));

  const getvolAttendance = async () => {
    try {
      const response = await api.get(`/Festofy/user/attendance/${eventId}/${subeventId}/volunteers`, { withCredentials: true })
      setvolAttendancedata(response.data.volunteers)
    } catch (err) {
      console.log(err)
    }
  }

  const exportAttendance = () => {
    const csvContent = [
      ['Date', 'Name', 'Email', 'Roll No', 'Hours Worked', 'Status', 'year', 'department'].join(','),
      ...volAttendancedata.map(p => {
        return [
          p.date,
          p.volunteerId.name,
          p.volunteerId.email,
          p.volunteerId.roll_no,
          p.hours,
          p.status,
          p.volunteerId.year,
          p.volunteerId.department
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `volunteer-attendance-${new Date().toString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportParticipants = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'College', 'Year', 'Department', 'Role', 'Status', 'Registration Date', 'Transaction Id'].join(','),
      ...filteredParticipants.map(p => {
        return [
          p.name,
          p.email,
          p.phone,
          p.college,
          p.year,
          p.department,
          p.position,
          p.status || "No Payment",
          p.registeredAt,
          p.TransactionId || "No Transaction Id"
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'participants.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const fetchVolunteersAndParticipants = async () => {
    let volunteers = [];
    let participants = [];
    const subeventid = eventhead ? subEventNo : subeventId;
    try {
      const volRes = await api.get(
        `/Festofy/user/event/volunteer/subevent/${subeventid}/volunteers`,
        { withCredentials: true }
      );
      volunteers = volRes?.data?.volunteers || [];
    } catch (err) {
      console.error("Error fetching volunteers:", err);
    }

    try {
      const partRes = await api.get(
        `/Festofy/user/event/participation/subevent/${subeventId}/participants`,
        { withCredentials: true }
      );
      participants = partRes?.data?.participants || [];
    } catch (err) {
      console.error("Error fetching participants:", err);
    }
    setstudentData([...volunteers, ...participants]);
  };
  console.log(studentData)
  useEffect(() => {
    fetchVolunteersAndParticipants();
    getvolAttendance()
  }, []);
  return (
    <div className='bg-black'>
      {eventhead && <E_Nav_Back />}
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fadeInUp">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-white bg-clip-text text-transparent">
                Event Register's
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Manage and view all registered participants and volunteers across events
            </p>
          </div>

          {/* Stats Cards */}
          <div className="min-w-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-8 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-cyan-400/20 p-6">
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-cyan-400 flex-shrink-0" />
                <div className='w-full flex flex-col justify-between'>
                  <div className="text-2xl font-bold text-white">{studentData.length}</div>
                  <div className="text-gray-400 text-sm">Total Registered</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-pink-400/20 p-6">
              <div className="flex items-center space-x-3">
                <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-pink-400 flex-shrink-0" />
                <div className='w-full flex flex-col justify-between'>
                  <div className="text-2xl font-bold text-white">{studentData.filter(p => p.position === 'volunteer').length}</div>
                  <div className="text-gray-400 text-sm">Volunteers</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-yellow-400/20 p-6">
              <div className="flex items-center space-x-3">
                <IoPeopleSharp className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400 flex-shrink-0" />
                <div className='w-full flex flex-col justify-between'>
                  <div className="text-2xl font-bold text-white">{studentData.filter(p => p.position === 'participant').length}</div>
                  <div className="text-gray-400 text-sm">Participants</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-green-400/20 p-6">
              <div className="flex items-center space-x-3">
                <UserCheck className="w-4 h-4 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" />
                <div className='w-full flex flex-col justify-between'>
                  <div className="text-2xl font-bold text-white">{studentData.filter(p => p.status === 'confirmed').length}</div>
                  <div className="text-gray-400 text-sm">Confirmed</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-yellow-400/20 p-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-red-400 flex-shrink-0" />
                <div className='w-full flex flex-col justify-between'>
                  <div className="text-2xl font-bold text-white">{studentData.filter(p => p.status === 'pending').length}</div>
                  <div className="text-gray-400 text-sm">Pending</div>
                </div>
              </div>
            </div>

          </div>

          {/* Filters and Search */}
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-cyan-400/20 p-6 mb-8 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search participants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                >
                  <option value="all">All Roles</option>
                  <option value="participant">Participants</option>
                  <option value="volunteer">Volunteers</option>
                </select>
              </div>

              {/* Export Button */}
              <button
                onClick={exportParticipants}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
              {!eventhead &&
                <button
                  onClick={exportAttendance}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105"
                >
                  <Download className="w-5 h-5 sm:w-4 sm:h-4 mb-1 sm:mb-0" />
                  <span>Attendance CSV</span>
                </button>
              }
            </div>
          </div>
          <div className='animate-fadeInUp'>
            <button
              onClick={() => { seteventheadpopup(true) }}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 mb-5 animate-fadeInUp"
            >
              <CiCirclePlus className="w-6 h-6" />
              <span>Add Event Head</span>
            </button>
          </div>

          {/* Participants List */}
          <div className="space-y-6 animate-fadeInUp" style={{ animationDelay: '600ms' }}>
            {filteredParticipants.length === 0 ? (
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-cyan-400/20 p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Participants Found</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredParticipants.map((participant, index) => {
                  const RoleIcon = getRoleIcon(participant.role);

                  return (
                    <div
                      key={participant._id}
                      className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-cyan-400/20 p-6 hover:border-cyan-400/40 transition-all duration-300 animate-fadeInUp"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex flex-col lg:flex-row gap-6 items-center">
                        {/* Participant Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-white mb-2">
                                {participant.name || participant.participantName || "Unnamed"}
                              </h3>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getRoleColor(participant.role)}`}>
                                  <RoleIcon className="w-3 h-3 inline mr-1" />
                                  {participant.position.charAt(0).toUpperCase() + participant.position.slice(1)}
                                </span>
                                {/* <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(participant.status)}`}>
                                  {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                                </span> */}
                                {participant.position === "participant" && participant.status !== 'free' && (
                                  <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${participant.status === 'confirmed'
                                    ? 'text-green-400 bg-green-500/20 border-green-400/30'
                                    : 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30'
                                    }`}>
                                    {participant.position === "participant" && participant.status === 'confirmed' ? 'Paid' : 'Payment Pending'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className='flex items-center gap-2 justify-center'>
                              <MdDelete size={25} onClick={() => {
                                if (participant.position === "volunteer") {

                                  deleteVolunteer(participant._id)
                                } else if (participant.position === "participant") {
                                  deleteParticipant(participant._id)
                                }
                              }} className='text-red-500 cursor-pointer' />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 text-gray-300">
                                <Mail className="w-4 h-4 text-cyan-400" />
                                <span className="truncate">{participant.email || participant.participantEmail}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-300">
                                <Phone className="w-4 h-4 text-cyan-400" />
                                <span>{participant.phone || participant.participantPhone}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-300">
                                <School className="w-4 h-4 text-cyan-400" />
                                <span>{participant.college}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 text-gray-300">
                                <Award className="w-4 h-4 text-cyan-400" />
                                <span>{participant.year} - {participant.department}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-300">
                                <Calendar className="w-4 h-4 text-cyan-400" />
                                <span>Registered: {new Date(participant.registeredAt).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric"
                                })}</span>
                              </div>
                              {participant.position === 'volunteer' || participant.TransactionId === null ? <div></div> :
                                <div className="flex items-center space-x-2 text-gray-300">
                                  <FaRegIdCard className="w-4 h-4 text-cyan-400" />
                                  <span>Transaction id: {participant.TransactionId}</span>
                                </div>
                              }
                            </div>
                          </div>




                          <div className='flex lg:flex-col  items-center gap-3 justify-center mt-2'>
                            {participant.position === "volunteer" &&
                              <div className='flex flex-col md:flex md:flex-row items-center gap-2'>
                                <button
                                  onClick={() => {
                                    setvolId(participant._id)
                                    setregisterManualHours(true)
                                  }}
                                  className="flex w-56 items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105"
                                >
                                  <UserCheck className="w-4 h-4" />
                                  <span>Manual Attendance</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setvolId(participant._id)
                                    setregisterHours(true)
                                    // setshowQrscan(participant._id);
                                  }}
                                  className="flex w-56 items-center justify-center space-x-2 px-4 py-3 bg-slate-700/50 border border-cyan-400/30 text-cyan-400 rounded-xl hover:bg-cyan-500/20 transition-all duration-300"
                                >
                                  <QrCode className="w-4 h-4" />
                                  <span>QR Based Attendance</span>
                                </button>
                              </div>
                            }
                          </div>
                        </div>

                        <div>

                        </div>
                      </div>
                    </div>
                  );
                })}


                {showQrscan && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl border border-cyan-400/20 max-w-md w-full p-8 animate-scaleIn">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                          <QrCode className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">QR Code Check-in</h2>
                        <p className="text-gray-300 mb-6">
                          {isScanning
                            ? 'Scanning for QR code... Point camera at volunteer\'s QR code'
                            : 'Scan the volunteer\'s QR code or use manual check-in'
                          }
                        </p>

                        {/* Camera Preview Area */}
                        {isScanning && (
                          <div className="mb-6 bg-slate-800 rounded-xl p-4 border-2 border-cyan-400/30">
                            <QRScanner
                              onSuccess={async (qrData) => {
                                // console.log("QR Scanned:", qrData);

                                let parsed;
                                try {
                                  parsed = JSON.parse(qrData); // convert string → object
                                } catch (e) {
                                  console.error("Invalid QR Code format:", e);
                                  return;
                                }

                                const payload = {
                                  encrypted: parsed.encrypted,
                                  iv: parsed.iv
                                }

                                const response = await api.post("/Festofy/user/attendance/decrypt", payload, { withCredentials: true })
                                if (!response.data.success) {
                                  alert("❌ Invalid QR Code");
                                  return;
                                }

                                const freshData = {
                                  eventId: response.data.qrData.eventId,
                                  subEventId: response.data.qrData.subEventId,
                                  date: response.data.qrData.timestamp,
                                };
                                const payload1 = {
                                  volunteerId: volId,
                                  subEventId: freshData.subEventId,
                                  eventId: freshData.eventId,
                                  date: freshData.date,
                                  status: "present",
                                  hours: hours
                                };
                                console.log(payload1)

                                try {
                                  const markres = await api.post("/Festofy/user/attendance/mark", payload1, { withCredentials: true })
                                  if (markres.data.success) {
                                    toast.success("Attendance marked successfully!");
                                    setIsScanning(false);
                                    setshowQrscan(false);
                                  } else {
                                    toast.error("Invalid QR Code");
                                    setIsScanning(false);
                                    setshowQrscan(false);
                                  }


                                } catch (err) {
                                  // console.log(err.response.data.error)
                                  toast.error(err.response.data.error)
                                  setIsScanning(false);
                                  setshowQrscan(false);
                                }

                              }}
                              onError={(err) => console.warn("QR Scan error:", err)}
                            />
                          </div>
                        )}

                        <div className="space-y-4">
                          {!isScanning ? (
                            <button
                              onClick={() => {
                                setIsScanning(true);
                                setScanError(null);
                              }}
                              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105"
                            >
                              <Camera className="w-4 h-4" />
                              <span>Start QR Scan</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setIsScanning(false)}
                              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-400 hover:to-red-500 transition-all duration-300 transform hover:scale-105"
                            >
                              <X className="w-4 h-4" />
                              <span>Stop Scanning</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              // stopQRScanning();
                              setshowQrscan(false);
                            }}
                            className="w-full px-6 py-3 bg-slate-700/50 border border-gray-600 text-gray-300 rounded-xl hover:border-cyan-400/40 hover:text-white transition-all duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Summary */}
          {filteredParticipants.length > 0 && (
            <div className="mt-8 text-center text-gray-400 animate-fadeInUp" style={{ animationDelay: '800ms' }}>
              Showing {filteredParticipants.length} of {studentData.length} participants
            </div>
          )}
        </div>
      </div>
      {registerHours &&
        <div className='fixed inset-0 z-50 w-full h-full bg-[#00000090] grid'>
          <div className='place-self-center left-[580px] opacity-80 top-[200px] bg-white rounded-[12px] w-[90%] sm:w-[55%] md:w-[50%] lg:w-[40%] xl:w-[30%] animate-[fadein_0.5s_ease-in-out_forwards] text-white'>
            <div className='p-5 flex justify-between font-[Nunito]'>
              <h1 className='font-bold ml-5 text-[18px] text-black'>Register Voleenter Hours</h1>
              <RxCross2 color='black' onClick={() => setregisterHours(false)} />
            </div>
            <form onSubmit={onsubmithours}>
              <div className='flex flex-col items-center'>
                <input type="text" id='hours' name='hours' value={hours} placeholder='Enter Worked Hours' className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-2' autoComplete='Hours' onChange={onchangehours} required />

                <button type='submit' disabled={isSubmitting} className={`${isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/25 hover:scale-105 hover:-translate-y-03"
                  } bg-gradient-to-r from-cyan-500 to-blue-600 w-[80%] text-white mb-2 rounded-[15px] cursor-pointer p-1 hover:from-cyan-400 hover:to-blue-500 transition-all duration-100 font-medium shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 hover:-translate-y-0.3 outline-none border-none`}>{isSubmitting ? "Submitting..." : "Submit"}</button>
              </div>
            </form>
          </div>
        </div>}

      {registerManualHours &&
        <div className='fixed inset-0 z-50 w-full h-full bg-[#00000090] grid'>
          <div className='place-self-center left-[580px] opacity-80 top-[200px] bg-white rounded-[12px] w-[90%] sm:w-[55%] md:w-[50%] lg:w-[40%] xl:w-[30%] animate-[fadein_0.5s_ease-in-out_forwards] text-white'>
            <div className='p-5 flex justify-between font-[Nunito]'>
              <h1 className='font-bold ml-5 text-[18px] text-black'>Register Voleenter Hours</h1>
              <RxCross2 color='black' onClick={() => setregisterHours(false)} />
            </div>
            <form onSubmit={onsubmithours1}>
              <div className='flex flex-col items-center'>
                <input type="text" id='hours' name='hours' value={hours} placeholder='Enter Worked Hours' className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-2' autoComplete='Hours' onChange={onchangehours1} required />

                <button type='submit' disabled={isSubmitting} className={`${isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/25 hover:scale-105 hover:-translate-y-03"
                  } bg-gradient-to-r from-cyan-500 to-blue-600 w-[80%] text-white mb-2 rounded-[15px] cursor-pointer p-1 hover:from-cyan-400 hover:to-blue-500 transition-all duration-100 font-medium shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 hover:-translate-y-0.3 outline-none border-none`}>{isSubmitting ? "Submitting..." : "Submit"}</button>
              </div>
            </form>
          </div>
        </div>}

      {eventheadpopup && (
        <div className="fixed inset-0 opacity-90  bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-[90%] sm:w-[50%] md:w-[45%] lg:w-[35%] xl:[30%] max-h-[90vh] overflow-y-auto">
            <div className='p-5 flex justify-between font-[Nunito]'>
              <h1 className='font-bold ml-5 text-[18px] text-black'>Set SubEvent Head</h1>
              <RxCross2 onClick={() => { seteventheadpopup(false) }} color='black' />
            </div>
            <div className='font-[Nunito]'>
              <form onSubmit={handleSubmit(onsubmit)}>
                <div className='flex flex-col items-center'>
                  <input type="text" placeholder='Set SubEventHead Key' className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-4' autoComplete='key' {...register("EventHeadKey", { required: "Enter the event head key" })} />

                  {errors.EventHeadKey && (
                    <p className="text-red-500 text-md mb-1">{errors.EventHeadKey.message}</p>
                  )}

                  <button type='submit' disabled={isSubmitting} className={`${isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/25 hover:scale-105 hover:-translate-y-0.3"
                    } bg-gradient-to-r from-cyan-500 to-blue-600 w-[80%] text-white mb-2 rounded-[15px] cursor-pointer p-1 hover:from-cyan-400 hover:to-blue-500 transition-all duration-100 font-medium shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 hover:-translate-y-0.3 outline-none border-none`}>{isSubmitting ? "Submitting..." : "Submit"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegisteredList
