import * as React from "react";
import { Button, DialogFooter, Select, Checkbox, Option } from "@material-tailwind/react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import { Input, Typography } from "@material-tailwind/react";
// import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
// import { DialogFooter, Button } from "@material-tailwind/react";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import { FaFileAlt } from "react-icons/fa";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
// import { fetchClientDetails } from "../../../Redux/clientSlice";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRef } from "react";
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

export default function AckCard({ rowId, fetchAckDetails, setTabIndex }) {
    const { id } = useParams();
    const role = getUserRole();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openViewModal, setOpenViewModal] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [openCreateModal, setOpenCreateModal] = React.useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
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
            { test: (v) => !v || v.length <= 500, message: "Remarks cannot exceed 500 characters" },
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "from_date") {
            // Convert input date (YYYY-MM-DD) to DD/MM/YYYY format for display
            const [year, month, day] = value.split("-");
            const formattedDate = `${day}/${month}/${year}`;

            setFormData((prev) => ({
                ...prev,
                [name]: value, // Keep the YYYY-MM-DD format for input field
                formatted_from_date: formattedDate, // Store formatted date separately for display
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    const handleInputChangemonth = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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

    const handleFilesChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            computation_file: Array.from(e.target.files), // Convert FileList to an array
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            return_file: Array.from(e.target.files), // Convert FileList to an array
        }));
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
        e.preventDefault(); // Prevent default form submission

        let hasError = false;
        for (let [field, value] of Object.entries(formData)) {
            const errorMsg = validateReturnField(field, value);
            if (errorMsg) {
                toast.error(errorMsg);
                hasError = true;
                break; // stop at first error
            }
        }

        if (hasError) return; // ❌ Stop submit if validation failed


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
            formDataToSend.append("month", formData.month || ""); // Ensure month is included

            if (formData.computation_file && formData.computation_file.length > 0) {
                formData.computation_file.forEach((file) => {
                    formDataToSend.append("computation_file", file);
                });
            }

            if (formData.return_file && formData.return_file.length > 0) {
                formData.return_file.forEach((file) => {
                    formDataToSend.append("return_file", file);
                });
            }

            const response = await axiosInstance.post(
                `${API_URL}/api/edit-acknowledgement/${id}/${rowId}`,
                formDataToSend,
                // foDataToSend,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            console.log("API Response:", response.data);

            if (response.status === 200 || response.status === 201) {
                toast.success(`${response.data.message}`, {
                    position: "top-right",
                    autoClose: 2000,
                });

                fetchAckDetails();

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
                setSelectedMonth(null);
                setSelectedYear(null);

            } else {
                // Show error toast if response indicates failure
                toast.error(
                    response.data.message || "Failed to update Acknowledgement details. Please try again.",
                    {
                        position: "top-right",
                        autoClose: 2000,
                    }
                );
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "An unexpected error occurred. Please try again.",
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
    const handleDeleteOpen = () => {
        setDeleteId(rowId);
        setOpenDeleteModal(true);
        setAnchorEl(null);
    };

    const handleDeleteID = async () => {
        try {
            const response = await axiosInstance.delete(
                `${API_URL}/api/delete-acknowledgement/${id}/${deleteId}`
            );

            setOpenDeleteModal(false);

            if (response.status === 200 || response.status === 201) {
                toast.success(`${response.data.message}`, {
                    position: "top-right",
                    autoClose: 2000,
                });

                // ✅ re-fetch all acknowledgement data
                await fetchAckDetails();

                // ✅ reset selected tab index (if needed)
                setTabIndex(0); // <-- Add this in the parent (Ack.jsx)
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
        const fetchAckDetails = async () => {
            try {
                const response = await axiosInstance.get(
                    `${API_URL}/api/single-acknowledgement/${id}/${rowId}`
                );
                setAcknowledgementData(response.data);
                console.log("Acknowledgement Data:", response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        fetchAckDetails();
    };

    const handleDeleteClose = () => setOpenDeleteModal(false);
    const handleViewClose = () => setOpenViewModal(false);

    const handleCreateOpen = async () => {
        setOpenCreateModal(true);
        setAnchorEl(null);

        try {
            const response = await axiosInstance.get(
                `${API_URL}/api/edit-acknowledgement/${id}/${rowId}`
            );
            setFormData(response.data);
            console.log("Edit Acknowledgement Data:", response.data);
        } catch (error) {
            console.error("Error fetching acknowledgement data:", error);
            toast.error("Failed to load data. Please try again.", { autoClose: 2000 });
        }
    };

    const downloadComputationFile = async () => {
        try {
            // First get the list of file URLs from your API (assumed JSON array of objects with 'file' key)
            const response = await axiosInstance.get(
                `${API_URL}/api/download-computation-file/${id}/${rowId}`
            );

            const files = response.data;

            if (!files || files.length === 0) {
                alert("No computation files found!");
                return;
            }

            // Loop through files and download each one as a blob
            for (let i = 0; i < files.length; i++) {
                const fileObj = files[i];
                const filePath = fileObj.file; // e.g., "/media/uploads/example.pdf"
                const fileUrl = `${API_URL}${filePath}`;

                // Fetch the file as a blob
                const fileResponse = await axiosInstance.get(fileUrl, {
                    responseType: "blob",
                });

                // Create a blob URL
                const url = window.URL.createObjectURL(new Blob([fileResponse.data]));

                // Create a temporary anchor tag to trigger download
                const anchor = document.createElement("a");
                anchor.href = url;

                // Extract filename from filePath
                const filename = filePath.split("/").pop();

                anchor.setAttribute("download", filename);
                document.body.appendChild(anchor);
                anchor.click();

                // Clean up
                anchor.remove();
                window.URL.revokeObjectURL(url);

                // Optional delay between downloads (500ms here)
                await new Promise((resolve) => setTimeout(resolve, 500));
            }
        } catch (error) {
            console.error("Error downloading files:", error);
            alert("Failed to download the files. Please try again.");
        }
    };

    const downloadReturnFile = async () => {
        try {
            // First get the list of file URLs from your API (assumed JSON array of objects with 'file' key)
            const response = await axiosInstance.get(
                `${API_URL}/api/download-return-file/${id}/${rowId}`
            );

            const files = response.data;

            if (!files || files.length === 0) {
                alert("No return files found!");
                return;
            }

            // Loop through files and download each one as a blob
            for (let i = 0; i < files.length; i++) {
                const fileObj = files[i];
                const filePath = fileObj.file; // e.g., "/media/uploads/example.pdf"
                const fileUrl = `${API_URL}${filePath}`;

                // Fetch the file as a blob
                const fileResponse = await axiosInstance.get(fileUrl, {
                    responseType: "blob",
                });

                // Create a blob URL
                const url = window.URL.createObjectURL(new Blob([fileResponse.data]));

                // Create a temporary anchor tag to trigger download
                const anchor = document.createElement("a");
                anchor.href = url;

                // Extract filename from filePath
                const filename = filePath.split("/").pop();

                anchor.setAttribute("download", filename);
                document.body.appendChild(anchor);
                anchor.click();

                // Clean up
                anchor.remove();
                window.URL.revokeObjectURL(url);

                // Optional delay between downloads (500ms here)
                await new Promise((resolve) => setTimeout(resolve, 500));
            }
        } catch (error) {
            console.error("Error downloading files:", error);
            alert("Failed to download the files. Please try again.");
        }
    };

    const handleCreateClose = () => setOpenCreateModal(false);
    const [acknowledgementData, setAcknowledgementData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (formData.month) {
            const parsedDate = new Date();
            parsedDate.setMonth(new Date(Date.parse(formData.month + " 1, 2022")).getMonth());
            setSelectedMonth(parsedDate);
        }
    }, [formData.month]);

    const shortenFilename = (filename, maxLength = 20) => {
        if (filename.length <= maxLength) {
            return filename;
        }
        const extension = filename.split('.').pop();
        const baseName = filename.slice(0, maxLength - extension.length - 3);
        return `${baseName}...${extension}`;
    };

    //....
    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState(null); //....
    const [selectedToDate, setSelectedToDate] = useState(null); //....
    const handleDateChange = (date) => {
        if (date instanceof Date && !isNaN(date)) {
            const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY
            setSelectedDate(date); // Keep original date for display
            setFormData({ ...formData, from_date: formattedDate }); // Store in required format
            // setSelectedToDate(date); // Set selected date to to_date
            // setFormData({ ...formData, to_date: formattedDate }); // Store in required format
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

                            {acknowledgementData && (
                                <>
                                    <div>
                                        <form className="my-5 w-full">
                                            <div className="block px-1 space-y-4">
                                                {/* Grid Layout for Rows */}
                                                <div className="grid grid-cols-3 gap-6 p-2">
                                                    {/* Return Type */}
                                                    <div className="flex gap-2">
                                                        <Typography variant="h6" color="blue-gray" size="sm">
                                                            Return Type :
                                                        </Typography>
                                                        <div className="text-gray-700 text-[15px] my-auto">
                                                            {acknowledgementData.return_type}
                                                        </div>
                                                    </div>

                                                    {/* Frequency */}
                                                    <div className="flex gap-2">
                                                        <Typography variant="h6" color="blue-gray" size="sm">
                                                            Frequency :
                                                        </Typography>
                                                        <div className="text-gray-700 text-[15px] my-auto">
                                                            {acknowledgementData.frequency
                                                                .replace(/_/g, " ")
                                                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                                                        </div>
                                                    </div>

                                                    {/* From Date */}
                                                    <div className="flex gap-2">
                                                        <Typography variant="h6" color="blue-gray" size="sm">
                                                            From Date :
                                                        </Typography>
                                                        <div className="text-gray-700 text-[15px] my-auto">
                                                            {acknowledgementData.from_date}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-6 p-2">
                                                    {/* To Date */}
                                                    <div className="flex gap-2">
                                                        <Typography variant="h6" color="blue-gray" size="sm">
                                                            To Date :
                                                        </Typography>
                                                        <div className="text-gray-700 text-[15px] my-auto">
                                                            {acknowledgementData.to_date}
                                                        </div>
                                                    </div>


                                                    {/* Month */}
                                                    <div className="flex gap-2">
                                                        <Typography variant="h6" color="blue-gray" size="sm">
                                                            Month :
                                                        </Typography>
                                                        <div className="text-gray-700 text-[15px] my-auto">
                                                            {acknowledgementData.month}
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Typography variant="h6" color="blue-gray" size="sm">
                                                            Client Review :
                                                        </Typography>
                                                        <div className="text-gray-700 text-[15px] my-auto">
                                                            {acknowledgementData.client_review
                                                                .replace(/_/g, " ")
                                                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* Client Review + Remark */}
                                                <div className="grid grid-cols-3 gap-6 p-2">
                                                    {/* Return Period */}
                                                    <div className="flex items-center gap-2">
                                                        <Typography
                                                            variant="h6"
                                                            color="blue-gray"
                                                            size="sm"
                                                            className="min-w-[140px] font-semibold"
                                                        >
                                                            Return Period :
                                                        </Typography>
                                                        <div className="text-gray-700 text-[15px] whitespace-nowrap">
                                                            {acknowledgementData.return_period
                                                                .replace(/_/g, " ")
                                                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-6 p-2">



                                                    {acknowledgementData.client_review === "remark" && (
                                                        <div className="flex gap-2 col-span-2">
                                                            <Typography variant="h6" color="blue-gray" size="sm">
                                                                Remark :
                                                            </Typography>
                                                            <div className="text-gray-700 text-[15px] my-auto">
                                                                {acknowledgementData.remarks}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Computations Files */}
                                                <div className="p-2">
                                                    <Typography
                                                        variant="h6"
                                                        color="blue-gray"
                                                        className="mb-1"
                                                        size="sm"
                                                    >
                                                        Computations Files :
                                                    </Typography>
                                                    <div className="flex justify-center">
                                                        {acknowledgementData.computation_file && acknowledgementData.computation_file.length > 0 && (
                                                            <div>
                                                                {acknowledgementData.computation_file.map((file, index) => {
                                                                    const fullFilename = file.computation_file.split("/").pop();
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
                                                                    )
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Return Files */}
                                                <div className="p-2">
                                                    <Typography
                                                        variant="h6"
                                                        color="blue-gray"
                                                        className="mb-1"
                                                        size="sm"
                                                    >
                                                        Return Files :
                                                    </Typography>
                                                    <div className="flex justify-center">
                                                        {acknowledgementData.return_file && acknowledgementData.return_file.length > 0 && (
                                                            <div>
                                                                {acknowledgementData.return_file.map((file, index) => {
                                                                    const fullFilename = file.return_file.split("/").pop();
                                                                    const shortFilename = shortenFilename(fullFilename);

                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            className="bg-primary text-white px-4 py-1 rounded-lg shadow-md w-80 my-1"
                                                                        >
                                                                            <div className="flex items-center justify-between">
                                                                                <div>
                                                                                    <a
                                                                                        href={`https://admin.dms.zacoinfotech.com${file.return_file}`}
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
                                                                    )
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Footer Buttons */}
                                    <DialogFooter className="flex justify-end space-x-3">
                                        <Button
                                            contained="gradient"
                                            color="red"
                                            onClick={handleViewClose}
                                            className="px-5"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            contained="gradient"
                                            color="green"
                                            className="bg-primary px-5"
                                            onClick={handleViewClose}
                                        >
                                            Confirm
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
                                                size="lg"
                                                required
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

                                        <div className="">
                                            <div className="relative w-full">
                                                <DatePicker
                                                    ref={fromDateRef}
                                                    selected={selectedDate}
                                                    required
                                                    // onChange={(date) => setSelectedDate(date)}
                                                    onChange={handleDateChange}
                                                    dateFormat="dd/MM/yyyy"
                                                    className="w-full !border !border-[#cecece] bg-white py-2 pl-3 pr-10 text-gray-900 
                                                                                            focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md 
                                                                                            outline-none"
                                                    //  className="!border !border-[#cecece] bg-white pt-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                                                    placeholderText="dd/mm/yyyy"
                                                    value={formData.from_date}
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

                                        <div className="">
                                            <div className="relative w-full">
                                                <DatePicker
                                                    ref={toDateRef}
                                                    selected={selectedToDate}
                                                    required
                                                    // onChange={(date) => setSelectedDate(date)}
                                                    onChange={handleToDateChange}
                                                    dateFormat="dd/MM/yyyy"
                                                    className="w-full !border !border-[#cecece] bg-white py-2 pl-3 pr-10 text-gray-900 
                                                                                            focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md 
                                                                                            outline-none"
                                                    //  className="!border !border-[#cecece] bg-white pt-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                                                    placeholderText="dd/mm/yyyy"
                                                    value={formData.to_date}
                                                    showYearDropdown
                                                    scrollableYearDropdown
                                                    yearDropdownItemNumber={25}

                                                />
                                                <FaRegCalendarAlt
                                                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                                                    // onClick={() => document.querySelector(".react-datepicker__input-container input").focus()}
                                                    onClick={() => toDateRef.current.setFocus()} // Focus the correct DatePicker
                                                />
                                            </div>
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
                                                placeholder="Return Period"
                                                required
                                                value={formData.return_period} // This will auto-fill after date selection
                                                readOnly // Prevent manual edits
                                                className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent 
                                                    placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] 
                                                    focus:!border-t-[#366FA1]"
                                                labelProps={{
                                                    className: "hidden",
                                                }}
                                                containerProps={{ className: "min-w-full" }}
                                            />
                                        </div>
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
                                                dateFormat="MMMM yyyy"
                                                required
                                                showMonthYearPicker
                                                className="border p-2"
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
                                                        value={formData.client_review}
                                                        required
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
                                    <div className="border-t-2 my-2 borderColor-divider w-[680px]">
                                        <div className="grid grid-cols-2 gap-6">
                                            {/* Computation Section */}
                                            <div>
                                                <label htmlFor="computation_file">
                                                    <Typography variant="small" color="blue-gray" className="block font-semibold mb-2 mt-2">
                                                        Computation
                                                    </Typography>
                                                </label>

                                                <input
                                                    type="file"
                                                    name="computation_file"
                                                    onChange={handleFilesChange}
                                                    // required
                                                    multiple
                                                    className="file-input file-input-bordered file-input-success w-full"
                                                />

                                                {/* Attachments Section */}
                                                <label htmlFor="attachment">
                                                    <Typography variant="small" color="blue-gray" className="block font-semibold mb-2 mt-4">
                                                        Attachments
                                                    </Typography>
                                                </label>

                                                {formData.computation_file && formData.computation_file.length > 0 && (
                                                    <div className="text-sm text-gray-500 mt-2 space-y-1">
                                                        <p>Selected Computation Files:</p>
                                                        {formData.computation_file.map((file, index) => (
                                                            <p key={index}>
                                                                {file.computation_file ? (
                                                                    <a
                                                                        href={`https://admin.dms.zacoinfotech.com${file.computation_file}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-500 underline"
                                                                    >
                                                                        {file.computation_file.split("/").pop()}
                                                                    </a>
                                                                ) : (
                                                                    <span>{file.name || "No file link available"}</span>
                                                                )}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Return Section */}
                                            <div>
                                                <label htmlFor="return_file">
                                                    <Typography variant="small" color="blue-gray" className="block font-semibold mb-2 mt-2">
                                                        Return
                                                    </Typography>
                                                </label>

                                                <input
                                                    type="file"
                                                    name="return_file"
                                                    onChange={handleFileChange}
                                                    multiple
                                                    className="file-input file-input-bordered file-input-success w-full"
                                                />

                                                {/* Attachments Section */}
                                                <label htmlFor="attachment">
                                                    <Typography variant="small" color="blue-gray" className="block font-semibold mb-2 mt-4">
                                                        Attachments
                                                    </Typography>
                                                </label>

                                                {formData.return_file && formData.return_file.length > 0 && (
                                                    <div className="text-sm text-gray-500 mt-2 space-y-1">
                                                        <p>Selected Return Files:</p>
                                                        {formData.return_file.map((file, index) => (
                                                            <p key={index}>
                                                                {file.return_file ? (
                                                                    <a
                                                                        href={`https://admin.dms.zacoinfotech.com${file.files}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-500 underline"
                                                                    >
                                                                        {file.return_file.split("/").pop()}
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
                    <MenuItem onClick={downloadComputationFile}>Computation File</MenuItem>
                    <MenuItem onClick={downloadReturnFile}>Return File</MenuItem>
                    {role === "superuser" && (
                        <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
                    )}
                </Menu>
            </div>
        </>
    );
}
