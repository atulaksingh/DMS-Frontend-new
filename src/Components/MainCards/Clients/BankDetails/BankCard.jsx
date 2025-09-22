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
import { FaFileAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchClientDetails } from "../../../Redux/clientSlice";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
// import "react-toastify/dist/ReactToastify.css";
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

export default function BankCard({ rowId }) {
  const { id } = useParams();
  // console.log("rowIdbank", rowId);
  const dispatch = useDispatch();
  const role = getUserRole();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [bankErrors, setBankErrors] = useState({});
  const [formData, setFormData] = useState({
    account_no: "",
    bank_name: "",
    ifsc: "",
    account_type: "",
    branch: "",
    files: [],
  });

  const bankRules = {
    account_no: [
      // { test: v => v.length > 0, message: "Account number is required" },
      { test: v => /^\d{9,18}$/.test(v), message: "Account number must be 9 to 18 digits" },
    ],
    bank_name: [
      { test: v => v.length > 0, message: "Bank name is required" },
      { test: v => /^[A-Za-z\s]+$/.test(v), message: "Bank name can only contain alphabets and spaces" },
    ],
    ifsc: [
      { test: v => v.length > 0, message: "IFSC code is required" },
      // { test: (v) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v), message: "IFSC must be in format: 4 letters, 0, followed by 6 characters (e.g., SBIN0001234)" },
    ],
    account_type: [
      { test: v => v.length > 0, message: "Account type is required" },
      { test: v => ["savings", "current", "salary"].includes(v.toLowerCase()), message: "Account type must be Savings, Current, or Salary" },
    ],
    branch: [
      { test: v => v.length > 0, message: "Branch name is required" },
      { test: v => /^[A-Za-z0-9\s,']+$/.test(v), message: "Branch can only contain letters, numbers and spaces" },
    ],
    files: [
      { test: (v) => Array.isArray(v) && v.length > 0, message: "At least one file is required" },
      // {
      //   test: (v) =>
      //     Array.isArray(v) &&
      //     v.every(
      //       (f) =>
      //         f.type === "application/pdf" ||
      //         f.type?.startsWith("image/") ||
      //         f.type === "application/vnd.ms-excel" ||
      //         f.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      //         f.type === "text/plain"
      //     ),
      //   message: "Only PDF, Image, Excel, or TXT files are allowed",
      // },
    ],

  };

  const validateBankField = (name, value) => {
    const fieldRules = bankRules[name];
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

    const errorMsg = validateBankField(name, value);
    setBankErrors((prev) => ({ ...prev, [name]: errorMsg }));

  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // ✅ define it
    setFormData((prev) => ({
      ...prev,
      files: selectedFiles,
    }));

    const errorMsg = validateBankField("files", selectedFiles);
    setBankErrors((prev) => ({ ...prev, files: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    let hasError = false;
    for (let [field, value] of Object.entries(formData)) {
      const errorMsg = validateBankField(field, value);
      if (errorMsg) {
        toast.error(errorMsg);
        hasError = true;
        break; // stop at first error
      }
    }

    if (hasError) return; // ❌ Stop submit if validation failed

    try {
      // Create a FormData object  to send the form fields to the server 
      const formDataToSend = new FormData();

      // Append text fields to FormData
      formDataToSend.append("account_no", formData.account_no);
      formDataToSend.append("bank_name", formData.bank_name);
      formDataToSend.append("ifsc", formData.ifsc);
      formDataToSend.append("account_type", formData.account_type);
      formDataToSend.append("branch", formData.branch);

      // Append files
      if (formData.files && formData.files.length > 0) {
        formData.files.forEach((file) => {
          formDataToSend.append("files", file);
        });
      }


      // Make a POST request to your API
      console.log("Bank Updated Data", formData);
      const response = await axiosInstance.post(
        `${API_URL}/api/edit-bank/${id}/${rowId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // fffgfffvfddfdgddddfvb we wew wewwe  wqqqqwe 
      // console.log("response",response)
      // Check if the response indicates success
      if (response.status === 200 || response.status === 201) {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });

        // Dispatch action to fetch client details
        dispatch(fetchClientDetails(id));

        // Optionally close the modal and reset form
        handleCreateClose();
        setFormData({
          account_no: "",
          bank_name: "",
          ifsc: "",
          account_type: "",
          branch: "",
        });
      } else {
        // Show error toast if response indicates failure
        toast.error(
          response.data.message || "Failed to update bank details. Please try again.",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Error submitting data:", error);

      // Display error message in a toast
      toast.error(
        error.response?.data?.message || "An unexpected error occurred. Please try again.",
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
  // console.log("row123", deleteId);
  const handleDeleteOpen = () => {
    setDeleteId(rowId);
    setOpenDeleteModal(true);
    setAnchorEl(null);
  };
  const handleDeleteID = async () => {
    try {
      const response = await axiosInstance.delete(
        `${API_URL}/api/delete-bank/${id}/${deleteId}`
      );
      // console.log("res-----bank---->", response);
      dispatch(fetchClientDetails(id));
      setOpenDeleteModal(false);
      if (response.status === 200 || response.status === 201) {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.error("Failed to delete bank. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting bank data:", error);
      toast.error("Failed to delete bank. Please try again.", {
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
          `${API_URL}/api/single-bank/${id}/${rowId}`
        );
        setBankData(response.data);
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
  const handleCreateOpen = async () => {
    setOpenCreateModal(true);
    setAnchorEl(null);

    try {
      const response = await axiosInstance.get(
        `${API_URL}/api/edit-bank/${id}/${rowId}`

      );

      // console.log("dd", response.data);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching bank data:", error);
      toast.error("Failed to load bank data. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleCreateClose = () => setOpenCreateModal(false);
  const [bankData, setBankData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const shortenFilename = (filename, maxLength = 20) => {
    if (filename.length <= maxLength) {
      return filename;
    }
    const extension = filename.split('.').pop();
    const baseName = filename.slice(0, maxLength - extension.length - 3);
    return `${baseName}...${extension}`;
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

              {bankData && (
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
                              Account Number :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {bankData.account_no}
                            </div>
                          </div>
                          <div className="w-full flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className=""
                            >
                              Account Type :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {bankData.account_type}
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
                              Bank Name :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {bankData.bank_name}
                            </div>
                          </div>
                          <div className="w-full flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className=""
                              size="sm"
                            >
                              Branch Name :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {bankData.branch}
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
                              IFSC Code :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {bankData.ifsc}
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
                            {bankData.files && bankData.files.length > 0 && (
                              <div>
                                {bankData.files.map((file, index) => {
                                  const fullFilename = file.files.split("/").pop();
                                  const shortFilename = shortenFilename(fullFilename);

                                  return (
                                    <div
                                      key={index}
                                      className="bg-primary text-white px-4 py-1 rounded-lg shadow-md w-80 my-1"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <a
                                            href={`https://admin.dms.zacoinfotech.com${file.files}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium"
                                          >
                                            {shortFilename}
                                          </a>
                                        </div>
                                        <FaFileAlt className="text-xl" />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>;
                        </div>
                      </div>
                    </form>
                  </div>
                  <DialogFooter className="">
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
              Update bank Details
            </Typography>
            <form className=" my-5 w-full " onSubmit={handleSubmit}>
              <div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-4">
                    <label htmlFor="account_no">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Account Number
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="number"
                        size="lg"
                        name="account_no"
                        placeholder="Account Number"
                        value={formData.account_no}
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
                    <label htmlFor="bank_name">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Bank Name
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="bank_name"
                        placeholder="Bank Name"
                        value={formData.bank_name}
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
                    <label htmlFor="account_type">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Account Type
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="account_type"
                        placeholder="Account Type"
                        value={formData.account_type}
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
                    <label htmlFor="branch">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Branch
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="branch"
                        placeholder="Branch"
                        value={formData.branch}
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
                    <label htmlFor="ifsc">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        IFSC Code
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="ifsc"
                        placeholder="IFSC Code"
                        value={formData.ifsc}
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
          {(role === "superuser" || role === "clientuser") && (
            <MenuItem onClick={handleCreateOpen}>Update</MenuItem>
          )}
          {/* <MenuItem onClick={handleCreateOpen}>Update</MenuItem> */}
          {/* <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem> */}
          {role === "superuser" && (
            <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
          )}
        </Menu>
      </div>
    </>
  );
}
