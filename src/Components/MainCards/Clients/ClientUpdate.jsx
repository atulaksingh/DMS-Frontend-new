import React, { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRef } from "react";
import { format, parse, isValid } from "date-fns";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
const API_URL = import.meta.env.VITE_API_BASE_URL;
function ClientUpdate() {
  const { id } = useParams();
  const role = getUserRole();
  const navigate = useNavigate();
  const [filesList, setFilesList] = useState([]);
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [remark, setRemark] = useState("");
  const [notify, setNotify] = useState("");
  const [currentFileIndex, setCurrentFileIndex] = useState(null); // To track which file is being edited
  const [formData, setFormData] = useState({
    client_name: "",
    entity_type: "",
    date_of_incorporation: "",
    contact_person: "",
    designation: "",
    email: "",
    contact_no_1: "",
    contact_no_2: "",
    business_detail: "",
    status: "active",
    fileinfos: [],
  });
  const [errors, setErrors] = useState({});

  // console.log("form", filesList);
  // Fetch client data when the component mounts
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_URL}/api/edit-client/${id}`
          // 'http://127.0.0.1:8000/api/edit-client/${id}'
        );
        const data = response.data;
        console.log("prepopulatedFiles", response.data);
        // Set formData with the fetched client data
        setFormData({
          client_name: data.client_name,
          entity_type: data.entity_type,
          date_of_incorporation: data.date_of_incorporation,
          contact_person: data.contact_person,
          designation: data.designation,
          email: data.email,
          contact_no_1: data.contact_no_1,
          contact_no_2: data.contact_no_2,
          business_detail: data.business_detail,
          status: data.status,
          fileinfos: data.fileinfos, // Assuming fileinfos is an array in your API response
        });

        // Prepopulate filesList based on fileinfos
        const prepopulatedFiles = data.fileinfos.map((fileinfo) => ({
          id: fileinfo.id,
          document_type: fileinfo.document_type,
          login: fileinfo.login,
          password: fileinfo.password,
          remark: fileinfo.remark,
          files: fileinfo.files, // Assuming files is an array of file objects
        }));

        setFilesList(prepopulatedFiles);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    fetchClientData();
  }, [id]); // Add id as a dependency

  // const handleOpen = () => setOpen(!open);

  // const notify = (message, type = "success") => {
  //   toast[type](message, { position: "top-right", autoClose: 1000 });
  // };

  const handleFileNameChange = (value) => setFileName(value);
  const handleLoginChange = (event) => setLogin(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleRemarkChange = (event) => setRemark(event.target.value);

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
      {
        test: (v) => v.every(f => f.type === "application/pdf" || f.type.startsWith("image/") || f.type === "application/vnd.ms-excel" || f.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || f.type === "text/plain"), message: "Only PDF or image files are allowed"
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

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  // const handleFileSave = () => {
  //   if (fileName && selectedFiles.length > 0) {
  //     const newFiles = {
  //       id: currentFileIndex !== null ? filesList[currentFileIndex].id : undefined, // ✅ Include ID
  //       document_type: fileName,
  //       login,
  //       password,
  //       remark,
  //       files: selectedFiles,
  //     };

  //     if (currentFileIndex !== null) {
  //       // Update existing file
  //       setFilesList((prevFiles) =>
  //         prevFiles.map((file, index) =>
  //           index === currentFileIndex ? newFiles : file
  //         )
  //       );
  //       toast.success("File updated successfully!");
  //     } else {
  //       // Add new file
  //       setFilesList((prevFiles) => [...prevFiles, newFiles]);
  //       toast.success("Files uploaded successfully!");
  //     }

  //     // Reset
  //     setFileName("");
  //     setSelectedFiles([]);
  //     setLogin("");
  //     setPassword("");
  //     setRemark("");
  //     handleClose();
  //   } else {
  //     toast.error("Please provide all details and select at least one file!");
  //   }
  // };
  const handleFileSave = () => {
    // Collect current values
    const fieldsToValidate = {
      document_type: fileName,
      login,
      password,
      remark,
      files: selectedFiles,
    };

    // Validate each field
    for (let [field, value] of Object.entries(fieldsToValidate)) {
      const errorMsg = validateFileField(field, value);
      if (errorMsg) {
        toast.error(errorMsg);
        return; // ❌ Stop execution if validation fails
      }
    }

    const newFiles = {
      id: currentFileIndex !== null ? filesList[currentFileIndex].id : undefined, // ✅ Keep ID for update
      document_type: fileName,
      login,
      password,
      remark,
      files: selectedFiles,
    };

    if (currentFileIndex !== null) {
      // Update existing file
      setFilesList((prevFiles) =>
        prevFiles.map((file, index) =>
          index === currentFileIndex ? newFiles : file
        )
      );
      toast.success("File updated successfully!");
    } else {
      // Add new file
      setFilesList((prevFiles) => [...prevFiles, newFiles]);
      toast.success("Files uploaded successfully!");
    }

    // Reset fields
    setFileName("");
    setSelectedFiles([]);
    setLogin("");
    setPassword("");
    setRemark("");
    handleClose();
  };


  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleFileDelete = (index) => {
    setFilesList((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      toast.success("File info deleted successfully!");
      return updatedFiles;
    });
  };

  const date_of_incorporation = useRef(null);
  // const handleDateChange = (date) => {
  //   if (isValid(date)) {
  //     const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY
  //     setFormData((prevData) =>
  //       prevData.map((item, index) =>
  //         index === 0 ? { ...item, date_of_incorporation: formattedDate } : item
  //       )
  //     );
  //   }
  // };
  const handleDateChange = (date) => {
    if (isValid(date)) {
      const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY
      setFormData((prevData) => ({
        ...prevData,
        date_of_incorporation: formattedDate,
      }));
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleOpen = (index = null) => {
    if (index !== null && filesList[index]) {
      const fileInfo = filesList[index];
      setCurrentFileIndex(index);
      setFileName(fileInfo.document_type || "");
      setLogin(fileInfo.login || "");
      setPassword(fileInfo.password || "");
      setRemark(fileInfo.remark || "");
      setSelectedFiles(fileInfo.files || []);
    } else {
      // Reset fields for new file
      setCurrentFileIndex(null);
      setFileName("");
      setSelectedFiles([]);
      setLogin("");
      setPassword("");
      setRemark("");
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const rules = {
    client_name: [
      { test: (v) => v.length > 0, message: "Client name is required" },
      { test: (v) => /^[A-Za-z\s]+$/.test(v), message: "Client name can only contain alphabets and spaces" },
      { test: (v) => v.length >= 2, message: "Client name must be at least 2 characters long" },
    ],
    entity_type: [
      { test: v => v && v.trim() !== "", message: "Entity type is required" },
    ],
    date_of_incorporation: [
      { test: v => v && v.trim() !== "", message: "Date of incorporation is required" },
      { test: v => /^\d{2}[-/]\d{2}[-/]\d{4}$/.test(v), message: "Date of incorporation must be in dd/mm/yyyy or dd-mm-yyyy format" },
      {
        test: v => {
          if (!v) return false;
          const parts = v.split(/[-/]/).map(Number);
          if (parts.length !== 3) return false;

          const [day, month, year] = parts;
          const inputDate = new Date(year, month - 1, day);
          const today = new Date();

          return inputDate <= today && !isNaN(inputDate.getTime());
        },
        message: "Date of incorporation cannot be in the future",
      }
    ],
    contact_person: [
      { test: v => v.length > 0, message: "Contact person is required" },
      { test: v => /^[A-Za-z\s]+$/.test(v), message: "Contact person can only contain alphabets and spaces" },
      { test: v => v.length >= 2, message: "Contact person must be at least 2 characters long" },
    ],
    designation: [
      { test: v => v.length > 0, message: "Designation is required" },
      { test: v => /^[A-Za-z\s]+$/.test(v), message: "Designation can only contain alphabets" },
      { test: v => v.length >= 2, message: "Designation must be at least 2 characters long" },
    ],
    contact_no_1: [
      // { test: (v) => v.length > 0
      // , message: "Primary contacts number is required" },
      { test: (v) => /^\d{10}$/.test(v), message: "Primary contact number must be exactly 10 digits" },
    ],
    contact_no_2: [
      { test: v => !v || /^\d{10}$/.test(v), message: "Alternate contact number must be exactly 10 digits if provided" },
    ],
    email: [
      { test: (v) => v.length > 0, message: "Email is required" },
      { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: "Email format is invalid" },
    ],
    business_detail: [
      { test: v => !v || v.length <= 200, message: "Business detail cannot exceed 200 characters" },
    ],
    status: [
      { test: v => v.length > 0, message: "Status is required" },
      { test: v => ["active", "inactive"].includes(v.toLowerCase()), message: "Status must be either Active or Inactive" },
    ],
  };

  const validateField = (name, value) => {
    const fieldRules = rules[name];
    if (!fieldRules) return "";
    for (let rule of fieldRules) {
      if (!rule.test(value)) return rule.message;
    }
    return "";
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    for (let [field, value] of Object.entries(formData)) {
      const errorMsg = validateField(field, value);
      if (errorMsg) {
        toast.error(errorMsg);
        hasError = true;
        break; // stop at first error
      }
    }

    if (hasError) return; // ❌ Stop submit if validation failed

    try {
      const data = new FormData();

      // Append basic form data
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value || "");
      });

      // Append fileinfos with their files
      filesList.forEach((fileinfo, index) => {
        // Append each field of the fileinfo object separately
        data.append(`fileinfos[${index}].id`, fileinfo.id || '');
        data.append(`fileinfos[${index}].document_type`, fileinfo.document_type || '');
        data.append(`fileinfos[${index}].login`, fileinfo.login || '');
        data.append(`fileinfos[${index}].password`, fileinfo.password || '');
        data.append(`fileinfos[${index}].remark`, fileinfo.remark || '');


        // Append the files for this fileinfo
        // fileinfo.files.forEach((file) => {
        //   data.append(`fileinfos[${index}].files`, file); // No need to use [] here, just append files
        // });
        fileinfo.files.forEach((file) => {
          if (!(typeof file === "string" || file?.url)) {
            data.append(`fileinfos[${index}].files`, file); // Only append new ones
          }
        });

        for (let pair of data.entries()) {
          console.log(pair[0] + ', ' + pair[1]);
        }

      });

      for (let pair of data.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }

      // console.log("Data to send:", data);

      // Submit the form data
      const response = await axiosInstance.post(
        `${API_URL}/api/edit-client/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("prepopulatedFiles", response);
      // toast.success("Client updated successfully!", {
      //   position: "top-right",
      //   autoClose: 2000,
      // });


      if (response.status === 200 || response.status === 201) {
        const toastId = toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });

        // Manually close as a fallback
        // setTimeout(() => toast.dismiss(toastId), 2000);
        setTimeout(() => {
          navigate(-1); // Go back to the previous page
        }, 1000);

      } else {
        toast.error(`Failed to Update Client. ${response.statusText}`, {
          position: "top-right",
          autoClose: 2000,
        });
      }




    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Failed to update client. Please try again.", {
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
      <Dialog open={open} size="sm" handler={handleOpen} className="max-h-screen overflow-scroll">
        <div className="flex items-center justify-between">
          <DialogHeader className="flex flex-col items-start">
            <Typography className="mb-1 text-[#366FA1]" variant="h4">
              Add File
            </Typography>
          </DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={handleClose}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <DialogBody className="mx-4">
          <div className="grid gap-3">
            <div className="">
              <label htmlFor="file_name">
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
                  label="file_name"
                  name="file_name"
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
                  value={fileName}
                  onChange={handleFileNameChange}
                  required
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
                value={login}
                onChange={handleLoginChange}
                placeholder="UserName"
                className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                labelProps={{ className: "hidden" }}
                containerProps={{ className: "min-w-[100px]" }}
                required
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
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  // type="password"
                  size="lg"
                  name="password"
                  value={password}
                  placeholder="Password"
                  onChange={handlePasswordChange}
                  className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-full" }}
                  required
                />
                {/* Toggle visibility button */}
                <button
                  type="button"
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
                  value={remark}
                  onChange={handleRemarkChange}
                  placeholder="Remarks"
                  className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                />
              </div>
            </div>

            <Typography
              variant="small"
              color="blue-gray"
              className="block font-semibold -mb-3"
            >
              File Select
            </Typography>
            <div className="">
              <div className="flex items-center justify-center bg-grey-lighter">
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
                  {/* {selectedFiles.map((file) => file.name).join(", ")} */}
                  {selectedFiles.length > 0 && (
                    <Typography className="text-sm mt-2 text-blue-gray">
                      {selectedFiles.map((file) =>
                        typeof file === "string"
                          ? file.split("/").pop() // show just filename from URL
                          : file.name || (file.files?.split("/").pop() ?? "Unnamed")
                      ).join(", ")}
                    </Typography>
                  )}

                </Typography>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="gray" onClick={handleClose}>
            cancel
          </Button>
          <Button className="bg-[#366FA1]" onClick={handleFileSave}>
            Upload
          </Button>
        </DialogFooter>
      </Dialog>
      <form onSubmit={handleSubmit}>
        <div className="p-8 bg-[#fefeff] max-w-6xl mx-auto my-10">
          <div className="text-[1.5rem] font-semibold">Client Update</div>
          <div className="text-gray-600 text-sm my-0.5">
            Update Client details here
          </div>
          <div className="grid grid-cols-3 gap-x-6">
            <div className="col-span-2 my-3">
              <label htmlFor="client name">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="block font-semibold mb-2"
                >
                  Client Name
                </Typography>
              </label>

              <div className="">
                <Input
                  type="text"
                  size="lg"
                  name="client_name"
                  placeholder="Name"
                  className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                  value={formData.client_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="my-3">
              <label htmlFor="entity_type">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="block text-gray-600 font-semibold  mb-2"
                >
                  Select Entity Type
                </Typography>
              </label>

              <div className="">
                <Select
                  label="Select Entity Type"
                  name="entity_type"
                  size="lg"
                  animate={{
                    mount: { y: 0 },
                    unmount: { y: 25 },
                  }}
                  className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                  value={formData.entity_type}
                  required
                  onChange={(selectedValue) =>
                    handleChange({
                      target: { name: "entity_type", value: selectedValue },
                    })
                  }
                >
                  <Option value="proprietorship">Proprietorship</Option>
                  <Option value="partnership">Partnership</Option>
                  <Option value="llp">LLP</Option>
                  <Option value="opc">OPC</Option>
                  <Option value="huf">HUF</Option>
                  <Option value="private ltd">Private Ltd</Option>
                  <Option value="public limited">Public limited</Option>
                  <Option value="trust">Trust</Option>
                </Select>
              </div>
            </div>
            <div className="my-3">
              <label htmlFor="date_of_incorporation">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="block font-semibold mb-2"
                >
                  Date of Incorporation
                </Typography>
              </label>

              {/* <div className="">
                <div className="">
                  <DatePicker
                    ref={date_of_incorporation}
                    selected={
                      formData[0]?.date_of_incorporation
                        ? isValid(parse(formData[0].date_of_incorporation, "dd-MM-yyyy", new Date()))
                          ? parse(formData[0].date_of_incorporation, "dd-MM-yyyy", new Date())
                          : null
                        : null
                    }
                    value={formData.date_of_incorporation}
                    onChange={handleDateChange}
                    dateFormat="dd-MM-yyyy"
                    // className="w-full !border !border-[#cecece] bg-white py-0.5 pl-3 text-gray-900 
                    //                                                               focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md outline-none"
                    className="w-full !border !border-[#cecece] w-[335px] bg-white py-2 pl-3 pr-10 text-gray-900 
                                                                                  focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md 
                                                                                  outline-none"
                    placeholderText="dd-mm-yyyy"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={25}
                  />
                </div>
              </div> */}
              <div className="flex items-center w-full border border-[#cecece] rounded-md bg-white">
                <DatePicker
                  ref={date_of_incorporation}
                  selected={
                    formData[0]?.date_of_incorporation
                      ? isValid(parse(formData[0].date_of_incorporation, "dd-MM-yyyy", new Date()))
                        ? parse(formData[0].date_of_incorporation, "dd-MM-yyyy", new Date())
                        : null
                      : null
                  }
                  value={formData.date_of_incorporation}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="flex-1 py-2 pl-3 pr-2 text-gray-900 outline-none rounded-md"
                  placeholderText="dd/mm/yyyy"
                  showYearDropdown
                  required
                  name="date_of_incorporation"
                  scrollableYearDropdown
                  yearDropdownItemNumber={25}
                />
                <FaRegCalendarAlt
                  className="ml-24 text-gray-500 cursor-pointer"
                  onClick={() => date_of_incorporation.current.setFocus()}
                />
              </div>
            </div>
            <div className="my-3">
              <label htmlFor="contact_person">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="block font-semibold mb-2"
                >
                  Contact Person
                </Typography>
              </label>

              <div className="">
                <Input
                  type="text"
                  size="lg"
                  name="contact_person"
                  placeholder="Contact Person"
                  className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                  value={formData.contact_person}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="my-3">
              <label htmlFor="designation">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="block font-semibold mb-2"
                >
                  Designation
                </Typography>
              </label>

              <div className="">
                <Input
                  type="text"
                  size="lg"
                  name="designation"
                  placeholder="Designation"
                  className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="my-3">
              <label htmlFor="email">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="block font-semibold mb-2"
                >
                  Your Email
                </Typography>
              </label>

              <div className="">
                <Input
                  type="email"
                  size="lg"
                  name="email"
                  placeholder="Email Address"
                  className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="my-3">
              <label htmlFor="contact_no_1">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="block font-semibold mb-2"
                >
                  Contact No
                </Typography>
              </label>

              <div className="">
                <Input
                  type="number"
                  size="lg"
                  name="contact_no_1"
                  icon={<PhoneAndroidIcon className="h-5 w-5 text-gray-500" />}
                  placeholder="Contact No"
                  className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                  value={formData.contact_no_1}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="my-3">
              <label htmlFor="contact_no_2">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="block font-semibold mb-2"
                >
                  Another Contact No
                </Typography>
              </label>

              <div className="">
                <Input
                  type="number"
                  size="lg"
                  name="contact_no_2"
                  icon={<PhoneAndroidIcon className="h-5 w-5 text-gray-500" />}
                  placeholder="Another Contact No"
                  className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                  value={formData.contact_no_2}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className=" col-span-3 my-3">
              <label htmlFor="business_detail">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="block font-semibold mb-2"
                >
                  Business Detail
                </Typography>
              </label>

              <div className="">
                <Textarea
                  type="text"
                  size="lg"
                  name="business_detail"
                  placeholder="Business Detail"
                  className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                  value={formData.business_detail}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <ToastContainer />
          <div className="grid grid-cols-2 gap-x-28">
            <div>
              <div className="my-3">
                <label htmlFor="status">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block  font-semibold  mb-2"
                  >
                    Select Status
                  </Typography>
                </label>

                <div className="">
                  <Select
                    label="Status"
                    name="status"
                    size="lg"
                    animate={{
                      mount: { y: 0 },
                      unmount: { y: 25 },
                    }}
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                    labelProps={{
                      className: "hidden",
                    }}
                    containerProps={{ className: "min-w-[100px]" }}
                    value={formData.status}
                    required
                    onChange={(selectedValue) =>
                      handleChange({
                        target: { name: "status", value: selectedValue },
                      })
                    }
                  >
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                  </Select>
                </div>
              </div>
            </div>
            <div className="mt-4 mb-3">
              <div className="">
                <label htmlFor="status">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block  font-semibold  pb-1"
                  >
                    Attchments
                  </Typography>
                </label>
                {filesList.length === 0 ? (
                  <div className="mt-2">
                    <label
                      htmlFor="mom-file"
                      className="cursor-pointer   bg-white text-blue-500 hover:text-white border border-[#366FA1] px-4 py-3  rounded-md hover:bg-[#366FA1]"
                    >
                      Select PDF/image file.
                    </label>
                    <input
                      id="mom-file"
                      name="mom"
                      className="hidden"
                      accept="image/*,application/pdf"
                      onClick={handleOpen}
                    // required
                    />
                  </div>
                ) : null}
              </div>
              <div className="mt-4">
                {filesList.length > 0 && (
                  <div className="flex align-middle">
                    <ul className="list-disc mr-5 w-full">
                      {filesList.map((file, index) => (
                        <div key={index} onClick={() => handleOpen(index)}>
                          <li
                            key={index}
                            className="flex items-center justify-between mb-2 bg-[#366FA1] p-2 rounded-md text-white"
                          >
                            <span>
                              {file.document_type} {file.id} (
                              {file.files.length})
                            </span>
                            <div className="flex items-center space-x-2">
                              {/* <DeleteIcon
                                color="white"
                                className="cursor-pointer"
                                onClick={() => handleFileDelete(index)}
                              /> */}
                              <DeleteIcon
                                color="white"
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation(); // ✅ Prevent parent click (modal open)
                                  handleFileDelete(index); // ✅ Only run delete
                                }}
                              />

                            </div>
                          </li>
                        </div>
                      ))}
                    </ul>
                    {filesList.length > 0 && (
                      <div className="flex items-end mb-4">
                        <ControlPointIcon
                          className="cursor-pointer text-[#366FA1]"
                          onClick={() => handleOpen(null)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="pt-5">
            <Button
              size="lg"
              type="submit"
              className="bg-[#366FA1] hover:bg-[#2d5e85]"
            >
              Update
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

export default ClientUpdate;
