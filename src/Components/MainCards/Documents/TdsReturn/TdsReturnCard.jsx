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
import { useDispatch } from "react-redux";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { fetchClientDetails } from "../../../Redux/clientSlice";
import { FaFileAlt } from "react-icons/fa";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRef } from "react";
const API_URL = import.meta.env.VITE_API_BASE_URL;
// import "react-toastify/dist/ReactToastify.css";
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

export default function TdsReturnCard({
  rowId,
  allTdsSectionData,
  fetchAllTdsSectionDetails
}) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const role = getUserRole();
  // console.log("rowIdTds Return", rowId);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [deleteId, setDeleteId] = useState(null);
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

  const tdsSectionData = allTdsSectionData?.tds_section || [];

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
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(e.target.files); // FileList → Array

    setFormData((prev) => ({
      ...prev,
      files: selectedFiles,  // store as array
    }));

    // validate with correct array
    const errorMsg = validateTdsReturn("files", selectedFiles);
    setTdsReturnErrors((prev) => ({ ...prev, files: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    let hasError = false;
    for (let [field, value] of Object.entries(formData)) {
      const errorMsg = validateTdsReturn(field, value);
      if (errorMsg) {
        toast.error(errorMsg);
        hasError = true;
        break; // stop at first error
      }
    }

    if (hasError) return; // ❌ Stop submit if validation failed


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
      // for (let i = 0; i < formData.files.length; i++) {
      //   formDataToSend.append("files", formData.files[i]);
      // }
      if (formData.files && formData.files.length > 0) {
        formData.files.forEach((file) => {
          formDataToSend.append("files", file);
        });
      }

      // Make a POST request to your API
      const response = await axiosInstance.post(
        `${API_URL}/api/edit-tds/${id}/${rowId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Handle success response
        // console.log(response.data);
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });

        // Dispatch fetchClientDetails action
        dispatch(fetchClientDetails(id));

        // Optionally close the modal and reset form
        handleCreateClose();
        setFormData({
          challan_date: "",
          challan_no: "",
          challan_type: "",
          tds_section: "",
          amount: "",
          last_filed_return_ack_date: "",
          last_filed_return_ack_no: "",
          // files: [],
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
      toast.error("Failed to update Tds Return details. Please try again.", {
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
        `${API_URL}/api/delete-tds/${id}/${deleteId}`
      );
      // console.log("res-----Tds Return---->", response);
      setOpenDeleteModal(false);
      if (response.status === 200 || response.status === 201) {
        toast.success("Tds Return deleted successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
        dispatch(fetchClientDetails(id));
      } else {
        toast.error("Failed to delete Tds Return. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting Tds Return data:", error);
      toast.error("Failed to delete Tds Return. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleViewOpen = async () => {
    setOpenViewModal(true);
    setAnchorEl(null);
    try {
      const response = await axiosInstance.get(
        `${API_URL}/api/single-tds/${id}/${rowId}`
      );
      setTdsReturnData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleDeleteClose = () => setOpenDeleteModal(false);
  const handleViewClose = () => setOpenViewModal(false);
  const handleCreateOpen = async () => {
    setOpenCreateModal(true);
    setAnchorEl(null);

    try {
      const response = await axiosInstance.get(
        `${API_URL}/api/edit-tds/${id}/${rowId}`
      );
      // console.log("dd", response.data);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching Tds Return data:", error);
      toast.error("Failed to load Tds Return data. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

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
  const [tdsReturnData, setTdsReturnData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const shortenFilename = (filename, maxLength = 20) => {
    if (filename.length <= maxLength) {
      return filename;
    }
    const extension = filename.split('.').pop();
    const baseName = filename.slice(0, maxLength - extension.length - 3);
    return `${baseName}...${extension}`;
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

              {tdsReturnData && (
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
                              Challan Date :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsReturnData.challan_date}
                            </div>
                          </div>
                          <div className="w-full flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className=""
                            >
                              Challan No :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsReturnData.challan_no}
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
                              Challan Type :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsReturnData.challan_type}
                            </div>
                          </div>
                          <div className="w-full flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className=""
                              size="sm"
                            >
                              Amount :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsReturnData.amount}
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
                              Last filed return Ack Date :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsReturnData.last_filed_return_ack_date}
                            </div>
                          </div>
                          <div className="w-full flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className=""
                              size="sm"
                            >
                              Last filed return Ack No:
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsReturnData.last_filed_return_ack_no}
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
                              TDS Section :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsReturnData.tds_section}
                            </div>
                          </div>
                        </div>

                        <div className="p-2">
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            className="mb-1"
                            size="sm"
                          >
                            Attachments :
                          </Typography>
                          <div className="flex justify-center">
                            {tdsReturnData.files &&
                              tdsReturnData.files.length > 0 && (
                                <div className="">
                                  {tdsReturnData.files.map((file, index) => (
                                    <div className=" bg-primary text-white px-4 py-1 rounded-lg shadow-md w-80 my-1">
                                      <div className="flex items-center justify-between">
                                        <div className=" ">
                                          <a
                                            href={`https://admin.dms.zacoinfotech.com${file.files}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium"
                                          >
                                            {file.files.split("/").pop()}
                                          </a>
                                        </div>
                                        <FaFileAlt className="text-xl " />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
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
              Update tdsReturn Details
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
                            name="name"
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
                                width: 720,
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
                        value={formData.challan_date}
                        className="w-full !border !border-[#cecece] w-[355px] bg-white py-2 pl-3 pr-10 text-gray-900 
                                                                                        focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md 
                                                                                        outline-none"
                        placeholderText="dd/mm/yyyy"
                        showYearDropdown
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
                        value={formData.challan_date}
                        required
                        name="date_of_incorporation"
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
                        required
                        value={formData.challan_no}
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
                        required
                        value={formData.amount}
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
                        required
                        value={formData.challan_type}
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
                        required
                        placeholder="Last filed return Ack No"
                        value={formData.last_filed_return_ack_no}
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
                        className="w-full !border !border-[#cecece] w-[355px] bg-white py-2 pl-3 pr-10 text-gray-900 
                                                                                        focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md 
                                                                                        outline-none"
                        placeholderText="dd/mm/yyyy"
                        showYearDropdown
                        value={formData.last_filed_return_ack_date}
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
                        value={formData.last_filed_return_ack_date}
                        required
                        name="date_of_incorporation"
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
                        onChange={handleFileChange}
                        className="file-input file-input-bordered file-input-success w-full max-w-sm"
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
                      {formData.files && formData.files.length > 0 && (
                        <div className="text-sm text-gray-500 mt-2">
                          <p>Selected files:</p>
                          {formData.files.map((file, index) => (
                            <p key={index}>
                              {file.files ? (
                                <a
                                  href={`https://admin.dms.zacoinfotech.com${file.files}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline"
                                >
                                  {file.files.split("/").pop()}
                                </a>
                              ) : (
                                <span>
                                  {file.name || "No file link available"}
                                </span>
                              )}
                            </p>
                          ))}
                        </div>
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
          <MenuItem onClick={handleCreateOpen}>Update</MenuItem>
          {role === "superuser" && (
            <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
          )}
        </Menu>
      </div>
    </>
  );
}
