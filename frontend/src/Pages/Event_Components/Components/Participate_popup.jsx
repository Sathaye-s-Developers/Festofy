import React, { useContext, useEffect, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { useForm, useFieldArray } from 'react-hook-form'
import { EventAppContext } from '../../../Context/EventContext'
import { Plus } from 'lucide-react';
import { Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
const Participate_popup = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            members: []
        }
    }
    )
    const navigate = useNavigate()
    const { api, setParticipate, subEventNo, EventNo, setispaid, ispaid, toastCondition, settoastCondition } = useContext(EventAppContext)
    const [errormsg, seterrormsg] = useState("")
    const [isSubmitting, setisSubmitting] = useState(false)
    const [teamtype, setteamtype] = useState(null)
    const [ismanual, setismanual] = useState(false)
    const [qrlink, setqrlink] = useState("")
    const [SingleSubEventInfo, setSingleSubEventInfo] = useState("")
    const { fields, append, remove } = useFieldArray({
        control,
        name: "members"
    });

    const addTeammate = () => {
        append({ name: "", email: "", contact: "", roll_no: "" });
    }

    const fetchsubevent = async () => {
        try {
            const response = await api.get(`/Festofy/user/event/subevent/${subEventNo}`, { withCredentials: true, })
            setSingleSubEventInfo(response.data.subEvent)
            setqrlink(response.data.subEvent.QrScanner)
            const qrScanner = response.data.subEvent.QrScanner;
            const hasQrScanner = !!qrScanner;


            if (hasQrScanner) {
                setismanual(hasQrScanner)

            } else if (hasQrScanner === false && response.data.subEvent.price > 0) {
                setispaid(true)
            }

            // const Conditionalprice = !!response.data.subEvent.price > 0 && hasQrScanner === false
            // console.log(Conditionalprice)

            setteamtype(response?.data?.subEvent?.participation_type)

        } catch (err) {
            console.log(err)
        }
    }

    const onsubmit = async (data) => {
        const payload = {
            eventId: EventNo,
            subEventId: subEventNo,
            roll_no: data.roll_no,
            teamName: data.teamName,
            members: data.members,
            TransactionId: data.TransactionId,
            phone: data.PhoneNo
        }

        setisSubmitting(true)
        if (ispaid) {
            try {
                const response = await api.post("/Festofy/user/payment/create-order", payload, {
                    withCredentials: true,
                })
                if (!response.data.success) {
                    seterrormsg(response.data.error || "Order creation failed");
                    setisSubmitting(false);
                    return;
                }
                const dataOrder = response.data;
                const options = {
                    key: dataOrder.key,
                    currency: dataOrder.order.currency,
                    name: "College Fest Payment",
                    description: "Event Participation",
                    order_id: dataOrder.order.id,
                    prefill: {
                        name: dataOrder.participant.name,
                        email: dataOrder.participant.email,
                        contact: data.PhoneNo,
                    },
                    handler: async (paymentResponse) => {
                        try {
                            const verifyRes = await api.post(
                                "/Festofy/user/payment/verify-payment",
                                {
                                    ...payload,
                                    razorpay_order_id: paymentResponse.razorpay_order_id,
                                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                    razorpay_signature: paymentResponse.razorpay_signature,
                                },
                                {
                                    withCredentials: true,
                                }
                            );

                            if (verifyRes.data.success) {
                                setisSubmitting(false);
                                setParticipate(false)
                                window.location.reload()

                            } else {
                                toast.error("Payment Failed")
                            }
                        } catch (err) {
                            console.error(err);
                            toast.error("⚠ Something went wrong during verification.")
                        }
                    },
                    theme: { color: "#3399cc" },
                }
                const rzp = new window.Razorpay(options);
                rzp.open();

            } catch (err) {
                if (err.response && (err.response.status === 409 || err.response.status === 404 || err.response.status === 400)) {
                    seterrormsg(err.response.data.error);
                    setisSubmitting(false)
                }
            } finally {
                setisSubmitting(false);
            }
        } else {
            try {
                const response = await api.post("/Festofy/user/event/participation/register", payload, {
                    withCredentials: true,
                })
                if (response.data.success) {
                    setParticipate(false)
                    setisSubmitting(false)
                    window.location.reload()
                }


            } catch (err) {
                if (err.response && (err.response.status === 409 || err.response.status === 404 || err.response.status === 400)) {
                    seterrormsg(err.response.data.error);
                    setisSubmitting(false)
                }
                setisSubmitting(false)
            }
        }
    }

    useEffect(() => {
        fetchsubevent()
    }, [])
    return (
        <div>
            <div>
                <div className='fixed inset-0 z-50 w-full h-full bg-[#00000090] grid'>
                    <div className='place-self-center left-[580px] opacity-80 top-[200px] bg-white rounded-[12px] w-[90%] sm:w-[55%] md:w-[50%] lg:w-[40%] xl:w-[30%] animate-[fadein_0.5s_ease-in-out_forwards] text-white max-h-[90vh] overflow-y-auto'>
                        <div className='p-5 flex justify-between font-[Nunito]'>
                            <h1 className='font-bold ml-5 text-[18px] text-black'>Participants Register</h1>
                            <RxCross2 onClick={() => { setParticipate(false) }} color='black' />
                        </div>
                        <div className='font-[Nunito]'>
                            <form onSubmit={handleSubmit(onsubmit)}>
                                <div className='flex flex-col items-center'>
                                    <input type="text" placeholder='Your Roll No' className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-3' autoComplete='RollNo' {...register("roll_no", { required: "Please fill all fields" })} />

                                    {errors.roll_no && (
                                        <p className="text-red-500 text-sm mt-1">{errors.roll_no.message}</p>
                                    )}
                                    {ismanual &&
                                        <div className='flex flex-col items-center'>
                                            <img src={qrlink} className='border-2' />
                                            <input type="number" placeholder='Enter Transaction Id' className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-3' autoComplete='transactionid' {...register("TransactionId", { required: "Please fill all fields" })} />
                                            {errors.TransactionId && (
                                                <p className="text-red-500 text-sm mt-1">{errors.TransactionId.message}</p>
                                            )}
                                        </div>
                                    }
                                    {ispaid &&
                                        <div className='flex flex-col items-center w-full'>
                                            <input type="text" placeholder='Enter PhoneNo' className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1  mb-2' autoComplete='phoneno' {...register("PhoneNo", { required: "Please fill all fields" })} />
                                            {errors.PhoneNo && (
                                                <p className="text-red-500 text-sm mt-1">{errors.PhoneNo.message}</p>
                                            )}
                                        </div>
                                    }

                                    {teamtype === "team" && (<>

                                        <input type="text" placeholder='Team Name' className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-4' autoComplete='TeamName' {...register("teamName", { required: "Please fill all fields" })} />

                                        {errors.teamName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.teamName.message}</p>
                                        )}

                                        <button type="button" onClick={addTeammate} className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-4 flex items-center justify-center gap-2'><Plus size={15} /> Add Teammates</button>

                                        {fields.map((fields, index) => (
                                            <div key={index} className='w-[80%] border pl-3 pr-3 pt-2 rounded-lg'>

                                                <p className='text-black font-semibold mb-2'>Player {index + 1}</p>

                                                <input
                                                    type="text"
                                                    placeholder='Name'
                                                    className='text-black border w-full rounded-[5px] p-1 mb-2'
                                                    {...register(`members.${index}.name`, { required: "Please fill all fields" })}
                                                />

                                                {errors.members?.[index]?.name && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.members?.[index]?.name.message}</p>
                                                )}

                                                <input
                                                    type="email"
                                                    placeholder='Email'
                                                    className='text-black border w-full rounded-[5px] p-1 mb-2'
                                                    {...register(`members.${index}.email`, { required: "Please fill all fields" })}
                                                />

                                                {errors.members?.[index]?.email && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.members?.[index]?.email.message}</p>
                                                )}

                                                <input
                                                    type="number"
                                                    placeholder='Phone No'
                                                    className='text-black border w-full rounded-[5px] p-1 mb-2'
                                                    {...register(`members.${index}.contact`, { required: "Please fill all fields" })}
                                                />

                                                {errors.members?.[index]?.contact && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.members?.[index]?.contact.message}</p>
                                                )}

                                                <input
                                                    type="text"
                                                    placeholder='Roll No'
                                                    className='text-black border w-full rounded-[5px] p-1 mb-2'
                                                    {...register(`members.${index}.roll_no`, { required: "Please fill all fields" })}
                                                />

                                                {errors.members?.[index]?.roll_no && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.members?.[index]?.roll_no.message}</p>
                                                )}

                                                <button type="button" onClick={() => remove(index)}>Remove</button>
                                            </div>
                                        )
                                        )}
                                    </>)}


                                    {errormsg && (<div className='w-[80%] mb-3'><p className='text-red-600'>{errormsg}</p></div>)}

                                    <button type='submit' disabled={isSubmitting} className={`${isSubmitting
                                        ? "opacity-50 cursor-not-allowed"
                                        : "cursor-pointer hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/25 hover:scale-105 hover:-translate-y-0.3"
                                        } bg-gradient-to-r from-cyan-500 to-blue-600 w-[80%] text-white mb-2 rounded-[15px] cursor-pointer p-1 hover:from-cyan-400 hover:to-blue-500 transition-all duration-100 font-medium shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 hover:-translate-y-0.3 outline-none border-none`}>{isSubmitting ? `${ispaid ? "Paying..." : "Submitting..."}` : `${ispaid ? "Pay Now" : "Submit"}`}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Participate_popup
