import {
  Button,
  Checkbox,
  DialogFooter,
  Radio,
} from "@material-tailwind/react";
import React from "react";
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
function CVCreation() {
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
    name: "",
    gst_no: "",
    pan: "",
    address: "",
    email: "",
    contact: "",
    customer: false,
    vendor: false,
  });

  const [cvErrors, setCVErrors] = useState({});

  const customerVendorRules = {
    name: [
      { test: (v) => v.length > 0, message: "Name is required" },
      { test: (v) => /^[A-Za-z\s]+$/.test(v), message: "Name can only contain alphabets and spaces" },
      { test: (v) => v.length >= 2, message: "Name must be at least 2 characters long" },
    ],

    gst_no: [
      { test: (v) => v.length > 0, message: "GST number is required" },
      // { test: (v) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v), message: "GST number must be in valid format (e.g., 27ABCDE1234F1Z5)" },
    ],

    pan: [
      { test: (v) => v.length > 0, message: "PAN number is required" },
      { test: (v) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v), message: "PAN must be in format ABCDE1234F" },
    ],

    address: [
      { test: (v) => v.length > 0, message: "Address is required" },
      { test: (v) => v.length <= 250, message: "Address cannot exceed 250 characters" },
    ],
    email: [
      { test: (v) => v.length > 0, message: "Email is required" },
      { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: "Email format is invalid" },
    ],
    contact: [
      { test: (v) => v.length > 0, message: "Contact number is required" },
      { test: (v) => /^\d{10}$/.test(v), message: "Contact number must be exactly 10 digits" },
    ],

    customerVendorSelection: [
      {
        test: (v, formData) => formData.customer === true || formData.vendor === true,
        message: "Please select at least Customer or Vendor",
      },
    ],
  };

  const validateCustomerVendor = (name, value) => {
    const fieldRules = customerVendorRules[name];
    if (!fieldRules) return "";
    for (let rule of fieldRules) {
      if (!rule.test(value)) return rule.message;
    }
    return "";
  };


  // console.log("formdatata", formData);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const errorMsg = validateCustomerVendor(name, value);
    setCVErrors(prev => ({ ...prev, [name]: errorMsg }));
  };
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked, // Toggle the value between true and false
    }));
  };

  const [errors, setErrors] = useState({});


  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const errorMsg = validateCustomerVendor(key, value);
      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

    if (!formData.customer && !formData.vendor) {
      toast.error("Please select at least Customer or Vendor");
      return; // ❌ stop submit
    }

    setCVErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      toast.error(newErrors[firstErrorField], {
        position: "top-right",
        autoClose: 2000,
      });
      return; // ❌ Stop submit
    }

    try {
      // Create a FormData object
      const formDataToSend = new FormData();

      // Append text fields to FormData
      formDataToSend.append("name", formData.name);
      formDataToSend.append("gst_no", formData.gst_no);
      formDataToSend.append("pan", formData.pan);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("contact", formData.contact);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("customer", formData.customer);
      formDataToSend.append("vendor", formData.vendor);

      // Make a POST request to your API
      const response = await axiosInstance.post(
        `${API_URL}/api/create-customer/${id}`,
        formDataToSend
      );
      // console.log("bbb", response);
      // Check if the response is successful
      if (response.status === 201 || response.status === 200) {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });

        // Dispatch action to fetch client details
        dispatch(fetchClientDetails(id));

        // Optionally close the modal and reset form
        handleCreateClose();
        setFormData({
          name: "",
          gst_no: "",
          pan: "",
          email: "",
          contact: "",
          address: "",
          customer: "",
          vendor: "",
        });
      } else {
        // Handle non-successful response
        throw new Error(

          toast.error(`${response.data.message}`, {
            position: "top-right",
            autoClose: 2000,
          })
        );
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      // Check if error has a response object from Axios
      if (error.response) {
        toast.error(
          error.response.data.message ||
          "Failed to create branch details. Please try again.",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      } else {
        // Fallback error message for unexpected errors
        toast.error("An unexpected error occurred. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }
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
              Create Customer and Vendor Details
            </Typography>
            <form className=" my-5 w-full " onSubmit={handleSubmit}>
              <div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-4">
                    <label htmlFor="name">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Name
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="name"
                        required
                        placeholder="Name"
                        value={formData.name}
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
                    <label htmlFor="gst_no">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Gst No
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="gst_no"
                        required
                        placeholder="Gst No"
                        value={formData.gst_no}
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
                        required
                        value={formData.pan}
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
                        required
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
                  <div className="col-span-2">
                    <label htmlFor="contact">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Contact Number
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="number"
                        size="lg"
                        name="contact"
                        placeholder="Contact Number"
                        value={formData.contact}
                        required
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-4">
                    <label htmlFor="address">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Address
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="address"
                        placeholder="Addesss"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-4">
                    {/* <div className="col-span-4">
                      <div className="flex gap-10">
                        <Checkbox
                          name="customer"
                          label="Customer"
                          ripple={false}
                          checked={formData.customer} // Controlled checkbox state
                          onChange={handleCheckboxChange} // Handle checkbox change
                        />
                        <Checkbox
                          name="vendor"
                          label="Vendor"
                          checked={formData.vendor} // Controlled checkbox state
                          onChange={handleCheckboxChange} // Handle checkbox change
                        />
                      </div>
                    </div> */}
                    <div className="col-span-4">
                      <div className="flex gap-10">
                        <Checkbox
                          name="customer"
                          label="Customer"
                          ripple={false}
                          checked={formData.customer}
                          onChange={handleCheckboxChange}
                        />
                        <Checkbox
                          name="vendor"
                          label="Vendor"
                          checked={formData.vendor}
                          onChange={handleCheckboxChange}
                        />
                      </div>

                      {/* Error message */}
                      {errors.customerVendor && (
                        <p className="text-red-500 text-sm mt-1">{errors.customerVendor}</p>
                      )}
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
                  name="cv_cancel"
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
      <Button
        conained="conained"
        size="md"
        className="bg-primary hover:bg-[#2d5e85]"
        onClick={handleCreateOpen}
      >
        Create
      </Button>
    </>
  );
}

export default CVCreation;
