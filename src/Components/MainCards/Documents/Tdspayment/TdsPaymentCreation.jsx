import { Button, DialogFooter } from "@material-tailwind/react";
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
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { NoEncryption } from "@mui/icons-material";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRef } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
function TdsPaymentCreation({ allTdsSectionData, fetchAllTdsSectionDetails }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const role = getUserRole();
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleCreateOpen = () => {
    setOpenCreateModal(true);
    setAnchorEl(null);
  };

  const tdsSectionData = allTdsSectionData?.tds_section || [];

  const handleCreateClose = () => {
    setOpenCreateModal(false);
    resetField();
  };
  const resetField = () => {
    setTdsSecData({
      name: "",
    });
  };

  const [tdsSecData, setTdsSecData] = useState({
    name: "",
  });

  const [selectedTdsSection, setSelectedTdsSection] = useState(null);
  const [formData, setFormData] = useState({
    client_name: "",
    date: "",
    PAN: "",
    amount: "",
    cgst: "",
    sgst: "",
    igst: "",
    total_amt: "",
    tds_rate: "",
    tds_section: "",
    tds_amount: "",
    net_amount: "",
    tds_payment_date: "",
    tds_challan_no: "",
  });

  const [tdsPaymentError, setTdsPaymentError] = useState({});

  const taxFormRules = {
    client_name: [
      { test: (v) => v.length > 0, message: "Client name is required" },
      {
        test: (v) => /^[A-Za-z\s]+$/.test(v),
        message: "Client name can only contain alphabets and spaces",
      },
      {
        test: (v) => v.length >= 2,
        message: "Client name must be at least 2 characters long",
      },
    ],

    date: [
      { test: (v) => v.length > 0, message: "Date is required" },
      {
        test: (v) => /^\d{2}[-/]\d{2}[-/]\d{4}$/.test(v),
        message: "Date must be in dd/mm/yyyy or dd-mm-yyyy format",
      },
      {
        test: (v) => {
          if (!v) return false;
          const parts = v.split(/[-/]/).map(Number);
          if (parts.length !== 3) return false;
          const [day, month, year] = parts;
          const inputDate = new Date(year, month - 1, day);
          const today = new Date();
          return inputDate <= today && !isNaN(inputDate.getTime());
        },
        message: "Date cannot be in the future",
      },
    ],

    PAN: [
      { test: (v) => v.length > 0, message: "PAN number is required" },
      {
        test: (v) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v),
        message: "PAN must be in format ABCDE1234F",
      },
    ],

    amount: [
      { test: (v) => v.length > 0, message: "Amount is required" },
      {
        test: (v) => !isNaN(v) && Number(v) > 0,
        message: "Amount must be a valid positive number",
      },
    ],

    cgst: [
      {
        test: (v) => v === "" || (!isNaN(v) && Number(v) >= 0),
        message: "CGST must be a valid number",
      },
    ],

    sgst: [
      {
        test: (v) => v === "" || (!isNaN(v) && Number(v) >= 0),
        message: "SGST must be a valid number",
      },
    ],

    igst: [
      {
        test: (v) => v === "" || (!isNaN(v) && Number(v) >= 0),
        message: "IGST must be a valid number",
      },
    ],

    total_amt: [
      { test: (v) => v.length > 0, message: "Total amount is required" },
      {
        test: (v) => !isNaN(v) && Number(v) >= 0,
        message: "Total amount must be a valid number",
      },
    ],

    tds_rate: [
      {
        test: (v) =>
          v === "" || (!isNaN(v) && Number(v) >= 0 && Number(v) <= 100),
        message: "TDS rate must be between 0 and 100",
      },
    ],
    tds_amount: [
      {
        test: (v) => v === "" || (!isNaN(v) && Number(v) >= 0),
        message: "TDS amount must be a valid number",
      },
    ],

    net_amount: [
      { test: (v) => v.length > 0, message: "Net amount is required" },
      {
        test: (v) => !isNaN(v) && Number(v) >= 0,
        message: "Net amount must be a valid number",
      },
    ],

    tds_payment_date: [
      {
        test: (v) => v === "" || /^\d{2}[-/]\d{2}[-/]\d{4}$/.test(v),
        message: "TDS payment date must be in dd/mm/yyyy or dd-mm-yyyy format",
      },
      {
        test: (v) => {
          if (!v) return true; // optional
          const parts = v.split(/[-/]/).map(Number);
          if (parts.length !== 3) return false;
          const [day, month, year] = parts;
          const inputDate = new Date(year, month - 1, day);
          const today = new Date();
          return inputDate <= today && !isNaN(inputDate.getTime());
        },
        message: "TDS payment date cannot be in the future",
      },
    ],

    tds_challan_no: [
      {
        test: (v) => v === "" || /^[A-Za-z0-9]+$/.test(v),
        message: "TDS challan no can only contain letters and numbers",
      },
    ],
  };

  const validateTdsPayment = (name, value) => {
    const fieldRules = taxFormRules[name];
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

    const errorMsg = validateTdsPayment(name, value);
    setTdsPaymentError((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleTdsSectionOnChange = (event, newValue) => {
    if (!newValue) {
      setTdsSecData({ name: "" });
      setFormData((prev) => ({ ...prev, tds_section: "" }));
      return;
    }

    if (typeof newValue === "string") {
      setTdsSecData({ name: newValue });
      setFormData((prev) => ({ ...prev, tds_section: newValue }));
    } else if (newValue && newValue.name) {
      setTdsSecData({ name: newValue.name });
      setFormData((prev) => ({ ...prev, tds_section: newValue.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const errorMsg = validateTdsPayment(key, value);
      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

    setTdsPaymentError(newErrors);
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
      formDataToSend.append("client_name", formData.client_name);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("PAN", formData.PAN);
      formDataToSend.append("amount", formData.amount);
      formDataToSend.append("cgst", formData.cgst);
      formDataToSend.append("sgst", formData.sgst);
      formDataToSend.append("igst", formData.igst);
      formDataToSend.append("total_amt", formData.total_amt);
      formDataToSend.append("tds_rate", formData.tds_rate);
      formDataToSend.append("tds_section", formData.tds_section);
      formDataToSend.append("tds_amount", formData.tds_amount);
      formDataToSend.append("net_amount", formData.net_amount);
      formDataToSend.append("tds_payment_date", formData.tds_payment_date);
      formDataToSend.append("tds_challan_no", formData.tds_challan_no);

      // Make a POST request to your API
      const response = await axiosInstance.post(
        `${API_URL}/api/create-tdspayment/${id}`,
        formDataToSend
      );

      if (response.status === 200 || response.status === 201) {
        console.log(response.data);
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });


        await dispatch(fetchClientDetails({ id, tabName: "TDSPayment" }));

     
        setTimeout(() => {
          handleCreateClose();
        }, 300);

        setFormData({
          client_name: "",
          date: "",
          PAN: "",
          amount: "",
          cgst: "",
          sgst: "",
          igst: "",
          total_amt: "",
          tds_rate: "",
          tds_section: "",
          tds_amount: "",
          net_amount: "",
          tds_payment_date: "",
          tds_challan_no: "",
        });
        setSelectedDate(null);
      } else {
        throw new Error(
          toast.error(
            "Failed to create Tds Payment details. Please try again.",
            {
              position: "top-right",
              autoClose: 2000,
            }
          )
        );
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to create Tds Payment details. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const [selectedDate, setSelectedDate] = useState(null); //....
  const [selectedTdsDate, setSelectedTdsDate] = useState(null); //....
  const dateRef = useRef(null);
  const tdsDateRef = useRef(null);

  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY
      setSelectedDate(date); // Keep original date for display
      setFormData({ ...formData, date: formattedDate }); // Store in required format
      // setSelectedToDate(date); // Set selected date to to_date
      // setFormData({ ...formData, to_date: formattedDate }); // Store in required format
    }
  };
  const handleToDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY
      // setSelectedDate(date); // Keep original date for display
      // setFormData({ ...formData, from_date: formattedDate }); // Store in required format
      setSelectedTdsDate(date); // Set selected date to to_date
      setFormData({ ...formData, tds_payment_date: formattedDate }); // Store in required format
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
          <Box sx={styleCreateMOdal} className="max-h-screen overflow-scroll">
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              className="text-center border-b-2 border-[#366FA1] pb-3"
            >
              Create Tds Payment Details
            </Typography>
            <form className="my-5 w-full" onSubmit={handleSubmit}>
              <div className="grid grid-cols-4 gap-4">
                {/* Client Name */}
                <div className="col-span-4">
                  <label htmlFor="client_name">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      Client Name
                    </Typography>
                  </label>
                  <Input
                    type="text"
                    size="lg"
                    name="client_name"
                    placeholder="Client Name"
                    value={formData.client_name}
                    required
                    onChange={handleInputChange}
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                {/* Date */}
                <div className="col-span-2">
                  <label htmlFor="date">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      Date
                    </Typography>
                  </label>
                  <div className="">
                    {/* <div className="relative w-full">
                      <DatePicker
                        ref={dateRef}
                        selected={selectedDate}
                        required
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        className="w-full !border !border-[#cecece] w-[336px] bg-white py-2 pl-3 pr-10 text-gray-900 
                                                                                        focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md 
                                                                                        outline-none"
                        placeholderText="dd/mm/yyyy"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={25}

                      />
                      <FaRegCalendarAlt
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        onClick={() => dateRef.current.setFocus()} // Focus the correct DatePicker
                      />
                    </div> */}
                    <div className="flex items-center w-full border border-[#cecece] rounded-md bg-white">
                      <DatePicker
                        ref={dateRef}
                        selected={selectedDate}
                        onChange={handleDateChange}
                        name="date"
                        dateFormat="dd/MM/yyyy"
                        className="flex-1 py-2 pl-3 pr-2 text-gray-900 outline-none rounded-md"
                        placeholderText="dd/mm/yyyy"
                        showYearDropdown
                        required
                        // name="date_of_incorporation"
                        scrollableYearDropdown
                        yearDropdownItemNumber={25}
                      />
                      <FaRegCalendarAlt
                        className="ml-20 text-gray-500 cursor-pointer"
                        onClick={() => dateRef.current.setFocus()}
                      />
                    </div>
                  </div>
                </div>

                {/* PAN */}
                <div className="col-span-2">
                  <label htmlFor="PAN">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      PAN
                    </Typography>
                  </label>
                  <Input
                    type="text"
                    size="lg"
                    name="PAN"
                    placeholder="PAN"
                    value={formData.PAN}
                    onChange={handleInputChange}
                    required
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                {/* Amount */}
                <div className="col-span-2">
                  <label htmlFor="amount">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      Amount
                    </Typography>
                  </label>
                  <Input
                    type="number"
                    size="lg"
                    name="amount"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                {/* CGST */}
                <div className="col-span-2">
                  <label htmlFor="cgst">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      CGST
                    </Typography>
                  </label>
                  <Input
                    type="number"
                    size="lg"
                    name="cgst"
                    placeholder="CGST"
                    value={formData.cgst}
                    onChange={handleInputChange}
                    required
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                {/* SGST */}
                <div className="col-span-2">
                  <label htmlFor="sgst">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      SGST
                    </Typography>
                  </label>
                  <Input
                    type="number"
                    size="lg"
                    name="sgst"
                    placeholder="SGST"
                    value={formData.sgst}
                    onChange={handleInputChange}
                    required
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                {/* IGST */}
                <div className="col-span-2">
                  <label htmlFor="igst">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      IGST
                    </Typography>
                  </label>
                  <Input
                    type="number"
                    size="lg"
                    name="igst"
                    placeholder="IGST"
                    value={formData.igst}
                    onChange={handleInputChange}
                    required
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                {/* Total Amount */}
                <div className="col-span-2">
                  <label htmlFor="total_amt">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      Total Amount
                    </Typography>
                  </label>
                  <Input
                    type="number"
                    size="lg"
                    name="total_amt"
                    placeholder="Total Amount"
                    value={formData.total_amt}
                    onChange={handleInputChange}
                    required
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                {/* TDS Rate */}
                <div className="col-span-2">
                  <label htmlFor="tds_rate">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      TDS Rate
                    </Typography>
                  </label>
                  <Input
                    type="number"
                    size="lg"
                    name="tds_rate"
                    placeholder="TDS Rate"
                    value={formData.tds_rate}
                    onChange={handleInputChange}
                    required
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="date">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      TDS Payment Date
                    </Typography>
                  </label>
                  <div className="">
                    {/* <div className="relative w-full">
                      <DatePicker
                        ref={tdsDateRef}
                        selected={selectedTdsDate}
                        onChange={handleToDateChange}
                        required
                        dateFormat="dd/MM/yyyy"
                        className="w-full !border !border-[#cecece] w-[336px] bg-white py-2 pl-3 pr-10 text-gray-900 
                                                                                        focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md 
                                                                                        outline-none"
                        placeholderText="dd/mm/yyyy"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={25}

                      />
                      <FaRegCalendarAlt
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        onClick={() => tdsDateRef.current.setFocus()} // Focus the correct DatePicker
                      />
                    </div> */}
                    <div className="flex items-center w-full border border-[#cecece] rounded-md bg-white">
                      <DatePicker
                        ref={tdsDateRef}
                        selected={selectedTdsDate}
                        onChange={handleToDateChange}
                        dateFormat="dd/MM/yyyy"
                        className="flex-1 py-2 pl-3 pr-2 text-gray-900 outline-none rounded-md"
                        placeholderText="dd/mm/yyyy"
                        showYearDropdown
                        required
                        name="tds_payment_date"
                        // name="date_of_incorporation"
                        scrollableYearDropdown
                        yearDropdownItemNumber={25}
                      />
                      <FaRegCalendarAlt
                        className="ml-20 text-gray-500 cursor-pointer"
                        onClick={() => tdsDateRef.current.setFocus()}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <label htmlFor="PAN">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      TDS Challan No.
                    </Typography>
                  </label>
                  <Input
                    type="text"
                    size="lg"
                    name="tds_challan_no"
                    placeholder="TDS Challan No."
                    value={formData.tds_challan_no}
                    onChange={handleInputChange}
                    required
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="tds_section">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold"
                    >
                      TDS Section
                    </Typography>
                  </label>
                </div>
                <div className="col-span-4">
                  <div className="m-0">
                    {/* <Stack spacing={1} sx={{ width: 300 }}> */}
                    <Autocomplete
                      sx={{ width: 300 }}
                      freeSolo
                      id="tds-section-autocomplete"
                      // disablePortal
                      disableClearable
                      required
                      options={tdsSectionData}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.name || ""
                      }
                      onChange={handleTdsSectionOnChange}
                      // value={tdsSecData.name || ""} // Bind value to formData.gst_no
                      value={formData.tds_section || ""}
                      PopperComponent={(props) => (
                        <div
                          {...props}
                          style={{ position: "relative", zIndex: 1 }}
                        />
                      )}
                      PaperComponent={(props) => (
                        <div
                          {...props}
                          style={{
                            marginTop: "5px",
                            position: "absolute",
                            backgroundColor: "white", // ✅ Ensures white background
                            // border: "1px solid #ccc", // ✅ Adds border for visibility
                            // borderRadius: "5px",
                            boxShadow: "5px 4px 6px rgba(0,0,0,0.1)", // ✅ Adds shadow for better visibility
                            padding: "5px",
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                          {option.name}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          name="tds_section"
                          value={formData.tds_section || ""} // Reset input value when formData.gst_no changes
                          onChange={(e) =>
                            handleTdsSectionOnChange(e, e.target.value)
                          } // Update input value on type
                          placeholder="Select TDS Section."
                          sx={{
                            // Adjust the height and padding to reduce overall size
                            "& .MuiInputBase-root": {
                              height: 45, // Set your desired height here
                              padding: "2px 6px", // Adjust padding to make it smaller
                              width: 680,
                            },
                            "& .MuiOutlinedInput-input": {
                              padding: "4px 6px", // Input padding
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
                    {/* </Stack> */}
                  </div>
                </div>

                {/* TDS Amount */}
                <div className="col-span-2">
                  <label htmlFor="tds_amount">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      TDS Amount
                    </Typography>
                  </label>
                  <Input
                    type="number"
                    size="lg"
                    name="tds_amount"
                    placeholder="TDS Amount"
                    value={formData.tds_amount}
                    onChange={handleInputChange}
                    required
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                {/* Net Amount */}
                <div className="col-span-2">
                  <label htmlFor="net_amount">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      Net Amount
                    </Typography>
                  </label>
                  <Input
                    type="number"
                    size="lg"
                    name="net_amount"
                    placeholder="Net Amount"
                    value={formData.net_amount}
                    onChange={handleInputChange}
                    required
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleCreateClose}
                  conained="text"
                  color="red"
                  className="mr-1 "
                  name="tdspayment_cancel"
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

export default TdsPaymentCreation;
