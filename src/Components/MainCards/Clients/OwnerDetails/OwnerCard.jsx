import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import { Checkbox, Input, Typography } from "@material-tailwind/react";
// import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { DialogFooter, Button } from "@material-tailwind/react";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { fetchClientDetails } from "../../../Redux/clientSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
const options = ["None", "Atria", "Callisto"];
const API_URL = import.meta.env.VITE_API_BASE_URL;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 750,
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

export default function OwnerCard({ rowId, createOwnerShare, ownerShare }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const role = getUserRole();
  console.log("Role from token:", getUserRole());
  // console.log("rowIdowner", rowId);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  // const [ownerShare, setOwnerShare] = useState("")             
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    share: "",
    pan: "",
    aadhar: "",
    email: "",
    it_password: "",
    mobile: "",
    isadmin: false,
    username: "",
    is_active: true,
  });

  const [ownerErrors, setOwnerErrors] = useState({});


  const ownerRules = {
    first_name: [
      { test: v => v.length > 0, message: "First name is required" },
      { test: v => /^[A-Za-z\s]+$/.test(v), message: "First name can only contain alphabets and spaces" },
      { test: v => v.length >= 2, message: "First name must be at least 2 characters long" },
    ],
    last_name: [
      { test: v => v.length > 0, message: "Last name is required" },
      { test: v => /^[A-Za-z\s]+$/.test(v), message: "Last name can only contain alphabets and spaces" },
      { test: v => v.length >= 2, message: "Last name must be at least 2 characters long" },
    ],
    share: [
      // { test: v => v.length > 0, message: "Share is required" },
      { test: v => /^\d+(\.\d+)?$/.test(v), message: "Share must be a valid number" },
      { test: v => parseFloat(v) > 0 && parseFloat(v) <= 100, message: "Share must be between 0 and 100" },
    ],
    pan: [
      { test: v => v.length > 0, message: "PAN number is required" },
      { test: v => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v), message: "Invalid PAN format (e.g., ABCDE1234F)" },
    ],
    aadhar: [
      { test: v => v.length > 0, message: "Aadhar number is required" },
      { test: v => /^\d{12}$/.test(v), message: "Aadhar number must be 12 digits" },
    ],
    email: [
      { test: v => v.length > 0, message: "Email is required" },
      { test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: "Invalid email format" },
    ],
    username: [
      { test: v => v.length > 0, message: "Username is required" },
      { test: v => /^[a-zA-Z0-9_]+$/.test(v), message: "Username can only contain letters, numbers, and underscores" },
    ],
    it_password: [
      { test: v => v.length > 0, message: "IT password is required" },
      { test: v => v.length >= 6, message: "IT password must be at least 6 characters long" },
    ],
    mobile_number: [
      { test: v => v.length > 0, message: "Mobile number is required" },
      { test: v => /^\d{10}$/.test(v), message: "Mobile number must be exactly 10 digits" },
    ],
    user_password: [
      { test: v => v.length > 0, message: "User password is required" },
      { test: v => v.length >= 6, message: "User password must be at least 6 characters long" },
    ],
    is_admin: [
      { test: v => typeof v === "boolean", message: "Is Admin must be true or false" },
    ],
    is_active: [
      { test: v => typeof v === "boolean", message: "Is Active must be true or false" },
    ],
  };

  const validateOwnerField = (name, value) => {
    const fieldRules = ownerRules[name];
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

    const errorMsg = validateOwnerField(name, value);
    setOwnerErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      isadmin: e.target.checked,  // Update isadmin based on checkbox state
      // is_active: e.target.checked, // Update is_active based on checkbox state
    }));
  };

  // const handleActiveCheckboxChange = (e) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     // isadmin: e.target.checked,  // Update isadmin based on checkbox state
  //     is_active: e.target.checked, // Update is_active based on checkbox state
  //   }));
  // };


  // console.log("formmmowner", formData);
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    let hasError = false;
    for (let [field, value] of Object.entries(formData)) {
      const errorMsg = validateOwnerField(field, value);
      if (errorMsg) {
        toast.error(errorMsg);
        hasError = true;
        break; // stop at first error
      }
    }

    if (hasError) return; // ❌ Stop submit if validation failed
    try {
      const response = await axiosInstance.post(
        `${API_URL}/api/edit-owner/${id}/${rowId}`,
        formData
      );
      // console.log("111",response.data)
      // Check if response is successful (you can adjust this depending on the response structure)
      if (response.status === 200 || response.status === 201) {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
        createOwnerShare()
        // Dispatch fetchClientDetails to update the client data in Redux
        dispatch(fetchClientDetails(id));

        // Close the form (e.g., modal) after a successful update
        handleCreateClose();

        // Reset the form data
        setFormData({
          first_name: "",
          last_name: "",
          share: "",
          pan: "",
          aadhar: "",
          email: "",
          it_password: "",
          mobile: "",
          // isadmin: "",
          username: "",
        });
      }
      else {
        toast.error(`Failed to delete owner. Please try again.${response.data.messgae}`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(`${error.response.data.error_message || error.response.data.message}`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // console.log("row123", deleteId);
  const handleDeleteOpen = () => {
    setDeleteId(rowId);
    setOpenDeleteModal(true);
    setAnchorEl(null);
  };

  const handleDeleteID = async () => {
    try {
      const response = await axiosInstance.delete(
        `${API_URL}/api/delete-owner/${id}/${deleteId}`
      );
      // console.log("res-----owner---->", response);
      // setOwnerShare(response.remaining_shares)
      createOwnerShare()
      dispatch(fetchClientDetails(id));
      setOpenDeleteModal(false)
      if (response.status === 200) {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.error(`Failed to delete owner. Please try again.`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting owner data:", error);
      toast.error(`Failed to delete owner. ${error.response.data.error_message}`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleViewOpen = () => {
    setOpenViewModal(true);
    setAnchorEl(null);
    const fetchClientDetails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/single-owner/${id}/${rowId}`
        );
        // console.log("ss", response.data);
        setOwnerData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchClientDetails();

  };

  const handleDeleteClose = () => setOpenDeleteModal(false);
  const handleViewClose = () => setOpenViewModal(false);
  const handleCreateOpen = async () => {
    setOpenCreateModal(true);
    setAnchorEl(null);

    try {
      const response = await axiosInstance.get(
        `${API_URL}/api/edit-owner/${id}/${rowId}`
      );
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching owner data:", error);
      toast.error("Failed to load owner data. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleCreateClose = () => setOpenCreateModal(false);
  const [ownertData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [isActive, setIsActive] = useState(formData.is_active);

  useEffect(() => {
    setFormData(formData);
    setIsActive(formData.is_active);
  }, [formData]);

  const handleActiveCheckboxChange = (e) => {
    const checked = e.target.checked;
    setFormData({ ...formData, is_active: checked });
  };

  return (
    <>
      {/* <ToastContainer /> */}
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

            {ownertData && (
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
                            {ownertData.first_name} {ownertData.last_name}
                          </div>
                        </div>
                        <div className="w-full flex gap-3">
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            className=""
                          >
                            Share :
                          </Typography>
                          <div className="text-gray-700 text-[15px] my-auto">
                            {ownertData.share}%
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-6   p-2">
                        <div className="w-full flex gap-3">
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            className=""
                            size="sm"
                          >
                            Pan Number :
                          </Typography>
                          <div className="text-gray-700 text-[15px] my-auto">
                            {ownertData.pan}
                          </div>
                        </div>
                        <div className="w-full flex gap-3">
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            className=""
                            size="sm"
                          >
                            Aadhar Number :
                          </Typography>
                          <div className="text-gray-700 text-[15px] my-auto">
                            {ownertData.aadhar}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-6  p-2">
                        <div className="w-full flex gap-3">
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            className="mb-1"
                            size="sm"
                          >
                            Number :
                          </Typography>
                          <div className="text-gray-700 text-[15px] my-auto">
                            {ownertData.mobile}
                          </div>
                        </div>
                        <div className="w-full flex gap-3 align-middle items-center">
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            className="mb-1"
                            size="sm"
                          >
                            Email Id :
                          </Typography>
                          <div className="text-gray-700 text-[15px] my-auto">
                            {ownertData.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-6  p-2">
                        <div className="w-full flex gap-3 align-middle items-center">
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            className="mb-1"
                            size="sm"
                          >
                            Username:
                          </Typography>
                          <div className="text-gray-700 text-[15px] my-auto">
                            {ownertData.username}
                          </div>
                        </div>
                        {/* <div className="w-full flex gap-3">
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            className="mb-1"
                            size="sm"
                          >
                            Is Admin :
                          </Typography>
                          <div className="text-gray-700 text-[15px] my-auto">
                            {ownertData.is_active}
                          </div>
                        </div> */}
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
              Update Owner Details
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
                        disabled={!formData.is_active}
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
                        disabled={!formData.is_active}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="share">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold mb-2 flex gap-2 "
                      >
                        Share    <div className="text-green-400 text-sm">{ownerShare}% left</div>
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="number"
                        size="lg"
                        name="share"
                        placeholder="Share"
                        value={formData.share}
                        onChange={handleInputChange}
                        required
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                        disabled={!formData.is_active}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="pan">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Pan Number
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="pan"
                        placeholder="Pan Number"
                        value={formData.pan}
                        onChange={handleInputChange}
                        required
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                        disabled={!formData.is_active}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="aadhar">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Aadhar Number
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="number"
                        size="lg"
                        name="aadhar"
                        placeholder="Aadhar Number"
                        value={formData.aadhar}
                        onChange={handleInputChange}
                        required
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                        disabled={!formData.is_active}
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
                        Email Id
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="email"
                        size="lg"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        // required
                        disabled
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
                        UserName
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="username"
                        placeholder="UserName"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                        disabled={!formData.is_active}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="it_password">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        IT Password
                      </Typography>
                    </label>


                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        size="lg"
                        name="it_password"
                        placeholder="Password"
                        value={formData.it_password}
                        onChange={handleInputChange}
                        required
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                        disabled={!formData.is_active}
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
                    <label htmlFor="aadhar">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Mobile Number
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="number"
                        size="lg"
                        name="mobile"
                        placeholder="Mobile Number"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        required
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                        disabled={!formData.is_active}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="aadhar">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Is Admin
                      </Typography>
                    </label>

                    <div className="">
                      <Checkbox
                        color="blue"
                        name="isadmin"
                        checked={formData.isadmin}
                        onChange={handleCheckboxChange}
                        label="Is Admin"
                        disabled={!formData.is_active}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="aadhar">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Is Active
                      </Typography>
                    </label>

                    <div className="">
                      <Checkbox
                        color="blue"
                        name="is_active"
                        checked={formData.is_active}
                        // onChange={handleActiveCheckboxChange}
                        onChange={handleActiveCheckboxChange}
                        label="Is Active"
                      />
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
                >
                  <span>Cancel</span>
                </Button>
                <Button
                  conained="filled"
                  type="submit"
                  //   color="green"
                  // onClick={handleCreateClose}
                  disabled={!formData.is_active}
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
                  <div className="text-sm text-gray-600 mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    auctor auctor arcu, at fermentum dui. Maecenas
                  </div>
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
          {((role === "superuser" || role === "clientuser")) && (
            <MenuItem onClick={handleCreateOpen}>Update</MenuItem>
          )}
          {/* <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem> */}
          {role === "superuser" && (
            <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
          )}
        </Menu>
      </div>
    </>
  );
}
