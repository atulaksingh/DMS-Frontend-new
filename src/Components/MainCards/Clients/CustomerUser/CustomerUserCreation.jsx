import {
  Button,
  DialogFooter,
  IconButton,
  Option,
  Select,
} from "@material-tailwind/react";
import React, { useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import { useState } from "react";
import { Input, Typography } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchClientDetails } from "../../../Redux/clientSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { Autocomplete, TextField } from "@mui/material";
const API_URL = import.meta.env.VITE_API_BASE_URL;
const styleCreateMOdal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 750,
  bgcolor: "background.paper",
  //   border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};
function CustomerUserCreation() {
  const { id } = useParams();
  const role = getUserRole();
  console.log("Role from token:", getUserRole());
  const dispatch = useDispatch();
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleCreateOpen = () => {
    setOpenCreateModal(true);
    setAnchorEl(null);
  };
  const handleCreateClose = () => setOpenCreateModal(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [customerUserErrors, setCustomerUserErrors] = useState({})

  const customerUserRules = {
    first_name: [
      { test: v => v && v.trim().length > 0, message: "First name is required" },
      { test: v => /^[A-Za-z\s]+$/.test(v), message: "First name can only contain alphabets and spaces" },
      { test: v => v.trim().length >= 2, message: "First name must be at least 2 characters long" },
    ],
    last_name: [
      { test: v => v && v.trim().length > 0, message: "Last name is required" },
      { test: v => /^[A-Za-z\s]+$/.test(v), message: "Last name can only contain alphabets and spaces" },
      { test: v => v.trim().length >= 2, message: "Last name must be at least 2 characters long" },
    ],
    email: [
      { test: v => v && v.trim().length > 0, message: "Email is required" },
      { test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: "Invalid email format" },
    ],
    password: [
      { test: v => v && v.trim().length > 0, message: "Password is required" },
      { test: v => v.length >= 6, message: "Password must be at least 6 characters long" },
      // { test: v => /[A-Za-z]/.test(v) && /\d/.test(v), message: "Password must contain at least one letter and one number" },
    ],
  };

  const validateCustomerUserField = (name, value) => {
    const fieldRules = customerUserRules[name];
    if (!fieldRules) return "";
    for (let rule of fieldRules) {
      if (!rule.test(value)) return rule.message;
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const errorMsg = validateCustomerUserField(name, value);
    setCustomerUserErrors(prev => ({ ...prev, [name]: errorMsg }));
  };
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");


  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const errorMsg = validateCustomerUserField(key, value);
      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

    setCustomerUserErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      toast.error(newErrors[firstErrorField], {
        position: "top-right",
        autoClose: 2000,
      });
      return; // ❌ Stop submit
    }
    if (submitting) return;

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("first_name", formData.first_name);
      formDataToSend.append("last_name", formData.last_name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);

      const response = await axiosInstance.post(
        `${API_URL}/api/create-customeruser/${id}`,
        formDataToSend
      );

      if (response.status === 200) {
        handleCreateClose();
        toast.success(response?.data?.message || "User-client form created successfully.");
        // dispatch(fetchClientDetails(id));
        dispatch(fetchClientDetails({ id, tabName: "CustomerUser" }));
        setFormData({ first_name: "", last_name: "", email: "", password: "" });
      } else {
        throw new Error("Failed to create user-client form.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(
        error.response?.data?.error_message || "Failed to create user-client details.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



  return (
    <>
      {/* <ToastContainer /> */}
      <div>
        <Modal
          open={openCreateModal}
          onClose={handleCreateClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleCreateMOdal}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              className="text-center border-b-2 border-[#366FA1] pb-3"
            >
              Create User Details
            </Typography>
            <form className=" my-5 w-full " onSubmit={handleSubmit}>
              <div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="first_name">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        First Name
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="last_name">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Last Name
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="last_name"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="email">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Email
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="email"
                        size="lg"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="password">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Password
                      </Typography>
                    </label>

                    {/* <div className="">
                      <Input
                        type="password"
                        size="lg"
                        name="password"
                        placeholder="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div> */}
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        size="lg"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                      {/* Toggle visibility button */}
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
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreateClose}
                  conained="text"
                  color="red"
                  className="mr-1 "
                  name="customeruser_cancel"
                >
                  <span>Cancel</span>
                </Button>
                <Button
                  conained="contained"
                  type="submit"
                  //   color="green"
                  // onClick={handleCreateClose}
                  className="bg-primary"
                >
                  <span>Confirm</span>
                </Button>
              </DialogFooter>
            </form>
          </Box>
        </Modal>
      </div>
      {(role === "superuser" || role === "clientuser") && (
        <Button
          conained="conained"
          size="md"
          className="bg-primary hover:bg-[#2d5e85]"
          onClick={handleCreateOpen}
        >
          Create
        </Button>
      )}
    </>
  );
}

export default CustomerUserCreation;
