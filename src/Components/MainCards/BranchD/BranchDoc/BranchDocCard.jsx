import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import { Input, Option, Select, Typography } from "@material-tailwind/react";
// import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { DialogFooter, Button } from "@material-tailwind/react";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react"; 
import { useState } from "react";
import axios from "axios";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { FaFileAlt } from "react-icons/fa";
// import "react-toastify/dist/ReactToastify.css";
const options = ["None", "Atria", "Callisto"];
const API_URL = import.meta.env.VITE_API_BASE_URL;
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

export default function BranchDocCard({ rowId, fetchBranchDetails }) {
  const { branchID } = useParams();
  const role = getUserRole();
  // console.log("rowIdbranchDoc", rowId);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    document_type: "",
    login: "",
    password: "",
    remark: "",
    files: [],
  });
  const [errors, setErrors] = useState({});

  const fileFormRules = {
    document_type: [
      { test: (v) => v.length > 0, message: "Document type is required" },
    ],
    login: [
      { test: (v) => v.length > 0, message: "Username is required" },
      { test: (v) => /^[a-zA-Z0-9_]+$/.test(v), message: "Only letters, numbers, and underscores allowed" },
    ],
    password: [
      { test: (v) => v.length > 0, message: "Password is required" },
      { test: (v) => v.length >= 6, message: "Password must be at least 6 characters long" },
    ],
    remark: [
      { test: (v) => v.length <= 200, message: "Remarks cannot exceed 200 characters" },
    ],
    files: [
      { test: (v) => v && v.length > 0, message: "At least one file is required" },
      // {
      //   test: (v) => v.every(f => f.type === "application/pdf" || f.type.startsWith("image/") || f.type === "application/vnd.ms-excel" || f.type ===
      //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || f.type === "text/plain"), message: "Only PDF or image files are allowed"
      // },
    ],
  };

  const validateFileField = (name, value) => {
    const rules = fileFormRules[name];
    if (!rules) return "";
    for (let rule of rules) {
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

    const errorMsg = validateFileField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };
  

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // FileList → Array

    setFormData((prev) => ({
      ...prev,
      files: selectedFiles,  // store as array
    }));

    // validate with correct array
    const errorMsg = validateFileField("files", selectedFiles);
    setErrors((prev) => ({ ...prev, files: errorMsg }));
  };

  const shortenFilename = (filename, maxLength = 20) => {
    if (filename.length <= maxLength) {
      return filename;
    }
    const extension = filename.split(".").pop();
    const baseName = filename.slice(0, maxLength - extension.length - 3);
    return `${baseName}...${extension}`;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    let hasError = false;
    for (let [field, value] of Object.entries(formData)) {
      const errorMsg = validateFileField(field, value);
      if (errorMsg) {
        toast.error(errorMsg);
        hasError = true;
        break; // stop at first error
      }
    }

    if (hasError) return; // ❌ Stop submit if validation failed

    try {
      const formDataToSend = new FormData();

      // Append each form field to FormData
      formDataToSend.append("document_type", formData.document_type);
      formDataToSend.append("login", formData.login);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("remark", formData.remark);

      // Append multiple files if selected
      formData.files.forEach((file) => {
        formDataToSend.append("files", file);
      });

      // Make a POST request to your API
      const response = await axiosInstance.post(
        `${API_URL}/api/edit-branchdoc/${branchID}/${rowId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle success response
      if (response.status === 200 || response.status === 201) {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });

        // Fetch updated branch details and close modal
        setTimeout(() => {
          fetchBranchDetails();
          handleCreateClose();
        }, 500); // Optional delay to allow toast display
      } else {
        throw new Error("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);

      // Check for Axios-specific error response
      if (error.response) {
        toast.error(
          error.response.data.message || "Failed to update BranchDoc details. Please try again.",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      } else {
        // Handle unexpected errors
        toast.error("An unexpected error occurred. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
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
        `${API_URL}/api/delete-branchdoc/${branchID}/${deleteId}`
      );
      // console.log("res-----branchDoc---->", response);
      setOpenDeleteModal(false);
      if (response.status === 200 || response.status === 201) {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
        fetchBranchDetails();
      } else {
        toast.error("Failed to delete branchDoc. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting branchDoc data:", error);
      toast.error("Failed to delete branchDoc. Please try again.", {
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
          `${API_URL}/api/single-branchdoc/${branchID}/${rowId}`
        );
        setBranchDocData(response.data);
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
        `${API_URL}/api/edit-branchdoc/${branchID}/${rowId}`
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
  const [branchDocData, setBranchDocData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

              {branchDocData && (
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
                              Document Type :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {branchDocData.document_type}
                            </div>
                          </div>
                          <div className="w-full flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className=""
                            >
                              UserName :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {branchDocData.login}
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
                              Password :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {branchDocData.password}
                            </div>
                          </div>
                        </div>
                        <div className="w-full flex gap-3 p-2">
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            className=""
                            size="sm"
                          >
                            Remark :
                          </Typography>
                          <div className="text-gray-700 text-[15px] my-auto">
                            {branchDocData.remark}
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
                            {branchDocData.files &&
                              branchDocData.files.length > 0 && (
                                <div>
                                  {branchDocData.files.map((file, index) => {
                                    const fullFilename = file.files
                                      .split("/")
                                      .pop();
                                    const shortFilename =
                                      shortenFilename(fullFilename);

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
              Update branchDoc Details
            </Typography>
            <form className=" my-5 w-full " onSubmit={handleSubmit}>
              <div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-4">
                    <div className="">
                      <label htmlFor="document_type">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block  font-semibold  mb-1"
                        >
                          Select File
                        </Typography>
                      </label>

                      <div className="">
                        <Select
                          label="document_type"
                          name="document_type"
                          size="lg"
                          value={formData.document_type}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              document_type: e,
                            }))
                          }
                          animate={{
                            mount: { y: 0 },
                            unmount: { y: 25 },
                          }}
                          className="!border !border-[#cecece] bg-white pt-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                          labelProps={{
                            className: "hidden",
                          }}
                          containerProps={{ className: "min-w-[100px]" }}
                        >
                          <Option value="ptec">PTEC</Option>
                          <Option value="ptrc">PTRC</Option>
                          <Option value="gst">GST</Option>
                          <Option value="eway">EWAY</Option>

                          <Option value="other">Other</Option>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-1"
                      >
                        UserName
                      </Typography>
                      <Input
                        type="text"
                        size="lg"
                        name="login"
                        value={formData.login}
                        onChange={handleInputChange}
                        required
                        placeholder="Login"
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                        labelProps={{ className: "hidden" }}
                        containerProps={{ className: "min-w-[100px]" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-1"
                      >
                        Password
                      </Typography>

                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          size="lg"
                          name="password"
                          placeholder="password"
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
                          name="eye-btn"
                          onClick={togglePasswordVisibility}
                          className="absolute top-3 right-3"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div>
                      <label htmlFor="remarks">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-semibold mb-2"
                        >
                          Remark
                        </Typography>
                      </label>

                      <div className="">
                        <Input
                          type="text"
                          size="lg"
                          name="remark"
                          placeholder="Remarks"
                          value={formData.remark}
                          onChange={handleInputChange}
                          className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                          labelProps={{
                            className: "hidden",
                          }}
                          containerProps={{ className: "min-w-[100px]" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
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
                  <div className="col-span-1">
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
                                <span>{file.name || "No file link available"}</span>
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
