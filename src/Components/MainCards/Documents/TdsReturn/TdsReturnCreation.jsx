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
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchClientDetails } from "../../../Redux/clientSlice";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRef } from "react";
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
function TdsReturnCreation({
  allTdsSectionData,
  fetchAllTdsSectionDetails
}) {
  const { id } = useParams();
  const role = getUserRole();
  const dispatch = useDispatch();
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
    challan_date: "",
    challan_no: "",
    challan_type: "",
    tds_section: "",
    amount: "",
    last_filed_return_ack_date: "",
    last_filed_return_ack_no: "",
    files: [],
  });

  const [tdsReturnErrors, setTdsReturnErrors] = useState({});

  const tdsReturnRules = {
    challan_date: [
      { test: (v) => v.length > 0, message: "Challan date is required" },
      { test: (v) => /^\d{2}[-/]\d{2}[-/]\d{4}$/.test(v), message: "Challan date must be in dd/mm/yyyy or dd-mm-yyyy format" },
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
        message: "Challan date cannot be in the future",
      },
    ],

    challan_no: [
      { test: (v) => v.length > 0, message: "Challan number is required" },
      { test: (v) => /^[A-Za-z0-9]+$/.test(v), message: "Challan number can only contain letters and numbers" },
    ],

    challan_type: [
      { test: (v) => v.length > 0, message: "Challan type is required" },
    ],

    // tds_section: [
    //   { test: (v) => v.length > 0, message: "TDS section is required" },
    //   { test: (v) => /^[0-9A-Za-z\s]+$/.test(v), message: "TDS section can only contain letters and numbers" },
    // ],

    amount: [
      { test: (v) => v.length > 0, message: "Amount is required" },
      { test: (v) => !isNaN(v) && Number(v) > 0, message: "Amount must be a valid positive number" },
    ],

    last_filed_return_ack_date: [
      { test: (v) => v === "" || /^\d{2}[-/]\d{2}[-/]\d{4}$/.test(v), message: "Last filed return acknowledgment date must be in dd/mm/yyyy or dd-mm-yyyy format" },
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
        message: "Last filed return acknowledgment date cannot be in the future",
      },
    ],

    last_filed_return_ack_no: [
      { test: (v) => v === "" || /^[A-Za-z0-9]+$/.test(v), message: "Acknowledgment number can only contain letters and numbers" },
    ],

    files: [
      { test: (v) => Array.isArray(v) && v.length > 0, message: "At least one file is required" },
      // {
      //   test: (v) =>
      //     Array.isArray(v) &&
      //     v.every(
      //       (f) =>
      //         typeof f === "string" ||
      //         f?.url ||
      //         (
      //           f &&
      //           typeof f === "object" &&
      //           "type" in f &&
      //           (
      //             f.type === "application/pdf" ||
      //             f.type.startsWith("image/") ||
      //             f.type === "application/vnd.ms-excel" ||
      //             f.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      //             f.type === "text/plain"
      //           )
      //         )
      //     ),
      //   message: "Only PDF, Image, Excel, or TXT files are allowed",
      // },
    ],
  };

  const validateTdsReturn = (name, value) => {
    const fieldRules = tdsReturnRules[name];
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

    const errorMsg = validateTdsReturn(name, value);
    setTdsReturnErrors(prev => ({ ...prev, [name]: errorMsg }));
  };
  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // FileList → Array

    setFormData((prev) => ({
      ...prev,
      files: selectedFiles,  // store as array
    }));

    // validate with correct array
    const errorMsg = validateTdsReturn("files", selectedFiles);
    setTdsReturnErrors((prev) => ({ ...prev, files: errorMsg }));
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
      const errorMsg = validateTdsReturn(key, value);
      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

    setTdsReturnErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      toast.error(newErrors[firstErrorField], {
        position: "top-right",
        autoClose: 2000,
      });
      return; // ❌ Stop submit
    }

    if (formData.files.length === 0) {
      toast.error("Please upload at least one file before submitting.", {
        position: "top-right",
        autoClose: 2000,
      });
      return; // Stop form submission
    }

    try {
      // Create a FormData object
      const formDataToSend = new FormData();

      // Append text fields to FormData
      formDataToSend.append("challan_date", formData.challan_date);
      formDataToSend.append("challan_no", formData.challan_no);
      formDataToSend.append("challan_type", formData.challan_type);
      formDataToSend.append("tds_section", formData.tds_section);
      formDataToSend.append("amount", formData.amount);
      formDataToSend.append(
        "last_filed_return_ack_date",
        formData.last_filed_return_ack_date
      );
      formDataToSend.append(
        "last_filed_return_ack_no",
        formData.last_filed_return_ack_no
      );

      // Append file field to FormData
      for (let i = 0; i < formData.files.length; i++) {
        formDataToSend.append("files", formData.files[i]);
      }

      // Make a POST request to your API
      const response = await axiosInstance.post(
        `${API_URL}/api/create-tds/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Ensure the request was successful
        // console.log(response.data); // Handle success response
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });

      await dispatch(fetchClientDetails({ id, tabName: "TDSReturn" }));

      setTimeout(() => {
        handleCreateClose();
      }, 300);
        setFormData({
          challan_date: "",
          challan_no: "",
          challan_type: "",
          tds_section: "",
          amount: "",
          last_filed_return_ack_no: "",
          last_filed_return_ack_date: "",
        });
      } else {
        throw new Error(
          toast.error(
            "Failed to create Tds Return details. Please try again.",
            {
              position: "top-right",
              autoClose: 2000,
            }
          )
        );
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to create Tds Return details. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const [selectedChallenDate, setSelectedChallenDate] = useState(null); //....
  const [selectedAckDate, setSelectedAckDate] = useState(null); //....
  const challenDateRef = useRef(null);
  const ackDateRef = useRef(null);

  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY
      setSelectedChallenDate(date); // Keep original date for display
      setFormData({ ...formData, challan_date: formattedDate }); // Store in required format
      // setSelectedToDate(date); // Set selected date to to_date
      // setFormData({ ...formData, to_date: formattedDate }); // Store in required format
    }
  };
  const handleToDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY
      // setSelectedDate(date); // Keep original date for display
      // setFormData({ ...formData, from_date: formattedDate }); // Store in required format
      setSelectedAckDate(date); // Set selected date to to_date
      setFormData({ ...formData, last_filed_return_ack_date: formattedDate }); // Store in required format
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
              Create Tds Return Details
            </Typography>
            <form className=" my-5 w-full " onSubmit={handleSubmit}>
              <div>
                <div className="grid grid-cols-4 gap-4">
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
                          typeof option === "string"
                            ? option
                            : option.name || ""
                        }
                        onChange={handleTdsSectionOnChange}
                        // value={tdsSecData.name || ""} // Bind value to formData.gst_no
                        value={formData.tds_section || ""}
                        PopperComponent={(props) => (
                          <div {...props} style={{ position: "relative", zIndex: 1 }} />
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
                            placeholder="Select TDS Section"
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
                  <div className="col-span-2">
                    <label htmlFor="challan_date">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Challan date
                      </Typography>
                    </label>

                    {/* <div className="relative w-full">
                      <DatePicker
                        ref={challenDateRef}
                        selected={selectedChallenDate}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        className="w-full !border !border-[#cecece] w-[335px] bg-white py-2 pl-3 pr-10 text-gray-900 
                                                                    focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md 
                                                                    outline-none"
                        placeholderText="dd/mm/yyyy"
                        showYearDropdown
                        required
                        scrollableYearDropdown
                        yearDropdownItemNumber={25}

                      />
                      <FaRegCalendarAlt
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        onClick={() => challenDateRef.current.setFocus()} // Focus the correct DatePicker
                      />
                    </div> */}
                    <div className="flex items-center w-full border border-[#cecece] rounded-md bg-white">
                      <DatePicker
                        ref={challenDateRef}
                        selected={selectedChallenDate}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        className="flex-1 py-2 pl-3 pr-2 text-gray-900 outline-none rounded-md"
                        placeholderText="dd/mm/yyyy"
                        showYearDropdown
                        // value={formData.last_filed_return_ack_date}
                        required
                        name="date"
                        scrollableYearDropdown
                        yearDropdownItemNumber={25}
                      />
                      <FaRegCalendarAlt
                        className="ml-20 text-gray-500 cursor-pointer"
                        onClick={() => challenDateRef.current.setFocus()}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="challan_no">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Challan No
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="challan_no"
                        placeholder="Challan No"
                        value={formData.challan_no}
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

                    <div className="">
                      <Input
                        type="number"
                        size="lg"
                        name="amount"
                        placeholder="Amount"
                        value={formData.amount}
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
                  <div className="col-span-2">
                    <label htmlFor="challan_type">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Challan Type
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="challan_type"
                        placeholder="Challan Type"
                        value={formData.challan_type}
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
                    <label htmlFor="last_filed_return_ack_no">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Last filed return Ack No
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="last_filed_return_ack_no"
                        placeholder="Last filed return Ack No"
                        value={formData.last_filed_return_ack_no}
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
                    <label htmlFor="last_filed_return_ack_date">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Last filed return Ack Date
                      </Typography>
                    </label>

                    {/* <div className="relative w-full">
                      <DatePicker
                        ref={ackDateRef}
                        selected={selectedAckDate}
                        onChange={handleToDateChange}
                        dateFormat="dd/MM/yyyy"
                        className="w-full !border !border-[#cecece] w-[335px] bg-white py-2 pl-3 pr-10 text-gray-900 
                                                                    focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md 
                                                                    outline-none"
                        placeholderText="dd/mm/yyyy"
                        showYearDropdown
                        required
                        scrollableYearDropdown
                        yearDropdownItemNumber={25}

                      />
                      <FaRegCalendarAlt
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        onClick={() => ackDateRef.current.setFocus()} // Focus the correct DatePicker
                      />
                    </div> */}
                    <div className="flex items-center w-full border border-[#cecece] rounded-md bg-white">
                      <DatePicker
                        ref={ackDateRef}
                        selected={selectedAckDate}
                        onChange={handleToDateChange}
                        dateFormat="dd/MM/yyyy"
                        className="flex-1 py-2 pl-3 pr-2 text-gray-900 outline-none rounded-md"
                        placeholderText="dd/mm/yyyy"
                        showYearDropdown
                        // value={formData.last_filed_return_ack_date}
                        required
                        name="last_filed_return_ack_date"
                        scrollableYearDropdown
                        yearDropdownItemNumber={25}
                      />
                      <FaRegCalendarAlt
                        className="ml-20 text-gray-500 cursor-pointer"
                        onClick={() => ackDateRef.current.setFocus()}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="attachment">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Attachments
                      </Typography>
                    </label>

                    <div className="">
                      <input
                        type="file"
                        name="attachment"
                        multiple
                        required
                        onChange={handleFileChange}
                        className="file-input file-input-bordered file-input-success w-full max-w-sm"
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
                  name="tdsreturn_cancel"
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

export default TdsReturnCreation;
