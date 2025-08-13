// import React, { useState } from "react";

// // @components
// import {
//     Card,
//     Input,
//     Button,
//     CardBody,
//     CardHeader,
//     Typography,
//     Checkbox,
// } from "@material-tailwind/react";
// import LockIcon from "@mui/icons-material/Lock";
// // @icons
// import { CpuChipIcon } from "@heroicons/react/24/solid";
// import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
// import logo from "../assets/Zaco_LOGO.png";
// import TwitterIcon from "@mui/icons-material/Twitter";
// import GoogleIcon from "@mui/icons-material/Google";
// import ReduxCard from "../Components/ReduxCard";
// import { Link } from "react-router-dom";
// import { IoMdPerson } from "react-icons/io";
// import { MdEmail } from "react-icons/md";
// import { HiLockClosed } from "react-icons/hi2";
// import { HiLockOpen } from "react-icons/hi2";
// import { useDispatch } from "react-redux";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
// import ClientDetails from "../Components/MainCards/Clients/ClientDetails";
// import { useNavigate } from 'react-router-dom';
// const API_URL = import.meta.env.VITE_API_BASE_URL;

// function Resetpassword() {

//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [errorMessage, setErrorMessage] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [formData, setFormData] = useState({
//         username: "",
//     })

//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     const toggleConfirmPasswordVisibility = () => {
//         setShowConfirmPassword(!showConfirmPassword);
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     // const handleSubmit = async (e) => {
//     //     e.preventDefault();

//     //     try {

//     //         const response = await axios.post(
//     //             `${API_URL}/api/forget-password`,
//     //             formData
//     //         );
//     //         console.log(response.data);

//     //         if (response.status === 200 || response.status === 201) {
//     //             toast.success(`${response.data.message}`, {
//     //                 position: "top-right",
//     //                 autoClose: 2000,
//     //             })

//     //             setFormData({
//     //                 username: "",
//     //             });

//     //             setTimeout(() => {
//     //                 navigate("/login");
//     //             }, 2500);
//     //         } else {
//     //             toast.error(`${response.data.error_message}`,
//     //                 {
//     //                     position: "top-right",
//     //                     autoClose: 2000,
//     //                 }
//     //             )
//     //         }

//     //     } catch (error) {
//     //         console.error("Error submitting data:", error);

//     //         if (error.response && error.response.status === 400) {
//     //             toast.error(`${error.response.data.error_message}`, {
//     //                 position: "top-right",
//     //                 autoClose: 2000,
//     //             });
//     //         } else {
//     //             toast.error("Something went wrong. Please try again.", {
//     //                 position: "top-right",
//     //                 autoClose: 2000,
//     //             });
//     //         }
//     //         setErrorMessage("Error submitting data. Please try again.");

//     //     }
//     // }


//     return (
//         <>
//             <ToastContainer />
//             <div className="bg-image min-h-[calc(100vh-100px)] flex items-center justify-center px-4">
//                 <div className="max-w-xl w-full">
//                     <Card
//                         shadow={false}
//                         className="md:px-6 md:py-2 py-8 border border-gray-300 shadow-2xl"
//                     >
//                         <CardHeader shadow={false} floated={false} className="text-center">
//                             <div>
//                                 <img src={logo} alt="Logo" className="w-36 mx-auto cursor-pointer py-0.5" />
//                                 <Typography variant="h6" className="font-bold">
//                                     Zaco Computers Pvt. Ltd
//                                 </Typography>
//                             </div>
//                             <div className="text-center border-b-2 border-[#366FA1] pb-3" />
//                         </CardHeader>

//                         <CardBody>
//                             <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:mt-1">
//                                 <div className="col-span-2">
//                                     <label htmlFor="password">
//                                         <Typography
//                                             variant="small"
//                                             color="blue-gray"
//                                             className="block font-semibold mb-2"
//                                         >
//                                             New Password
//                                         </Typography>
//                                     </label>

//                                     <div className="relative">
//                                         <Input
//                                             type={showPassword ? "text" : "password"}
//                                             size="lg"
//                                             name="new_password"
//                                             placeholder="New Password"
//                                             // value={resetData.new_password}
//                                             // onChange={handleResetInputChange}
//                                             className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
//                                             labelProps={{
//                                                 className: "hidden",
//                                             }}
//                                             containerProps={{ className: "min-w-full" }}
//                                         />
//                                         {/* Toggle visibility button */}
//                                         <button
//                                             type="button"
//                                             onClick={togglePasswordVisibility}
//                                             className="absolute top-3 right-3"
//                                         >
//                                             {showPassword ? (
//                                                 <EyeIcon className="h-5 w-5 text-gray-500" />
//                                             ) : (
//                                                 <EyeSlashIcon className="h-5 w-5 text-gray-500" />
//                                             )}
//                                         </button>
//                                     </div>
//                                 </div>

//                                 <div className="col-span-2">
//                                     <label htmlFor="confirm_password">
//                                         <Typography
//                                             variant="small"
//                                             color="blue-gray"
//                                             className="block font-semibold mb-2"
//                                         >
//                                             Confirm Password
//                                         </Typography>
//                                     </label>

