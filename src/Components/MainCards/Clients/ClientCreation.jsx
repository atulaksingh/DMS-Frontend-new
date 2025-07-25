import React, { useState } from "react";
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
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRef } from "react";
const API_URL = import.meta.env.VITE_API_BASE_URL;
function ClientCreation() {
  const navigate = useNavigate();
  const [filesList, setFilesList] = useState([]);
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [remark, setRemark] = useState("");
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

  const handleOpen = () => setOpen(!open);

  const notify = (message, type = "success") => {
    toast[type](message, { position: "top-right", autoClose: 1000 });
  };

  const handleFileNameChange = (value) => setFileName(value);
  const handleLoginChange = (event) => setLogin(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleRemarkChange = (event) => setRemark(event.target.value);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleFileSave = () => {
    if (fileName && selectedFiles.length > 0) {
      const newFiles = {
        document_type: fileName,
        login,
        password,
        remark,
        files: selectedFiles,
      };

      setFilesList((prevFiles) => [...prevFiles, newFiles]);
      notify("Files uploaded successfully!");

      // Reset fields
      setFileName("");
      setSelectedFiles([]);
      setLogin("");
      setPassword("");
      setRemark("");
      handleOpen();
    } else {
      notify("Please provide all details and select at least one file!", "error");
    }
  };

  const handleFileDelete = (index) => {
    setFilesList((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      notify("File info deleted successfully!");
      return updatedFiles;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // Append all other form fields
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value || "");
      });

      // Append structured fileinfos
      filesList.forEach(({ document_type, login, password, remark, files }, index) => {
        // Append fileinfo details
        const fileinfoData = {
          document_type,
          login,
          password,
          remark,
        };

        // Append fileinfo details as JSON
        data.append(`fileinfos[${index}]`, JSON.stringify(fileinfoData));

        // Append each file under the respective fileinfo
        files.forEach((file) => {
          data.append(`fileinfos[${index}].files[]`, file);
        });
      });

      // console.log("data to send:", data);
      const response = await axios.post(
        `${API_URL}/api/create-client`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // http://127.0.0.1:8000/api/create-purchase-post2/
      // console.log("response",response)


      if (response.status === 200 || response.status === 201) {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });

        // Reset form and file list
        setFormData({
          client_name: "",
          entity_type: "",
          date_of_incorporation: "",
          contact_person: "",
          designation: "",
          contact_no_1: "",
          contact_no_2: "",
          email: "",
          business_detail: "",
          status: "active",
          fileinfos: [],
        });
        setFilesList([]);
        setTimeout(() => {
          navigate(-1); // Go back to the previous page
        }, 1000);
      } else {
        // Handle unexpected status codes
        toast.error(`Failed to create client: ${response.statusText}`, {
          position: "top-right",
          autoClose: 2000,
        });
      }

    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Failed to create client. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };


  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // const [selectedChallenDate, setSelectedChallenDate] = useState(null); //....
  const [selectedDate, setSelectedDate] = useState(null); //....
  const date = useRef(null);
  // const ackDateRef = useRef(null);

  // const handleDateChange = (date) => {
  //   if (date instanceof Date && !isNaN(date)) {
  //     const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY
  //     setSelectedChallenDate(date); // Keep original date for display
  //     setFormData({ ...formData, challan_date: formattedDate }); // Store in required format
  //     // setSelectedToDate(date); // Set selected date to to_date
  //     // setFormData({ ...formData, to_date: formattedDate }); // Store in required format
  //   }
  // };
  const handleToDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY
      // setSelectedDate(date); // Keep original date for display
      // setFormData({ ...formData, from_date: formattedDate }); // Store in required format
      setSelectedDate(date); // Set selected date to to_date
      setFormData({ ...formData, date_of_incorporation: formattedDate }); // Store in required format
    }
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
            onClick={handleOpen}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <DialogBody className="mx-4 ">
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
                  value={password}
                  placeholder="Password"
                  onChange={handlePasswordChange}
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
                  {selectedFiles.map((file) => file.name).join(", ")}
                </Typography>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="gray" onClick={handleOpen}>
            cancel
          </Button>
          <Button className="bg-[#366FA1]" name="upload" onClick={handleFileSave}>
            Upload
          </Button>
        </DialogFooter>
      </Dialog>
      <form onSubmit={handleSubmit}>
        <div className="p-8 bg-[#fefeff] max-w-6xl mx-auto my-10">
          <div className="text-[1.5rem] font-semibold">Client Creation</div>
          <div className="text-gray-600 text-sm my-0.5">
            Create Client details here
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
                <Input
                  type="date"
                  size="lg"
                  name="date_of_incorporation"
                  placeholder="Contact Person"
                  className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{ className: "min-w-[100px]" }}
                  value={formData.date_of_incorporation}
                  onChange={handleChange}
                />
              </div> */}
              <div className="relative w-full">
                <DatePicker
                  ref={date}
                  selected={selectedDate}
                  // onChange={(date) => setSelectedDate(date)}
                  onChange={handleToDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="w-full !border !border-[#cecece] w-[335px] bg-white py-2 pl-3 pr-10 text-gray-900 
                                                                                  focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md 
                                                                                  outline-none"
                  //  className="!border !border-[#cecece] bg-white pt-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                  placeholderText="dd/mm/yyyy"
                  showYearDropdown
                  name="date_of_incorporation"
                  scrollableYearDropdown
                  yearDropdownItemNumber={25}

                />
                <FaRegCalendarAlt
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => date.current.setFocus()} // Focus the correct DatePicker
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
                    Attachments
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
                      required
                    />
                  </div>
                ) : null}
              </div>
              <div className="mt-4">
                {filesList.length > 0 && (
                  <div className="flex align-middle">
                    <ul className="list-disc mr-5 w-full">
                      {filesList.map((file, index) => (
                        <>
                          {/* {console.log("dj",file)} */}
                          <li
                            key={index} // Use index since file.id is not defined
                            className="flex items-center justify-between mb-2 bg-[#366FA1] p-2 rounded-md text-white"
                          >
                            <span>
                              {file.document_type} ({file.files.length})
                            </span>
                            <div className="flex items-center space-x-2">
                              <DeleteIcon
                                color="white"
                                className="cursor-pointer"
                                onClick={() => handleFileDelete(index)} // Use index for delete
                              />
                            </div>
                          </li>
                        </>
                      ))}
                    </ul>
                    {filesList.length > 0 && (
                      <div className="flex items-end mb-4">
                        <ControlPointIcon
                          className="cursor-pointer text-[#366FA1]"
                          onClick={handleOpen}
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
              name="create-btn"
              className="bg-[#366FA1] hover:bg-[#2d5e85]"
            >
              Create
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

export default ClientCreation;
