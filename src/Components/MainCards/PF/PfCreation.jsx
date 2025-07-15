import React, { useState } from "react";
import {
  Button,
  DialogFooter,
  IconButton,
  Option,
  Select,
} from "@material-tailwind/react";
import { Input, Typography } from "@material-tailwind/react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { fetchClientDetails } from "../../Redux/clientSlice";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRef } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import "./App.css";
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
const PfCreation = ({ fetchPfTotals }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

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
  const handleCreateOpen = () => {
    setOpenCreateModal(true);
    setAnchorEl(null);
  };
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleMonthInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const formDataToSend = new FormData();

      // Append all fields from formData to FormData
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      // Make the API call
      const response = await axios.post(
        `http://127.0.0.1:8000/api/create-pf/${id}`,
        formDataToSend
      );
      console.log(response.data); // Handle success response

      // Check if the response is successful
      if (response.status === 200 || response.status === 201) {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });


        // Dispatch and reset form only on success
        dispatch(fetchClientDetails(id));
        await fetchPfTotals((id));
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
        setSelectedDate(null);
        setSelectedMonth(null);
      }
    } catch (error) {
      // Show error toast if the API call fails
      toast.error(
        error.response?.data?.message || "Failed to create PF details. Please try again.",
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
      console.error("Error submitting data:", error.response?.data || error.message);
    }
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
          <Box sx={styleCreateMOdal} className="items-center max-h-screen overflow-scroll">
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              className="text-center border-b-2 border-[#366FA1] pb-3"
            >
              Create PF Details
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
              {/* <div>
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
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
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
                        onChange={handleFileChange}
                        className="file-input file-input-bordered file-input-success w-full max-w-sm"
                      />
                    </div>
                  </div>
                </div>
              </div> */}
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
                              type="number"
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
                              type="number"
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
                              type="number"
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
                              <Option value="" disabled>
                                Please select a PF Deducted
                              </Option>
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
                            <div className="relative w-full ">
                              <DatePicker
                                selected={selectedDate}
                                // onChange={(date) => setSelectedDate(date)}
                                onChange={handleDateChange}
                                dateFormat="dd/MM/yyyy"
                                className="w-full !border !border-[#cecece] bg-white py-2 pl-3 pr-10 w-[385px] text-gray-900 focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md outline-none"
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

                          {/* <div className="">
                            <Select
                              label="Select status"
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
                              value={formData.status || "ss"}
                              onChange={(selectedValue) =>
                                handleInputChange({
                                  target: {
                                    name: "status",
                                    value: selectedValue,
                                  },
                                })
                              }
                            >
                              <Option value="" disabled selected hidden>
                                Please select a status
                              </Option>
                              <Option value="active">Active</Option>
                              <Option value="inactive">InActive</Option>
                            </Select>
                          </div> */}
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
                              <Option value="" disabled>
                                Please select a status
                              </Option>
                              <Option value="active">Active</Option>
                              <Option value="inactive">Inactive</Option>
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

                          {/* <div className="">
                            <Input
                              type="text"
                              size="lg"
                              name="gender"
                              placeholder="Gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                              labelProps={{
                                className: "hidden",
                              }}
                              containerProps={{ className: "min-w-full" }}
                            />
                          </div> */}
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
                              <Option value="" disabled>
                                Please select a Gender
                              </Option>
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
                          {/* <label htmlFor="month">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="block font-semibold mb-2"
                            >
                              Month
                            </Typography>
                          </label> */}

                          {/* <div className="">
                            <Input
                              type="text"
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
                          <div className="col-span-2">
                            <Typography
                              variant="small"
                              className="block font-semibold mb-1"
                            >
                              Month
                            </Typography>
                            <DatePicker
                              selected={selectedMonth}
                              onChange={(date) => {
                                setSelectedMonth(date);
                                handleMonthInputChange("month", format(date, "MMMM yyyy"));
                              }}
                              showMonthYearPicker
                              dateFormat="MMMM YYYY"
                              className="w-full px-3 py-2 border border-[#cecece] bg-white py-1 text-gray-900 focus:border-[#366FA1]"
                              placeholderText="Select Month"
                            />
                          </div>
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
                              type="number"
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
                              type="number"
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
                              type="number"
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
                              type="number"
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
                              type="number"
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
                              type="number"
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
};

export default PfCreation;
