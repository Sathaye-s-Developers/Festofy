import React, { useContext, useState } from 'react';
import { Calendar, Clock, MapPin, Users, Star, Filter, Search, ChevronDown, Heart, Share2, Bookmark, ArrowRight, Tag, Trophy, Music, Palette, Code, Gamepad2, BookOpen, Mic, Camera, Zap, X, Save, Plus, Trash2, Send, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { EventAppContext } from '../../Context/EventContext';
import group from "../../assets/group.png"
import person from "../../assets/person.png"
import { CiCircleQuestion } from "react-icons/ci";
import { MdUploadFile } from "react-icons/md";
import axios from 'axios';

const CreateSub_EventPg = () => {
    const { api,paymentData,setpaymentData } = useContext(EventAppContext)
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [newPrize, setnewPrize] = useState('');
    const [editingSubEvent, setEditingSubEvent] = useState(null);
    const Navigate = useNavigate()
    const { eventId } = useParams()
    const { register, handleSubmit, setValue, setError, control, watch, formState: { errors } } = useForm({
        defaultValues: {
            mode: "onSubmit",
            reValidateMode: "onSubmit",
            category: "",
            ParticipationCategory: "",
            Prices: [],
            isPaid: false,
            PaymentMode: false
        }
    })

    const onsubmit = async (data) => {
        const dateObj = new Date(data.Date);
        let imageUrl
        if (data.PaymentMode) {
            const file = data.Qrimg[0];
            const formData = new FormData();
            formData.append("file", file)
            formData.append("upload_preset", "Festofy")

            const cloudinaryRes = await axios.post(
                "https://api.cloudinary.com/v1_1/dr2twfsn1/image/upload",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            imageUrl = cloudinaryRes.data.secure_url;
        }

        const payload = {
            title: data.Title,
            description: data.Description,
            date: new Date(dateObj.setUTCHours(0, 0, 0, 0)).toISOString(),
            time: data.Time,
            eventId: eventId,
            price: data.EntryFee ? Number(data.EntryFee) : 0,
            duration: data.Duration,
            requirements: data.Requirements,
            prizes: data.Prices,
            maxParticipants: data.MaxParticipants,
            location: data.Location,
            subEventCategory: data.category,
            participation_type: data.ParticipationCategory,
            maxVoleenters: data.MaxVoleenters,
            QrScanner:imageUrl
        }
        try {
            const response = await api.post("/Festofy/user/event/subevent/create", payload, { withCredentials: true, })
            if (response.data.success) {
                setIsSubmitting(true)
                setIsSubmitted(true)
            } else {
                setIsSubmitting(false)
            }
        } catch (err) {
            console.log(err.response.data)
            const message = err.response?.data?.error || "Something went wrong!";
            setError("root.serverError", {
                type: "server",
                message
            }, { shouldFocus: false });
            setIsSubmitting(false)
        }
    }

    const subEventTypes = [
        { value: 'workshop', label: 'Workshop', icon: Code, color: 'blue' },
        { value: 'competition', label: 'Competition', icon: Trophy, color: 'red' },
        { value: 'talk', label: 'Talk/Presentation', icon: Mic, color: 'green' },
        { value: 'performance', label: 'Performance', icon: Music, color: 'purple' },
        { value: 'ceremony', label: 'Ceremony', icon: Star, color: 'yellow' }
    ];

    const PaticipationTypes = [
        { value: 'solo', label: 'Solo', icon: person, color: 'blue' },
        { value: 'team', label: 'Team', icon: group, color: 'red' },
    ];

    const addPrize = () => {
        if (newPrize.trim()) {
            const updatedPrizes = [...Prices, newPrize.trim()];
            setValue("Prices", updatedPrizes, { shouldValidate: true });
            setnewPrize('');
        }
    };

    // 4. Remove prize
    const removePrize = (index) => {
        const updatedPrizes = Prices.filter((_, i) => i !== index);
        setValue("Prices", updatedPrizes, { shouldValidate: true });
    };
    const getTypeColor = (color) => {
        const colorMap = {
            blue: 'from-blue-500/20 to-blue-600/20 border-blue-400/30 text-blue-400',
            red: 'from-red-500/20 to-red-600/20 border-red-400/30 text-red-400',
            green: 'from-green-500/20 to-green-600/20 border-green-400/30 text-green-400',
            purple: 'from-purple-500/20 to-purple-600/20 border-purple-400/30 text-purple-400',
            yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-400/30 text-yellow-400'
        };
        return colorMap[color] || colorMap.blue;
    };

    const Prices = watch("Prices", []);
    const selectedCategory = watch("category", "");
    const ParticipationCategory = watch("ParticipationCategory", "")

    if (isSubmitted) {
        return (
            <div className="min-h-screen pt-24 pb-16 px-6 flex items-center justify-center">
                <div className="max-w-2xl mx-auto text-center animate-fadeInUp">
                    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-3xl border border-cyan-400/20 p-12">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">SubEvent Created Successfully!</h1>
                        <p className="text-gray-300 mb-8">
                            {/* Your event "{eventForm.title}" has been submitted for review. You'll receive a confirmation email shortly. */}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => Navigate("/Admin/MyEvents")}
                                className="px-6 py-3 bg-slate-700/50 border border-gray-600 text-gray-300 rounded-xl hover:border-cyan-400/40 hover:text-white transition-all duration-300"
                            >
                                View All SubEvents
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className='bg-black h-screen'>
            <div className="flex items-center justify-center p-4 animate-fadeIn">
                <div className=" rounded-3xl w-full  animate-scaleIn">
                    <form onSubmit={handleSubmit(onsubmit)}>
                        {/* Modal Header */}
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                                    <Calendar className="w-6 h-6 text-cyan-400" />
                                    <span>{editingSubEvent ? 'Edit Sub-Event' : 'Create Sub-Event'}</span>
                                </h2>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="space-y-6">

                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Sub-Event Title *</label>
                                        <input
                                            type="text"
                                            {...register("Title", { required: "Fields Should Not be empty !" })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                                            placeholder="e.g., AI Workshop - Machine Learning Basics"
                                        />
                                        {errors.Title && (
                                            <p className="text-red-500 text-sm mt-1">{errors.Title.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
                                        <input
                                            type="text"
                                            {...register("Location", { required: "Fields Should Not be empty !" })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                                            placeholder="e.g, location of sub-event like room no."
                                        />
                                        {errors.Location && (
                                            <p className="text-red-500 text-sm mt-1">{errors.Location.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block mt-5 text-sm font-medium text-gray-300 mb-2">Description *</label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        {...register("Description", { required: "Fields Should Not be empty !" })}
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 resize-none"
                                        placeholder="Describe what this sub-event is about..."
                                    />
                                    {errors.Description && (
                                        <p className="text-red-500 text-sm mt-1">{errors.Description.message}</p>
                                    )}
                                </div>

                                {/* Type Selection */}
                                <div>
                                    <label className="mt-5 block text-sm font-medium text-gray-300 mb-4">Sub-Event Type *</label>
                                    <input type="hidden" {...register("category", { required: "Select Category !" })} />
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                        {subEventTypes.map((type) => {
                                            const IconComponent = type.icon;
                                            const isSelected = selectedCategory === type.value;
                                            const colorClasses = getTypeColor(type.color);
                                            return (
                                                <button
                                                    key={type.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setValue("category", type.value, { shouldValidate: true });
                                                        // handleTypeSelect(type.value);
                                                    }}
                                                    className={`p-4 rounded-xl border transition-all duration-300 transform hover:scale-105 active:scale-95 text-center ${isSelected
                                                        ? `bg-gradient-to-r ${colorClasses} scale-105`
                                                        : 'bg-slate-700/30 border-gray-600 text-gray-300 hover:border-cyan-400/40'
                                                        }`}
                                                >
                                                    <IconComponent className="w-6 h-6 mx-auto mb-2" />
                                                    <span className="text-xs font-medium">{type.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.category && (
                                        <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mt-5 block text-sm font-medium text-gray-300 mb-4">Participation Type *</label>
                                    <input type="hidden" {...register("ParticipationCategory", { required: "Select Participation Category !" })} />
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                        {PaticipationTypes.map((type) => {
                                            const IconComponent = type.icon;
                                            const isSelected = ParticipationCategory === type.value;
                                            const colorClasses = getTypeColor(type.color);
                                            return (
                                                <button
                                                    key={type.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setValue("ParticipationCategory", type.value, { shouldValidate: true });

                                                    }}
                                                    className={`p-4 rounded-xl border transition-all duration-300 transform hover:scale-105 active:scale-95 text-center ${isSelected
                                                        ? `bg-gradient-to-r ${colorClasses} scale-105`
                                                        : 'bg-slate-700/30 border-gray-600 text-gray-300 hover:border-cyan-400/40'
                                                        }`}
                                                >
                                                    <img src={IconComponent} className="invert w-6 h-6 mx-auto mb-2" />
                                                    <span className="text-xs font-medium">{type.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.ParticipationCategory && (
                                        <p className="text-red-500 text-sm mt-1">{errors.ParticipationCategory.message}</p>
                                    )}
                                </div>

                                {/* Time and Duration */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Event Start Date *</label>
                                        <input
                                            type="date"
                                            {...register("Date", { required: "Fields Should Not be empty !" })}
                                            min={new Date().toISOString().split("T")[0]}   // restricts to today and future dates
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                                        />

                                        {errors.Date && (
                                            <p className="text-red-500 text-sm mt-1">{errors.Date.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Start Time *</label>
                                        <input
                                            type="time"
                                            {...register("Time", { required: "Fields Should Not be empty !" })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                                        />
                                        {errors.Time && (
                                            <p className="text-red-500 text-sm mt-1">{errors.Time.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Max Participants  *</label>
                                        <input
                                            type="number"
                                            {...register("MaxParticipants", { required: "Fields Should Not be empty !" })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                                            placeholder="Maximum Participants"
                                        />
                                        {errors.MaxParticipants && (
                                            <p className="text-red-500 text-sm mt-1">{errors.MaxParticipants.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Max volunteer *</label>
                                        <input
                                            type="number"
                                            {...register("MaxVoleenters", { required: "Fields Should Not be empty !" })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                                            placeholder="Maximum volunteer"
                                        />
                                        {errors.MaxVoleenters && (
                                            <p className="text-red-500 text-sm mt-1">{errors.MaxVoleenters.message}</p>
                                        )}
                                    </div>

                                </div>

                                {/* Participants and Requirements */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Duration *</label>
                                        <input
                                            type="text"
                                            {...register("Duration", { required: "Fields Should Not be empty !" })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                                            placeholder="e.g., 3 hours"
                                        />
                                        {errors.Duration && (
                                            <p className="text-red-500 text-sm mt-1">{errors.Duration.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Requirements *</label>
                                        <input
                                            type="text"
                                            {...register("Requirements", { required: "Fields Should Not be empty !" })}
                                            className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                                            placeholder="e.g, Eligibilty Criteria"
                                        />
                                        {errors.Requirements && (
                                            <p className="text-red-500 text-sm mt-1">{errors.Requirements.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>

                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Payment Mode *</label>
                                        <div className="flex items-center space-x-3">
                                            <div
                                                onClick={() => setValue("isPaid", !watch("isPaid"))}
                                                className={`relative w-14 h-8 rounded-full transition-colors duration-300 cursor-pointer ${watch("isPaid") ? 'bg-green-500/60' : 'bg-blue-500/60'}`}
                                            >
                                                <div
                                                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${watch("isPaid") ? 'translate-x-6' : 'translate-x-0'}`}
                                                />
                                            </div>
                                            <span className={`text-sm font-medium ${watch("isPaid") ? 'text-green-400' : 'text-blue-400'}`}>
                                                {watch("isPaid") ? "Paid" : "Free"}
                                            </span>
                                        </div>
                                    </div>

                                    {watch("isPaid") && <div className="mt-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <label className="block text-sm font-medium text-gray-300 ">Payment Method </label>
                                            <div className="relative group">
                                                <CiCircleQuestion
                                                    className='hover:cursor-pointer text-gray-400'
                                                />
                                                <div className="absolute left-0 top-full mt-2 w-64 bg-gray-800 text-gray-300 text-[14px] p-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                                    For manual payments, please upload a QR code image. For automatic payments, this step is not required.
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex gap-2'>
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    onClick={() => setValue("PaymentMode", !watch("PaymentMode"))}
                                                    className={`relative w-14 h-8 rounded-full transition-colors duration-300 cursor-pointer ${watch("PaymentMode") ? 'bg-green-500/60' : 'bg-blue-500/60'}`}
                                                >
                                                    <div
                                                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${watch("PaymentMode") ? 'translate-x-6' : 'translate-x-0'}`}
                                                    />
                                                </div>
                                                <span className={`text-sm font-medium ${watch("PaymentMode") ? 'text-green-400' : 'text-blue-400'}`}>
                                                    {!watch("PaymentMode") ? "RozarPay" : "Manual"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                </div>

                                {watch("PaymentMode") && <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-4">Upload Qr Scanner *</label>
                                    <input className='hidden' accept="image/*" id="banner-upload" type='file' {...register("Qrimg", {
                                        required: "Enter the image file !",
                                        validate: fileList =>
                                            fileList && fileList.length > 0 && fileList[0].type.startsWith("image/")
                                                ? true
                                                : "Only image files are allowed",
                                        onChange: (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setPreview(URL.createObjectURL(file)); // create preview
                                            }
                                        }
                                    })} />
                                    <label
                                        htmlFor="banner-upload"
                                        className="flex flex-col "
                                    >
                                        <MdUploadFile size={40} />
                                    </label>
                                    {errors.Qrimg && (
                                        <p className="text-red-500 text-sm mt-1">{errors.Qrimg.message}</p>
                                    )}

                                    {/* Image preview */}
                                    {preview && (
                                        <div className="mt-4">
                                            <img
                                                src={preview}
                                                alt="Selected Banner"
                                                className="w-full max-w-md rounded-xl border border-cyan-400/30"
                                            />
                                        </div>
                                    )}
                                </div>}

                                {watch("isPaid") && <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Entry Fee *</label>
                                    <input
                                        type="number"
                                        {...register("EntryFee", { required: "Fields Should Not be empty !" })}
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                                        placeholder="0 for free event"
                                    />
                                    {errors.EntryFee && (
                                        <p className="text-red-500 text-sm mt-1">{errors.EntryFee.message}</p>
                                    )}
                                </div>}

                                {/* Prizes */}
                                {selectedCategory === 'competition' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2 mt-6">Prizes</label>
                                        <div className="space-y-3">
                                            {Prices.filter(p => p).map((prize, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <div className="flex items-center space-x-2 flex-1 px-3 py-2 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
                                                        <Trophy className="w-4 h-4 text-yellow-400" />
                                                        <span className="text-yellow-400 text-sm font-medium">{index + 1}.</span>
                                                        <span className="text-white">{prize}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removePrize(index)}
                                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <div className="flex space-x-2">
                                                <input
                                                    type="hidden"
                                                    {...register("Prices", { required: "Please add at least one Prize" })}
                                                />
                                                <input
                                                    type="text"
                                                    value={newPrize}
                                                    onChange={(e) => setnewPrize(e.target.value)}
                                                    className="flex-1 px-4 py-2 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                                                    placeholder="e.g., ₹10,000 cash prize"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addPrize}
                                                    className="px-4 py-2 bg-yellow-500/20 border border-yellow-400/30 text-yellow-400 rounded-xl hover:bg-yellow-500/30 transition-colors duration-300"
                                                >

                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {errors.Prices && (
                                                <p className="text-red-500 text-sm mt-1">{errors.Prices.message}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                        {errors.root?.serverError && (
                            <p className="text-red-500 mb-4 text-center mt-4 text-2xl">
                                {errors.root.serverError.message}
                            </p>
                        )}
                        {/* Modal Footer */}
                        <div className="p-6 border-t border-cyan-400/20">
                            <div className="flex flex-col sm:flex-row gap-4 justify-end">
                                <button
                                    onClick={() => { Navigate("/Admin") }}
                                    className="px-6 py-3 bg-slate-700/50 border border-gray-600 text-gray-300 rounded-xl hover:border-cyan-400/40 hover:text-white transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button type='submit' disabled={isSubmitting}
                                    className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${isSubmitting
                                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500'
                                        }`}
                                >
                                    {/* <Save className="w-4 h-4" /> */}
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Creating SubEvent...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            <span>Create SubEvent</span>
                                        </>
                                    )}
                                    {/* <span>{editingSubEvent ? 'Update Sub-Event' : 'Create Sub-Event'}</span> */}
                                </button>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default CreateSub_EventPg
