import React, { useState } from "react";
import { setUser } from "../Components/Redux/authSlice";

// @components
import {
  Card,
  Input,
  Button,
  CardBody,
  CardHeader,
  Typography,
  Checkbox,
} from "@material-tailwind/react";
import LockIcon from "@mui/icons-material/Lock";
// @icons
import { CpuChipIcon } from "@heroicons/react/24/solid";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import logo from "../assets/Zaco_LOGO.png";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleIcon from "@mui/icons-material/Google";
import ReduxCard from "../Components/ReduxCard";
import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { HiLockClosed } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import ClientDetails from "../Components/MainCards/Clients/ClientDetails";
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_BASE_URL;


function Login() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending login data:", formData);  // ✅ Add this

      const response = await axios.post(
        `${API_URL}/api/superadmin-login`,
        formData
      );
      console.log(response.data);

      if (response.status === 200 || response.status === 201) {
        dispatch(setUser(response.data));

        // localStorage.setItem("user", JSON.stringify(response.data));
        sessionStorage.setItem("user", JSON.stringify(response.data));
        window.dispatchEvent(new Event("storage"));

        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        })

        setFormData({
          username: "",
          password: "",
        });

        // setTimeout(() => {
        //   navigate("/client-details");
        //   // window.location.reload();
        // }, 2500);
        navigate("/client-details", { replace: true }); // ✅ navigate instantly
      } else {
        toast.error(`${response.data.error_message}`,
          {
            position: "top-right",
            autoClose: 2000,
          }
        )
      }

    } catch (error) {
      console.error("Full error:", error);

      let errorMsg = "Something went wrong. Please try again.";

      if (error.response?.data?.error_message) {
        const message = error.response.data.error_message;

        // If it's an array (like yours), take the first item
        if (Array.isArray(message)) {
          errorMsg = message[0];
        } else if (typeof message === "string") {
          errorMsg = message;
        }
      }

      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 2000,
      });

      setErrorMessage(errorMsg);
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="bg-image">

        <div className="container mx-auto ">
          <div className="max-w-xl mx-auto pt-20">
            <Card
              shadow={false}
              className="md:px-12 md:py-2 py-8 border border-gray-300 shadow-2xl"
            >
              <CardHeader shadow={false} floated={false} className="text-start ">
                <div>

                  <img
                    src={logo}
                    alt="Logo"
                    className=" w-36 mx-auto cursor-pointer py-0.5"
                  />

                </div>

                <Typography
                  variant="h1"
                  color="blue-gray"
                  className="mb-1 mt-5 !text-3xl lg:text-lg text-[#366FA1]"
                >
                  Log in
                </Typography>
                <Typography className="!text-gray-800 text-[14px] font-normal md:max-w-sm">
                  Enter your email and password to login
                </Typography>
              </CardHeader>
              <CardBody>
                <form action="#" className="flex flex-col gap-4 md:mt-1" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="text">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        <span className="flex items-center gap-2 ">
                          <MdEmail />
                          Your Email
                        </span>
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        name="username"
                        placeholder="Email Address"
                        className="!border !border-[#366FA1] bg-white text-gray-900 shadow-lg  ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        value={formData.username}
                        onChange={handleInputChange}
                        containerProps={{ className: "min-w-[100px]" }}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="passowrd">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        <span className="flex items-center gap-2 ">
                          <HiLockClosed />
                          Your Password
                        </span>
                      </Typography>
                    </label>

                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        className="!border !border-[#366FA1] bg-white text-gray-900 shadow-lg  ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        value={formData.password}
                        onChange={handleInputChange}
                        containerProps={{ className: "min-w-[100px]" }}
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

                  <Button size="md" name="login" className="bg-[#366FA1] text-white" fullWidth type="submit">
                    Continue
                  </Button>
                </form>

                {/* <div className="flex justify-center align-middle items-center gap-3 mt-4">
                  <div className="bg-[#366FA1] w-fit  rounded-full p-1.5 cursor-pointer">
                    <FacebookOutlinedIcon className="text-white " />
                  </div>
                  <div className="bg-[#50A5F1] w-fit  rounded-full p-1.5 cursor-pointer">
                    <TwitterIcon className="text-white " />
                  </div>
                  <div className="bg-[#F46A6A] w-fit  rounded-full p-1.5 cursor-pointer">
                    <GoogleIcon className="text-white h-4 w-4" />
                  </div>
                </div> */}

                <div className="flex justify-center align-middle items-center mt-6 gap-1 my-1">
                  <div>
                    <LockIcon fontSize="" className="text-[13px] mb-1" />
                  </div>
                  <Link to="/forgetpassword"><div className="text-[14px] font-medium cursor-pointer">
                    Forgot your password?
                  </div></Link>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>


      {/* <ReduxCard /> */}
    </>
  );
}

export default Login;
