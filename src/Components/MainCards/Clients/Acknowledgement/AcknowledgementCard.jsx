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
import { fetchClientDetails } from "../../../Redux/clientSlice";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRef } from "react";
import { parse } from "date-fns";
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

export default function AcknowledgementCard({ rowId }) {
    const { id } = useParams();
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


    console.log("computation Files:", formData);

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

    // useEffect(() => {
    //     if (formData.from_date && formData.to_date) {   //to check if both dates are selected
    //         const formYear = new Date(formData.from_date).getFullYear(); //get year from from_date
    //         const toYear = new Date(formData.to_date).getFullYear();  //get year from to_date

    //         setFormData((prev) => ({                          //updating the formData 'prev' means the previous state of form data
    //             ...prev,                                   // for keepin all existing data unchanged
    //             return_period: `${formYear}-${toYear}`,    //updating the return_period with fromYear-toYear
    //         }));
    //     }
    // }, [formData.from_date, formData.to_date]);         //This tells React to run this effect whenever from_date or to_date changes.


    // useEffect(() => {
    //     if (formData.from_date && formData.to_date) {
    //         const formDate = new Date(formData.from_date);
    //         const toDate = new Date(formData.to_date);

    //         const fromMonthYear = formDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    //         const toMonthYear = toDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    //         setFormData((prev) => ({
    //             ...prev,
    //             return_period: `${fromMonthYear} - ${toMonthYear}`,
    //         }));
    //     }
    // }, [formData.from_date, formData.to_date]);

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

            const response = await axios.post(
                `http://127.0.0.1:8000/api/edit-acknowledgement/${id}/${rowId}`,
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

                // Dispatch action to fetch client details
                dispatch(fetchClientDetails(id));

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
                setSelectedMonth(null);
                setSelectedYear(null);

                // if (responseData.month) {
                //     const parsedDate = parseMonthYear(responseData.month); // Ensure function handles errors
                //     console.log("Selected Month:", parsedDate);
                //     setSelectedMonth(parsedDate);
                // }
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
                `http://127.0.0.1:8000/api/delete-acknowledgement/${id}/${deleteId}`
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
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/single-acknowledgement/${id}/${rowId}`
                );
                setAckData(response.data);
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
            const response = await axios.get(
                `http://127.0.0.1:8000/api/edit-acknowledgement/${id}/${rowId}`
            );
            setFormData(response.data);
        } catch (error) {
            console.error("Error fetching acknowledgement data:", error);
            toast.error("Failed to load data. Please try again.", { autoClose: 2000 });
        }
    };


    const handleCreateClose = () => setOpenCreateModal(false);
    const [ackData, setAckData] = useState(null);
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

                            {ackData && (
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
                                                            Return Type :
                                                        </Typography>
                                                        <div className="text-gray-700 text-[15px] my-auto">
                                                            {ackData.return_type
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="w-full flex gap-3">
                                                        <Typography
                                                            variant="h6"
                                                            color="blue-gray"
                                                            className=""
                                                        >
                                                            Frequency :
                                                        </Typography>
                                                        <div className="text-gray-700 text-[15px] my-auto">
                                                            {ackData.frequency.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                                                        </div>
                                                    </div>
                                                    <div className="w-full flex gap-3">
                                                        <Typography
                                                            variant="h6"
                                                            color="blue-gray"
                                                            className=""
                                                            size="sm"
                                                        >
                                                            From Date:
                                                        </Typography>
                                                        <div className="text-gray-700 text-[15px] my-auto">
                                                            {ackData.from_date}
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
                                                            To Date :
                                                        </Typography>
                                                        <div className="text-gray-700 text-[15px] my-auto">
                                                            {ackData.to_date}
                                                        </div>
                                                    </div>
                                                    <div className="w-full flex gap-3">
                                                        <Typography
                                                            variant="h6"
                                                            color="blue-gray"
                                                            className=""
                                                            size="sm"
                                                        >
                                                            Return Period :
                                                        </Typography>
                                                        <div className="text-gray-700 text-[15px] my-auto">
                                                            {ackData.return_period.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                                                        </div>
                                                    </div>
                                                    <div className="w-full flex gap-3">
                                                        <Typography
                                                            variant="h6"
                                                            color="blue-gray"
                                                            className=""
                                                            size="sm"
                                                        >
                                                            Month :
                                                        </Typography>
                                                        <div className="text-gray-700 text-[15px] my-auto">
                                                            {ackData.month}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-6 p-2">
                                                    <div className="w-full flex gap-3">
                                                        <Typography variant="h6" color="blue-gray" size="sm">
                                                            Client Review :
                                                        </Typography>
                                                        <div className="text-gray-700 text-[15px] my-auto">
                                                            {/* {ackData.client_review} */}
                                                            {ackData.client_review.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                                                        </div>
                                                    </div>

                                                    {ackData.client_review === "remark" && (
                                                        <div className="w-full flex gap-3">
                                                            <Typography variant="h6" color="blue-gray" size="sm">
                                                                Remark :
                                                            </Typography>
                                                            <div className="text-gray-700 text-[15px] my-auto">
                                                                {ackData.remarks}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
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
                                                        {ackData.computation_file && ackData.computation_file.length > 0 && (
                                                            <div>
                                                                {ackData.computation_file.map((file, index) => {
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
                                                        {ackData.return_file && ackData.return_file.length > 0 && (
                                                            <div>
                                                                {ackData.return_file.map((file, index) => {
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
                                            {/* <Input
                                                type="date"
                                                size="lg"
                                                name="from_date"
                                                placeholder="From Date"
                                                value={formData.from_date}
                                                onChange={handleInputChange}
                                                className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                                                labelProps={{
                                                    className: "hidden",
                                                }}
                                                containerProps={{ className: "min-w-full" }}
                                            /> */}
                                            <div className="relative w-full">
                                                <DatePicker
                                                    ref={fromDateRef}
                                                    selected={selectedDate}
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
                                            {/* <Input
                                                type="date"
                                                size="lg"
                                                name="to_date"
                                                placeholder="To Date"
                                                value={formData.to_date}
                                                onChange={handleInputChange}
                                                className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                                                labelProps={{
                                                    className: "hidden",
                                                }}
                                                containerProps={{ className: "min-w-full" }}
                                            /> */}
                                            <div className="relative w-full">
                                                <DatePicker
                                                    ref={toDateRef}
                                                    selected={selectedToDate}
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
