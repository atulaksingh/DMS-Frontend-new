import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import { Input, Option, Select, Typography } from "@material-tailwind/react";

import { DialogFooter, Button } from "@material-tailwind/react";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { XMarkIcon } from "@heroicons/react/16/solid";

import Modal from "@mui/material/Modal";
import { fetchClientDetails } from "../../Redux/clientSlice";
import { useDispatch } from "react-redux";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRef } from "react";
import { parse } from "date-fns"
import { format } from "date-fns";
import DatePicker from "react-datepicker";
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
  width: "75%",
  bgcolor: "background.paper",
  //   border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};
const ITEM_HEIGHT = 48;

export default function PfCard({ rowId, fetchPfTotals }) {
  //   console.log("dddd",rowId)

  const { id } = useParams();
  const dispatch = useDispatch();
  // console.log("rowIdbank", rowId);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [singleViewId, setSingleViewId] = useState(null);

  const [attachment, setAttachment] = useState(null); // State for file input

  // Handle file input change
  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
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
      const response = await axios.delete(
        `${API_URL}/api/delete-pf/${id}/${deleteId}`
      );
      // console.log("res-----bank---->", response);
      setOpenDeleteModal(false);
      if (response.status === 200 || response.status === 201) {
        toast.success("pf deleted successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
        dispatch(fetchClientDetails(id));
        await fetchPfTotals(id);
      } else {
        toast.error("Failed to delete pf. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting pf data:", error);
      toast.error("Failed to delete pf. Please try again.", {
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
        const response = await axios.get(
          `${API_URL}/api/edit-pf/${id}/${rowId}`
        );
        setBankData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchBankDetails()
  };

  const handleDeleteClose = () => setOpenDeleteModal(false);
  const handleViewClose = () => setOpenViewModal(false);
  const handleCreateOpen = async () => {
    setOpenCreateModal(true);
    setAnchorEl(null);

    try {
      const response = await axios.get(
        `${API_URL}/api/edit-pf/${id}/${rowId}`
      );
      //   console.log("dd", response.data);
      const updatedData = {
        ...response.data,
        pf_deducted: response.data.pf_deducted ? "true" : "false",
      };

      setFormData(updatedData);
      // setFormData(response.data);

    } catch (error) {
      console.error("Error fetching bank data:", error);
      toast.error("Failed to load bank data. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const [bankData, setBankData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchBankDetails = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${API_URL}/api/editpf/${id}/${rowId}`
  //       );
  //       setBankData(response.data);
  //       setLoading(false);
  //     } catch (error) {
  //       setError(error);
  //       setLoading(false);
  //     }
  //   };
  //   fetchBankDetails();
  // }, [id, rowId]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error loading client details: {error.message}</div>;
  // }

  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    employee_name: "",
    employee_code: "",
    uan: "",
    pf_number: "",
    pf_deducted: "",
    date_of_joining: "",
    status: "",
    gender: "",
    month: "",
    gross_ctc: "",
    basic_pay: "",
    hra: "",
    statutory_bonus: "",
    special_allowance: "",
    pf: "",
    gratuity: "",
    total_gross_salary: "",
    number_of_days_in_month: "",
    present_days: "",
    lwp: "",
    leave_adjustment: "",
    basic_pay_monthly: "",
    hra_monthly: "",
    statutory_bonus_monthly: "",
    special_allowance_monthly: "",
    total_gross_salary_monthly: "",
    provident_fund: "",
    professional_tax: "",
    advance: "",
    esic_employee: "",
    tds: "",
    total_deduction: "",
    net_pay: "",
    advance_esic_employer_cont: "",
  });
  // console.log("dj--->", formData);
  const [errors, setErrors] = useState({});

  const handleCreateClose = () => setOpenCreateModal(false);
  const steps = [
    "Employee Information",
    "Salary Breakdown",
    "Deductions & Net Pay",
  ];

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (currentStep === 0) {
      // if (!formData.name) newErrors.name = "Name is required";
    }
    if (currentStep === 1) {
      // if (!formData.email) newErrors.email = "Email is required";
      // if (!/^\S+@\S+\.\S+$/.test(formData.email))
      //   newErrors.email = "Email is invalid";
      // if (!formData.phone) newErrors.phone = "Phone is required";
      // if (!/^\d{10}$/.test(formData.phone))
      //   newErrors.phone = "Phone number is invalid";
    }
    if (currentStep === 2) {
      if (!formData.country) newErrors.country = "Country is required";
      if (!formData.role) newErrors.role = "Role is required";
    }
    return newErrors;
  };

  const handleNext = () => {
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setErrors(formErrors);
    }
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Update the formData dynamically
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await axios.post(
        `${API_URL}/api/edit-pf/${id}/${rowId}`,
        formDataToSend
      );
      const responseData = response.data; // Store response data safely

      console.log(response.data.Message); // Handle success response
      toast.success(response.data.Message, {
        position: "top-right",
        autoClose: 2000,
      });
      dispatch(fetchClientDetails(id));
      await fetchPfTotals(id);
      handleCreateClose();
      setFormData({
        employee_name: "",
        employee_code: "",
        uan: "",
        pf_number: "",
        pf_deducted: "",
        date_of_joining: "",
        status: "",
        gender: "",
        month: "",
        gross_ctc: "",
        basic_pay: "",
        hra: "",
        statutory_bonus: "",
        special_allowance: "",
        pf: "",
        gratuity: "",
        total_gross_salary: "",
        number_of_days_in_month: "",
        present_days: "",
        lwp: "",
        leave_adjustment: "",
        basic_pay_monthly: "",
        hra_monthly: "",
        statutory_bonus_monthly: "",
        special_allowance_monthly: "",
        total_gross_salary_monthly: "",
        provident_fund: "",
        professional_tax: "",
        advance: "",
        esic_employee: "",
        tds: "",
        total_deduction: "",
        net_pay: "",
        advance_esic_employer_cont: "",
      });
      if (responseData.month) {
        const parsedDate = parseMonthYear(responseData.month); // Ensure function handles errors
        console.log("Selected Month:", parsedDate);
        setSelectedMonth(parsedDate);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to update pf details. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const parseMonthYear = (monthYearString) => {
    const [month, year] = monthYearString.split(" "); // Split into ["May", "2021"]
    return new Date(`${year}-${month}-01`); // Convert to valid date (YYYY-MMM-DD)
  };

  const [selectedDate, setSelectedDate] = useState(null); //....
  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY
      setSelectedDate(date); // Keep original date for display
      setFormData({ ...formData, date_of_joining: formattedDate }); // Store in required format
      // setSelectedToDate(date); // Set selected date to to_date
      // setFormData({ ...formData, to_date: formattedDate }); // Store in required format
    }
  };

  const [selectedMonth, setSelectedMonth] = useState(null);

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
                              Employee Code :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {bankData.employee_code}
                            </div>
                          </div>
                          <div className="w-full flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className=""
                            >
                              Employee Name :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {bankData.employee_name}
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
                              UAN Number :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {bankData.uan}
                            </div>
                          </div>
                          <div className="w-full flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className=""
                              size="sm"
                            >
                              PF Number :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {bankData.pf_number}
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
                              {bankData.pf_deducted ? "Yes" : "NO"}
                            </div>
                          </div>
                          <div className="w-full flex gap-3 align-middle items-center">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className="mb-1"
                              size="sm"
                            >
                              Attachment :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {bankData.attachment}
                            </div>
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
          <Box sx={styleCreateMOdal} className="max-h-screen overflow-scroll">
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              className="text-center border-b-2 border-[#366FA1] pb-3"
            >
              Update PF Details
            </Typography>
            <IconButton
              size="sm"
              variant="text"
              className="!absolute right-3.5 top-3.5"
              onClick={handleCreateClose}
            >
              <XMarkIcon className="h-4 w-4 stroke-2" />
            </IconButton>
            <form className=" my-5 w-full" onSubmit={handleSubmit}>

              <div className="container mx-auto mt-10">
                <div className="w-full">
                  <div className="flex justify-between mb-4">
                    {steps.map((step, index) => (
                      <div
                        key={index}
                        className={`flex-1 border-b-4 pb-2 text-center ${index <= currentStep
                          ? "border-primary"
                          : "border-gray-200"
                          }`}
                      >
                        {step}
                      </div>
                    ))}
                  </div>

                  {/* Step 1 - Personal Info */}
                  {currentStep === 0 && (
                    <div>
                      <h2 className="text-lg font-bold mb-2">
                        Employee Information
                      </h2>
                      <div className="grid grid-cols-3 gap-5">
                        <div className="col-span-1">
                          <label htmlFor="employee_code">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Employee Code
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="text"
                              size="lg"
                              name="employee_code"
                              placeholder="Employee Code"
                              value={formData.employee_code}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="employee_name">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Employee Name
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="text"
                              size="lg"
                              name="employee_name"
                              placeholder=" Employee Name"
                              value={formData.employee_name}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="uan">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              UAN Number
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="text"
                              size="lg"
                              name="uan"
                              placeholder="UAN Number"
                              value={formData.uan}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="pf_number">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              PF Number
                            </Typography>
                          </label>

                          <div className="">
                            <Input

                              size="lg"
                              name="pf_number"
                              placeholder="PF Number"
                              value={formData.pf_number}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="pf_deducted">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              PF Deducted
                            </Typography>
                          </label>

                          <div className="">
                            <Select
                              label="Select status"
                              name="pf_deducted"
                              size="lg"

                              animate={{
                                mount: { y: 0 },
                                unmount: { y: 25 },
                              }}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-[100px]" }}
                              value={formData.pf_deducted} // Controlled component value
                              onChange={(selectedValue) =>
                                handleInputChange({
                                  target: {
                                    name: "pf_deducted",
                                    value: selectedValue,
                                  },
                                })
                              } // Pass selected value directly
                            >
                              {/* <Option value="" disabled>
                                Please select a PF Deducted
                              </Option> */}
                              <Option value="true">Yes</Option>
                              <Option value="false">No</Option>
                            </Select>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="date_of_joining">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Date Of Joining
                            </Typography>
                          </label>

                          <div className="">
                            {/* <Input
                              type="date"
                              size="lg"
                              name="date_of_joining"
                              placeholder="Date Of Joining "
                              value={formData.date_of_joining}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            /> */}
                            <div className="relative w-full">
                              <DatePicker
                                selected={selectedDate}
                                // onChange={(date) => setSelectedDate(date)}
                                onChange={handleDateChange}
                                dateFormat="dd/MM/yyyy"
                                className="w-full !border !border-[#cecece] bg-white py-2 pl-3 pr-10 text-gray-900 w-[385px] focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md outline-none"
                                //  className="!border !border-[#cecece] bg-white pt-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                                placeholderText="dd/mm/yyyy"
                                value={formData.date_of_joining}
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={25}

                              />
                              <FaRegCalendarAlt
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                                onClick={() => document.querySelector(".react-datepicker__input-container input").focus()}
                              // onClick={() => toDateRef.current.setFocus()} // Focus the correct DatePicker
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="status">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Status
                            </Typography>
                          </label>

                          <div className="">
                            <Select
                              label="Select status"
                              name="status"
                              size="lg"

                              animate={{
                                mount: { y: 0 },
                                unmount: { y: 25 },
                              }}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-[100px]" }}
                              value={formData.status} // Controlled component value
                              onChange={(selectedValue) =>
                                handleInputChange({
                                  target: {
                                    name: "status",
                                    value: selectedValue,
                                  },
                                })
                              } // Pass selected value directly
                            >
                              {/* <Option value="" disabled>
                                Please select a PF Deducted
                              </Option> */}
                              <Option value="active">Active</Option>
                              <Option value="inactive">InActive</Option>
                            </Select>
                          </div>
                        </div>

                        <div className="col-span-1">
                          <label htmlFor="gender">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Gender
                            </Typography>
                          </label>

                          <div className="">
                            <Select
                              label="Select status"
                              name="gender"
                              size="lg"
                              animate={{
                                mount: { y: 0 },
                                unmount: { y: 25 },
                              }}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-[100px]" }}
                              value={formData.gender} // Controlled component value
                              onChange={(selectedValue) =>
                                handleInputChange({
                                  target: {
                                    name: "gender",
                                    value: selectedValue,
                                  },
                                })
                              } // Pass selected value directly
                            >
                              <Option value="male">Male</Option>
                              <Option value="female">Female</Option>
                            </Select>
                          </div>
                        </div>
                      </div>
                      {/* <div className="mt-4">
                        <label className="block mb-1">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full p-2 border ${
                            errors.name ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.name && (
                          <p className="text-red-500">{errors.name}</p>
                        )}
                      </div> */}
                      <div className="flex justify-between mt-4">
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-300 rounded"
                          disabled
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-4 py-2 bg-primary text-white rounded"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2 - Contact Info */}
                  {currentStep === 1 && (
                    <div>
                      <h2 className="text-lg font-bold mb-2">
                        Salary Breakdown
                      </h2>
                      <div className="grid grid-cols-3 gap-5">
                        <div className="col-span-1">
                          <label htmlFor="month">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Month
                            </Typography>
                          </label>

                          {/* <div className="">
                            <Input
                              type="date"
                              size="lg"
                              name="month"
                              placeholder="Month"
                              value={formData.month}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div> */}
                          {isEditingMonth ? (
                            <DatePicker
                              selected={selectedMonth}
                              onChange={handleMonthChange}
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

                        <div className="col-span-1">
                          <label htmlFor="gross_ctc">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Gross Ctc
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="text"
                              size="lg"
                              name="gross_ctc"
                              placeholder=" Gross Ctc "
                              value={formData.gross_ctc}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="basic_pay">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Basic Pay
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="text"
                              size="lg"
                              name="basic_pay"
                              placeholder="Basic Pay"
                              value={formData.basic_pay}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="hra">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              HRA
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="hra"
                              placeholder="HRA"
                              value={formData.hra}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="statutory_bonus">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Statutory Bonus
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="statutory_bonus"
                              placeholder="Statutory Bonus "
                              value={formData.statutory_bonus}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="special_allowance">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Special Allowance
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="special_allowance"
                              placeholder="Special Allowance"
                              value={formData.special_allowance}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="pf">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              PF
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="pf"
                              placeholder="PF"
                              value={formData.pf}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="gratuity">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Gratuity
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="gratuity"
                              placeholder="Gratuity "
                              value={formData.gratuity}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="total_gross_salary">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Total Gross Salary
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="text"
                              size="lg"
                              name="total_gross_salary"
                              placeholder="Total Gross Salary"
                              value={formData.total_gross_salary}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="number_of_days_in_month">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Number of Days In Month
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="text"
                              size="lg"
                              name="number_of_days_in_month"
                              placeholder="Number of Days In Month"
                              value={formData.number_of_days_in_month}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="present_days">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Present Days
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="present_days"
                              placeholder="Present Days"
                              value={formData.present_days}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="lwp">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              LWP
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="lwp"
                              placeholder="LWP"
                              value={formData.lwp}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="leave_adjustment">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Leave Adjustment
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="leave_adjustment"
                              placeholder="Leave Adjustment"
                              value={formData.leave_adjustment}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* <div className="mt-4">
                        <label className="block mb-1">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full p-2 border ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-red-500">{errors.phone}</p>
                        )}
                      </div> */}
                      <div className="flex justify-between mt-4">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="px-4 py-2 bg-gray-300 rounded"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-4 py-2 bg-primary text-white rounded"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3 - Preferences */}
                  {currentStep === 2 && (
                    <div>
                      <h2 className="text-lg font-bold mb-2">
                        Deductions & Net Pay
                      </h2>
                      <div className="grid grid-cols-3 gap-5">
                        <div className="col-span-1">
                          <label htmlFor="basic_pay_monthly">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Basic Pay Monthly
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="basic_pay_monthly"
                              placeholder="Basic pay Monthly"
                              value={formData.basic_pay_monthly}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="hra_monthly">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              HRA Monthly
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="hra_monthly"
                              placeholder="HRA Monthly "
                              value={formData.hra_monthly}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="statutory_bonus_monthly">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Statutory Bonus Monthly
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="statutory_bonus_monthly"
                              placeholder="Statutory Bonus Monthly"
                              value={formData.statutory_bonus_monthly}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="special_allowance_monthly">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Special Allowance Monthly
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="text"
                              size="lg"
                              name="special_allowance_monthly"
                              placeholder="Special Allowance Monthly"
                              value={formData.special_allowance_monthly}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="total_gross_salary_monthly">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Total Gross Salary Monthly
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="total_gross_salary_monthly"
                              placeholder="Total Gross Salary Monthly"
                              value={formData.total_gross_salary_monthly}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="provident_fund ">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Provident Fund
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="provident_fund"
                              placeholder="Provident Fund"
                              value={formData.provident_fund}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="professional_tax">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Professional Tax
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="professional_tax"
                              placeholder="Professional Tax"
                              value={formData.professional_tax}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="advance">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              advance
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="text"
                              size="lg"
                              name="advance"
                              placeholder="Advance"
                              value={formData.advance}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="esic_employee">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Esic Employee
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="esic_employee"
                              placeholder="Esic Employee"
                              value={formData.esic_employee}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="tds">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              TDS
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="tds"
                              placeholder="TDS"
                              value={formData.tds}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="total_deduction">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Total Deduction
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="total_deduction"
                              placeholder="Total Deduction"
                              value={formData.total_deduction}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="net_pay">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Net Pay
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="net_pay"
                              placeholder="Net Pay"
                              value={formData.net_pay}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="advance_esic_employer_cont">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Advance Esic Employer Cont
                            </Typography>
                          </label>

                          <div className="">
                            <Input
                              type="number"
                              size="lg"
                              name="advance_esic_employer_cont"
                              placeholder="Advance Esic Employer Cont"
                              value={formData.advance_esic_employer_cont}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-4">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="px-4 py-2 bg-gray-300 rounded"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-500 text-white rounded"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* <DialogFooter>
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
                    color="green"
                  onClick={handleCreateClose}
                  className="bg-primary"
                >
                  <span>Confirm</span>
                </Button>
              </DialogFooter> */}
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
          {/* <MenuItem onClick={handleViewOpen}>View</MenuItem> */}
          <MenuItem onClick={handleCreateOpen}>Update</MenuItem>
          <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
        </Menu>
      </div>
    </>
  );
}
