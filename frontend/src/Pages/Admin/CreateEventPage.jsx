import React, { useCallback, useContext, useState } from 'react';
import { Calendar, Clock, MapPin, Users, DollarSign, Tag, Image, FileText, Save, Send, ArrowLeft, Plus, X, Upload, Eye, Star, Trophy, Music, Palette, Code, Gamepad2, BookOpen, Mic, Camera, Zap, CheckCircle, Watch } from 'lucide-react';
import { useForm, Controller } from "react-hook-form";
import axios from 'axios';
import { useNavigate } from 'react-router';
import { MdUploadFile } from "react-icons/md";
import { EventAppContext } from '../../Context/EventContext';

const CreateEventPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [preview, setPreview] = useState(null);
  const { api } = useContext(EventAppContext)
  const [eventForm, seteventForm] = useState([])
  const Navigate = useNavigate()
  const { register, handleSubmit, setValue, setError, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      mode: "onSubmit",
      reValidateMode: "onSubmit",
      category: "",
      Tags: []
    }
  })

  const onsubmithandler = useCallback(async (data) => {
    setIsSubmitting(true)
    const file = data.banner[0];
    const formData = new FormData();
    const startDate = new Date(data.StartDate);
    const endDate = new Date(data.EndDate);

    formData.append("file", file)
    formData.append("upload_preset", "Festofy")

    const cloudinaryRes = await axios.post(
      "https://api.cloudinary.com/v1_1/dr2twfsn1/image/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    const imageUrl = cloudinaryRes.data.secure_url;

    const payload = {
      email: data.Email,
      title: data.Title,
      department: data.category,
      description: data.Description,
      dateRange: {
        start: new Date(startDate.setUTCHours(0, 0, 0, 0)).toISOString(),
        end: new Date(endDate.setUTCHours(23, 59, 59, 999)).toISOString()
      },
      tags: data.Tags,
      location: data.Location,
      time:data.Time,
      organiser_name: data.Host,
      visibility: data.Visibility,
      bannerUrl: imageUrl,
      phone: data.ContactNo
    }
    seteventForm(payload)
    try {
      const response = await api.post("/Festofy/user/event/create", payload, { withCredentials: true, })
      if (response.data.success) {
        setIsSubmitting(false);
        setIsSubmitted(true)
      }
      setIsSubmitting(false)
    } catch (err) {
      console.log(err.response.data)
      const message = err.response?.data?.error || "Something went wrong!";
      setError("root.serverError", {
        type: "server",
        message
      }, { shouldFocus: false });
      setIsSubmitting(false)

    }
  })



  const categories = [
    { name: 'Technical', icon: Code, color: 'blue', description: 'Tech talks, hackathons, coding competitions' },
    { name: 'Cultural', icon: Music, color: 'pink', description: 'Dance, music, traditional performances' },
    { name: 'Sports', icon: Trophy, color: 'green', description: 'Athletic competitions and tournaments' },
    { name: 'Arts', icon: Palette, color: 'purple', description: 'Creative workshops and exhibitions' },
    { name: 'Gaming', icon: Gamepad2, color: 'orange', description: 'Gaming tournaments and competitions' },
    { name: 'Academic', icon: BookOpen, color: 'indigo', description: 'Conferences, seminars, workshops' },
    { name: 'Entertainment', icon: Mic, color: 'red', description: 'Shows, concerts, entertainment events' }
  ];


  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed) {
      const updatedTags = [...tags, trimmed]
      setValue("Tags", updatedTags, { shouldValidate: true });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setValue(
      "Tags", updatedTags,
      { shouldValidate: true }
    );
  };


  const handleSubmitbtn = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const getCategoryColor = (color) => {
    const colorMap = {
      blue: 'from-blue-500/20 to-blue-600/20 border-blue-400/30 text-blue-400',
      pink: 'from-pink-500/20 to-pink-600/20 border-pink-400/30 text-pink-400',
      green: 'from-green-500/20 to-green-600/20 border-green-400/30 text-green-400',
      purple: 'from-purple-500/20 to-purple-600/20 border-purple-400/30 text-purple-400',
      orange: 'from-orange-500/20 to-orange-600/20 border-orange-400/30 text-orange-400',
      indigo: 'from-indigo-500/20 to-indigo-600/20 border-indigo-400/30 text-indigo-400',
      red: 'from-red-500/20 to-red-600/20 border-red-400/30 text-red-400'
    };

    return colorMap[color] || colorMap.blue;
  };


  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-6 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center animate-fadeInUp">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-3xl border border-cyan-400/20 p-12">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Event Created Successfully!</h1>
            <p className="text-gray-300 mb-8">
              {/* Your event "{eventForm.title}" has been submitted for review. You'll receive a confirmation email shortly. */}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => Navigate("/Admin/MyEvents")}
                className="px-6 py-3 bg-slate-700/50 border border-gray-600 text-gray-300 rounded-xl hover:border-cyan-400/40 hover:text-white transition-all duration-300"
              >
                View All Events
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectCategory = watch("category")
  // const tags = watch("Tags", []);
  // const tags = Array.isArray(watch("Tags")) ? watch("Tags") : [];
  const tags = watch("Tags")

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-white bg-clip-text text-transparent">
              Create Amazing
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
              College Events
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Bring your ideas to life and create memorable experiences for students across colleges
          </p>
        </div>

        {/* Form Content */}
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-cyan-400/20 p-8 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
          <form onSubmit={handleSubmit(onsubmithandler)}>

            {/* Step 1: Basic Info */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Basic Event Information</h2>

              {/* Event Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Title *</label>
                <input
                  type="text"
                  {...register("Title", { required: "Fields Should Not be empty !" })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  placeholder="Enter a catchy event title"
                />
                {errors.Title && (
                  <p className="text-red-500 text-sm mt-1">{errors.Title.message}</p>
                )}
              </div>

              {/* Event Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Description *</label>
                <textarea
                  {...register("Description", { required: "Fields Should Not be empty !" })}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 resize-none"
                  placeholder="Describe your event in detail..."
                />
                {errors.Description && (
                  <p className="text-red-500 text-sm mt-1">{errors.Description.message}</p>
                )}
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">Event Category *</label>
                <input type="hidden" {...register("category", { required: "Select Category !" })} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    const isSelected = selectCategory === category.name;
                    const colorClasses = getCategoryColor(category.color);

                    return (
                      <button
                        key={category.name}
                        type="button"
                        onClick={() => {
                          setValue("category", category.name, { shouldValidate: true })
                        }}
                        className={`p-4 rounded-xl border transition-all duration-300 transform hover:scale-105 active:scale-95 text-left ${isSelected
                          ? `bg-gradient-to-r ${colorClasses} scale-105`
                          : 'bg-slate-700/30 border-gray-600 text-gray-300 hover:border-cyan-400/40'
                          }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <IconComponent className="w-6 h-6" />
                          <span className="font-semibold">{category.name}</span>
                        </div>
                        <p className="text-xs opacity-80">{category.description}</p>
                      </button>
                    );
                  })}
                </div>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">Upload Event Banner *</label>
                <input className='hidden' accept="image/*" id="banner-upload" type='file' {...register("banner", {
                  required: "Enter the image file !",
                  validate: fileList =>
                    fileList && fileList.length > 0 && fileList[0].type.startsWith("image/")
                      ? true
                      : "Only image files are allowed",
                  onChange: (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPreview(URL.createObjectURL(file)); // create preview
                    } else {
                      setPreview(null);
                    }
                  }
                })} />
                <label
                  htmlFor="banner-upload"
                  className="flex flex-col "
                >
                  <MdUploadFile size={40} />
                </label>
                {errors.banner && (
                  <p className="text-red-500 text-sm mt-1">{errors.banner.message}</p>
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
              </div>
              {/* <p>1918x867px</p> */}

            </div>

            {/* Step 2: Schedule & Location */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6 mt-10 text-center">Schedule & Location</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event Start Date *</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    {...register("StartDate", { required: "Fields Should Not be empty !" })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  />
                  {errors.StartDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.StartDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event End Date *</label>
                  <input
                    type="date"
                    min={watch("StartDate") || new Date().toISOString().split("T")[0]}
                    {...register("EndDate", { required: "Fields Should Not be empty !" })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  />
                  {errors.EndDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.EndDate.message}</p>
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
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event Location *</label>
                  <input
                    type="text"
                    {...register("Location", { required: "Fields Should Not be empty !" })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                    placeholder="e.g., Main Auditorium, Tech Campus"
                  />
                  {errors.Location && (
                    <p className="text-red-500 text-sm mt-1">{errors.Location.message}</p>
                  )}
                </div>
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Maximum Attendees *</label>
                  <input
                    type="number"
                    {...register("MaxAttendee", { required: "Fields Should Not be empty !" })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                    placeholder="Maximum number of participants"
                  />
                  {errors.MaxAttendee && (
                    <p className="text-red-500 text-sm mt-1">{errors.MaxAttendee.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Maximum Voleenters *</label>
                  <input
                    type="number"
                    {...register("MaxVoleenter", { required: "Fields Should Not be empty !" })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                    placeholder="Maximum number of participants"
                  />
                  {errors.MaxVoleenter && (
                    <p className="text-red-500 text-sm mt-1">{errors.MaxVoleenter.message}</p>
                  )}
                </div>
              </div> */}
            </div>

            {/* Step 3: Additional Details */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6  mt-10 text-center">Additional Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Visibility : *</label>
                <div>
                  <select {...register("Visibility", { required: "Fields Should Not Be Empty !" })} className='w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300' defaultValue="">
                    <option value="">
                      -- Select Visibility --
                    </option>
                    <option value="college">Visible To Your College Only</option>
                    <option value="explore">Visible To All Colleges</option>
                  </select>
                  {errors.Visibility && (
                    <p className="text-red-500 text-sm mt-1">{errors.Visibility.message}</p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Tags *</label>
                <div className="flex flex-wrap gap-2 mb-3 max-w-full">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-2 px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-cyan-400 text-sm break-words max-w-full"
                    >
                      <span className="truncate max-w-[120px]">{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-400 transition-colors duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {/* Hidden input so react-hook-form knows about the tags */}
                <input
                  type="hidden"
                  {...register("Tags", { required: "Please add at least one tag" })}
                />

                <div className="flex w-full space-x-2 flex-wrap sm:flex-nowrap">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 min-w-0 px-4 py-2 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                    placeholder="Add tags (e.g., AI, Workshop, Competition)"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-400 transition-colors duration-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {errors.Tags && (
                  <p className="text-red-500 text-sm mt-1">{errors.Tags.message}</p>
                )}
              </div>

              {/* Featured Event */}
              {/* <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={eventForm.featured}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-cyan-500 bg-slate-700 border-cyan-400/30 rounded focus:ring-cyan-400/20"
                  />
                  <label className="text-gray-300">
                    Mark as featured event (will be highlighted in listings)
                  </label>
                </div> */}
            </div>

            {/* Step 4: Contact & Review */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6  mt-10 text-center">Contact Information & Review</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Organizer Name *</label>
                  <input
                    type="text"
                    {...register("Host", { required: "Fields Should Not be empty !" })}
                    className={`w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300`}
                    placeholder="Your name or organization"
                  />
                  {errors.Host && (
                    <p className="text-red-500 text-sm mt-1">{errors.Host.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email *</label>
                  <input
                    type="email"
                    {...register("Email", { required: "Fields Should Not be empty !" })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                    placeholder="contact@example.com"
                  />
                  {errors.Email && (
                    <p className="text-red-500 text-sm mt-1">{errors.Email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contact Phone *</label>
                <input
                  type="tel"
                  {...register("ContactNo", { required: "Fields Should Not be empty !" })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  placeholder="+1 (555) 123-4567"
                />
                {errors.ContactNo && (
                  <p className="text-red-500 text-sm mt-1">{errors.ContactNo.message}</p>
                )}
              </div>

              {/* Event Preview */}
              {/* <div className="bg-slate-700/30 rounded-xl p-6 border border-cyan-400/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-cyan-400" />
                  <span>Event Preview</span>
                </h3>

                <div className="space-y-3 text-sm">
                    <div><span className="text-gray-400">Title:</span> <span className="text-white">{eventForm.title || 'Not specified'}</span></div>
                    <div><span className="text-gray-400">Category:</span> <span className="text-white">{eventForm.department || 'Not specified'}</span></div>
                    <div><span className="text-gray-400">Date & Time:</span> <span className="text-white">{eventForm.dataRange} at {eventForm.time || 'Not specified'}</span></div>
                    <div><span className="text-gray-400">Location:</span> <span className="text-white">{eventForm.location || 'Not specified'}</span></div>
                    <div><span className="text-gray-400">Price:</span> <span className="text-white">{eventForm.price ? `₹${eventForm.price}` : 'Free'}</span></div>
                    <div><span className="text-gray-400">Max Attendees:</span> <span className="text-white">{eventForm.maxParticipants || 'Unlimited'}</span></div>
                    <div><span className="text-gray-400">Organizer:</span> <span className="text-white">{eventForm.organiser_name || 'Not specified'}</span></div>
                  </div>
              </div> */}
            </div>
            {errors.root?.serverError && (
              <p className="text-red-500 mb-4 text-center mt-4 text-2xl">
                {errors.root.serverError.message}
              </p>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-center pt-8 border-t border-gray-600">
              <button
                type='submit'
                disabled={isSubmitting}
                className={`flex items-center space-x-2 px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${isSubmitting
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Event...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Create Event</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateEventPage