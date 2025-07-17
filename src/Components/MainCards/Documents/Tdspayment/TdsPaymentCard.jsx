import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import { Input, Typography } from "@material-tailwind/react";
// import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { DialogFooter, Button } from "@material-tailwind/react";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchClientDetails } from "../../../Redux/clientSlice";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRef } from "react";
import { parse } from "date-fns"
import { format } from "date-fns";
import DatePicker from "react-datepicker";
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

export default function TdsPaymentCard({
  rowId,
  allTdsSectionData,
  fetchAllTdsSectionDetails
}) {
  const { id } = useParams();
  const dispatch = useDispatch();
  // console.log("rowIdTds Return", rowId);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    client_name: "",
    date: "",
    PAN: "",
    amount: "",
    cgst: "",
    sgst: "",
    igst: "",
    total_amt: "",
    tds_rate: "",
    tds_section: "",
    tds_amount: "",
    net_amount: "",
    tds_payment_date: "",
    tds_challan_no: "",
  });

  const tdsSectionData = allTdsSectionData?.tds_section || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Handle file input change


  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Create a FormData object
      const formDataToSend = new FormData();

      // Append text fields to FormData
      formDataToSend.append("client_name", formData.client_name);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("PAN", formData.PAN);
      formDataToSend.append("amount", formData.amount);
      formDataToSend.append("cgst", formData.cgst);
      formDataToSend.append("sgst", formData.sgst);
      formDataToSend.append("igst", formData.igst);
      formDataToSend.append("total_amt", formData.total_amt);
      formDataToSend.append("tds_rate", formData.tds_rate);
      formDataToSend.append("tds_section", formData.tds_section);
      formDataToSend.append("tds_amount", formData.tds_amount);
      formDataToSend.append("net_amount", formData.net_amount);
      formDataToSend.append("tds_payment_date", formData.tds_payment_date);
      formDataToSend.append("tds_challan_no", formData.tds_challan_no);

      // Make a POST request to your API
      const response = await axios.post(
        `${API_URL}/api/edit-tdspayment/${id}/${rowId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) { // Check if response is successful
        // console.log(response.data); // Handle success response
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });

        // Dispatch fetchClientDetails action
        dispatch(fetchClientDetails(id));

        // Optionally close the modal and reset form
        handleCreateClose();
        setFormData({
          client_name: "",
          date: "",
          PAN: "",
          amount: "",
          cgst: "",
          sgst: "",
          igst: "",
          total_amt: "",
          tds_rate: "",
          tds_section: "",
          tds_amount: "",
          net_amount: "",
          tds_payment_date: "",
          tds_challan_no: "",
        });
      } else {
        throw new Error("Failed to update Tds Return details.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to update Tds Return details. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
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
        `${API_URL}/api/delete-tdspayment/${id}/${deleteId}`
      );
      // console.log("res-----Tds Return---->", response);
      setOpenDeleteModal(false);
      if (response.status === 200 || response.status === 201) {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
        dispatch(fetchClientDetails(id));
      } else {
        toast.error("Failed to delete Tds Return. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting Tds Return data:", error);
      toast.error("Failed to delete Tds Return. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleViewOpen = async () => {
    setOpenViewModal(true);
    setAnchorEl(null);
    try {
      const response = await axios.get(
        `${API_URL}/api/single-tdspayment/${id}/${rowId}`
      );
      setTdsPaymentData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleDeleteClose = () => setOpenDeleteModal(false);
  const handleViewClose = () => setOpenViewModal(false);
  const handleCreateOpen = async () => {
    setOpenCreateModal(true);
    setAnchorEl(null);

    try {
      const response = await axios.get(
        `${API_URL}/api/edit-tdspayment/${id}/${rowId}`
      );
      // console.log("dd", response.data);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching Tds Return data:", error);
      toast.error("Failed to load Tds Return data. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleCreateClose = () => {
    setOpenCreateModal(false);
    resetField();
  };
  const resetField = () => {
    setTdsSecData({
      name: "",
    });
  };
  const [tdsSecData, setTdsSecData] = useState({
    name: "",
  });
  const [selectedTdsSection, setSelectedTdsSection] = useState(null);
  const [tdsPaymentData, setTdsPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleTdsSectionOnChange = (event, newValue) => {
    if (!newValue) {
      setTdsSecData({ name: "" });
      setFormData((prev) => ({ ...prev, tds_section: "" }));
      return;
    }

    if (typeof newValue === "string") {
      setTdsSecData({ name: newValue });
      setFormData((prev) => ({ ...prev, tds_section: newValue }));
    } else if (newValue && newValue.name) {
      setTdsSecData({ name: newValue.name });
      setFormData((prev) => ({ ...prev, tds_section: newValue.name }));
    }
  };


  const [selectedDate, setSelectedDate] = useState(null); //....
  const [selectedTdsDate, setSelectedTdsDate] = useState(null); //....
  const dateRef = useRef(null);
  const tdsDateRef = useRef(null);

  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY
      setSelectedDate(date); // Keep original date for display
      setFormData({ ...formData, date: formattedDate }); // Store in required format
      // setSelectedToDate(date); // Set selected date to to_date
      // setFormData({ ...formData, to_date: formattedDate }); // Store in required format
    }
  };
  const handleToDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY
      // setSelectedDate(date); // Keep original date for display
      // setFormData({ ...formData, from_date: formattedDate }); // Store in required format
      setSelectedTdsDate(date); // Set selected date to to_date
      setFormData({ ...formData, tds_payment_date: formattedDate }); // Store in required format
    }
  };


  // const [selectedDate, setSelectedDate] = useState(null); //....
  // const handleDateChange = (date) => {
  //   if (date instanceof Date && !isNaN(date)) {
  //     const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY
  //     setSelectedDate(date); // Keep original date for display
  //     setFormData({ ...formData, date: formattedDate }); // Store in required format
  //     // setSelectedToDate(date); // Set selected date to to_date
  //     // setFormData({ ...formData, to_date: formattedDate }); // Store in required format
  //   }
  // };
  // console.log("TDS Section Data:", tdsSectionData);



  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error loading client details: {error.message}</div>;
  // }
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
            <Box sx={style} className="max-h-screen overflow-scroll">
              <Typography
                id="modal-modal-title"
                variant="h5"
                component="h2"
                className="text-center border-b-2 border-[#366FA1] pb-3"
              >
                Details View
              </Typography>

              {tdsPaymentData && (
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
                              Client Name :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsPaymentData.client_name}
                            </div>
                          </div>
                          <div className="w-full flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className=""
                            >
                              PAN :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsPaymentData.PAN}
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
                              Date :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsPaymentData.date}
                            </div>
                          </div>
                          <div className="w-full flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className=""
                              size="sm"
                            >
                              Amount :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsPaymentData.amount}
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
                              TDS Rate :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsPaymentData.tds_rate}
                            </div>
                          </div>
                          <div className="w-full flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className=""
                              size="sm"
                            >
                              TDS Amount :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsPaymentData.tds_amount}
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
                              CGST :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsPaymentData.cgst}
                            </div>
                          </div>
                          <div className="w-full flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className=""
                              size="sm"
                            >
                              SGST :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsPaymentData.sgst}
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
                              IGST :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsPaymentData.igst}
                            </div>
                          </div>
                          <div className="w-full flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className=""
                              size="sm"
                            >
                              Total Amount :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsPaymentData.total_amt}
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
                              TDS Amount :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsPaymentData.tds_amount}
                            </div>
                          </div>
                          <div className="w-full flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className=""
                              size="sm"
                            >
                              Net Amount :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsPaymentData.net_amount}
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
                              TDS Payment Date :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsPaymentData.tds_payment_date}
                            </div>
                          </div>
                          <div className="w-full flex gap-3">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className=""
                              size="sm"
                            >
                              TDS Challan No. :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsPaymentData.tds_challan_no}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-6 p-2">
                          <div className="w-full flex gap-3">
                            <Typography variant="h6" color="blue-gray" size="sm">
                              TDS Section :
                            </Typography>
                            <div className="text-gray-700 text-[15px] my-auto">
                              {tdsPaymentData.tds_section}
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
          <Box sx={styleCreateMOdal}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              className="text-center border-b-2 border-[#366FA1] pb-3"
            >
              Update TdsPayment Details
            </Typography>
            <form className="my-5 w-full" onSubmit={handleSubmit}>
              <div className="grid grid-cols-4 gap-4">
                {/* Client Name */}
                <div className="col-span-4">
                  <label htmlFor="client_name">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      Client Name
                    </Typography>
                  </label>
                  <Input
                    type="text"
                    size="lg"
                    name="client_name"
                    placeholder="Client Name"
                    value={formData.client_name}
                    onChange={handleInputChange}
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                {/* Date */}
                <div className="col-span-2">
                  <label htmlFor="date">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      Date
                    </Typography>
                  </label>
                  <div className="relative w-full">
                    <DatePicker
                      ref={dateRef}
                      selected={selectedDate}
                      // onChange={(date) => setSelectedDate(date)}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yyyy"
                      className="w-full !border !border-[#cecece] w-[350px] bg-white py-2 pl-3 pr-10 text-gray-900 
                                                                                                          focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md 
                                                                                                          outline-none"
                      //  className="!border !border-[#cecece] bg-white pt-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                      placeholderText="dd/mm/yyyy"
                      value={formData.date}
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={25}

                    />
                    <FaRegCalendarAlt
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                      onClick={() => dateRef.current.setFocus()} // Focus the correct DatePicker
                    />
                  </div>
                </div>

                {/* PAN */}
                <div className="col-span-2">
                  <label htmlFor="PAN">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      PAN
                    </Typography>
                  </label>
                  <Input
                    type="text"
                    size="lg"
                    name="PAN"
                    placeholder="PAN"
                    value={formData.PAN}
                    onChange={handleInputChange}
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                {/* Amount */}
                <div className="col-span-2">
                  <label htmlFor="amount">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      Amount
                    </Typography>
                  </label>
                  <Input
                    type="number"
                    size="lg"
                    name="amount"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                {/* CGST */}
                <div className="col-span-2">
                  <label htmlFor="cgst">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      CGST
                    </Typography>
                  </label>
                  <Input
                    type="number"
                    size="lg"
                    name="cgst"
                    placeholder="CGST"
                    value={formData.cgst}
                    onChange={handleInputChange}
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                {/* SGST */}
                <div className="col-span-2">
                  <label htmlFor="sgst">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      SGST
                    </Typography>
                  </label>
                  <Input
                    type="number"
                    size="lg"
                    name="sgst"
                    placeholder="SGST"
                    value={formData.sgst}
                    onChange={handleInputChange}
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                {/* IGST */}
                <div className="col-span-2">
                  <label htmlFor="igst">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      IGST
                    </Typography>
                  </label>
                  <Input
                    type="number"
                    size="lg"
                    name="igst"
                    placeholder="IGST"
                    value={formData.igst}
                    onChange={handleInputChange}
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                {/* Total Amount */}
                <div className="col-span-2">
                  <label htmlFor="total_amt">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      Total Amount
                    </Typography>
                  </label>
                  <Input
                    type="number"
                    size="lg"
                    name="total_amt"
                    placeholder="Total Amount"
                    value={formData.total_amt}
                    onChange={handleInputChange}
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                {/* TDS Rate */}
                <div className="col-span-2">
                  <label htmlFor="tds_rate">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      TDS Rate
                    </Typography>
                  </label>
                  <Input
                    type="number"
                    size="lg"
                    name="tds_rate"
                    placeholder="TDS Rate"
                    value={formData.tds_rate}
                    onChange={handleInputChange}
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                {/* TDS Section */}
                {/* <div className="col-span-2">
                  <label htmlFor="tds_section">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      TDS Section
                    </Typography>
                  </label>
                  <Input
                    type="text"
                    size="lg"
                    name="tds_section"
                    placeholder="TDS Section"
                    value={formData.tds_section}
                    onChange={handleInputChange}
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div> */}
                <div className="col-span-2">
                  <label htmlFor="date">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      TDS Payment Date
                    </Typography>
                  </label>
                  <div className="">
                    <div className="relative w-full">
                      <DatePicker
                        ref={tdsDateRef}
                        selected={selectedTdsDate}
                        // onChange={(date) => setSelectedDate(date)}
                        onChange={handleToDateChange}
                        dateFormat="dd/MM/yyyy"
                        className="w-full !border !border-[#cecece] w-[350px] bg-white py-2 pl-3 pr-10 text-gray-900 
                                                                                                        focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md 
                                                                                                        outline-none"
                        //  className="!border !border-[#cecece] bg-white pt-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        placeholderText="dd/mm/yyyy"
                        value={formData.tds_payment_date}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={25}

                      />
                      <FaRegCalendarAlt
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        onClick={() => tdsDateRef.current.setFocus()} // Focus the correct DatePicker
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <label htmlFor="PAN">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      TDS Challan No.
                    </Typography>
                  </label>
                  <Input
                    type="text"
                    size="lg"
                    name="tds_challan_no"
                    placeholder="TDS Challan No."
                    value={formData.tds_challan_no}
                    onChange={handleInputChange}
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="tds_section">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold"
                    >
                      TDS Section
                    </Typography>
                  </label>
                </div>
                <div className="col-span-4">
                  <div className="m-0">
                    {/* <Stack spacing={1} sx={{ width: 300 }}> */}
                    <Autocomplete
                      sx={{ width: 300 }}
                      freeSolo
                      id="tds-section-autocomplete"
                      // disablePortal  
                      disableClearable
                      options={tdsSectionData}
                      getOptionLabel={(option) =>
                        typeof option === "string"
                          ? option
                          : option.name || ""
                      }
                      onChange={handleTdsSectionOnChange}
                      // value={tdsSecData.name || ""} // Bind value to formData.gst_no
                      value={formData.tds_section || ""}
                      PopperComponent={(props) => (
                        <div {...props} style={{ position: "relative", zIndex: 1 }} />
                      )}
                      PaperComponent={(props) => (
                        <div
                          {...props}
                          style={{
                            marginTop: "5px",
                            position: "absolute",
                            backgroundColor: "white", // ✅ Ensures white background
                            // border: "1px solid #ccc", // ✅ Adds border for visibility
                            // borderRadius: "5px",
                            boxShadow: "5px 4px 6px rgba(0,0,0,0.1)", // ✅ Adds shadow for better visibility
                            padding: "5px",
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                          {option.name}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          name="name"
                          value={formData.tds_section || ""} // Reset input value when formData.gst_no changes
                          onChange={(e) =>
                            handleTdsSectionOnChange(e, e.target.value)
                          } // Update input value on type
                          placeholder="Select TDS Section."
                          sx={{
                            // Adjust the height and padding to reduce overall size
                            "& .MuiInputBase-root": {
                              height: 45, // Set your desired height here
                              padding: "2px 6px", // Adjust padding to make it smaller
                              width: 680,
                            },
                            "& .MuiOutlinedInput-input": {
                              padding: "4px 6px", // Input padding
                            },
                          }}
                          slotProps={{
                            input: {
                              ...params.InputProps,
                              type: "search",
                            },
                          }}
                        />
                      )}
                    />
                    {/* </Stack> */}
                  </div>
                </div>



                {/* TDS Amount */}
                <div className="col-span-2">
                  <label htmlFor="tds_amount">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      TDS Amount
                    </Typography>
                  </label>
                  <Input
                    type="number"
                    size="lg"
                    name="tds_amount"
                    placeholder="TDS Amount"
                    value={formData.tds_amount}
                    onChange={handleInputChange}
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
                </div>

                {/* Net Amount */}
                <div className="col-span-2">
                  <label htmlFor="net_amount">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      Net Amount
                    </Typography>
                  </label>
                  <Input
                    type="number"
                    size="lg"
                    name="net_amount"
                    placeholder="Net Amount"
                    value={formData.net_amount}
                    onChange={handleInputChange}
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    containerProps={{ className: "min-w-full" }}
                    labelProps={{
                      className: "hidden",
                    }}
                  />
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
          <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
        </Menu>
      </div>
    </>
  );
}
