import React, { useState, useEffect } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { Checkbox, Input, Typography } from "@material-tailwind/react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Card from "../../Card";
import { Button, DialogFooter } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OwnerCard from "./OwnerCard";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchClientDetails } from "../../../Redux/clientSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
// import { DialogFooter, Button } from "@material-tailwind/react";
const API_URL = import.meta.env.VITE_API_BASE_URL;
const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});

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
function Owner({ ownerData }) {
  if (!ownerData) return <div>No owner data available</div>;
  const [ownerShare, setOwnerShare] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ownerErrors, setOwnerErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [showUserPassword, setShowUserPassword] = useState(false);

  const toggleUserPasswordVisibility = () => {
    setShowUserPassword(!showUserPassword);
  };

  const { id } = useParams();
  const role = getUserRole();
  // console.log("Role from token:", getUserRole());
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    share: "",
    pan: "",
    aadhar: "",
    email: "",
    it_password: "",
    mobile: "",
    username: "",
    user_password: "",
    isadmin: false,
    is_active: true,
  });
  const notify = (message, type = "success") => {
    toast[type](message, { position: "top-right", autoClose: 1000 });
  };

  const ownerRules = {
    first_name: [
      { test: (v) => v.length > 0, message: "First name is required" },
      {
        test: (v) => /^[A-Za-z\s]+$/.test(v),
        message: "First name can only contain alphabets and spaces",
      },
      {
        test: (v) => v.length >= 2,
        message: "First name must be at least 2 characters long",
      },
    ],
    last_name: [
      { test: (v) => v.length > 0, message: "Last name is required" },
      {
        test: (v) => /^[A-Za-z\s]+$/.test(v),
        message: "Last name can only contain alphabets and spaces",
      },
      {
        test: (v) => v.length >= 2,
        message: "Last name must be at least 2 characters long",
      },
    ],
    share: [
      { test: (v) => v.length > 0, message: "Share is required" },
      {
        test: (v) => /^\d+(\.\d+)?$/.test(v),
        message: "Share must be a valid number",
      },
      {
        test: (v) => parseFloat(v) > 0 && parseFloat(v) <= 100,
        message: "Share must be between 0 and 100",
      },
    ],
    pan: [
      { test: (v) => v.length > 0, message: "PAN number is required" },
      {
        test: (v) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v),
        message: "Invalid PAN format (e.g., ABCDE1234F)",
      },
    ],
    aadhar: [
      { test: (v) => v.length > 0, message: "Aadhar number is required" },
      {
        test: (v) => /^\d{12}$/.test(v),
        message: "Aadhar number must be 12 digits",
      },
    ],
    email: [
      { test: (v) => v.length > 0, message: "Email is required" },
      {
        test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Invalid email format",
      },
    ],
    username: [
      { test: (v) => v.length > 0, message: "Username is required" },
      {
        test: (v) => /^[a-zA-Z0-9_]+$/.test(v),
        message: "Username can only contain letters, numbers, and underscores",
      },
    ],
    it_password: [
      { test: (v) => v.length > 0, message: "IT password is required" },
      {
        test: (v) => v.length >= 6,
        message: "IT password must be at least 6 characters long",
      },
    ],
    mobile_number: [
      { test: (v) => v.length > 0, message: "Mobile number is required" },
      {
        test: (v) => /^\d{10}$/.test(v),
        message: "Mobile number must be exactly 10 digits",
      },
    ],
    user_password: [
      { test: (v) => v.length > 0, message: "User password is required" },
      {
        test: (v) => v.length >= 6,
        message: "User password must be at least 6 characters long",
      },
    ],
    is_admin: [
      {
        test: (v) => typeof v === "boolean",
        message: "Is Admin must be true or false",
      },
    ],
    is_active: [
      {
        test: (v) => typeof v === "boolean",
        message: "Is Active must be true or false",
      },
    ],
  };

  const validateOwnerField = (name, value) => {
    const fieldRules = ownerRules[name];
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

    const errorMsg = validateOwnerField(name, value);
    setOwnerErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      isadmin: e.target.checked, // Update isadmin based on checkbox state
      // is_active: e.target.checked, // Update is_active based on checkbox state
    }));
  };

  const handleActiveCheckboxChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      // isadmin: e.target.checked,  // Update isadmin based on checkbox state
      is_active: e.target.checked, // Update is_active based on checkbox state
    }));
  };

  const createOwnerShare = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_URL}/api/create-owner/${id}`,
        formData
      );
      setOwnerShare(response?.data?.remaining_shares);
    } catch (error) {
      console.error("Error creating owner:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    if (id) {
      createOwnerShare();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    // console.log("enter");
    e.preventDefault(); // Prevent default form submission
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const errorMsg = validateOwnerField(key, value);
      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

    setOwnerErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      toast.error(newErrors[firstErrorField], {
        position: "top-right",
        autoClose: 2000,
      });
      return; // ❌ Stop submit
    }

    try {
      // Make a POST request to your API
      const response = await axiosInstance.post(
        `${API_URL}/api/create-owner/${id}`,
        formData
      );
      console.log(response.data); // Handle success response

      if (response.status === 200 || response.status === 201) {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
        // then close modal after a delay
        setTimeout(() => {
          handleCreateClose();
        }, 600);

        // refresh redux after delay
        setTimeout(() => {
          dispatch(fetchClientDetails({ id, tabName: "Owner" }));
        }, 700);

        // handleCreateClose();
        // setErrorMessage("");
        setFormData({
          first_name: "",
          last_name: "",
          share: "",
          pan: "",
          aadhar: "",
          email: "",
          it_password: "",
          mobile: "",
          username: "",
          user_password: "",
          // isadmin: "",
          // is_active: "",
        });
      } else {
        toast.error(`${response.data.error_message || response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);

      const backendError = error.response?.data?.error_message;
      const fallbackMessage = "Error submitting data. Please try again.";

      let detailedErrors = "";

      // If error_message is an object, format it into a string
      if (backendError && typeof backendError === "object") {
        detailedErrors = Object.entries(backendError)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join(" | ");
      } else if (typeof backendError === "string") {
        detailedErrors = backendError;
      }

      toast.error(detailedErrors || fallbackMessage, {
        position: "top-right",
        autoClose: 3000,
      });

      // Optional: update UI state
      setErrorMessage(detailedErrors || fallbackMessage);
    }
  };

  const calculateTableBodyHeight = () => {
    const rowHeight = 80;
    const maxHeight = 525;
    const calculatedHeight = ownerData.length * rowHeight;
    return calculatedHeight > maxHeight
      ? `${maxHeight}px`
      : `${calculatedHeight}px`;
  };

  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState(
    calculateTableBodyHeight
  );
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [searchBtn, setSearchBtn] = useState(true);
  const [downloadBtn, setDownloadBtn] = useState(true);
  const [printBtn, setPrintBtn] = useState(true);
  const [viewColumnBtn, setViewColumnBtn] = useState(true);
  const [filterBtn, setFilterBtn] = useState(true);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleCreateOpen = () => {
    setOpenCreateModal(true);
    setAnchorEl(null);
  };

  const handleCreateClose = () => setOpenCreateModal(false);
  useEffect(() => {
    setTableBodyHeight(calculateTableBodyHeight());
  }, [ownerData]);

  const columns = [
    {
      name: "first_name",
      label: "First Name",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "last_name",
      label: "Last Name",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "share",
      label: "Share",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "pan",
      label: "PAN",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "aadhar",
      label: "Aadhar",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "mobile",
      label: "Mobile",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "is_active",
      label: "Status",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return value ? "Active" : "InActive";
        },
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    // {
    //   name: "it_password",
    //   label: "Password",
    //   options: {
    //     setCellHeaderProps: () => ({
    //       style: {
    //         backgroundColor: "#366FA1",
    //         color: "#ffffff",
    //       },
    //     }),
    //   },
    // },
    {
      name: "Actions",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const rowData = ownerData[dataIndex];
          return (
            <div>
              <OwnerCard
                rowId={rowData.id}
                createOwnerShare={createOwnerShare}
                ownerShare={ownerShare}
              />
            </div>
          );
        },
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
  ];

  const options = {
    search: searchBtn,
    download: downloadBtn,
    print: printBtn,
    viewColumns: viewColumnBtn,
    filter: filterBtn,
    filterType: "dropdown",
    responsive,
    tableBodyHeight,
    tableBodyMaxHeight,
    onTableChange: (action, state) => {
      // console.log(action);
      // console.dir(state);
    },
    selectableRows: "none",
    selectableRowsHeader: false,
    rowsPerPage: 13,
    rowsPerPageOptions: [13, 25, 50, 100],
    page: 0,
  };

  const theme = createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: "#366FA1",
            paddingBlock: "2px",
            color: "#ffffff !important",
            "&.MuiTableSortLabel-root": {
              color: "#ffffff !important",
              "&:hover": {
                color: "#ffffff !important",
              },
              "&.Mui-active": {
                color: "#ffffff !important",
                "& .MuiTableSortLabel-icon": {
                  color: "#ffffff !important",
                },
              },
            },
          },
          body: {
            paddingBlock: "0px",
          },
        },
      },
    },
  });

  const renderNoData = () => (
    <div className="w-full border rounded-lg shadow-md p-10 flex flex-col items-center justify-center text-red-900 text-lg bg-white">
      No owner data available !!
    </div>
  );

  return (
    <>
      {/* <ToastContainer /> */}
      {/* //////////////////////////Create Data Modal open//////// */}
      {/* {console.log("hhhhhhhh",ownerShare)} */}
      <div>
        <Modal
          open={openCreateModal}
          onClose={handleCreateClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "95%",
              maxWidth: 750,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 3,
              borderRadius: "10px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              className="text-center border-b-2 border-[#366FA1] pb-3"
            >
              Create Owner Details
            </Typography>
            <form className=" my-5 w-full " onSubmit={handleSubmit}>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="">
                    <label htmlFor="first_name">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        First Name
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                        className="!w-full !border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "w-full" }}
                
                      />
                    </div>
                  </div>
                  <div className="">
                    <label htmlFor="last_name">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Last Name
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="last_name"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required
                        className="!w-full !border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "w-full" }}
                        
                      />
                    </div>
                  </div>
                  <div className="">
                    <label htmlFor="share">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold mb-2 flex gap-2 "
                      >
                        Share{" "}
                        <div className="text-green-400 text-sm">
                          {ownerShare}% left
                        </div>
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="number"
                        size="lg"
                        name="share"
                        required
                        placeholder="Share"
                        value={formData.share}
                        onChange={handleInputChange}
                        className="!w-full !border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "w-full" }}
                      
                      />
                    </div>
                  </div>
                  <div className="">
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
                        value={formData.pan}
                        onChange={handleInputChange}
                        required
                        className="!w-full !border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                          containerProps={{ className: "w-full" }}
                      />
                    </div>
                  </div>
                  <div className="">
                    <label htmlFor="aadhar">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Aadhar Number
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="number"
                        size="lg"
                        name="aadhar"
                        placeholder="Aadhar Number"
                        value={formData.aadhar}
                        onChange={handleInputChange}
                        required
                        className="!w-full !border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                         containerProps={{ className: "w-full" }}
                      />
                    </div>
                  </div>

                  <div className="">
                    <label htmlFor="email">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Email Id
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="email"
                        size="lg"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="!w-full !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                         containerProps={{ className: "w-full" }}
                      />
                    </div>
                  </div>
                  <div className="">
                    <label htmlFor="email">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        UserName
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="username"
                        placeholder="UserName"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="!w-full !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                         containerProps={{ className: "w-full" }}
                      />
                    </div>
                  </div>
                  <div className="">
                    <label htmlFor="it_password">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        IT Password
                      </Typography>
                    </label>

                    <div className="">
                      {/* <Input
                        type="password"
                        size="lg"
                        name="it_password"
                        placeholder="Password"
                        value={formData.it_password}
                        onChange={handleInputChange}
                        className="!w-full !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                         containerProps={{ className: "w-full" }}
                      /> */}
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          size="lg"
                          name="it_password"
                          placeholder="Password"
                          value={formData.it_password}
                          onChange={handleInputChange}
                          required
                          className="!w-full !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                          labelProps={{
                            className: "hidden",
                          }}
                           containerProps={{ className: "w-full" }}
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
                  </div>
                  <div className="">
                    <label htmlFor="aadhar">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Mobile Number
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="number"
                        size="lg"
                        name="mobile"
                        placeholder="Mobile Number"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        required
                        className="!w-full !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                         containerProps={{ className: "w-full" }}
                      />
                    </div>
                  </div>
                  <div className="">
                    <label htmlFor="it_password">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        User Password
                      </Typography>
                    </label>

                    <div className="">
                      <div className="relative">
                        <Input
                          type={showUserPassword ? "text" : "password"}
                          size="lg"
                          name="user_password"
                          placeholder="User Password"
                          value={formData.user_password}
                          onChange={handleInputChange}
                          required
                          className="!w-full !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                          labelProps={{
                            className: "hidden",
                          }}
                           containerProps={{ className: "w-full" }}
                        />
                        {/* Toggle visibility button */}
                        <button
                          type="button"
                          onClick={toggleUserPasswordVisibility}
                          className="absolute top-3 right-3"
                        >
                          {showUserPassword ? (
                            <EyeIcon className="h-5 w-5 text-gray-500" />
                          ) : (
                            <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <label htmlFor="aadhar">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Is Admin
                      </Typography>
                    </label>

                    <div className="">
                      <Checkbox
                        color="blue"
                        name="isadmin"
                        checked={formData.isadmin}
                        onChange={handleCheckboxChange}
                        label="Is Admin"
                      />
                    </div>
                  </div>
                  <div className="">
                    <label htmlFor="aadhar">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Is Active
                      </Typography>
                    </label>

                    <div className="">
                      <Checkbox
                        color="blue"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleActiveCheckboxChange}
                        label="Is Active"
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
                  name="owner_cancel"
                >
                  <span>Cancel</span>
                </Button>
                <Button
                  conained="filled"
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

      <div>
        <div className="flex justify-between align-middle items-center mb-5">
          <div className="text-2xl text-gray-800 font-semibold">
            Owner Details
          </div>
          <div>
            {(role === "superuser" || role === "clientuser") && (
              <Button
                variant="filled"
                size="md"
                className="bg-primary hover:bg-[#2d5e85]"
                onClick={handleCreateOpen}
              >
                Create
              </Button>
            )}
          </div>
        </div>
        {Array.isArray(ownerData) && ownerData.length > 0 ? (
          <CacheProvider value={muiCache}>
            <ThemeProvider theme={theme}>
              <MUIDataTable
                data={ownerData}
                columns={columns}
                options={options}
              />
            </ThemeProvider>
          </CacheProvider>
        ) : (
          renderNoData()
        )}
      </div>
    </>
  );
}

export default Owner;
