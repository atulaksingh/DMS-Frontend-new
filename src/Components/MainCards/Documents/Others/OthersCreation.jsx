import React, { useState, useCallback } from "react";
import {
    Button,
    DialogFooter,
    Typography,
    Input,
    Option,
}
    from "@material-tailwind/react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { fetchClientDetails } from "../../../Redux/clientSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const API_URL = import.meta.env.VITE_API_BASE_URL;

// Styles for modal
const styleCreateModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 750,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
};

const generateYearRanges = (startYear, count) => {
    return Array.from({ length: count }, (_, i) => {
        const fromYear = startYear + i;
        const toYear = fromYear + 1;
        return { value: `${fromYear}-${toYear}`, label: `${fromYear}-${toYear}` };
    });
};

function OthersCreation() {
    const { id } = useParams();
    const role = getUserRole();
    console.log("Role from token:", getUserRole());
    const dispatch = useDispatch();
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        financial_year: "",
        month: "",
        text: "",
        files: [],
    });
    const [selectedOption, setSelectedOption] = useState(null);

    const options = [
        { value: "monthly", label: "Monthly" },
        { value: "minute", label: "Minute" },
        { value: "other", label: "Other" },
    ];

    const handleChange = (selectedOption) => {
        console.log("Selected Option:", selectedOption);
        setSelectedOption(selectedOption);
        setFormData((prev) => {
            const newData = { ...prev, text: selectedOption ? selectedOption.value : "" };
            console.log("Updated Form Data:", newData);
            return newData;
        });
    };

    const handleCreateOpen = useCallback(() => setOpenCreateModal(true), []);
    const handleCreateClose = useCallback(() => setOpenCreateModal(false), []);

    const yearOptions = generateYearRanges(2017, 33);

    const [othersErrors, setOthersErrors] = useState({})

    const othersRules = {
        financial_year: [
            { test: (v) => v.length > 0, message: "Financial year is required" },
            { test: (v) => /^\d{4}-\d{4}$/.test(v), message: "Financial year must be in format YYYY-YYYY (e.g., 2023-2024)" },
            {
                test: (v) => {
                    if (!/^\d{4}-\d{4}$/.test(v)) return false;
                    const [start, end] = v.split("-").map(Number);
                    return end === start + 1; // year should be consecutive
                },
                message: "Financial year must be consecutive (e.g., 2023-2024)",
            },
        ],

        text: [
            { test: (v) => v.length > 0, message: "Text is required" },
        ],

        files: [
            {
                test: (v) => Array.isArray(v) && v.length > 0,
                message: "At least one file is required",
            },
            {
                test: (v) =>
                    Array.isArray(v) &&
                    v.every(
                        (f) =>
                            f &&
                            typeof f === "object" &&
                            "type" in f &&
                            (
                                f.type === "application/pdf" ||
                                f.type.startsWith("image/") ||
                                f.type === "application/vnd.ms-excel" ||
                                f.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                                f.type === "text/plain"
                            )
                    ),
                message: "Only PDF, Image, Excel, or TXT files are allowed",
            },
        ],
    };

    const validateOthers = (name, value) => {
        const fieldRules = othersRules[name];
        if (!fieldRules) return "";
        for (let rule of fieldRules) {
            if (!rule.test(value)) return rule.message;
        }
        return "";
    };

    const handleInputChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        const errorMsg = validateOthers(name, value);
        setOthersErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files); // FileList → Array

        setFormData((prev) => ({
            ...prev,
            files: selectedFiles,  // store as array
        }));

        const errorMsg = validateOthers("files", selectedFiles);
        setOthersErrors((prev) => ({ ...prev, files: errorMsg }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        Object.entries(formData).forEach(([key, value]) => {
            const errorMsg = validateOthers(key, value);
            if (errorMsg) {
                newErrors[key] = errorMsg;
            }
        });

        setOthersErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            const firstErrorField = Object.keys(newErrors)[0];
            toast.error(newErrors[firstErrorField], {
                position: "top-right",
                autoClose: 2000,
            });
            return; // ❌ Stop submit
        }

        console.log("Final Form Data Before Submit:", formData); // Debugging log

        if (formData.files.length === 0) {
            toast.error("Please upload at least one file before submitting.", {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("financial_year", formData.financial_year);
            formDataToSend.append("month", formData.month);
            formDataToSend.append("text", formData.text);  // Ensure text is added
            formData.files.forEach((file) => formDataToSend.append("files", file));

            console.log("FormData being sent:", formDataToSend.get("text")); // Check if text is included

            // const response = await axios.post(`api/create-others/${id}`, formDataToSend, {
            //     headers: { "Content-Type": "multipart/form-data" }
            // });

            const response = await axiosInstance.post(
                `${API_URL}/api/create-others/${id}`,
                formDataToSend,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.status === 200 || response.status === 201) {
                toast.success(`${response.data.message}`, {
                    position: "top-right",
                    autoClose: 2000,
                });
                dispatch(fetchClientDetails(id));
                handleCreateClose();

                setFormData({
                    financial_year: "",
                    text: "",
                    month: "",
                    files: [],
                });

                setSelectedOption(null);
                setSelectedYear(null);
                setSelectedMonth(null);
            } else {
                toast.error(`Failed to create air. ${response.data.error_message}`, {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            toast.error(`Failed to create air details. Please try again.`, {
                position: "top-right",
                autoClose: 2000,
            });
        }
    };

    return (
        <>
            {/* <ToastContainer /> */}
            <Modal
                open={openCreateModal}
                onClose={handleCreateClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={styleCreateModal}>
                    <Typography
                        id="modal-title"
                        variant="h5"
                        className="text-center border-b-2 border-[#366FA1] pb-3"
                    >
                        Others Details
                    </Typography>
                    <form className="my-5 w-full" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-2">
                                <Typography
                                    variant="small"
                                    className="block font-semibold mb-1"
                                >
                                    Log In Year
                                </Typography>
                                <Select
                                    options={yearOptions}
                                    required
                                    value={yearOptions.find((option) => option.value === selectedYear)}
                                    onChange={(selectedOption) => {
                                        setSelectedYear(selectedOption.value);
                                        handleInputChange("financial_year", selectedOption.value);
                                    }}
                                    placeholder="Select Financial Year"
                                />
                            </div>

                            <div className="col-span-2">
                                <Typography
                                    variant="small"
                                    className="block font-semibold mb-1"
                                >
                                    Month
                                </Typography>
                                <DatePicker
                                    selected={selectedMonth}
                                    required
                                    onChange={(date) => {
                                        setSelectedMonth(date);
                                        handleInputChange("month", format(date, "MMMM yyyy"));
                                    }}
                                    showMonthYearPicker
                                    dateFormat="MMMM YYYY"
                                    className="w-full px-3 py-2 border border-[#cecece] bg-white py-1 text-gray-900 focus:border-[#366FA1]"
                                    placeholderText="Select Month"
                                />
                            </div>

                            <div className="col-span-2">
                                <label htmlFor="text">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="block  font-semibold  mb-1"
                                    >
                                        Nature of Report
                                    </Typography>
                                </label>
                                {/* <Select
                                    value={selectedOption}
                                    onChange={handleChange}
                                    options={options}
                                    placeholder="Choose..."
                                    isClearable
                                /> */}
                                <div className="">
                                    <Input
                                        type="text"
                                        size="lg"
                                        name="text"
                                        required
                                        placeholder="Nature of Report"
                                        value={formData.text}
                                        // onChange={handleInputChange}
                                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
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
                                    className="block font-semibold mb-2"
                                >
                                    Attachments
                                </Typography>
                                <input
                                    type="file"
                                    name="files"
                                    required
                                    onChange={handleFileChange}
                                    multiple
                                    className="file-input file-input-bordered file-input-success w-full max-w-sm"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={handleCreateClose}
                                variant="text"
                                color="red"
                                className="mr-1"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-primary">
                                Confirm
                            </Button>
                        </DialogFooter>
                    </form>
                </Box>
            </Modal>

            <Button
                size="md"
                className="bg-primary hover:bg-[#2d5e85]"
                onClick={handleCreateOpen}
            >
                Create
            </Button>
        </>
    );
}

export default OthersCreation;
