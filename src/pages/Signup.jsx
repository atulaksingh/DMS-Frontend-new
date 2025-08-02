import React, { useState } from "react";

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
import { IoMdPerson } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { HiLockClosed } from "react-icons/hi2";
import { HiLockOpen } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import ClientDetails from "../Components/MainCards/Clients/ClientDetails";
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_BASE_URL;

function Signup() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  })

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

      const response = await axios.post(
        `${API_URL}/api/create-superuser`,
        formData
      );
      console.log(response.data);

      if (response.status === 200 || response.status === 201) {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        })

        setFormData({
          name: "",
          email: "",
          password: "",
          confirm_password: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 2500);
      } else {
        toast.error(`${response.data.error_message}`,
          {
            position: "top-right",
            autoClose: 2000,
          }
        )
      }

    } catch (error) {
      console.error("Error submitting data:", error);

      if (error.response && error.response.status === 400) {
        toast.error(`${error.response.data.error_message}`, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.error("Something went wrong. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
      setErrorMessage("Error submitting data. Please try again.");

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
                  Sign Up
                </Typography>
                <Typography className="!text-gray-800 text-[14px] font-normal md:max-w-sm">
                  Enter your following details to sign up
                </Typography>
              </CardHeader>
              <CardBody>
                <form action="#" className="flex flex-col gap-4 md:mt-1" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="first-name">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        <span className="flex items-center gap-2 ">
                          <IoMdPerson />
                          Name
                        </span>
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="!border !border-[#366FA1] bg-white text-gray-900 shadow-lg  ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        required
                        containerProps={{ className: "min-w-[100px]" }}
                      />
                    </div>
                  </div>
                  {/* <div>
                    <label htmlFor="last-name">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        <span className="flex items-center gap-2 ">
                          <IoMdPerson />
                          Last Name
                        </span>
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        placeholder="Last Name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="!border !border-[#366FA1] bg-white text-gray-900 shadow-lg  ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        required
                        containerProps={{ className: "min-w-[100px]" }}
                      />
                    </div>
                  </div> */}
                  <div>
                    <label htmlFor="email">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        <span className="flex items-center gap-2 ">
                          <MdEmail />
                          Email
                        </span>
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="!border !border-[#366FA1] bg-white text-gray-900 shadow-lg  ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        required
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
                          <HiLockOpen />
                          Password
                        </span>
                      </Typography>
                    </label>

                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="!border !border-[#366FA1] bg-white text-gray-900 shadow-lg  ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        required
                        containerProps={{ className: "min-w-[100px]" }}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute top-3 right-3"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirm-password">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        <span className="flex items-center gap-2 ">
                          <HiLockClosed />
                          Confirm Password
                        </span>
                      </Typography>
                    </label>

                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        className="!border !border-[#366FA1] bg-white text-gray-900 shadow-lg  ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        required
                        containerProps={{ className: "min-w-[100px]" }}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute top-3 right-3"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  {/* <Checkbox
                    className="h-4 w-4 py-0"
                    label={
                      <div>
                        <Typography
                          color="blue-gray"
                          className="font-medium text-sm "
                        >
                          Remember Me
                        </Typography>
                      </div>
                    }
                  /> */}
                  <Button size="md" className="bg-[#366FA1] text-white" fullWidth type="submit">
                    Signup
                  </Button>
                </form>
                <div className="text-[15px] font-semibold my-2.5 text-center">
                  <Link to="/login">Already have an Account?</Link>
                </div>

                <div className="flex justify-center align-middle items-center gap-3">
                  <div className="bg-[#366FA1] w-fit  rounded-full p-1.5 cursor-pointer">
                    <FacebookOutlinedIcon className="text-white " />
                  </div>
                  <div className="bg-[#50A5F1] w-fit  rounded-full p-1.5 cursor-pointer">
                    <TwitterIcon className="text-white " />
                  </div>
                  <div className="bg-[#F46A6A] w-fit  rounded-full p-1.5 cursor-pointer">
                    <GoogleIcon className="text-white h-4 w-4" />
                  </div>
                </div>

                <div className="flex justify-center align-middle items-center gap-1 my-1">
                  <div>
                    <LockIcon fontSize="" className="text-[13px] mb-1" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>


      <ReduxCard />
    </>
  );
}

export default Signup;
