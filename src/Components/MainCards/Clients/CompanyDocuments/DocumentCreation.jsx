// import { Select } from '@mui/material';
import {
  Button,
  Input,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Textarea,
  Switch,
  Option,
} from "@material-tailwind/react";
import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { fetchClientDetails } from "../../../Redux/clientSlice";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
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
function DocumentCreation() {
  const { id } = useParams();
  const role = getUserRole();
  const dispatch = useDispatch();
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const [selectedFiles, setSelectedFiles] = useState([]);
  const open = Boolean(anchorEl);
  const handleCreateOpen = () => {
    setOpenCreateModal(true);
    setAnchorEl(null);
  };
  const [formData, setFormData] = useState({
    document_type: "",
    login: "",
    password: "",
    remark: "",
    files: [],
  });

  const handleCreateClose = () => setOpenCreateModal(false);

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
      { test: (v) => Array.isArray(v) && v.length > 0, message: "At least one file is required" },
      {
        test: (v) =>
          Array.isArray(v) &&
          v.every(
            (f) =>
              f.type === "application/pdf" ||
              f.type.startsWith("image/") ||
              f.type === "application/vnd.ms-excel" ||
              f.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
              f.type === "text/plain"
          ),
        message: "Only PDF, Image, Excel, or TXT files are allowed",
      },
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


  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const errorMsg = validateFileField(key, value);
      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      toast.error(newErrors[firstErrorField], {
        position: "top-right",
        autoClose: 2000,
      });
      return; // ❌ Stop submit
    }

    try {
      const formDataToSend = new FormData();

      // Append each form field to FormData
      formDataToSend.append("document_type", formData.document_type);
      formDataToSend.append("login", formData.login);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("remark", formData.remark);

      // Append multiple files if selected
      for (let i = 0; i < formData.files.length; i++) {
        formDataToSend.append("files", formData.files[i]);
      }

      // Make a POST request to your API
      const response = await axiosInstance.post(
        `${API_URL}/api/create-companydoc/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Check if the response is successful
      if (response.status === 200 || response.status === 201) {
        // fetchBranchDetails();
        dispatch(fetchClientDetails(id));


        setFormData({
          document_type: "",
          login: "",
          password: "",
          remark: "",
          files: [],
        });
        handleCreateClose();

        // Optionally close the modal and reset form
        toast.success("Branch Documents details created successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        // Handle error response (if not 200)
        toast.error("Failed to create Branch documents details. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to create Branch details. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
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
              Create Company Documentation
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
                          animate={{
                            mount: { y: 0 },
                            unmount: { y: 25 },
                          }}
                          className="!border !border-[#cecece] bg-white pt-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                          labelProps={{
                            className: "hidden",
                          }}
                          containerProps={{ className: "min-w-[100px]" }}
                          // value={fileName}
                          // onChange={handleFileNameChange}
                          value={formData.document_type}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              document_type: e,
                            }))
                          }
                        >
                          <Option value="udym">Udyam Aadhar</Option>
                          <Option value="pan">PAN</Option>
                          <Option value="tan">TAN</Option>
                          <Option value="msme">MSME</Option>
                          <Option value="mca">MCA</Option>
                          <Option value="esic">ESIC</Option>
                          <Option value="other">Other</Option>
                        </Select>
                      </div>
                    </div>
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
                        // value={login}
                        // onChange={handleLoginChange}
                        value={formData.login}
                        onChange={handleInputChange}
                        required
                        placeholder="UserName"
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                        labelProps={{ className: "hidden" }}
                        containerProps={{ className: "min-w-[100px]" }}
                      />
                    </div>
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-1"
                      >
                        Password
                      </Typography>
                      {/* <Input
                          type="password"
                          size="lg"
                          name="password"
                          value={password}
                          onChange={handlePasswordChange}
                          placeholder="password"
                          className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                          labelProps={{ className: "hidden" }}
                          containerProps={{ className: "min-w-[100px]" }}
                        /> */}
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          // type="password"
                          size="lg"
                          name="password"
                          // value={password}
                          placeholder="Password"
                          // onChange={handlePasswordChange}
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
                        <Textarea
                          type="text"
                          size="lg"
                          name="remark"
                          // value={remark}
                          // onChange={handleRemarkChange}
                          value={formData.remark}
                          onChange={handleInputChange}
                          placeholder="Remarks"
                          className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                          labelProps={{
                            className: "hidden",
                          }}
                          containerProps={{ className: "min-w-[100px]" }}
                        />
                      </div>
                    </div>
                    {/* <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold -mb-3"
                    >
                      File Select
                    </Typography> */}
                    <div className="">
                      <div className="col-span-4">
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
                            required
                            multiple
                            className="file-input file-input-bordered file-input-success w-full max-w-sm"
                          />
                        </div>
                      </div>
                      {/* <div className="flex items-center justify-center bg-grey-lighter">
                        <label className="w-52 flex flex-col items-center px-2 py-4 bg-white text-[#366FA1] rounded-lg shadow-lg tracking-wide uppercase border border-[#366FA1] cursor-pointer hover:bg-[#366FA1] hover:text-white">
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                          </svg>
                          <span className="mt-2 text-base leading-normal">
                            Select a file
                          </span>
                          <input
                            name="file"
                            type="file"
                            className="hidden"
                            multiple
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      {selectedFiles.length > 0 && (
                        <Typography className="text-sm mt-2 text-blue-gray">
                          {selectedFiles.map((file) => file.name).join(", ")}
                        </Typography>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="space-x-2">
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

export default DocumentCreation;
