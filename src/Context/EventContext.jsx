import axios, { Axios } from "axios"
import { createContext, useEffect, useState, useMemo, useCallback } from "react"
import randomColor from "randomcolor";
import { useCookies } from "react-cookie";

export const EventAppContext = createContext(null)

const EventContext = (props) => {
    const [hue, setHue] = useState('red');
    const [lum, setLum] = useState('light');

    const api = useMemo(() => axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
        withCredentials: true,
    }), []);

    const [register, setRegister] = useState(false)
    const [details, setdetails] = useState({ username: "", email: "" })
    const [options, setoptions] = useState(false)
    const [progress, setprogress] = useState(0)
    const [randcolor, setrandcolor] = useState("")
    const [profileOptions, setprofileOptions] = useState(false)
    const [otp, setotp] = useState(false)
    const [password, setpassword] = useState(false)
    const [loading, setloading] = useState(true)
    const [EventArray, setEventArray] = useState([])
    const [key, setkey] = useState(false)
    const [admin, setadmin] = useState(false)
    const [isAuthenticated, setisAuthenticated] = useState(false)
    const [share, setshare] = useState({ Isshare: false, eventId: "" })
    const [Voleenter, setVoleenter] = useState(false)
    const [profile, setprofile] = useState(false)
    const [EventNo, setEventNo] = useState("")
    const [subEventNo, setsubEventNo] = useState("")
    const [Participate, setParticipate] = useState(false)
    const [eventhead, seteventhead] = useState(false)
    const [ispaid,setispaid]=useState(false)
    const [toastCondition,settoastCondition]=useState(false)
    const [paymentData,setpaymentData]=useState({isPaid:false,PaymentMode:false})
    const [popup,setpopup]=useState(false)
    const param = {
        luminosity: lum,
        hue: hue,
    };

    //Otp Email
    const [email, setemail] = useState({ "email": "" })

    const fetchUserDetails = useCallback(async () => {
        try {
            const response = await api.get("/Festofy/user/user_details");
            setrandcolor(randomColor(param));
            if (response.data.isAuthenticated) {
                setisAuthenticated(response.data.isAuthenticated)
            }
            if(response.data.user.year===null || response.data.user.department===null || response.data.user.phone===null){
                setpopup(true)
            }else{
                setpopup(false)
            }
            const volunteers = response.data.user.volunteers
            const participations = response.data.user.participations
            setdetails({ username: response.data.user.username, email: response.data.user.email, college_code: response.data.user.college_code, role: response.data.user.role, phone: response.data.user.phone, department: response.data.user.department, year: response.data.user.year, volunteers: volunteers, participations: participations })
            if (response.data.user.role === "admin") {
                setadmin(true);
            }

        } catch (err) {
            setisAuthenticated(false)
        } finally {
            setloading(false); // only stop loading after fetch completes or errors
        }
    }, [api]);
    const EventFetcher = async () => {
        try {
            const response = await api.get("/Festofy/user/event/my-college-events", {}, { withCredentials: true, })
            const response1 = await api.get("/Festofy/user/event/my-college-explore-events", {}, { withCredentials: true, })
            const events = [...response.data.events, ...response1.data.events];
            const FetchedArray = events.map((event) => ({
                Id: event._id,
                Title: event.title,
                Description: event.description,
                startDate: event.dateRange.start || "",
                endDate: event.dateRange.end || "",
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
                time:event.time,
            }))
            setEventArray(FetchedArray)
        } catch (err) {
            console.log(err)
        }
    }
    // console.log(EventArray)



    const closePopup = useCallback(() => {
        setRegister(false);
    }, []);

    useEffect(() => {
        const code = localStorage.getItem("ULRKGDAPS");
        if (code) {
            fetchUserDetails()
        } else {
            setloading(false)
        }

    }, [fetchUserDetails]);

    const contextvalue = useMemo(() => ({
        api, register, setRegister, details, setdetails, fetchUserDetails, options, setoptions, progress, setprogress, randcolor, profileOptions, setprofileOptions, email, setemail, closePopup, otp, setotp, password, setpassword, isAuthenticated, setisAuthenticated, loading, setloading, EventArray, setEventArray, EventFetcher, key, setkey, admin, setadmin, share, setshare, Voleenter, setVoleenter, profile, setprofile, EventNo, setEventNo, subEventNo, setsubEventNo, Participate, setParticipate, eventhead, seteventhead,setispaid,ispaid,toastCondition,settoastCondition,paymentData,setpaymentData,setpopup,popup
    }), [api, register, setRegister, details, setdetails, fetchUserDetails, options, setoptions, progress, setprogress, randcolor, profileOptions, setprofileOptions, email, setemail, closePopup, otp, setotp, password, setpassword, isAuthenticated, setisAuthenticated, loading, setloading,
        EventArray, setEventArray, EventFetcher, key, setkey, admin, setadmin, share, setshare, Voleenter, setVoleenter, profile, setprofile, EventNo, setEventNo, subEventNo, setsubEventNo, Participate, setParticipate, eventhead, seteventhead,setispaid,ispaid,toastCondition,settoastCondition,paymentData,setpaymentData,setpopup,popup
    ]);


    // const contextvalue = {
    //     api, register, setRegister, details, setdetails, fetchUserDetails, options, setoptions, progress, setprogress, randcolor, profileOptions, setprofileOptions, email, setemail, closePopup, otp, setotp, password, setpassword, isAuthenticated, setisAuthenticated, loading, setloading
    // }
    return (
        <EventAppContext.Provider value={contextvalue}>
            {props.children}
        </EventAppContext.Provider>
    )
}

export default EventContext
