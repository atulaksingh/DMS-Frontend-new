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
import Select from "react-select";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { FaFileAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchClientDetails } from "../../../Redux/clientSlice";
import { parse } from "date-fns";
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

const generateYearRanges = (startYear, count) => {
  return Array.from({ length: count }, (_, i) => {
    const fromYear = startYear + i;
    const toYear = fromYear + 1;
    return { value: `${fromYear}-${toYear}`, label: `${fromYear}-${toYear}` };
  });
};

export default function TaxAuditCard({ rowId }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const role = getUserRole();
  // console.log("rowIdtaxAudit", rowId);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [fileDetails, setFileDetails] = useState([]); // State for file details
  const [formData, setFormData] = useState({
    financial_year: "",
    month: "",
    files: [],
  });
  console.log("tttt", formData);

  const yearOptions = generateYearRanges(2017, 33);

  const [taxAuditErrors, setTaxAuditErrors] = useState({});

  const taxAuditRules = {
    financial_year: [
      { test: (v) => v.length > 0, message: "Financial year is required" },
      {
        test: (v) => /^\d{4}-\d{4}$/.test(v),
        message: "Financial year must be in format YYYY-YYYY (e.g., 2023-2024)",
      },
      {
        test: (v) => {
          if (!/^\d{4}-\d{4}$/.test(v)) return false;
          const [start, end] = v.split("-").map(Number);
          return end === start + 1; // year should be consecutive
        },
        message: "Financial year must be consecutive (e.g., 2023-2024)",
      },
    ],

    // month: [
    //   { test: (v) => v.length > 0, message: "Month is required" },
    //   {
    //     test: (v) =>
    //       [
    //         "january", "february", "march", "april", "may", "june",
    //         "july", "august", "september", "october", "november", "december",
    //       ].includes(v.toLowerCase()),
    //     message: "Month must be a valid month name (e.g., January)",
    //   },
    // ],

    files: [
      {
        test: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one file is required",
      },
      // {
      //   test: (v) =>
      //     Array.isArray(v) &&
      //     v.every(
      //       (f) =>
      //         f &&
      //         typeof f === "object" &&
      //         "type" in f &&
      //         (
      //           f.type === "application/pdf" ||
      //           f.type.startsWith("image/") ||
      //           f.type === "application/vnd.ms-excel" ||
      //           f.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      //           f.type === "text/plain"
      //         )
      //     ),
      //   message: "Only PDF, Image, Excel, or TXT files are allowed",
      // },
    ],
  };

  const validateTaxAudit = (name, value) => {
    const fieldRules = taxAuditRules[name];
    if (!fieldRules) return "";
    for (let rule of fieldRules) {
      if (!rule.test(value)) return rule.message;
    }
    return "";
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // FileList → Array

    setFormData((prev) => ({
      ...prev,
      files: selectedFiles, // store as array
    }));

    const errorMsg = validateTaxAudit("files", selectedFiles);
    setTaxAuditErrors((prev) => ({ ...prev, files: errorMsg }));
  };

  useEffect(() => {
    if (formData.month) {
      // Convert "March 2025" -> Date object
      const parsedDate = parse(formData.month, "MMMM yyyy", new Date());
      setSelectedMonth(parsedDate);
    }
  }, [formData.month]);

  const [isEditingMonth, setIsEditingMonth] = useState(false); // Track if month input is being edited

  const handleMonthInputClick = () => {
    setIsEditingMonth(true); // Switch to date picker on click
  };

  const handleMonthChange = (date) => {
    if (date) {
      setSelectedMonth(date);
      setFormData((prev) => ({
        ...prev,
        month: format(date, "MMMM yyyy"), // Save in "Month Year" format
      }));
      setIsEditingMonth(false); // Switch back to input after selection
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    for (let [field, value] of Object.entries(formData)) {
      const errorMsg = validateTaxAudit(field, value);
      if (errorMsg) {
        toast.error(errorMsg);
        hasError = true;
        break; // stop at first error
      }
    }

    if (hasError) return; // ❌ Stop submit if validation failed

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("financial_year", formData.financial_year);
      formDataToSend.append("month", formData.month);

      // formData.files.forEach((file) => formDataToSend.append("files", file));
      if (formData.files && formData.files.length > 0) {
        formData.files.forEach((file) => {
          formDataToSend.append("files", file);
        });
      }

      // Make a POST request to your API
      const response = await axiosInstance.post(
        `${API_URL}/api/edit-taxaudit/${id}/${rowId}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const responseData = response.data; // Store response data safely
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
        // dispatch(fetchClientDetails(id));

        dispatch(fetchClientDetails({ id, tabName: "TaxAudit" })).then(() => {
          setTimeout(() => {
            handleCreateClose();
          }, 300);
        });

        setFormData({
          financial_year: "",
          month: "",
          files: [],
        });
        if (responseData.financial_year) {
          setSelectedYear(
            yearOptions.find(
              (option) => option.value === responseData.financial_year
            )
          );
        }

        // Convert and set the selected month
        if (responseData.month) {
          const parsedDate = parseMonthYear(responseData.month); // Ensure function handles errors
          console.log("Selected Month:", parsedDate);
          setSelectedMonth(parsedDate);
        }
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(
        `Failed to create TaxAudit details. Please try again.${
          response.data?.error_message || "Unknown error"
        }`,
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    }
  };

  const parseMonthYear = (monthYearString) => {
    const [month, year] = monthYearString.split(" "); // Split into ["May", "2021"]
    return new Date(`${year}-${month}-01`); // Convert to valid date (YYYY-MMM-DD)
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
        `${API_URL}/api/delete-taxaudit/${id}/${deleteId}`
      );
      // console.log("res-----taxAudit---->", response);
      if (response.status === 200) {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
        // dispatch(fetchClientDetails(id));
        dispatch(fetchClientDetails({ id, tabName: "taxAuditData" }));
        dispatch(fetchClientDetails({ id, tabName: "TaxAudit" })).then(() => {
          // wait for Redux update before closing
          setTimeout(() => {
            // handleCreateClose();
            setOpenDeleteModal(false);
          }, 300);
        });
      } else {
        toast.error("Failed to delete TaxAudit. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting TaxAudit data:", error);
      toast.error("Failed to delete TaxAudit. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleDeleteClose = () => setOpenDeleteModal(false);
  const handleViewClose = () => setOpenViewModal(false);
  const handleCreateOpen = async () => {
    setOpenCreateModal(true);
    setAnchorEl(null);

    try {
      const response = await axiosInstance.get(
        `${API_URL}/api/edit-taxaudit/${id}/${rowId}`
      );
      const data = response.data;
      setFormData(response.data);
      setSelectedYear(new Date(data.financial_year, 0)); // Assuming financial year is in "YYYY" format
      setSelectedMonth(new Date(`${data.month} 01, ${data.financial_year}`)); // Parse month
    } catch (error) {
      console.error("Failed to fetch data for update:", error);
    }
  };
  // console.log("dd", formData, fileDetails);

  const handleCreateClose = () => setOpenCreateModal(false);
  const [taxAuditData, setTaxAuditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleViewOpen = () => {
    setOpenViewModal(true);
    setAnchorEl(null);
    const fetchTaxAuditDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_URL}/api/single-taxaudit/${id}/${rowId}`
        );
        setTaxAuditData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchTaxAuditDetails();
  };

  const shortenFilename = (filename, maxLength = 20) => {
    if (filename.length <= maxLength) {
      return filename;
    }
    const extension = filename.split(".").pop();
    const baseName = filename.slice(0, maxLength - extension.length - 3);
    return `${baseName}...${extension}`;
  };

  console.log("taxAudit", taxAuditData);

  return (
    <>
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

              {taxAuditData && (
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
                              Financial year :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {taxAuditData.financial_year}
                            </div>
                          </div>
                          <div className="w-full flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className=""
                            >
                              Month :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {taxAuditData.month}
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
                            {taxAuditData.files &&
                              taxAuditData.files.length > 0 && (
                                <div className="">
                                  {taxAuditData.files.map((file, index) => (
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
              Update taxAudit Details
            </Typography>
            <form className="my-5 w-full" onSubmit={handleSubmit}>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                  <Typography
                    variant="small"
                    className="block font-semibold mb-1"
                  >
                    Log In Year
                  </Typography>
                  <Select
                    options={yearOptions}
                    required
                    value={
                      yearOptions.find(
                        (option) => option.value === formData.financial_year
                      ) || null
                    }
                    onChange={(selectedOption) => {
                      setFormData((prev) => ({
                        ...prev,
                        financial_year: selectedOption?.value || "",
                      }));
                    }}
                    getOptionLabel={(e) => `${e.label}`}
                    placeholder="Select Financial Year"
                  />
                </div>

                <div className="col-span-2">
                  <Typography
                    variant="small"
                    className="block font-semibold mb-1"
                  >
                    Month
                  </Typography>
                  {isEditingMonth ? (
                    <DatePicker
                      selected={selectedMonth}
                      onChange={handleMonthChange}
                      required
                      dateFormat="MMMM yyyy"
                      showMonthYearPicker
                      className="border p-2"
                      // onBlur={() => setIsEditingMonth(false)} // Close picker when focus is lost
                      // inputProps={{ readOnly: true }} // Prevent manual typing
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData.month}
                      readOnly
                      className="border border-[#cecece] p-2 cursor-pointer"
                      onClick={handleMonthInputClick} // Show DatePicker on click
                    />
                  )}
                </div>
                <div className="col-span-2">
                  <label htmlFor="files">
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
                      name="files"
                      onChange={handleFileChange}
                      multiple
                      className="file-input file-input-bordered file-input-success w-full max-w-sm"
                    />
                  </div>
                  <label htmlFor="attachment">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2 mt-2"
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
              <DialogFooter>
                <Button
                  onClick={handleCreateClose}
                  variant="text"
                  color="red"
                  className="mr-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary">
                  Confirm
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
