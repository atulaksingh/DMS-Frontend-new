import { Button, DialogFooter, Select, Checkbox, Option } from "@material-tailwind/react";
import React from "react";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import { Input, Typography } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { fetchClientDetails } from "../../../Redux/clientSlice";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRef } from "react";
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
function AckCreation({ fetchAckDetails }) {
    const { id } = useParams();
    // console.log("ddddddddddddd",id)
    const [openCreateModal, setOpenCreateModal] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null); //....
    const [selectedToDate, setSelectedToDate] = useState(null); //....
    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);
    const dispatch = useDispatch(); // To dispatch actions for fetching client details
    const open = Boolean(anchorEl);
    const handleCreateOpen = () => {
        setOpenCreateModal(true);
        setAnchorEl(null);
    };

    const handleCreateClose = () => setOpenCreateModal(false);
    const [formData, setFormData] = useState({
        return_type: "",
        frequency: "",
        return_period: "",
        from_date: "",
        to_date: "",
        client_review: "",
        remarks: "",
        month: "",
        return_file: [],
        computation_file: [],
    });

    const [ackErrors, setAckErrors] = useState({})

    const returnFormRules = {
        return_type: [
            { test: (v) => v.length > 0, message: "Return type is required" },
        ],
        frequency: [
            { test: (v) => v.length > 0, message: "Frequency is required" },
            // { test: (v) => ["monthly", "quarterly", "Half Yearly", "yearly"].includes(v.toLowerCase()), message: "Frequency must be Monthly, Quarterly or Yearly" },
        ],
        return_period: [
            { test: (v) => v.length > 0, message: "Return period is required" },
        ],
        from_date: [
            { test: (v) => v.length > 0, message: "From date is required" },
            {
                test: (v) => /^\d{2}[-/]\d{2}[-/]\d{4}$/.test(v),
                message: "From date must be in dd/mm/yyyy or dd-mm-yyyy format",
            },
        ],
        to_date: [
            { test: (v) => v.length > 0, message: "To date is required" },
            {
                test: (v) => /^\d{2}[-/]\d{2}[-/]\d{4}$/.test(v),
                message: "To date must be in dd/mm/yyyy or dd-mm-yyyy format",
            },
            {
                test: (v, allValues) => {
                    if (!allValues.from_date || !v) return true;
                    const [fd, fm, fy] = allValues.from_date.split(/[-/]/).map(Number);
                    const [td, tm, ty] = v.split(/[-/]/).map(Number);
                    const fromDate = new Date(fy, fm - 1, fd);
                    const toDate = new Date(ty, tm - 1, td);
                    return toDate >= fromDate;
                },
                message: "To date cannot be earlier than From date",
            },
        ],
        client_review: [
            { test: (v) => v.length > 0, message: "Client review is required" },
        ],
        remarks: [
            { test: (v) => !v || v.length <= 200, message: "Remarks cannot exceed 200 characters" },
        ],
        month: [
            { test: (v) => v.length > 0, message: "Month is required" },
            // { test: (v) => /^(0?[1-9]|1[0-2])$/.test(v), message: "Month must be between 1 and 12" },
        ],
        computation_file: [
            { test: (v) => v && v.length > 0, message: "Computation file is required" },
            // {
            //     test: (v) =>
            //         v.every(
            //             (f) =>
            //                 f.type === "application/pdf" ||
            //                 f.type.startsWith("image/") ||
            //                 f.type === "application/vnd.ms-excel" ||
            //                 f.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            //                 f.type === "text/plain"
            //         ),
            //     message: "Computation file must be PDF, Image, Excel or TXT",
            // },
        ],
    };

    const validateReturnField = (name, value, allValues = {}) => {
        const rules = returnFormRules[name];
        if (!rules) return "";
        for (let rule of rules) {
            if (!rule.test(value, allValues)) return rule.message;
        }
        return "";
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            return_file: Array.from(e.target.files), // Convert FileList to array
        }));
    };

    const handleFilesChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            computation_file: Array.from(e.target.files), // Convert FileList to array
        }));
    }

    const [attachment, setAttachment] = useState(null); // State for file input

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleInputChangemonth = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        const errorMsg = validateReturnField(name, value);
        setAckErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    useEffect(() => {
        if (formData.from_date && formData.to_date) {
            const fromDate = new Date(
                formData.from_date.split("-").reverse().join("-")
            ); // "30-04-2024" → "2024-04-30"
            const toDate = new Date(
                formData.to_date.split("-").reverse().join("-")
            );

            const formattedReturnPeriod = `${format(fromDate, "MMMM yyyy")} - ${format(toDate, "MMMM yyyy")}`;

            setFormData((prev) => ({
                ...prev,
                return_period: formattedReturnPeriod,
            }));
        }
    }, [formData.from_date, formData.to_date]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        const newErrors = {};
        Object.entries(formData).forEach(([key, value]) => {
            const errorMsg = validateReturnField(key, value);
            if (errorMsg) {
                newErrors[key] = errorMsg;
            }
        });

        setAckErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            const firstErrorField = Object.keys(newErrors)[0];
            toast.error(newErrors[firstErrorField], {
                position: "top-right",
                autoClose: 2000,
            });
            return; // ❌ Stop submit
        }

        if (!formData.computation_file || formData.computation_file.length === 0) {
            toast.error("Please upload at least one file of Computation before submitting.", {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }


        try {
            // Create a FormData object
            const formDataToSend = new FormData();

            // Append text fields to FormData
            formDataToSend.append("return_type", formData.return_type);
            formDataToSend.append("frequency", formData.frequency);
            formDataToSend.append("return_period", formData.return_period);
            formDataToSend.append("from_date", formData.from_date);
            formDataToSend.append("to_date", formData.to_date);
            formDataToSend.append("computation", formData.computation);
            formDataToSend.append("client_review", formData.client_review);
            formDataToSend.append("remarks", formData.remarks);
            formDataToSend.append("month", formData.month);


            // Append multiple files if selected
            for (let i = 0; i < formData.return_file?.length; i++) {
                formDataToSend.append("return_file", formData.return_file[i]);
            }

            for (let i = 0; i < formData.computation_file?.length; i++) {
                formDataToSend.append("computation_file", formData.computation_file[i]);
            }

            // Make a POST request to your API
            const response = await axiosInstance.post(
                `${API_URL}/api/create-acknowledgement/${id}`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("acknowledgement", response)
            // Check if the response indicates success
            if (response.status === 200 || response.status === 201) {
                toast.success(`${response.data.message}`, {
                    position: "top-right",
                    autoClose: 2000,
                });

                fetchAckDetails();

                // Optionally close the modal and reset form
                handleCreateClose();
                setFormData({
                    return_type: "",
                    frequency: "",
                    return_period: "",
                    from_date: "",
                    to_date: "",
                    computation: "",
                    client_review: "",
                    remarks: "",
                    month: "",
                    // files: [],
                });
                setAttachment(null); // Clear the file input
                setSelectedMonth(null);
                setSelectedYear(null);
                setSelectedDate(null); // Clear the selected date
                setSelectedToDate(null); // Clear the selected date
            } else {
                // If response doesn't indicate success, show error toast
                toast.error("Failed to create bank details. Please check your input.", {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        } catch (error) {

            console.error("Error submitting data:", error);
            toast.error("Failed to create bank details. Please try again.", {
                position: "top-right",
                autoClose: 2000,
            });
        }
        console.log("Files being sent:", formData.return_file);
        console.log("computation_files being sent:", formData.computation_file);

    };

    const handleDateChange = (date) => {
        if (date instanceof Date && !isNaN(date)) {
            const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY
            setSelectedDate(date); // Keep original date for display
            setFormData({ ...formData, from_date: formattedDate }); // Store in required format
        }
    };

    const handleToDateChange = (date) => {
        if (date instanceof Date && !isNaN(date)) {
            const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY
            // setSelectedDate(date); // Keep original date for display
            // setFormData({ ...formData, from_date: formattedDate }); // Store in required format
            setSelectedToDate(date); // Set selected date to to_date
            setFormData({ ...formData, to_date: formattedDate }); // Store in required format
        }
    };

    return (
        <>
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
                            Create Acknowledgement Details
                        </Typography>
                        <form className=" my-5 w-full " onSubmit={handleSubmit}>
                            <div>
                                <div className="grid grid-cols-6 gap-4">
                                    <div className="col-span-2">
                                        <label htmlFor="return_type">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="block font-semibold mb-2"
                                            >
                                                Return Type
                                            </Typography>
                                        </label>

                                        <div className="">
                                            <Select
                                                label="return_type"
                                                name="return_type"
                                                aria-required
                                                size="lg"
                                                placeholder="Select Return Type"
                                                value={formData.return_type}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        return_type: e,
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
                                                <Option value="gstr_1">GSTR 1</Option>
                                                <Option value="gstr_3b">GSTR 3B</Option>
                                                <Option value="gstr_4">GSTR 4</Option>
                                                <Option value="gstr_5">GSTR 5</Option>
                                                <Option value="gstr_5a">GSTR 5A</Option>
                                                <Option value="gstr">GSTR</Option>
                                                <Option value="gstr_7">GSTR 7</Option>
                                                <Option value="gstr_8">GSTR 8</Option>
                                                <Option value="gstr_9">GSTR 9</Option>
                                                <Option value="gstr_10">GSTR 10</Option>
                                                <Option value="gstr_11">GSTR 11</Option>
                                                <Option value="cmp_8">CMP 8</Option>
                                                <Option value="itc_04">ITC 04</Option>
                                                <Option value="income_tax">Income Tax</Option>
                                                <Option value="tax_audit">Tax Audit</Option>
                                                <Option value="air">AIR</Option>
                                                <Option value="sft">SFT</Option>
                                                <Option value="tds_return">TDS Return</Option>
                                                <Option value="tds_payment">TDS Payment</Option>
                                                <Option value="pf">PF</Option>
                                                <Option value="esic">ESIC</Option>
                                                <Option value="gst_notice">GST Notice</Option>
                                                <Option value="income_tax_notice">Income Tax Notice</Option>
                                            </Select>
                                        </div>

                                    </div>

                                    <div className="col-span-2">
                                        <label htmlFor="frequency">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="block font-semibold mb-2"
                                            >
                                                Frequency
                                            </Typography>
                                        </label>

                                        <div className="">
                                            <Select
                                                label="frequency"
                                                name="frequency"
                                                size="lg"
                                                required
                                                value={formData.frequency}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        frequency: e,
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
                                                <Option value="monthly">Monthly</Option>
                                                <Option value="quarterly">Quarterly</Option>
                                                <Option value="half_yearly">Half Yearly</Option>
                                                <Option value="yearly">Yearly</Option>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label htmlFor="from_date">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="block font-semibold mb-2"
                                            >
                                                From Date
                                            </Typography>
                                        </label>

                                        <div className="relative w-full">
                                            <DatePicker
                                                ref={fromDateRef}
                                                required
                                                selected={selectedDate}
                                                // onChange={(date) => setSelectedDate(date)}
                                                onChange={handleDateChange}
                                                dateFormat="dd/MM/yyyy"
                                                className="w-full !border !border-[#cecece] bg-white py-2 pl-3 pr-10 text-gray-900 
                                                focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md 
                                                outline-none"
                                                //  className="!border !border-[#cecece] bg-white pt-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                                                placeholderText="dd/mm/yyyy"
                                                showYearDropdown
                                                scrollableYearDropdown
                                                yearDropdownItemNumber={25}

                                            />
                                            <FaRegCalendarAlt
                                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                                                onClick={() => fromDateRef.current.setFocus()} // Focus the correct DatePicker
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label htmlFor="to_date">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="block font-semibold mb-2"
                                            >
                                                To Date
                                            </Typography>
                                        </label>
                                        <div className="relative w-full">
                                            <DatePicker
                                                ref={toDateRef}
                                                required
                                                selected={selectedToDate}
                                                // onChange={(date) => setSelectedDate(date)}
                                                onChange={handleToDateChange}
                                                dateFormat="dd/MM/yyyy"
                                                className="w-full !border !border-[#cecece] bg-white py-2 pl-3 pr-10 text-gray-900 
                                                focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md 
                                                outline-none"
                                                //  className="!border !border-[#cecece] bg-white pt-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                                                placeholderText="dd/mm/yyyy"
                                                showYearDropdown
                                                scrollableYearDropdown
                                                yearDropdownItemNumber={25}

                                            />
                                            <FaRegCalendarAlt
                                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                                                onClick={() => toDateRef.current.setFocus()} // Focus the correct DatePicker
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label htmlFor="return_period">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="block font-semibold mb-2"
                                            >
                                                Return Period
                                            </Typography>
                                        </label>

                                        <div className="">
                                            <Input
                                                type="text"
                                                size="lg"
                                                name="return_period"
                                                required
                                                placeholder="Return Period"
                                                value={formData.return_period} // This will auto-fill after date selection\
                                                // onChange={(e) => setFormData({ ...formData, return_period: e.target.value })}
                                                className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent 
                                                    placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] 
                                                    focus:!border-t-[#366FA1]"
                                                labelProps={{
                                                    className: "hidden",
                                                }}
                                                readOnly // Make it read-only
                                                containerProps={{ className: "min-w-full" }}
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="border-t-2 my-3 border-[#366FA1]"> */}
                                    <div className="col-span-2 mb-2">
                                        <label htmlFor="month">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="block font-semibold mb-2"
                                            >
                                                Month
                                            </Typography>
                                        </label>

                                        <div className="">
                                            <DatePicker
                                                selected={selectedMonth}
                                                onChange={(date) => {
                                                    setSelectedMonth(date);
                                                    handleInputChangemonth("month", format(date, "MMMM yyyy"));
                                                }}
                                                showMonthYearPicker
                                                required
                                                dateFormat="MMMM YYYY"
                                                className="w-full !border !border-[#cecece] bg-white py-2 pl-3 pr-10 text-gray-900 
                                                focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md 
                                                outline-none"
                                                // className="w-full px-3 py-2 border border-[#cecece] bg-white py-1 text-gray-900 focus:border-[#366FA1]"
                                                placeholderText="Select Month"

                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="border-t-2 my-2 borderColor-divider w-[680px]">
                                        <div className="grid gap-x-5">
                                            <div className="flex gap-4 items-center">
                                                {/* Client Review Dropdown */}
                                                <div className="w-[250px] mb-2">
                                                    <label htmlFor="client_review">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="block font-semibold mb-2 mt-2"
                                                        >
                                                            Client Review
                                                        </Typography>
                                                    </label>
                                                    <Select
                                                        label="client_review"
                                                        name="client_review"
                                                        size="lg"
                                                        required
                                                        value={formData.client_review}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                client_review: e,
                                                                remarks: e === "remark" ? prev.remarks : "", // Clear remarks if not "remark"
                                                            }))
                                                        }
                                                        animate={{
                                                            mount: { y: 0 },
                                                            unmount: { y: 25 },
                                                        }}
                                                        className="!border !border-[#cecece] bg-white pt-1 text-gray-900 ring-4 ring-transparent 
                                                                            placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] 
                                                                            focus:!border-t-[#366FA1] w-full"
                                                        labelProps={{
                                                            className: "hidden",
                                                        }}
                                                        containerProps={{ className: "min-w-[150px]" }}
                                                    >
                                                        <Option value="accept">Accept</Option>
                                                        <Option value="to_be_modified">To Be Modified</Option>
                                                        <Option value="remark">Remark</Option>
                                                    </Select>
                                                </div>

                                                {/* Show remarks input only when "Remark" is selected */}
                                                {formData.client_review === "remark" && (
                                                    <div className="flex-1">
                                                        <label htmlFor="remarks">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="block font-semibold mb-2 "
                                                            >
                                                                Remarks
                                                            </Typography>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="remarks"
                                                            value={formData.remarks}
                                                            onChange={(e) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    remarks: e.target.value,
                                                                }))
                                                            }
                                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Enter your remarks..."
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t-2 my-2 borderColor-divider w-[680px] ">
                                        <div className="grid gap-x-5">
                                            <div className="flex gap-4 items-center">
                                                <div className="col-span-4">
                                                    <label htmlFor="computation_file">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="block font-semibold mb-2 mt-2"
                                                        >
                                                            Computation
                                                        </Typography>
                                                    </label>

                                                    <div className="">
                                                        <input
                                                            type="file"
                                                            name="computation_file"
                                                            required
                                                            onChange={handleFilesChange}
                                                            multiple
                                                            className="file-input file-input-bordered file-input-success w-full max-w-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-span-4">
                                                    <label htmlFor="return_file">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="block font-semibold mt-2 mb-2"
                                                        >
                                                            Return File
                                                        </Typography>
                                                    </label>

                                                    <div className="">
                                                        <input
                                                            type="file"
                                                            name="return_file"
                                                            onChange={handleFileChange}
                                                            // required
                                                            multiple
                                                            className="file-input file-input-bordered file-input-success w-full max-w-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
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

export default AckCreation;
