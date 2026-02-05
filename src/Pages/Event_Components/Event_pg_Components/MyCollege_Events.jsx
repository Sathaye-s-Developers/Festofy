import React, { useMemo, useState } from 'react'
import { Calendar, Clock, MapPin, Users, Star, Filter, Search, ChevronDown, Heart, Share2, Bookmark, ArrowRight, Tag, Trophy, Music, Palette, Code, Gamepad2, BookOpen, Mic, Camera, Zap,Clock9 } from 'lucide-react';
import { useContext } from 'react';
import { EventAppContext } from '../../../Context/EventContext';
import { useEffect } from 'react';
import { Link } from "react-router-dom"
import { useCallback } from 'react';

const categories = [
    { name: 'All', icon: Calendar, color: 'cyan' },
    { name: 'Cultural', icon: Music, color: 'pink' },
    { name: 'Technical', icon: Code, color: 'blue' },
    { name: 'Sports', icon: Trophy, color: 'green' },
    { name: 'Arts', icon: Palette, color: 'purple' },
    { name: 'Gaming', icon: Gamepad2, color: 'orange' },
    { name: 'Academic', icon: BookOpen, color: 'indigo' },
    { name: 'Entertainment', icon: Mic, color: 'red' }
];

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

const MyCollege_Events = () => {
    const { api, EventArray, EventFetcher, setshare } = useContext(EventAppContext)

    console.log(EventArray)
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [likedEvents, setLikedEvents] = useState([]);
    const [bookmarkedEvents, setBookmarkedEvents] = useState([]);

    const filters = ['All', 'Today', 'This Week', 'This Month', 'Free', 'Paid', 'Featured'];

    const filteredEvents = useMemo(() => {
        return EventArray.filter((event, index) => {
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

    const getColorClasses = useCallback((color) => colorMap[color] || colorMap.cyan, []);

    const getCategoryColor = useCallback(
        (categoryName) => categories.find(cat => cat.name === categoryName)?.color || 'cyan',
        []
    );

    useEffect(() => {
        EventFetcher()
    }, [])
    return (
        <div>
            <div className="min-h-screen pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Search and Filter Section */}
                    <div className="mb-12 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-cyan-400/20 p-6">
                            {/* Search Bar */}
                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search events, colleges, or keywords..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                                />
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <h3 className="text-white font-semibold mb-4">Categories</h3>
                                <div className="flex flex-wrap gap-3">
                                    {categories.map((category) => {
                                        const IconComponent = category.icon;
                                        const isSelected = selectedCategory === category.name;
                                        const colorClasses = getColorClasses(category.color);

                                        return (
                                            <button
                                                key={category.name}
                                                onClick={() => setSelectedCategory(category.name)}
                                                className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-300 transform hover:scale-105 active:scale-95 ${isSelected
                                                    ? `bg-gradient-to-r ${colorClasses} scale-105`
                                                    : 'bg-slate-700/30 border-gray-600 text-gray-300 hover:border-cyan-400/40'
                                                    }`}
                                            >
                                                <IconComponent className="w-4 h-4" />
                                                <span className="text-sm font-medium">{category.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap items-center gap-4">
                                {/* <div className="relative">
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white hover:border-cyan-400 transition-all duration-300"
                                    >
                                        <Filter className="w-4 h-4" />
                                        <span>Filter: {selectedFilter}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isFilterOpen && (
                                        <div className="absolute top-full left-0 mt-2 bg-slate-800 border border-cyan-400/30 rounded-xl shadow-xl z-10 min-w-[150px]">
                                            {filters.map((filter) => (
                                                <button
                                                    key={filter}
                                                    onClick={() => {
                                                        setSelectedFilter(filter);
                                                        setIsFilterOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 hover:bg-cyan-500/10 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl ${selectedFilter === filter ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-300'
                                                        }`}
                                                >
                                                    {filter}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div> */}
                                <div className="text-gray-400 text-sm">
                                    {filteredEvents.length} events found
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
                        {Array.isArray(EventArray) && filteredEvents.map((event, index) => {
                            const isLiked = likedEvents.includes(event.Id);
                            const isBookmarked = bookmarkedEvents.includes(event.Id);
                            const categoryColor = getCategoryColor(event.category);
                            const colorClasses = getColorClasses(categoryColor);
                            return (<div
                                key={event.Id}
                                className="group bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-cyan-400/20 overflow-hidden hover:border-cyan-400/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 animate-fadeInUp"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <Link to={`/SubEvent/${EventArray[index].Id}`}>
                                    {/* Event Image */}
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={event.EventLogo}
                                            alt={event.Title}
                                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        {/* Featured Badge */}
                                        {event.Featured && (
                                            <div className="absolute top-4 left-4 flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-yellow-500/90 to-orange-500/90 rounded-full">
                                                <Zap className="w-3 h-3 text-white" />
                                                <span className="text-white text-xs font-semibold">Featured</span>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="absolute top-4 right-4 flex space-x-2 transition-opacity duration-300">

                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setshare({ Isshare: true, eventId: event.Id })
                                            }} className="p-2 rounded-full bg-black/40 border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Price Badge */}
                                        {/* <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                                            <span className="text-white text-sm font-semibold">
                                                {event.Price === 0 ? 'Free' : `₹${event.Price}`}
                                            </span>
                                        </div> */}
                                    </div>

                                    {/* Event Content */}
                                    <div className="p-6">
                                        {/* Category and Rating */}
                                        {/* <div className="flex items-center justify-between mb-3">
                                            <div className={`px-3 py-1 bg-gradient-to-r ${colorClasses} rounded-full border`}>
                                                <span className="text-xs font-semibold">{event.category}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-white text-sm font-medium">{event.Rating}</span>
                                            </div>
                                        </div> */}

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
    )
}

export default MyCollege_Events
