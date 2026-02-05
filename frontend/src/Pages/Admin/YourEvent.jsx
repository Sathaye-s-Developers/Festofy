import React, { useMemo, useState } from 'react'
import { Calendar, Clock, MapPin, Users, Star, Filter, Search, ChevronDown, Heart, Share2, Bookmark, ArrowRight, Tag, Trophy, Music, Palette, Code, Gamepad2, BookOpen, Mic, Camera, Zap,Clock9 } from 'lucide-react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import { EventAppContext } from '../../Context/EventContext';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const YourEvent = () => {
    const { api, EventArray, setEventArray } = useContext(EventAppContext)

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [likedEvents, setLikedEvents] = useState([]);
    const [bookmarkedEvents, setBookmarkedEvents] = useState([]);

    const navigate = useNavigate()
    // const [filteredEvents, setFilteredEvents] = useState([]);

    const categories = [
        { name: 'All', icon: Calendar, color: 'cyan' },
        { name: 'Cultural', icon: Music, color: 'pink' },
        { name: 'Technical', icon: Code, color: 'blue' },
        { name: 'Sports', icon: Trophy, color: 'green' },
        { name: 'Arts', icon: Palette, color: 'purple' },
        { name: 'Gaming', icon: Gamepad2, color: 'orange' },
        { name: 'Academic', icon: BookOpen, color: 'indigo' },
        { name: 'Entertainment', icon: Mic, color: 'amber' }
    ];

    const EventFetcher = async () => {
        try {
            const response = await api.get("/Festofy/user/event/admin-created-events", {}, { withCredentials: true, })
            console.log(response.data)
            const events = [...response.data.events]
            const FetchedArray = events.map((event) => ({
                Id: event._id,
                Title: event.title,
                Description: event.description,
                startDate: event.dateRange.start || "",
                endDate: event.dateRange.end || "",
                Time: event.dateRange.start || "",
                Address: event.location,     //temp
                category: event.department,
                Attendees: "50",
                MaxAttendess: event.maxParticipants,
                Price: 50, //rating                  //temp
                Rating: 4.5,                                   //temp
                EventLogo: event.bannerUrl,
                tags: event.tags,
                Featured: false,                                //temp
                EventOrganiser: event.organiser_name,
                College: event.createdByCollege,
                Event_Mode: event.event_mode,
                time:event.time
            }))
            setEventArray(FetchedArray)
        } catch (err) {
            console.log(err)
        }
    }
    const filters = ['All', 'Today', 'This Week', 'This Month', 'Free', 'Paid', 'Featured'];
    const filteredEvents = useMemo(() => {
        return EventArray.filter(event => {
            const matchesSearch = event.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.College.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;

            const matchesFilter = selectedFilter === 'All' ||
                (selectedFilter === 'Free' && event.Price === 0) ||
                (selectedFilter === 'Paid' && event.Price > 0) ||
                (selectedFilter === 'Featured' && event.Featured);

            return matchesSearch && matchesCategory && matchesFilter;
        });
    }, [EventArray, searchTerm, selectedCategory, selectedFilter]);

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

    const getCategoryColor = (categoryName) => {
        const category = categories.find(cat => cat.name === categoryName);
        return category?.color || 'cyan';
    };

    useEffect(() => {
        EventFetcher()
    }, [])

    return (
        <div>
            <div className='flex flex-col mx-auto mt-10'>
                <h1 className='text-white text-center text-4xl font-bold'>
                    Your Events
                </h1>
                <div>
                    <div className="min-h-screen pt-10 pb-16 px-6">
                        <div className="max-w-7xl mx-auto">
                            {/* Events Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
                                {Array.isArray(EventArray) && filteredEvents.map((event, index) => {
                                    const isLiked = likedEvents.includes(event.Id);
                                    const isBookmarked = bookmarkedEvents.includes(event.Id);
                                    const categoryColor = getCategoryColor(event.category);
                                    const colorClasses = getColorClasses(categoryColor);
                                    return (<div
                                        key={event.Id}
                                        className="group bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-cyan-400/20 overflow-hidden transition-all duration-300 transform animate-fadeInUp"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <Link to={`/Admin/AdminSubEvent/${EventArray[index].Id}`}>
                                            {/* Event Image */}
                                            <div className="relative overflow-hidden">
                                                <div className='absolute right-0 flex p-2 gap-1'>
                                                    <button onClick={(e) => {
                                                        e.preventDefault()
                                                        e.stopPropagation();
                                                        window.location.href = `/Admin/Editevent/${EventArray[index].Id}`;
                                                    }}>
                                                        <FaEdit size={30} className='text-cyan-600 cursor-pointer' />
                                                    </button>
                                                    <MdDelete onClick={(e) => {
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                        deleteEvent(EventArray[index].Id)
                                                    }} size={30} className='text-red-500 cursor-pointer' />
                                                </div>
                                                <img
                                                    src={event.EventLogo}
                                                    alt={event.Title}
                                                    className="w-full h-48 object-cover transition-transform duration-300"
                                                />

                                                {/* Featured Badge */}
                                                {event.Featured && (
                                                    <div className="absolute top-4 left-4 flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-yellow-500/90 to-orange-500/90 rounded-full">
                                                        <Zap className="w-3 h-3 text-white" />
                                                        <span className="text-white text-xs font-semibold">Featured</span>
                                                    </div>
                                                )}

                                                {/* Price Badge */}
                                                {/* <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                                                    <span className="text-white text-sm font-semibold">
                                                        {event.Price === 0 ? 'Free' : `₹${event.Price}`}
                                                    </span>
                                                </div> */}
                                            </div>

                                            {/* Event Content */}
                                            <div className="p-6">

                                                {/* Event Title */}
                                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                                                    {event.Title}
                                                </h3>

                                                {/* Event Description */}
                                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                                    {event.Description}
                                                </p>

                                                {/* Event Details */}
                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center space-x-2 text-gray-300 text-sm">
                                                        <Calendar className="w-4 h-4 text-cyan-400" />
                                                        <span>{new Date(event.startDate).toISOString().split("T")[0]} To {new Date(event.endDate).toISOString().split("T")[0]}</span>
                                                    </div>

                                                    <div className="flex items-center space-x-2 text-gray-300 text-sm">
                                                        <MapPin className="w-4 h-4 text-cyan-400" />
                                                        <span className="truncate">{event.Address}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-gray-300 text-sm">
                                                        <Clock9  className="w-4 h-4 text-cyan-400" />
                                                        <span className="truncate">{event.time}</span>
                                                    </div>

                                                </div>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {event.tags.slice(0, 3).map((tag, tagIndex) => (
                                                        <div key={tagIndex} className="flex items-center space-x-1 px-2 py-1 bg-slate-700/50 rounded-lg">
                                                            <Tag className="w-3 h-3 text-gray-400" />
                                                            <span className="text-xs text-gray-400">{tag}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* College and Organizer */}
                                                <div className="text-xs text-gray-500 mb-4">
                                                    <div>Organized by <span className="text-cyan-400">{event.EventOrganiser}</span></div>
                                                    {/* <div>at <span className="text-cyan-400">{event.college}</span></div> */}
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                        navigate(`/Admin/CreateSubEvent/${event.Id}`)
                                                    }}
                                                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 transform hover:scale-105 active:scale-95 transition-all duration-300 font-semibold"
                                                >
                                                    <span>Create SubEvent</span>
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                                </button>

                                            </div>
                                        </Link>
                                    </div>)
                                })}
                            </div>

                            {/* No Events Found */}
                            {filteredEvents.length === 0 && (
                                <div className="text-center py-16 animate-fadeInUp">
                                    <div className="p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-cyan-400/20 max-w-md mx-auto">
                                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-white mb-2">No Events Found</h3>
                                        <p className="text-gray-400">Try adjusting your search criteria or filters to find more events.</p>
                                    </div>
                                </div>

                            )}
                        </div>
                        {/* </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default YourEvent
