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

function Forgetpassword() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
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
        `${API_URL}/api/forget-password`,
        formData
      );
      console.log(response.data);

      if (response.status === 200 || response.status === 201) {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        })

        setFormData({
          username: "",
        });

        setTimeout(() => {
          navigate("/client-details");
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
      {/* <ToastContainer /> */}

      {/* <div className="bg-image">

        <div className="container mx-auto h-screen mt-[100px] ">
          <div className="max-w-xl  mx-auto pt-20 justify-center  pt-24 bg-gray-100">
            <Card
              shadow={false}
              className="md:px-6 md:py-2 py-8  border border-gray-300 shadow-2xl"
            >
              <CardHeader shadow={false} floated={false} className="text-center">
                <div>

                  <img
                    src={logo}
                    alt="Logo"
                    className=" w-36 mx-auto cursor-pointer py-0.5"
                  />
                  <Typography variant="h6" className="font-bold">
                    Zaco Computers Pvt. Ltd
                  </Typography>
                </div>
                <div className="text-center border-b-2 border-[#366FA1] pb-3">

                </div>
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
                          Username or Email
                        </span>
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        placeholder="Enter your Username or Email"
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
                  <div className="flex justify-center mt-4">
                  <Button size="md" className="bg-[#366FA1] text-white" type="submit">
                    Submit
                  </Button>
                  </div>
                </form>

              </CardBody>
            </Card>
          </div>
        </div>
      </div> */}
      <div className="bg-image min-h-[calc(100vh-100px)] flex items-center justify-center px-4">
        <div className="max-w-xl w-full">
          <Card
            shadow={false}
            className="md:px-6 md:py-2 py-8 border border-gray-300 shadow-2xl"
          >
            <CardHeader shadow={false} floated={false} className="text-center">
              <div>
                <img src={logo} alt="Logo" className="w-36 mx-auto cursor-pointer py-0.5" />
                <Typography variant="h6" className="font-bold">
                  Zaco Computers Pvt. Ltd
                </Typography>
              </div>
              <div className="text-center border-b-2 border-[#366FA1] pb-3" />
            </CardHeader>

            <CardBody>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:mt-1">
                <div>
                  <label htmlFor="first-name">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      <span className="flex items-center gap-2">
                        Username or Email
                      </span>
                    </Typography>
                  </label>

                  <Input
                    type="email"
                    placeholder="Enter your Username or Email"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="!border !border-[#366FA1] bg-white text-gray-900 shadow-lg ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    labelProps={{ className: "hidden" }}
                    required
                    containerProps={{ className: "min-w-[100px]" }}
                  />
                </div>

                <div className="flex justify-center mt-4">
                  <Button size="md" className="bg-[#366FA1] text-white" type="submit">
                    Submit
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* <div className="flex items-center justify-center min-h-screen bg-[#f5f5f5]">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md px-8 py-10">
          <div className="text-center mb-8">
            <img
              src={logo}
              alt="Zaco Logo"
              className="w-24 mx-auto mb-2"
            />
            <h1 className="text-lg font-semibold text-gray-800">Zaco Computers Pvt. Ltd</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Username or Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your username or email"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-md transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div> */}



      {/* <ReduxCard /> */}
    </>
  );
}

export default Forgetpassword;
