import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import { Input, Typography } from "@material-tailwind/react";
// import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { DialogFooter, Button } from "@material-tailwind/react";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { fetchClientDetails } from "../../../Redux/clientSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { Autocomplete, TextField } from "@mui/material";
import { is } from "date-fns/locale/is";
import Signup from "../../../../pages/ForgetPassword";
import { use } from "react";
const API_URL = import.meta.env.VITE_API_BASE_URL;
const options = ["None", "Atria", "Callisto"];
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  //   border: "1px solid #000",
  boxShadow: 24,
  paddingTop: "17px", // For vertical (top and bottom) padding
  paddingInline: "40px",
  borderRadius: "10px",
};
const styleCreateMOdal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  //   border: "1px solid #000",
  boxShadow: 24,
  // p: 4,
  paddingTop: "17px", // For vertical (top and bottom) padding
  paddingInline: "40px",
  borderRadius: "10px",
};
const ITEM_HEIGHT = 48;

export default function ClientUserCard({ rowId }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const role = getUserRole();
  console.log("Role from token:", getUserRole());
  // console.log("rowIdClientUser", rowId);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [openResetModal, setOpenResetModal] = React.useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    // customer: "",
    email: "",
    password: "",
    is_active: " ",
  });
  const [attachment, setAttachment] = useState(null); // State for file input

  const [clientuserErrors, setClientUserErrors] = useState({});

  const clientuserRules = {
    first_name: [
      {
        test: (v) => v && v.trim().length > 0,
        message: "First name is required",
      },
      {
        test: (v) => /^[A-Za-z\s]+$/.test(v),
        message: "First name can only contain alphabets and spaces",
      },
      {
        test: (v) => v.trim().length >= 2,
        message: "First name must be at least 2 characters long",
      },
    ],
    last_name: [
      {
        test: (v) => v && v.trim().length > 0,
        message: "Last name is required",
      },
      {
        test: (v) => /^[A-Za-z\s]+$/.test(v),
        message: "Last name can only contain alphabets and spaces",
      },
      {
        test: (v) => v.trim().length >= 2,
        message: "Last name must be at least 2 characters long",
      },
    ],
    email: [
      { test: (v) => v && v.trim().length > 0, message: "Email is required" },
      {
        test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Invalid email format",
      },
    ],
    password: [
      {
        test: (v) => v && v.trim().length > 0,
        message: "Password is required",
      },
      {
        test: (v) => v.length >= 6,
        message: "Password must be at least 6 characters long",
      },
      {
        test: (v) => /[A-Za-z]/.test(v) && /\d/.test(v),
        message: "Password must contain at least one letter and one number",
      },
    ],
  };

  const validateClientUserField = (name, value) => {
    const fieldRules = clientuserRules[name];
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
    const errorMsg = validateClientUserField(name, value);
    setClientUserErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    let hasError = false;
    for (let [field, value] of Object.entries(formData)) {
      const errorMsg = validateClientUserField(field, value);
      if (errorMsg) {
        toast.error(errorMsg);
        hasError = true;
        break; // stop at first error
      }
    }

    if (hasError) return; // ❌ Stop submit if validation failed

    try {
      const dataToSubmit = new FormData();
      dataToSubmit.append("email", formData.email);
      dataToSubmit.append("first_name", formData.first_name);
      dataToSubmit.append("last_name", formData.last_name);
      dataToSubmit.append("password", formData.password);
      dataToSubmit.append("is_active", formData.is_active);

      console.log("Data to submit:", dataToSubmit); // Check the final data being sent

      // const response = await axiosInstance.post(
      //   `${API_URL}/api/edit-clientuser/${id}/${rowId}`,
      //   dataToSubmit
      // );
      console.log("ss", response);
      // Check if the response is successful
      if (response.status === 200) {
        // console.log("ss",response.data)
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
        console.log("new", formData.password);

        // Dispatch fetchClientDetails action
        // dispatch(fetchClientDetails(id));
        dispatch(fetchClientDetails({ id, tabName: "ClientUser" }));
        // Optionally close the modal and reset form
        handleCreateClose();
        setFormData({
          first_name: "",
          last_name: "",
          // name: "",
          email: "",
          password: "",
          is_active: " ",
          // username: "",
        });
        setAttachment(null); // Clear the file input
      } else {
        throw new Error("Failed to update ClientUser details.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to update ClientUser details. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };
  const [resetData, setResetData] = useState({
    previous_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  const passwordRules = {
    previous_password: [
      {
        test: (v) => v && v.trim().length > 0,
        message: "Previous password is required",
      },
    ],
    new_password: [
      {
        test: (v) => v && v.trim().length > 0,
        message: "New password is required",
      },
      {
        test: (v) => v.length >= 6,
        message: "New password must be at least 6 characters long",
      },
      {
        test: (v) => /[A-Za-z]/.test(v) && /\d/.test(v),
        message: "New password must contain at least one letter and one number",
      },
    ],
    confirm_password: [
      {
        test: (v) => v && v.trim().length > 0,
        message: "Confirm password is required",
      },
      // ✅ cross-field check should be handled separately in handleSubmit
    ],
  };
  const validatePasswordField = (name, value, formData) => {
    const fieldRules = passwordRules[name];
    if (!fieldRules) return "";
    for (let rule of fieldRules) {
      if (!rule.test(value)) return rule.message;
    }
    return "";
  };

  const handleResetInputChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const errorMsg = validatePasswordField(name, value);
    setPasswordErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };
  const handleReset = async (e) => {
    e.preventDefault(); // Prevent default form submission

    let hasError = false;
    for (let [field, value] of Object.entries(formData)) {
      const errorMsg = validatePasswordField(field, value);
      if (errorMsg) {
        toast.error(errorMsg);
        hasError = true;
        break; // stop at first error
      }
    }

    if (hasError) return; // ❌ Stop submit if validation failed

    try {
      const dataToSubmit = new FormData();
      dataToSubmit.append("previous_password", resetData.previous_password);
      dataToSubmit.append("new_password", resetData.new_password);
      dataToSubmit.append("confirm_password", resetData.confirm_password);

      console.log("Data to submit:", dataToSubmit); // Check the final data being sent

      const response = await axiosInstance.post(
        `${API_URL}/api/reset-password/${id}/${rowId}`,
        dataToSubmit
      );
      console.log("ss", response);
      // Check if the response is successful
      if (response.status === 200) {
        // console.log("ss",response.data)
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
        console.log("new", resetData.password);

        // Dispatch fetchClientDetails action
        // dispatch(fetchClientDetails(id));
        dispatch(fetchClientDetails({ id, tabName: "ClientUser" }));
        // Optionally close the modal and reset form
        handleResetClose();
        setResetData({
          previous_password: "",
          new_password: "",
          confirm_password: "",
        });
        setAttachment(null); // Clear the file input
      } else {
        throw new Error("Failed to update ClientUser details.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(
        error.response?.data?.error_message ||
          "Failed to update ClientUser details. Please try again.",
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    }
  };
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDeleteOpen = () => {
    setDeleteId(rowId);
    setOpenDeleteModal(true);
    setAnchorEl(null);
  };
  const handleDeleteID = async () => {
    try {
      const response = await axiosInstance.delete(
        `${API_URL}/api/delete-clientuser/${id}/${deleteId}`
      );
      // console.log("res-----ClientUser---->123", response);
      setOpenDeleteModal(false);
      if (response.status === 200) {
        // Success notification
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
        // Refresh client details
        // dispatch(fetchClientDetails(id));
        dispatch(fetchClientDetails({ id, tabName: "ClientUser" }));
      } else {
        // Failure notification
        toast.error("Failed to delete ClientUser. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting ClientUser data:", error);
      // Error notification
      toast.error("Failed to delete ClientUser. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };
  const handleViewOpen = () => {
    setOpenViewModal(true);
    setAnchorEl(null);
    const fetchBankDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_URL}/api/single-clientuser/${id}/${rowId}`
        );
        setClientUser(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchBankDetails();
  };
  const handleDeleteClose = () => setOpenDeleteModal(false);
  const handleViewClose = () => setOpenViewModal(false);
  //   setOpenCreateModal(true);
  //   setAnchorEl(null);

  //   try {
  //     const response = await axiosInstance.get(
  //       `${API_URL}/api/edit-clientuser/${id}/${rowId}`
  //     );
  //     console.log("previous", formData.password);

  //     const { data } = response;
  //     //   console.log("dd", response.data);
  //     setFormData({
  //       ...data,
  //       // customer: data.customer.name, // Ensure the customer object is set properly here
  //     });
  //   } catch (error) {
  //     console.error("Error fetching ClientUser data:", error);
  //     toast.error("Failed to load ClientUser data. Please try again.", {
  //       position: "top-right",
  //       autoClose: 2000,
  //     });
  //   }
  // };
  const handleResetOpen = async () => {
    setOpenResetModal(true);
    setAnchorEl(null);
  };
  const handleCreateClose = () => setOpenCreateModal(false);
  const handleResetClose = () => setOpenResetModal(false);
  const [clientUser, setClientUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordsVisibility = () => {
    setShowPasswords(!showPasswords);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleCustomerChange = (event, newValue) => {
    // When a user selects a customer, update the formData with the selected customer object
    setFormData((prev) => ({
      ...prev,
      // customer: newValue || "", // Store the full customer object
    }));
  };
  return (
    <>
      {/* <ToastContainer /> */}
      <div>
        <div>
          <Modal
            open={openViewModal}
            onClose={handleViewClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0.9, y: -100 },
            }}
          >
            <Box sx={style}>
              <Typography
                id="modal-modal-title"
                variant="h5"
                component="h2"
                className="text-center border-b-2 border-[#366FA1] pb-3"
              >
                Details View
              </Typography>

              {clientUser && (
                <>
                  <div>
                    <form className=" my-5 w-full ">
                      <div className="block px-4">
                        <div className="flex gap-6  p-2">
                          <div className="w-full flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className=" "
                              size="sm"
                            >
                              Name :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {clientUser.first_name} {clientUser.last_name}
                            </div>
                          </div>
                          <div className="w-full flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className=""
                            >
                              Status:
                            </Typography>
                            {/* <div className="text-gray-700 text-[15px] my-auto">
                              {clientUser.is_active}
                            </div> */}
                            <div
                              className={`text-[15px] my-auto font-semibold ${
                                clientUser.is_active
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {clientUser.is_active ? "Active" : "Inactive"}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-10 p-2">
                          <div className="flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              size="sm"
                            >
                              Username :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {clientUser.username}
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              size="sm"
                            >
                              Email :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {clientUser.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <DialogFooter>
                    <Button
                      conained="gradient"
                      color="red"
                      onClick={handleViewClose}
                      className="mr-1 "
                    >
                      <span>Cancel</span>
                    </Button>
                    <Button
                      conained="gradient"
                      color="green"
                      className="bg-primary"
                      onClick={handleViewClose}
                    >
                      <span>Confirm</span>
                    </Button>
                  </DialogFooter>
                </>
              )}
            </Box>
          </Modal>
        </div>
      </div>

      {/* //////////////////////////Update Data Modal open//////// */}

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
              Update ClientUser Details
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
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                  {/* <div className="col-span-2">
                    <label htmlFor="email">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Active
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="is_active"
                        placeholder="Email"
                        value={formData.is}
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div> */}

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

                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        size="lg"
                        name="password"
                        placeholder="Password"
                        // value={formData.password}
                        // onChange={handleInputChange}
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
                  {/* <div className="col-span-2">
                    <label htmlFor="password">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Select Customer or Vendor
                      </Typography>
                    </label>

                    <Autocomplete
                      sx={{ width: 300 }}
                      freeSolo
                      id="gst-no-autocomplete"
                      disableClearable
                      options={customers}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.name || ""
                      }
                      onChange={handleCustomerChange} // Use the custom handler
                      value={formData.customer || null} // Bind value to formData.customer (the whole object)
                      renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                          {option.gst_no} ({option.name})
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          name="customer"
                          value={
                            formData.customer ? formData.customer.name : ""
                          } // Display the name of the selected customer
                          onChange={handleInputChange} // Update input value on type
                          placeholder="Enter or select GST No."
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 34,
                              padding: "4px 6px",
                            },
                            "& .MuiOutlinedInput-input": {
                              padding: "14px 16px",
                            },
                          }}
                          slotProps={{
                            input: {
                              ...params.InputProps,
                              type: "search",
                            },
                          }}
                        />
                      )}
                    />
                  </div> */}
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreateClose}
                  conained="text"
                  color="red"
                  className="mr-1 "
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

      {/* //////////////////////////////Reset /modal/////////////// */}

      <div>
        <Modal
          open={openResetModal}
          onClose={handleResetClose}
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
              Reset ClientUser Password
            </Typography>
            <form className=" my-5 w-full " onSubmit={handleReset}>
              <div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="first_name">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Previous Password
                      </Typography>
                    </label>

                    <div className="relative">
                      <Input
                        type={showPasswords ? "text" : "password"}
                        size="lg"
                        name="previous_password"
                        placeholder="Previous Password"
                        value={resetData.previous_password}
                        onChange={handleResetInputChange}
                        required
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                      {/* Toggle visibility button */}
                      <button
                        type="button"
                        onClick={togglePasswordsVisibility}
                        className="absolute top-3 right-3"
                      >
                        {showPasswords ? (
                          <EyeIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

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
                        name="new_password"
                        placeholder="New Password"
                        value={resetData.new_password}
                        onChange={handleResetInputChange}
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
                        placeholder="Confirm Password"
                        value={resetData.confirm_password}
                        onChange={handleResetInputChange}
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
                    {/* <a href="https://google.com" class="text-blue-500 text-sm underline hover:text-blue-700">
                      Forgot Password?
                    </a> */}
                    <div className="text-blue-500 text-sm underline hover:text-blue-700">
                      <Link to="/forgetpassword">Forgot Password?</Link>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleResetClose}
                  conained="text"
                  color="red"
                  className="mr-1 "
                >
                  <span>Cancel</span>
                </Button>
                <Button
                  conained="contained"
                  type="submit"
                  //   color="green"
                  // onClick={handleResetClose}
                  className="bg-primary"
                >
                  <span>Confirm</span>
                </Button>
              </DialogFooter>
            </form>
          </Box>
        </Modal>
      </div>

      {/* /////////////////////////////delete modal//////////////////// */}

      <div>
        <Modal
          open={openDeleteModal}
          onClose={handleDeleteClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              className="text-center border-b-2 border-[#366FA1] pb-3"
            >
              Delete
            </Typography>

            <div>
              <div className="w-full max-w-md mx-auto pb-7">
                <div className="my-8 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-14 fill-red-500 inline"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                      data-original="#000000"
                    />
                    <path
                      d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                      data-original="#000000"
                    />
                  </svg>
                  <h4 className="text-gray-800 text-lg font-semibold mt-4">
                    Are you sure you want to delete it?
                  </h4>
                  <p className="text-sm text-gray-600 mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    auctor auctor arcu, at fermentum dui. Maecenas
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <button
                    type="button"
                    onClick={handleDeleteID}
                    className="px-4 py-2 rounded-lg text-white text-sm tracking-wide bg-red-500 hover:bg-red-600 active:bg-red-500"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteClose}
                    className="px-4 py-2 rounded-lg text-gray-800 text-sm tracking-wide bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      </div>

      <div>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: "20ch",
              },
            },
          }}
        >
          <MenuItem onClick={handleViewOpen}>View</MenuItem>
          {/* <MenuItem onClick={handleCreateOpen}>Update</MenuItem> */}
          {(role === "superuser" || role === "clientuser") && (
            <MenuItem onClick={handleResetOpen}>Reset Password</MenuItem>
          )}
          {role === "superuser" && (
            <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
          )}
        </Menu>
      </div>
    </>
  );
}