//                                     <div className="relative">
//                                         <Input
//                                             type={showConfirmPassword ? "text" : "password"}
//                                             size="lg"
//                                             name="confirm_password"
//                                             placeholder="Confirm Password"
//                                             // value={resetData.confirm_password}
//                                             // onChange={handleResetInputChange}
//                                             className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
//                                             labelProps={{
//                                                 className: "hidden",
//                                             }}
//                                             containerProps={{ className: "min-w-full" }}
//                                         />
//                                         {/* Toggle visibility button */}
//                                         <button
//                                             type="button"
//                                             onClick={toggleConfirmPasswordVisibility}
//                                             className="absolute top-3 right-3"
//                                         >
//                                             {showConfirmPassword ? (
//                                                 <EyeIcon className="h-5 w-5 text-gray-500" />
//                                             ) : (
//                                                 <EyeSlashIcon className="h-5 w-5 text-gray-500" />
//                                             )}
//                                         </button>
//                                     </div>
//                                     {/* <a href="https://google.com" class="text-blue-500 text-sm underline hover:text-blue-700">
//                                       Forgot Password?
//                                     </a> */}
//                                     {/* <div className="text-blue-500 text-sm underline hover:text-blue-700">
//                                         <Link to="/signup">Forgot Password?</Link>
//                                     </div> */}

//                                 </div>
//                                 <div className="flex justify-center mt-4">
//                                     <Button size="md" className="bg-[#366FA1] text-white" type="submit">
//                                         Submit
//                                     </Button>
//                                 </div>
//                             </form>
//                         </CardBody>
//                     </Card>
//                 </div>
//             </div>


//         </>
//     );
// }

// export default Resetpassword;

import React, { useState } from "react";
import {
    Card,
    Input,
    Button,
    CardBody,
    CardHeader,
    Typography,
} from "@material-tailwind/react";
import logo from "../assets/Zaco_LOGO.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function Resetpassword() {
    const navigate = useNavigate();
    const { uidb64, token } = useParams(); // ✅ Extract from URL

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        password: "",
        confirm_password: "",
    });

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () =>
        setShowConfirmPassword(!showConfirmPassword);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirm_password) {
            toast.error("Passwords do not match", {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }

        try {
            const response = await axios.post(
                `${API_URL}/api/reset-password/${uidb64}/${token}/`,
                {
                    password: formData.password,
                    confirm_password: formData.confirm_password,
                }
            );

            if (response.status === 200) {
                toast.success("Password reset successful!", {
                    position: "top-right",
                    autoClose: 2000,
                });
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.error_message || "Something went wrong!",
                {
                    position: "top-right",
                    autoClose: 2000,
                }
            );
        }
    };

    const handleCancel = () => {
        navigate("/login");
    };

    return (
        <>
            <ToastContainer />
            <div className="bg-image min-h-[calc(100vh-100px)] flex items-center justify-center px-4">
                <div className="max-w-xl w-full">
                    <Card
                        shadow={false}
                        className="md:px-6 md:py-2 py-8 border border-gray-300 shadow-2xl"
                    >
                        <CardHeader shadow={false} floated={false} className="text-center">
                            <div>
                                <img
                                    src={logo}
                                    alt="Logo"
                                    className="w-36 mx-auto cursor-pointer py-0.5"
                                />
                                <Typography variant="h6" className="font-bold">
                                    Zaco Computers Pvt. Ltd
                                </Typography>
                            </div>
                            <div className="text-center border-b-2 border-[#366FA1] pb-3" />
                        </CardHeader>

                        <CardBody>
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-4 md:mt-1"
                            >
                                {/* Password */}
                                <div className="col-span-2">
                                    <label htmlFor="password">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="block font-semibold mb-2"
                                        >
                                            New Password
                                        </Typography>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            size="lg"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="New Password"
                                            className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                                            labelProps={{ className: "hidden" }}
                                            containerProps={{ className: "min-w-full" }}
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute top-3 right-3"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="h-5 w-5 text-gray-500" />
                                            ) : (
                                                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="col-span-2">
                                    <label htmlFor="confirm_password">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="block font-semibold mb-2"
                                        >
                                            Confirm Password
                                        </Typography>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            size="lg"
                                            name="confirm_password"
                                            value={formData.confirm_password}
                                            onChange={handleInputChange}
                                            placeholder="Confirm Password"
                                            className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                                            labelProps={{ className: "hidden" }}
                                            containerProps={{ className: "min-w-full" }}
                                        />
                                        <button
                                            type="button"
                                            onClick={toggleConfirmPasswordVisibility}
                                            className="absolute top-3 right-3"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeIcon className="h-5 w-5 text-gray-500" />
                                            ) : (
                                                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit + Cancel Buttons */}
                                <div className="flex justify-between mt-4">
                                    <Button
                                        size="md"
                                        className="bg-gray-400 text-white"
                                        type="button"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="md"
                                        className="bg-[#366FA1] text-white"
                                        type="submit"
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default Resetpassword;

