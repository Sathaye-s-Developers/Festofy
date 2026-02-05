import React, { useContext, memo, useState } from 'react'
import { EventAppContext } from '../Context/EventContext'
import { college_Name } from "../Websites data/Colleges_Names"
import Select from 'react-select'
import { RxCross2 } from "react-icons/rx";
import { FiEye, FiEyeOff } from "react-icons/fi";

const LoginForm = ({ login, setlogin, onsubmit, errorMsg, isSubmitting, register, handleSubmit, setValue,control,Controller }) => {
    const { closePopup, setpassword } = useContext(EventAppContext)

    const [addpassword, setaddpassword] = useState(false)
 

    const handleCollegeChange = (selectedOption) => {
        setValue("college_code", selectedOption.value, {
            shouldValidate: true, // Optional, to trigger validation
            shouldDirty: true,
        });
    };
    React.useEffect(() => {
       if (login !== "logout") {
    register("college_code", { required: "College is required" });
  }
    }, [register,login]);

    return (
        <div>
            <div className='p-5 flex justify-between font-[Nunito]'>
                <h1 className='font-bold ml-5 text-[18px] text-black'>{login === "logout" ? "Login" : "SignUp"}</h1>
                <RxCross2 onClick={closePopup} color='black' />
            </div>
            <div className='font-[Nunito]'>
                <form onSubmit={handleSubmit(onsubmit)}>
                    <div className='flex flex-col items-center'>
                        {login === "logout" ? null : <input type="text" placeholder='Your Username' className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-4' autoComplete='username' {...register("Username", { required: true })} />}

                        <input type="email" placeholder='Your Email' className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-4' autoComplete='email' {...register("Email", { required: true })} />

                        <div className='flex w-[80%] justify-around items-center relative mb-4'>
                            <input type={addpassword ? "text" : "password"} placeholder='Your Password' className='text-black outline-none border-2 border-gray-300 w-full rounded-[5px] p-1' autoComplete='password' {...register("Password", { required: true })} />
                            <p
                                onClick={() => setaddpassword(prev => !prev)}
                                className='absolute top-2.5 right-3 cursor-pointer text-gray-500'
                            >{addpassword ? <FiEyeOff /> : <FiEye />}</p>
                        </div>
                        {login === "logout" ? <></> :
                            <div className='w-[80%] mb-4'>
                                <Controller
                                    name="college_code"
                                    control={control}  // get this from useForm()
                                    rules={{ required: "College is required" }}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <Select
                                                {...field}
                                                options={college_Name.map(college => ({
                                                    label: college.full_name,
                                                    value: college.college_code,
                                                }))}
                                                className="w-full h-[36px]"
                                                isSearchable
                                                styles={{
                                                    control: (baseStyles, state) => ({
                                                        ...baseStyles,
                                                        border: `1px solid white ${state.isFocused ? "white" : "white"}`,
                                                        boxShadow: "none",
                                                        backgroundColor: "transparent",
                                                        color: "black",
                                                    }),
                                                    menu: (base) => ({
                                                        ...base,
                                                        backgroundColor: "#1f2937",
                                                        color: "white",
                                                        zIndex: 9999,
                                                    }),
                                                    option: (base, state) => ({
                                                        ...base,
                                                        backgroundColor: state.isFocused ? "#374151" : "#1f2937",
                                                        color: "white",
                                                        cursor: "pointer",
                                                        "&:hover": {
                                                            backgroundColor: "#4b5563",
                                                            color: "black",
                                                        },
                                                    }),
                                                    input: (base) => ({
                                                        ...base,
                                                        color: "black",
                                                    }),
                                                    placeholder: (base) => ({
                                                        ...base,
                                                        color: "black",
                                                    }),
                                                    singleValue: (base) => ({
                                                        ...base,
                                                        color: "black",
                                                    }),
                                                }}
                                                placeholder="Your College Name"
                                                onChange={val => field.onChange(val.value)} // pass only value to react-hook-form
                                                value={college_Name
                                                    .map(college => ({
                                                        label: college.full_name,
                                                        value: college.college_code,
                                                    }))
                                                    .find(option => option.value === field.value)
                                                }
                                            />
                                            {error && <p className="text-red-600 text-sm mt-1">{error.message}</p>}
                                        </>
                                    )}
                                />

                            </div>}

                        {login === "logout" ? <input type="text" placeholder='Special Key (Optional)' className='text-black outline-none border-2 border-gray-300 w-[80%] rounded-[5px] p-1 mb-3' {...register("Special_key")} autoComplete='Special_key' /> : null}
                        {errorMsg && (<div className='w-[80%] mb-3'><p className='text-red-600'>{errorMsg}</p></div>)}
                        {login === "logout" ?
                            <div className='flex flex-col items-end w-[80%]'>
                                <div className='text-blue-400 hover:underline active:text-white active:underline' onClick={() => { setpassword(true) }}>Forgot Password ?</div>
                            </div>
                            : <></>
                        }

                        {/* {login === "logout" ?
                            <div className='flex flex-col items-end w-[80%]'>
                                <a className='text-blue-400 underline' href="#Tutorial" onClick={closePopup}>Apply for special key</a>
                            </div>
                            : <></>
                        } */}

                        {/* {login === "logout" ? <></> :
                            <div className='flex flex-col items-end w-[80%]'>
                                <a className='text-blue-400 underline' href="#Tutorial" onClick={closePopup}>If College name not found</a>
                            </div>
                        } */}
                        <div className='w-[80%] flex justify-end mb-2 hover:cursor-pointer'>
                            <a href="#Enquiry" className='text-blue-500 underline' onClick={closePopup}></a>
                        </div>

                        <div className='flex items-center w-[80%] mb-4'>
                            <input type="checkbox" className='cursor-pointer' required />
                            <p className='text-[12px] pl-1 text-gray-600 '> By continuing , I agree to the terms & conditions </p>
                        </div>

                        <button type='submit' disabled={isSubmitting} className={`${isSubmitting
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/25 hover:scale-105 hover:-translate-y-0.3"
                            } bg-gradient-to-r from-cyan-500 to-blue-600 w-[80%] text-white mb-2 rounded-[15px] cursor-pointer p-1 hover:from-cyan-400 hover:to-blue-500 transition-all duration-100 font-medium shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 hover:-translate-y-0.3 outline-none border-none`}>{isSubmitting ? "Submitting..." : "Submit"}</button>

                        <div className='flex gap-2 mb-2'>
                            {login === "login" ? <p className='text-gray-600 text-[14px]'>Already have an account </p> :
                                <p className='text-gray-600 text-[14px]'>Create a new account ? </p>}
                            {login === "logout" ?
                                <p className='text-blue-600 text-[14px] font-bold hover:underline' onClick={() => { setlogin("login") }}>Click Here</p>
                                :
                                <p className='text-blue-600 text-[14px] font-bold hover:underline' onClick={() => { setlogin("logout") }}>Click Here</p>
                            }
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default memo(LoginForm);
