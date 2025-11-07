import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import { Checkbox, Input, Typography } from "@material-tailwind/react";
import Modal from "@mui/material/Modal";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import { ImFilePicture } from "react-icons/im";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRef } from "react";
import { format, parse, isValid } from "date-fns";
const options = ["None", "Atria", "Callisto"];
import {
  Button,
  DialogFooter,
  Option,
  Radio,
  Select,
} from "@material-tailwind/react";

import "react-toastify/dist/ReactToastify.css";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  // IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TabPanel from "@mui/lab/TabPanel";
import { useDispatch } from "react-redux";
import { fetchClientDetails } from "../../../Redux/clientSlice";
import PurchaseInvoice from "./PurchaseInvoice";
const API_URL = import.meta.env.VITE_API_BASE_URL;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  boxShadow: 24,
  marginBlock: "80px",
  borderRadius: "10px",
};
const styleCreateModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90%",
    sm: "90%",
    md: "90%",
    lg: "90%",
    xl: "85%",
  },
  bgcolor: "background.paper",
  boxShadow: 24,
  paddingTop: "17px",
  paddingInline: {
    xs: "20px",
    sm: "30px",
    md: "40px",
  },
  borderRadius: "10px",
};
const ITEM_HEIGHT = 48;
export default function PurchaseCard({
  rowId,
  allLocationBranchProductData,
  fetchAllLocBranchDetails,
}) {
  const { id } = useParams();
  const role = getUserRole();
  const purchID = rowId;
  const offData = allLocationBranchProductData?.serializer || [];
  const customerData = allLocationBranchProductData?.serializer_customer || [];
  const product_ser_Data = allLocationBranchProductData?.product_serializer || [];
  const branch_ser_name = allLocationBranchProductData?.branch_serializer || [];
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const resetFields = () => {
    setFormData({
      offLocID: "",
      location: "",
      contact: "",
      address: "",
      city: "",
      state: "",
      country: "",
      branchID: "",
    });

    setVendorData({
      vendorID: "",
      gst_no: "",
      name: "",
      pan: "",
      vendor_address: "",
      customer: false,
      vendor: false,
    });

    setRows([
      {
        product: "",
        hsnCode: "",
        gstRate: "",
        description: "",
        unit: "",
        rate: "",
        product_amount: "",
        cgst: "",
        sgst: "",
        igst: "",
        total_invoice: 0,
      },
    ]);

    setInvoiceData([
      {
        month: "",
        invoice_no: "",
        invoice_date: "",
        invoice_type: "",
        entry_type: "",
        attach_e_way_bill: "",
        attach_invoice: "",
        taxable_amount: "",
        totalall_gst: "",
        total_invoice_value: "",
        tds_tcs_rate: "",
        tcs: "",
        tds: "",
        amount_receivable: "",
        utilise_month: "",
        utilise_edit: false,
      },
    ]);

    setBranchNoGst("");
  };
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      files: e.target.files, // Handles multiple files
    }));
  };
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
        `${API_URL}/api/delete-purchase-invoice/${id}/${deleteId}`
      );
      setOpenDeleteModal(false);
      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 2000,
        });
        // dispatch(fetchClientDetails(id));
        dispatch(fetchClientDetails({ id, tabName: "Purchase" }));
      } else {
        toast.error("Failed to delete PurchaseInvoice. Please try again.", {
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
  };
  const handleDeleteClose = () => setOpenDeleteModal(false);
  const handleViewClose = () => setOpenViewModal(false);
  const helloworld = () => setOpenViewModal(false);
  const [bankData, setBankData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_URL}/api/purchase-view/${id}/${rowId}`
        );
        setBankData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchBankDetails();
  }, [id, rowId]);
  const [value, setValue] = React.useState("1");
  const [selectedValueInvoiceType, setSelectedValueInvoiceType] = useState("");
  const [showBranchInput, setShowBranchInput] = useState(false);
  const [branchNoGst, setBranchNoGst] = useState("");
  const open = Boolean(anchorEl);
  const [selectedTDSTCSOption, setSelectedTDSTCSOption] = useState("");
  const [selectedTDSTCSRateOption, setSelectedTDSTCSRateOption] = useState("");
  const [selectedTDSTCSectionOption, setSelectedTDSTCSectionOption] = useState("");
  const [shouldShowIGST, setShouldShowIGST] = useState(false);
  const [shouldShowCGSTSGST, setShouldShowCGSTSGST] = useState(false);
  const [isGstNoEmpty, setIsGstNoEmpty] = useState(true);
  const [filteredInvoiceTypes, setFilteredInvoiceTypes] = useState([
    "Unregistered Local",
    "Unregistered Non-Local",
  ]);
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const handleCreateClose = () => {
    setOpenCreateModal(false);
    resetFields();
  };
  const [formData, setFormData] = useState({
    offLocID: "",
    location: "",
    contact: "",
    address: "",
    city: "",
    state: "",
    country: "",
    branchID: "",
  });
  const [vendorData, setVendorData] = useState({
    vendorID: "",
    gst_no: "",
    name: "",
    pan: "",
    vendor_address: "",
    email: "",
    contact: "",
    customer: false,
    vendor: false,
  });
  const [rows, setRows] = useState([
    {
      product: "",
      hsnCode: "",
      gstRate: "",
      description: "",
      unit: "",
      rate: "",
      product_amount: "",
      cgst: "",
      sgst: "",
      igst: "",
      total_invoice: 0,
    },
  ]);
  const [invoiceData, setInvoiceData] = useState([
    {
      month: "",
      invoice_no: "",
      invoice_date: "",
      invoice_type: "",
      entry_type: "",
      attach_e_way_bill: "",
      attach_invoice: "",
      taxable_amount: "",
      totalall_gst: "",
      total_invoice_value: "",
      tds_tcs_rate: "",
      tcs: "",
      tds: "",
      amount_receivable: "",
      utilise_month: "",
      utilise_edit: false,
    },
  ]);
  const handleCreateOpen = async () => {
    setOpenCreateModal(true);
    setAnchorEl(null);

    try {
      const response = await axiosInstance.get(
        `${API_URL}/api/get-purchase-invoice/${id}/${rowId}`
      );
      setFormData(response?.data?.client_location);
      setVendorData(response?.data?.vendor);
      setRows(response?.data?.product_summaries);
      if (response?.data?.purchase_invoice) {
        setInvoiceData([
          {
            ...response?.data?.purchase_invoice,
            invoice_type: response?.data?.purchase_invoice?.invoice_type || "",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching bank data:", error);
      toast.error("Failed to load bank data. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };
  const handleInputChangeInvoiceData = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue =
      type === "checkbox"
        ? checked
        : type === "file"
          ? e.target.files[0]
          : value;

    setInvoiceData((prevData) => {
      const updatedData = Array.isArray(prevData) ? [...prevData] : [{}];

      if (!updatedData[0]) {
        updatedData[0] = {};
      }

      let updatedEntry = {
        ...updatedData[0],
        [name]: fieldValue,
      };

      if (name === "tcs") {
        updatedEntry.tds = "";
      } else if (name === "tds") {
        updatedEntry.tcs = "";
      }

      if (name === "tds_tcs_rate") {
        if (updatedEntry.tcs > 0) {
          updatedEntry.tds = "";
        } else if (updatedEntry.tds > 0) {
          updatedEntry.tcs = "";
        }
      }

      updatedData[0] = updatedEntry;

      return updatedData;
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleInputChangeCL = (e) => {
    const { name, value } = e.target;
    setVendorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [selectedLocation, setSelectedLocation] = useState("");
  const [productID, setProductID] = useState("");
  const [selectedGstNo, setSelectedGstNo] = useState("");
  const handleLocationChange = async (newValue, isBranch = false) => {
    console.log("newwvalue", newValue)
    if (isBranch && newValue && newValue.branch_name) {
      setBranchNoGst(newValue?.gst_no);
      setFormData({
        ...formData,
        branchID: newValue.id,
      });
    }
    else if (newValue && newValue.location) {
      setFormData({
        ...formData,
        offLocID: newValue.id,
        location: newValue.location,
        contact: newValue.contact || "",
        address: newValue.address || "",
        city: newValue.city || "",
        state: newValue.state || "",
        country: newValue.country || "",
        branchID: newValue.branch || "",
      });
      setShowBranchInput(false);
      try {
        const response = await axiosInstance.get(
          `${API_URL}/api/get-purchase/${id}/?newValue=${newValue.id}&productID=${productID}`
        );
        console.log("Location Data:---->", response.data.branch_gst);
        setBranchNoGst(response?.data?.branch_gst);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    }
    const errorMsg = validatePurchaseField(name, value);
    setPurchaseErrors(prev => ({ ...prev, [name]: errorMsg }));
  };
  const handleInputChangeLocation = async (event, newInputValue) => {
    if (!newInputValue) {
      setFormData((prev) => ({
        ...prev,
        offLocID: "",
        location: "",
        contact: "",
        address: "",
        city: "",
        state: "",
        country: "",
        branchID: "",
      }));
      setShowBranchInput(false);
      return;
    }
    const matchingLocation = offData?.find(
      (option) =>
        option?.location?.toLowerCase() === newInputValue.toLowerCase()
    );

    if (matchingLocation) {
      handleLocationChange(matchingLocation);
      setShowBranchInput(false);
    } else {
      setShowBranchInput(true);
      setFormData((prev) => ({
        ...prev,
        location: newInputValue,
        offLocID: "",
        contact: "",
        address: "",
        city: "",
        state: "",
        country: "",
        branchID: "",
      }));
      setBranchNoGst("")
    }
  };
  const handleGstNoChange = (event, newValue1) => {
    setIsGstNoEmpty(!newValue1);
    if (!newValue1) {
      setVendorData((prevVendorData) => ({
        ...prevVendorData,
        vendorID: "",
        gst_no: "",
        name: "",
        pan: "",
        email: "",
        contact: "",
        vendor_address: "",
        customer: false,
        vendor: false,
      }));
      return;
    }

    if (typeof newValue1 === "string") {
      const matchedCustomer = customerData.find(
        (customer) => customer.gst_no === newValue1
      );

      if (matchedCustomer) {
        setVendorData((prevVendorData) => ({
          ...prevVendorData,

          vendorID: matchedCustomer.id,
          gst_no: matchedCustomer.gst_no,
          name: matchedCustomer.name,
          pan: matchedCustomer.pan,
          email: matchedCustomer.email,
          contact: matchedCustomer.contact,
          vendor_address: matchedCustomer.address,
          customer: matchedCustomer.customer,
          vendor: matchedCustomer.vendor,
        }));
      } else {
        setVendorData((prevVendorData) => ({
          ...prevVendorData,
          vendorID: "",
          gst_no: newValue1,
          name: "",
          pan: "",
          email: "",
          contact: "",
          vendor_address: "",
          customer: false,
          vendor: false,
        }));
      }
      return;
    }
    if (newValue1 && newValue1.gst_no) {
      setVendorData((prevVendorData) => ({
        ...prevVendorData,
        vendorID: newValue1.id,
        gst_no: newValue1.gst_no,
        name: newValue1.name || "",
        pan: newValue1.pan || "",
        email: newValue1.email || "",
        contact: newValue1.contact || "",
        vendor_address: newValue1.address || "",
        customer: newValue1.customer || false,
        vendor: newValue1.vendor || false,
      }));
    }
  };
  const handleNameChange = (event, newValue1) => {
    setIsNameEmpty(!newValue1);
    if (!newValue1) {
      setVendorData((prevVendorData) => ({
        ...prevVendorData,
        vendorID: "",
        gst_no: "",
        name: "",
        pan: "",
        email: "",
        contact: "",
        vendor_address: "",
        customer: false,
        vendor: false,
      }));
      return;
    }

    if (typeof newValue1 === "string") {
      const matchedCustomer = customerData.find(
        (customer) => customer.name === newValue1
      );

      if (matchedCustomer) {
        setVendorData((prevVendorData) => ({
          ...prevVendorData,

          vendorID: matchedCustomer.id,
          gst_no: matchedCustomer.gst_no,
          name: matchedCustomer.name,
          pan: matchedCustomer.pan,
          email: matchedCustomer.email,
          contact: matchedCustomer.contact,
          vendor_address: matchedCustomer.address,
          customer: matchedCustomer.customer,
          vendor: matchedCustomer.vendor,
        }));
      } else {
        setVendorData((prevVendorData) => ({
          ...prevVendorData,
          vendorID: "",
          gst_no: "",
          name: newValue1,
          pan: "",
          email: "",
          contact: "",
          vendor_address: "",
          customer: false,
          vendor: false,
        }));
      }
      return;
    }

    if (newValue1 && newValue1.gst_no) {
      setVendorData((prevVendorData) => ({
        ...prevVendorData,
        vendorID: newValue1.id,
        gst_no: newValue1.gst_no || "",
        name: newValue1.name,
        pan: newValue1.pan || "",
        email: newValue1.email || "",
        contact: newValue1.contact || "",
        vendor_address: newValue1.address || "",
        customer: newValue1.customer || false,
        vendor: newValue1.vendor || false,
      }));
    }
  };
  const handleProductChange = async (index, newValue) => {
    if (newValue) {
      setProductID(newValue.id);
      try {
        const response = await axiosInstance.get(
          `${API_URL}/api/get-purchase/${id}/?newValue=${selectedLocation}&productID=${newValue.id}`
        );

        const { hsn_code: hsnCode, gst_rate: gstRate } =
          response.data.hsn || {};

        setRows((prevRows) =>
          prevRows.map((row, rowIndex) =>
            rowIndex === index
              ? { ...row, product: newValue.product_name, hsnCode, gstRate }
              : row
          )
        );
      } catch (error) {
        console.error("Error fetching HSN code and GST rate:", error);
      }
    } else {
      setRows((prevRows) =>
        prevRows.map((row, rowIndex) =>
          rowIndex === index ? { ...row, product: "" } : row
        )
      );
    }
  };
  const handleInputChangeProductField = async (index, value) => {
    setRows((prevRows) =>
      prevRows.map((row, rowIndex) => {
        if (rowIndex === index) {
          return {
            ...row,
            product: value,
            hsnCode: "",
            gstRate: "",
            description: "",
            unit: "",
            rate: "",
            product_amount: "",
            cgst: 0,
            sgst: 0,
            igst: 0,
            total_invoice: 0,

          }; // reset first
        }
        return row;
      })
    );

    if (value) {
      try {
        setRows((prevRows) =>
          prevRows.map((row, rowIndex) =>
            rowIndex === index
              ? { ...row, hsnCode: "", gstRate: "" }
              : row
          )
        );
        // }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    }

    const errorMsg = validatePurchaseField("product", value);
    setPurchaseErrors((prev) => ({ ...prev, product: errorMsg }));
  };
  const handleInputChangeProduct = (index, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row, rowIndex) => {
        if (rowIndex === index) {
          const updatedRow = { ...row, [field]: value };

          if (invoiceData[0]?.invoice_type.toLowerCase() === "nil rated") {
            updatedRow.cgst = "0.00";
            updatedRow.sgst = "0.00";
            updatedRow.igst = "0.00";
            updatedRow.product_amount =
              (parseFloat(updatedRow.unit) || 0) *
              (parseFloat(updatedRow.rate) || 0).toFixed(2);
            updatedRow.total_invoice = updatedRow.product_amount;
          } else {
            if (field === "unit" || field === "rate") {
              const unit = parseFloat(updatedRow.unit) || 0;
              const rate = parseFloat(updatedRow.rate) || 0;
              updatedRow.product_amount = (unit * rate).toFixed(2);
            }
            if (updatedRow.gstRate) {
              const gstValue = (
                (parseFloat(updatedRow.gstRate) *
                  parseFloat(updatedRow.product_amount)) /
                100
              ).toFixed(2);

              if (shouldShowCGSTSGST) {
                const cgstValue = (gstValue / 2).toFixed(2);
                const sgstValue = (gstValue / 2).toFixed(2);
                updatedRow.cgst = cgstValue;
                updatedRow.sgst = sgstValue;
                updatedRow.igst = "0.00";
              } else if (shouldShowIGST) {
                updatedRow.cgst = "0.00";
                updatedRow.sgst = "0.00";
                updatedRow.igst = gstValue;
              }
            }
            // Calculate GST value for total invoice calculation
            const gstValueRow = shouldShowCGSTSGST
              ? (parseFloat(updatedRow.cgst) || 0) +
              (parseFloat(updatedRow.sgst) || 0)
              : parseFloat(updatedRow.igst) || 0;
            // Ensure total_invoice is calculated without NaN
            updatedRow.total_invoice = (
              (parseFloat(updatedRow.product_amount) || 0) + gstValueRow
            ).toFixed(2);
          }
          // Return the updated row
          return updatedRow;
        }
        return row;
      })
    );
  };
  useEffect(() => {
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row) => {
        // Check if the invoice type is "Nil Rated"
        if (invoiceData[0]?.invoice_type.toLowerCase() === "nil rated") {
          // Set all GST values to 0 when Nil Rated is selected
          if (
            row.cgst !== "0.00" ||
            row.sgst !== "0.00" ||
            row.igst !== "0.00"
          ) {
            row.cgst = "0.00";
            row.sgst = "0.00";
            row.igst = "0.00";
          }
          // Set total_invoice to product_amount since no GST applies
          row.total_invoice = (parseFloat(row.product_amount) || 0).toFixed(2);
        } else if (row.product_amount && row.gstRate) {
          // Recalculate GST and total_invoice if not "Nil Rated"
          const gstValue = (
            (parseFloat(row.gstRate) * parseFloat(row.product_amount)) /
            100
          ).toFixed(2);

          if (shouldShowCGSTSGST) {
            const cgstValue = (gstValue / 2).toFixed(2);
            const sgstValue = (gstValue / 2).toFixed(2);
            row.cgst = cgstValue;
            row.sgst = sgstValue;
            row.igst = "0.00";
          } else if (shouldShowIGST) {
            row.cgst = "0.00";
            row.sgst = "0.00";
            row.igst = gstValue;
          }
          // Calculate total_invoice for this row
          const gstValueRow = shouldShowCGSTSGST
            ? (parseFloat(row.cgst) || 0) + (parseFloat(row.sgst) || 0)
            : parseFloat(row.igst) || 0;

          row.total_invoice = (
            (parseFloat(row.product_amount) || 0) + gstValueRow
          ).toFixed(2);
        }

        return row;
      });

      return updatedRows;
    });
  }, [shouldShowCGSTSGST, shouldShowIGST, invoiceData]);
  useEffect(() => {

    let totalAmount = 0;
    let totalGSTValue = 0;
    let totalInvoiceValueSum = 0;
    // Check if invoice_type is "Nil Rated"
    const isNilRated =
      invoiceData[0]?.invoice_type.toLowerCase() === "nil rated";

    rows.forEach((row) => {
      totalAmount += parseFloat(row.product_amount) || 0;
      if (shouldShowCGSTSGST) {
        totalGSTValue +=
          (parseFloat(row.cgst) || 0) + (parseFloat(row.sgst) || 0);
      } else if (shouldShowIGST) {
        totalGSTValue += parseFloat(row.igst) || 0;
      }
      totalInvoiceValueSum += parseFloat(row.total_invoice) || 0;
    });
    const updatedTotalGST = isNilRated ? "0.00" : totalGSTValue.toFixed(2);
    const updatedInvoiceData = {
      ...invoiceData[0],
      taxable_amount: totalAmount.toFixed(2),
      totalall_gst: updatedTotalGST,
      total_invoice_value: totalInvoiceValueSum.toFixed(2),
    };
    if (
      updatedInvoiceData.taxable_amount !== invoiceData[0]?.taxable_amount ||
      updatedInvoiceData.totalall_gst !== invoiceData[0]?.totalall_gst ||
      updatedInvoiceData.total_invoice_value !==
      invoiceData[0]?.total_invoice_value
    ) {
      setInvoiceData([updatedInvoiceData]);
    }
  }, [rows, shouldShowCGSTSGST, shouldShowIGST, invoiceData]);
  useEffect(() => {
    const tdsTcsRate = parseFloat(invoiceData[0]?.tds_tcs_rate) || 0;
    const totalAmount = parseFloat(invoiceData[0]?.taxable_amount) || 0;
    const TotalAllInvoice = parseFloat(invoiceData[0]?.total_invoice_value) || 0;
    const amountToAddOrSubtract = ((totalAmount * tdsTcsRate) / 100).toFixed(2);
    setInvoiceData((prevData) =>
      prevData.map((data, index) =>
        index === 0
          ? {
            ...data,
            tcs: selectedTDSTCSOption === "tcs" ? amountToAddOrSubtract : 0,
            tds: selectedTDSTCSOption === "tds" ? amountToAddOrSubtract : 0,
            amount_receivable:
              selectedTDSTCSOption === "tcs"
                ? (
                  TotalAllInvoice + parseFloat(amountToAddOrSubtract)
                ).toFixed(2)
                : (
                  TotalAllInvoice - parseFloat(amountToAddOrSubtract)
                ).toFixed(2),
          }
          : data
      )
    );
  }, [
    invoiceData[0]?.taxable_amount,
    invoiceData[0]?.total_invoice_value,
    invoiceData[0]?.tds_tcs_rate,
    selectedTDSTCSOption,
  ]);
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        product: "",
        hsnCode: "",
        gstRate: "",
        description: "",
        unit: "",
        cgst: "0.00",
        sgst: "0.00",
        igst: "0.00",
      },
    ]);
  };
  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
  };
  const [salesInvoice, setSalesInvoice] = useState("100");
  const [purchaseErrors, setPurchaseErrors] = useState({})

  const purchaseRules = {
    // location: [
    //   { test: v => v.length > 0, message: "Office Location is required" }
    // ],
    contact: [
      { test: v => /^\d{10}$/.test(v), message: "Contact must be 10 digits" }
    ],
    address: [
      { test: v => v.length > 0, message: "Address is required" }
    ],
    city: [
      { test: v => v.length > 0, message: "City is required" }
    ],
    state: [
      { test: v => v.length > 0, message: "State is required" }
    ],
    country: [
      { test: v => v.length > 0, message: "Country is required" }
    ],
    // gst_no: [
    //   { test: v => v.length > 0, message: "Vendor GST is required" }
    // ],
    name: [
      { test: v => v.length > 0, message: "Vendor Name is required" }
    ],
    pan: [
      { test: v => v.length > 0, message: "PAN is required" },
      { test: v => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v), message: "Invalid PAN format" }
    ],
    email: [
      { test: v => v.length > 0, message: "Email is required" },
      { test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: "Invalid email format" }
    ],
    contact_vendor: [
      { test: v => /^\d{10}$/.test(v), message: "Vendor Contact must be 10 digits" }
    ],
    customer_vendor_type: [
      { test: v => v.customer || v.vendor, message: "Select at least Customer or Vendor" }
    ],
    invoice_date: [
      { test: v => v.length > 0, message: "Invoice Date is required" }
    ],
    month: [
      { test: v => v.length > 0, message: "Month is required" }
    ],
    product: [
      { test: v => v.length > 0, message: "Product is required" }
    ],
    hsnCode: [
      { test: v => /^\d+$/.test(v), message: "HSN must be numbers" }
    ],
    unit: [
      { test: v => v.length > 0, message: "Unit is required" }
    ],
    rate: [
      { test: v => v.length > 0, message: "Rate is required" },
      { test: v => !isNaN(v), message: "Rate must be numeric" }
    ]
  };

  const validatePurchaseField = (name, value) => {
    const fieldRules = purchaseRules[name];
    if (!fieldRules) return "";
    for (let rule of fieldRules) {
      if (!rule.test(value)) return rule.message;
    }
    return "";
  };

  const [activeTab, setActiveTab] = useState("1");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const newErrors = {};

    // Validate Office/Location formData
    Object.entries(formData).forEach(([key, value]) => {
      const errorMsg = validatePurchaseField(key, value);
      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

    // Validate Customer/Vendor vendorData
    Object.entries(vendorData).forEach(([key, value]) => {
      const errorMsg = validatePurchaseField(key, value);
      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

    // Validate Invoice Data (first object only)
    Object.entries(invoiceData[0]).forEach(([key, value]) => {
      const errorMsg = validatePurchaseField(key, value);
      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

    // Validate Products (rows)
    if (rows.length === 0 || rows.some(r => !r.product || !r.hsnCode || !r.unit || !r.rate)) {
      setActiveTab("2");
      toast.error("Please fill Product details before submitting.");
      return; // stop here
    }

    // If any errors → stop and show first toast
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      toast.error(newErrors[firstErrorField], {
        position: "top-right",
        autoClose: 2000,
      });

      // Optionally switch tab based on error
      if (firstErrorField.startsWith("row_")) {
        setActiveTab("2"); // Product tab
      } else if (Object.keys(vendorData).includes(firstErrorField)) {
        setActiveTab("1"); // Vendor tab
      }
      return;
    }

    const cleanedRows = rows.filter(
      (row) =>
        row.product.trim() !== "" &&
        row.hsnCode !== "" &&
        !isNaN(row.hsnCode) &&
        row.gstRate !== "" &&
        !isNaN(row.gstRate) &&
        row.unit !== "" &&
        row.rate !== "" &&
        !isNaN(row.rate)
    );

    if (rows.length !== cleanedRows.length) {
      toast.warning("Some empty product rows were ignored.");
    }

    const payload = {
      formData,
      vendorData,
      rows: cleanedRows,
      invoiceData,
      branchNoGst,
    };
    console.log('wholedata', payload)

    try {
      const response = await axiosInstance.put(
        `${API_URL}/api/update-purchase-post/${id}/${rowId}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 2000,
        });
        // dispatch(fetchClientDetails(id));
        dispatch(fetchClientDetails({ id, tabName: "Purchase" }));
        await fetchAllLocBranchDetails();
        handleCreateClose();
        resetFields();
      } else {
        toast.error(
          `Failed to Update PurchaseInvoice. Please try again.${response.data.message}`,
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle error response
      toast.error(
        `Failed to Update Purchase Invoice.${error.response.data.error_message} `,
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    }
  };
  useEffect(() => {
    const currentType = invoiceData[0]?.invoice_type.toLowerCase();

    if (currentType === "nil rated") {
      setRows((prevRows) =>
        prevRows.map((row) => ({
          ...row,
          cgst: "0.00",
          sgst: "0.00",
          igst: "0.00",
          total_invoice: parseFloat(row.product_amount || 0).toFixed(2),
        }))
      );
      setShouldShowIGST(false);
      setShouldShowCGSTSGST(false);
    } else if (currentType === "sez") {
      setRows((prevRows) =>
        prevRows.map((row) => {
          if (row.product_amount && row.gstRate) {
            const gstValue = (
              (parseFloat(row.gstRate) * parseFloat(row.product_amount)) /
              100
            ).toFixed(2);
            return {
              ...row,
              cgst: "0.00",
              sgst: "0.00",
              igst: gstValue,
              total_invoice: (
                parseFloat(row.product_amount) + parseFloat(gstValue)
              ).toFixed(2),
            };
          }
          return row;
        })
      );
      setShouldShowIGST(true);
      setShouldShowCGSTSGST(false);
    } else {
      const vendorGstPrefix = vendorData.gst_no?.slice(0, 2);
      const branchGstPrefix = branchNoGst?.slice(0, 2);

      if (vendorGstPrefix === branchGstPrefix) {
        setRows((prevRows) =>
          prevRows.map((row) => {
            if (row.product_amount && row.gstRate) {
              const gstValue = (
                (parseFloat(row.gstRate) * parseFloat(row.product_amount)) /
                100
              ).toFixed(2);
              const halfGst = (gstValue / 2).toFixed(2);
              return {
                ...row,
                cgst: halfGst,
                sgst: halfGst,
                igst: "0.00",
                total_invoice: (
                  parseFloat(row.product_amount) +
                  parseFloat(halfGst) +
                  parseFloat(halfGst)
                ).toFixed(2),
              };
            }
            return row;
          })
        );
        setShouldShowIGST(false);
        setShouldShowCGSTSGST(true);
      } else {
        // Different GST region: Show IGST
        setRows((prevRows) =>
          prevRows.map((row) => {
            if (row.product_amount && row.gstRate) {
              const gstValue = (
                (parseFloat(row.gstRate) * parseFloat(row.product_amount)) /
                100
              ).toFixed(2);
              return {
                ...row,
                cgst: "0.00",
                sgst: "0.00",
                igst: gstValue,
                total_invoice: (
                  parseFloat(row.product_amount) + parseFloat(gstValue)
                ).toFixed(2),
              };
            }
            return row;
          })
        );
        setShouldShowIGST(true);
        setShouldShowCGSTSGST(false);
      }
    }
  }, [invoiceData[0]?.invoice_type, vendorData.gst_no, branchNoGst]);
  useEffect(() => {
    if (invoiceData[0].tcs && parseFloat(invoiceData[0].tcs) > 0) {
      setSelectedTDSTCSOption("tcs");
    } else if (invoiceData[0].tds && parseFloat(invoiceData[0].tds) > 0) {
      setSelectedTDSTCSOption("tds");
    }
  }, [invoiceData]);
  useEffect(() => {
    if (!vendorData.gst_no) {
      setFilteredInvoiceTypes([
        "Select Entity Type",
        "Unregistered Local",
        "Unregistered Non-Local",
      ]);

      if (invoiceData[0].invoice_type.toLowerCase() === "unregistered local") {
        setShouldShowIGST(false);
        setShouldShowCGSTSGST(true);
      } else if (
        invoiceData[0].invoice_type.toLowerCase() === "unregistered non-local"
      ) {
        setShouldShowIGST(true);
        setShouldShowCGSTSGST(false);
      } else {
        setShouldShowIGST(false);
        setShouldShowCGSTSGST(false);
      }
    } else {
      setFilteredInvoiceTypes([
        "Select Entity Type",
        "B2B",
        "B2C-L",
        "BSC-O",
        "Nil Rated",
        "Advance Received",
        "SEZ",
        "Export",
      ]);

      const vendorGstPrefix = vendorData.gst_no.slice(0, 2);
      const branchGstPrefix = branchNoGst.slice(0, 2);

      if (
        vendorGstPrefix === branchGstPrefix &&
        invoiceData[0].invoice_type.toLowerCase() === "sez"
      ) {
        setShouldShowIGST(true);
        setShouldShowCGSTSGST(false);
      } else if (vendorGstPrefix === branchGstPrefix) {
        setShouldShowIGST(false);
        setShouldShowCGSTSGST(true);
      } else {
        setShouldShowIGST(true);
        setShouldShowCGSTSGST(false);
      }
    }
  }, [vendorData.gst_no, branchNoGst, invoiceData[0].invoice_type]);
  const truncateFileName = (fileName, maxLength = 20) => {
    if (typeof fileName !== "string") return "Invalid file name";
    if (fileName.length <= maxLength) return fileName;
    const start = fileName.slice(0, 10); // First 10 characters
    const end = fileName.slice(-10); // Last 10 characters
    return `${start}...${end}`;
  };
  const month = useRef(null);
  const invoice = useRef(null);
  const utilise = useRef(null);
  const handleDateChange = (date) => {
    if (isValid(date)) {
      const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY
      setInvoiceData((prevData) =>
        prevData.map((item, index) =>
          index === 0 ? { ...item, month: formattedDate } : item
        )
      );
    }
  };
  const handleToDateChange = (date) => {
    if (isValid(date)) {
      const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY
      setInvoiceData((prevData) =>
        prevData.map((item, index) =>
          index === 0 ? { ...item, invoice_date: formattedDate } : item
        )
      );
    }
  };
  const handleUtiliseChange = (date) => {
    if (isValid(date)) {
      const formattedDate = format(date, "dd-MM-yyyy");
      setInvoiceData((prevData) =>
        prevData.map((item, index) =>
          index === 0 ? { ...item, utilise_month: formattedDate } : item
        )
      );
    }
  }
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
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
              <>
                <div>
                  <form className=" my-5 w-full ">
                    <PurchaseInvoice invoiceData={bankData} />
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
          <Box sx={styleCreateModal} className="max-h-full overflow-scroll">
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              className="text-center border-b-2 border-[#366FA1] pb-3"
            >
              Update PurchaseInvoice Details
            </Typography>

            <form className=" my-5 w-full  " onSubmit={handleSubmit}>
              <div className="flex justify-between items-center font-bold text-[15px] text-primary my-1">
                Office Location Details
                {isBranchDropdownOpen && (
                  <Typography className="mt-0 text-sm italic text-red-600">
                    You are creating a new office location.
                  </Typography>
                )}
              </div>
              <div className="grid grid-cols-2">
                <div>
                  <div className="grid grid-cols-12 gap-2 mb-2">
                    <div className="col-span-4 border-r-2 border-primary">
                      <label htmlFor="account_no">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-semibold mb-2"
                        >
                          Office Location
                        </Typography>
                      </label>
                    </div>
                    <div className="col-span-8">
                      <div className="">
                        <Stack spacing={1} sx={{ width: 300 }}>
                          <Autocomplete
                            freeSolo
                            id="location-select"
                            disableClearable
                            options={offData}
                            required
                            getOptionLabel={(option) =>
                              typeof option === "string"
                                ? option
                                : option.location || ""
                            }
                            isOptionEqualToValue={(option, value) =>
                              option.location?.toLowerCase() ===
                              value?.toLowerCase()
                            }
                            value={formData.location || ""}
                            onInputChange={(event, newInputValue) => {
                              handleInputChangeLocation(event, newInputValue);
                            }}
                            onChange={(event, newValue) => {
                              handleLocationChange(newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                required
                                // value={formData.location || ""}
                                className="border border-red-500"
                                placeholder="Location Select"
                                sx={{
                                  "& .MuiInputBase-root": {
                                    height: 28,
                                    padding: "4px 6px",
                                  },
                                  "& .MuiOutlinedInput-input": {
                                    padding: "4px 6px",
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
                        </Stack>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-12 gap-2 mb-2">
                    <div className="col-span-4 border-r-2 border-primary">
                      <label htmlFor="contact">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-semibold"
                        >
                          Contact No
                        </Typography>
                      </label>
                    </div>
                    <div className="col-span-8">
                      <div className="h-7">
                        <Input
                          type="number"
                          size="md"
                          name="contact"
                          placeholder="Contact No"
                          required
                          value={formData.contact}
                          onChange={handleInputChange}
                          className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                          labelProps={{
                            className: "hidden",
                          }}
                          style={{
                            height: "28px",
                            padding: "4px 6px",
                            fontSize: "0.875rem",
                            width: 300,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-12 gap-2 mb-2">
                    <div className="col-span-4 border-r-2 border-primary">
                      <label htmlFor="address">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-semibold mb-2"
                        >
                          Address
                        </Typography>
                      </label>
                    </div>
                    <div className="col-span-8 h-7">
                      <div className="">
                        <Input
                          type="text"
                          size="md"
                          name="address"
                          placeholder="Address"
                          value={formData.address}
                          required
                          onChange={handleInputChange}
                          className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                          labelProps={{
                            className: "hidden",
                          }}
                          style={{
                            height: "28px", // Match this to your Autocomplete's root height
                            padding: "4px 6px", // Match this padding
                            fontSize: "0.875rem", // Ensure font size is consistent
                            width: 300,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-12 gap-2 mb-2">
                    <div className="col-span-4 border-r-2 border-primary">
                      <label htmlFor="address">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-semibold mb-2"
                        >
                          City
                        </Typography>
                      </label>
                    </div>
                    <div className="col-span-8 h-7">
                      <div className="">
                        <Input
                          type="text"
                          size="lg"
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          required
                          onChange={handleInputChange}
                          className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                          labelProps={{
                            className: "hidden",
                          }}
                          style={{
                            height: "28px",
                            padding: "4px 6px",
                            fontSize: "0.875rem",
                            width: 300,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-12 gap-2 mb-2">
                    <div className="col-span-4 border-r-2 border-primary">
                      <label htmlFor="address">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-semibold mb-2"
                        >
                          State
                        </Typography>
                      </label>
                    </div>
                    <div className="col-span-8 h-7">
                      <div className="">
                        <Input
                          type="text"
                          size="lg"
                          name="state"
                          placeholder="State"
                          value={formData.state}
                          required
                          onChange={handleInputChange}
                          className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                          labelProps={{
                            className: "hidden",
                          }}
                          style={{
                            height: "28px",
                            padding: "4px 6px",
                            fontSize: "0.875rem",
                            width: 300,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-12 gap-2 mb-2">
                    <div className="col-span-4 border-r-2 border-primary">
                      <label htmlFor="address">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-semibold mb-2"
                        >
                          Country
                        </Typography>
                      </label>
                    </div>
                    <div className="col-span-8 h-7">
                      <div className="">
                        <Input
                          type="text"
                          size="lg"
                          name="country"
                          placeholder="Country"
                          required
                          value={formData.country}
                          onChange={handleInputChange}
                          className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                          labelProps={{
                            className: "hidden",
                          }}
                          style={{
                            height: "28px",
                            padding: "4px 6px",
                            fontSize: "0.875rem",
                            width: 300,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-2 mb-2">
                  <div className="col-span-4 border-r-2 border-primary">
                    <label htmlFor="gst_no">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold"
                      >
                        Gst No
                      </Typography>
                    </label>
                  </div>
                  <div className="col-span-8">
                    {/* {" "} */}
                    <div className="h-7">
                      <Input
                        type="text"
                        size="md"
                        name="branchNoGst"
                        placeholder="GST No"
                        value={branchNoGst}
                        required
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        style={{
                          height: "28px",
                          padding: "4px 6px",
                          fontSize: "0.875rem",
                          width: 300,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  {showBranchInput && (
                    <div className="grid grid-cols-12 gap-2 mb-2">
                      <div className="col-span-4 border-r-2 border-primary">
                        <label htmlFor="address">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="block font-semibold mb-2"
                          >
                            Branch
                          </Typography>
                        </label>
                      </div>
                      <div className="col-span-8 h-7">
                        <div className="">
                          <Stack spacing={1} sx={{ width: 300 }}>
                            <Autocomplete
                              freeSolo
                              id="branch-select"
                              disableClearable
                              required
                              options={branch_ser_name}
                              getOptionLabel={(option) =>
                                option.branch_name || ""
                              }
                              onChange={(event, newValue) =>
                                handleLocationChange(newValue, true)
                              }
                              onOpen={() => setIsBranchDropdownOpen(true)}
                              onClose={() => setIsBranchDropdownOpen(false)}
                              renderOption={(props, option) => (
                                <li
                                  {...props}
                                  key={option.id}
                                  style={{
                                    padding: "4px 8px",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {option.branch_name}
                                </li>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  value={formData.branchID || ""}
                                  className="border border-red-500"
                                  placeholder="Branch Select"
                                  inputProps={{
                                    ...params.inputProps,
                                    readOnly: true,
                                  }}
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: 28,
                                      padding: "4px 6px",
                                    },
                                    "& .MuiOutlinedInput-input": {
                                      padding: "4px 6px",
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
                          </Stack>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t-2 my-3 border-[#366FA1]">
                <div className="grid gap-x-5 lg:gap-x-6 2xl:gap-x-0 grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 my-2">
                  <div>
                    <div>
                      <label htmlFor="invoice_no">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-semibold mb-1"
                        >
                          Invoice No
                        </Typography>
                      </label>
                    </div>
                    <div className="">
                      <Input
                        type="text"
                        size="md"
                        name="invoice_no"
                        required
                        placeholder="Invoice No"
                        value={invoiceData[0].invoice_no}
                        onChange={handleInputChangeInvoiceData}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        style={{
                          height: "28px",
                          padding: "4px 6px",
                          fontSize: "0.875rem",
                          width: 300,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div>
                      <label htmlFor="attach_invoice">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-semibold mb-1"
                        >
                          Attach Invoice
                        </Typography>
                      </label>
                    </div>
                    <div className="">
                      <input
                        type="file"
                        size="md"
                        name="attach_invoice"
                        // required
                        placeholder="Invoice Date"
                        onChange={handleInputChangeInvoiceData}
                      />
                      <div className="flex gap-2 pt-1">
                        <ImFilePicture
                          size={20}
                          color="#366FA1"
                          className="mb-1"
                        />
                        <a
                          href={
                            typeof invoiceData[0]?.attach_invoice === "string"
                              ? `https://admin.dms.zacoinfotech.com${invoiceData[0]?.attach_invoice}`
                              : "#"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <p className="text-blue-500">
                            {invoiceData[0]?.attach_invoice
                              ? typeof invoiceData[0]?.attach_invoice ===
                                "string"
                                ? truncateFileName(
                                  invoiceData[0].attach_invoice
                                    .split("/")
                                    .pop()
                                )
                                : invoiceData[0]?.attach_invoice.name
                              : "No file uploaded"}
                          </p>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div>
                      <label htmlFor="attach_e_way_bill">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-semibold mb-1"
                        >
                          Eway Bill
                        </Typography>
                      </label>
                    </div>
                    <div className="">
                      <input
                        type="file"
                        size="md"
                        // required
                        name="attach_e_way_bill"
                        placeholder="attach_e_way_bill"
                        onChange={handleInputChangeInvoiceData}
                      />
                      <div className="flex gap-2 pt-1">
                        <ImFilePicture
                          size={20}
                          color="#366FA1"
                          className="mb-1"
                        />

                        <a
                          href={
                            typeof invoiceData[0]?.attach_e_way_bill ===
                              "string"
                              ? `https://admin.dms.zacoinfotech.com${invoiceData[0]?.attach_e_way_bill}`
                              : "#"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <p className="text-blue-500">
                            {invoiceData[0]?.attach_e_way_bill
                              ? typeof invoiceData[0]?.attach_e_way_bill ===
                                "string"
                                ? truncateFileName(
                                  invoiceData[0].attach_e_way_bill
                                    .split("/")
                                    .pop()
                                )
                                : invoiceData[0]?.attach_e_way_bill.name
                              : "No file uploaded"}
                          </p>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div>
                      <label htmlFor="month">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-semibold mb-1"
                        >
                          Month
                        </Typography>
                      </label>
                    </div>
                    <div className="relative w-full">
                      <DatePicker
                        ref={month}
                        selected={
                          invoiceData[0]?.month
                            ? isValid(parse(invoiceData[0].month, "dd-MM-yyyy", new Date()))
                              ? parse(invoiceData[0].month, "dd-MM-yyyy", new Date())
                              : null
                            : null
                        }
                        onChange={handleDateChange}
                        value={invoiceData[0].month}
                        required
                        dateFormat="dd-MM-yyyy"
                        className="w-full !border !border-[#cecece] bg-white py-0.5 pl-3 text-gray-900 
                                    focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md outline-none"
                        placeholderText="dd-mm-yyyy"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={25}
                      />
                      <FaRegCalendarAlt
                        className="absolute top-1/2 left-40 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        onClick={() => month.current.setFocus()}
                      />
                    </div>
                  </div>

                  <div>
                    <div>
                      <label htmlFor="invoice_date">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-semibold mb-1"
                        >
                          Invoice Date
                        </Typography>
                      </label>
                    </div>
                    <div className="relative w-full">
                      <DatePicker
                        ref={invoice}
                        selected={
                          invoiceData[0]?.invoice_date
                            ? isValid(parse(invoiceData[0].invoice_date, "dd-MM-yyyy", new Date()))
                              ? parse(invoiceData[0].invoice_date, "dd-MM-yyyy", new Date())
                              : null
                            : null
                        }
                        value={invoiceData[0].invoice_date}
                        onChange={handleToDateChange}
                        required
                        dateFormat="dd-MM-yyyy"
                        className="w-full !border !border-[#cecece] bg-white py-0.5 pl-3 text-gray-900 
                                            focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md outline-none"
                        placeholderText="dd-mm-yyyy"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={25}
                      />
                      <FaRegCalendarAlt
                        className="absolute top-1/2 left-40 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        onClick={() => invoice.current.setFocus()}
                      />
                    </div>
                  </div>

                  <div>
                    <div>
                      <div>
                        <label htmlFor="utilise_month">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="block font-semibold mb-1 "
                          >
                            Utilise Month
                          </Typography>
                        </label>
                      </div>
                      <div className="relative w-full">
                        <DatePicker
                          ref={utilise}
                          selected={
                            invoiceData[0]?.utilise_month
                              ? isValid(parse(invoiceData[0].utilise_month, "dd-MM-yyyy", new Date()))
                                ? parse(invoiceData[0].utilise_month, "dd-MM-yyyy", new Date())
                                : null
                              : null
                          }
                          value={invoiceData[0].utilise_month}
                          onChange={handleUtiliseChange}
                          required
                          dateFormat="dd-MM-yyyy"
                          className="w-full !border !border-[#cecece] bg-white py-0.5 pl-3 text-gray-900 
                                            focus:!border-[#366FA1] focus:!border-t-[#366FA1] rounded-md outline-none"
                          placeholderText="dd-mm-yyyy"
                          showYearDropdown
                          PopperProps={{
                            style: { zIndex: 1500 },
                          }}
                          scrollableYearDropdown
                          yearDropdownItemNumber={25}
                        />
                        <FaRegCalendarAlt
                          className="absolute top-1/2 left-40 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                          onClick={() => utilise.current.setFocus()}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex  align-middle items-center gap-5 mt-2">
                    <div>
                      <label htmlFor="utilise_edit">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-semibold mb-1"
                        >
                          Utilise Edit
                        </Typography>
                      </label>
                    </div>
                    <div className="">
                      <Checkbox
                        name="utilise_edit"
                        ripple={false}
                        required
                        checked={invoiceData[0]?.utilise_edit || false} // Access the first entry in the array
                        className="h-5 w-5 rounded-md border-gray-900/20 bg-gray-900/10 transition-all hover:scale-105 hover:before:opacity-0"
                        onChange={handleInputChangeInvoiceData} // Updated function
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="py-5 px-0">
                  <div className="bg-secondary px-0 py-3 rounded-md ">
                    <Box sx={{ width: "100%", typography: "body1" }}>
                      <TabContext value={activeTab}>
                        <Box
                          sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            padding: 0,
                            margin: 0,
                            minHeight: "25px",
                          }}
                        >
                          <TabList
                            onChange={handleChange}
                            aria-label="customized tabs example"
                            TabIndicatorProps={{
                              sx: {
                                display: "none",
                                padding: 0,
                                margin: 0,
                              },
                            }}
                            sx={{
                              padding: 0,
                              minHeight: "20px",
                            }}
                          >
                            <Tab
                              label="Customer And Vendor Details"
                              value="1"
                              sx={{
                                padding: "0px 10px",
                                minHeight: "0px",
                                lineHeight: "2.2",
                                fontSize: "0.75rem",
                                "&.Mui-selected": {
                                  color: "primary.main",
                                  fontWeight: "bold",
                                  borderTop: "1px solid",
                                  borderLeft: "1px solid",
                                  borderRight: "1px solid",
                                  borderBottom: "0px",
                                  borderColor: "primary.main",
                                },
                                "&:hover": {
                                  color: "primary.main",
                                },
                              }}
                            />
                            <Tab
                              label="Product Details"
                              value="2"
                              sx={{
                                padding: "0px 10px",
                                minHeight: "25px",
                                lineHeight: "2.2",
                                fontSize: "0.75rem",
                                "&.Mui-selected": {
                                  color: "primary.main",
                                  fontWeight: "bold",
                                  borderTop: "1px solid",
                                  borderLeft: "1px solid",
                                  borderRight: "1px solid",
                                  borderBottom: "0px",
                                  borderColor: "primary.main",
                                },
                                "&:hover": {
                                  color: "primary.main",
                                },
                              }}
                            />
                          </TabList>
                        </Box>

                        <TabPanel value="1" sx={{ padding: "20px 0" }}>
                          <div className="grid grid-cols-2">
                            <div>
                              <div className="grid grid-cols-12 gap-2 3">
                                <div className="col-span-4 border-r-2 border-primary">
                                  <label htmlFor="account_no">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="block font-semibold mb-2"
                                    >
                                      Gst No
                                    </Typography>
                                  </label>
                                </div>
                                <div className="col-span-8">
                                  <div className="">
                                    <Autocomplete
                                      sx={{ width: 300 }}
                                      freeSolo
                                      id="gst-no-autocomplete"
                                      disableClearable
                                      required
                                      options={customerData}
                                      getOptionLabel={(option) =>
                                        typeof option === "string"
                                          ? option
                                          : option.gst_no || ""
                                      }
                                      onChange={handleGstNoChange}
                                      value={vendorData.gst_no || ""}
                                      renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                          {option.gst_no} ({option.name})
                                        </li>
                                      )}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size="small"
                                          name="gst_no"
                                          value={vendorData.gst_no || ""}
                                          required
                                          onChange={(e) =>
                                            handleGstNoChange(e, e.target.value)
                                          }
                                          placeholder="Enter or select GST No."
                                          sx={{
                                            "& .MuiInputBase-root": {
                                              height: 28,
                                              padding: "4px 6px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                              padding: "4px 6px",
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
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="grid grid-cols-12 gap-2 mb-3">
                                <div className="col-span-4 border-r-2 border-primary">
                                  <label htmlFor="name">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="block font-semibold mb-2"
                                    >
                                      Name
                                    </Typography>
                                  </label>
                                </div>
                                <div className="col-span-8">
                                  {" "}
                                  <Autocomplete
                                    sx={{ width: 300 }}
                                    freeSolo
                                    id="name-autocomplete"
                                    disableClearable
                                    options={customerData}
                                    required
                                    getOptionLabel={(option) =>
                                      typeof option === "string"
                                        ? option
                                        : option.name || ""
                                    }
                                    onChange={handleNameChange}
                                    value={vendorData.name || ""}
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
                                        value={vendorData.name || ""}
                                        required
                                        onChange={(e) =>
                                          handleNameChange(e, e.target.value)
                                        }
                                        placeholder="Enter or select Name"
                                        sx={{
                                          "& .MuiInputBase-root": {
                                            height: 28,
                                            padding: "4px 6px",
                                          },
                                          "& .MuiOutlinedInput-input": {
                                            padding: "4px 6px",
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

                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="grid grid-cols-12 gap-2 mb-3">
                                <div className="col-span-4 border-r-2 border-primary">
                                  <label htmlFor="address">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="block font-semibold mb-2"
                                    >
                                      PAN
                                    </Typography>
                                  </label>
                                </div>
                                <div className="col-span-8 h-7">
                                  <div className="">
                                    <Input
                                      type="text"
                                      size="lg"
                                      name="pan"
                                      placeholder="PAN No"
                                      value={vendorData.pan}
                                      required
                                      onChange={handleInputChangeCL}
                                      className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                                      labelProps={{
                                        className: "hidden",
                                      }}
                                      style={{
                                        height: "28px",
                                        padding: "4px 6px",
                                        fontSize: "0.875rem",
                                        width: 300,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="grid grid-cols-12 gap-2 mb-3">
                                <div className="col-span-4 border-r-2 border-primary">
                                  <label htmlFor="address">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="block font-semibold mb-2"
                                    >
                                      Customer Address
                                    </Typography>
                                  </label>
                                </div>
                                <div className="col-span-8 h-7">
                                  <div className="">
                                    <Input
                                      type="text"
                                      size="lg"
                                      name="vendor_address"
                                      placeholder="Customer Address"
                                      value={vendorData.vendor_address}
                                      required
                                      onChange={handleInputChangeCL}
                                      className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                                      labelProps={{
                                        className: "hidden",
                                      }}
                                      style={{
                                        height: "28px",
                                        padding: "4px 6px",
                                        fontSize: "0.875rem",
                                        width: 300,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="grid grid-cols-12 gap-2 mb-3">
                                <div className="col-span-4 border-r-2 border-primary">
                                  <label htmlFor="email">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="block font-semibold mb-2"
                                    >
                                      Email
                                    </Typography>
                                  </label>
                                </div>
                                <div className="col-span-8 h-7">
                                  <div className="">
                                    <Input
                                      type="email"
                                      size="lg"
                                      name="email"
                                      placeholder="Email"
                                      value={vendorData.email}
                                      required
                                      onChange={handleInputChangeCL}
                                      className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                                      labelProps={{
                                        className: "hidden",
                                      }}
                                      style={{
                                        height: "28px",
                                        padding: "4px 6px",
                                        fontSize: "0.875rem",
                                        width: 300,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="grid grid-cols-12 gap-2 mb-3">
                                <div className="col-span-4 border-r-2 border-primary">
                                  <label htmlFor="contact">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="block font-semibold mb-2"
                                    >
                                      Contact No
                                    </Typography>
                                  </label>
                                </div>
                                <div className="col-span-8 h-7">
                                  <div className="">
                                    <Input
                                      type="text"
                                      size="lg"
                                      name="contact"
                                      placeholder="Contact No"
                                      value={vendorData.contact}
                                      required
                                      onChange={handleInputChangeCL}
                                      className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                                      labelProps={{
                                        className: "hidden",
                                      }}
                                      style={{
                                        height: "28px",
                                        padding: "4px 6px",
                                        fontSize: "0.875rem",
                                        width: 300,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="grid grid-cols-12 gap-2 mb-3 ">
                                <div className="col-span-4 border-r-2 border-primary">
                                  <label htmlFor="address">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="block font-semibold mb-2"
                                    >
                                      Customer Type
                                    </Typography>
                                  </label>
                                </div>
                                <div className="col-span-8 h-7">
                                  <div className="">
                                    <div className="">
                                      <div className="col-span-4 my-auto">
                                        <div className="flex gap-10">
                                          <Checkbox
                                            name="customer"
                                            label="Customer"
                                            ripple={false}
                                            checked={
                                              vendorData.customer || false
                                            }
                                            className="h-5 w-5 rounded-full border-gray-900/20 bg-gray-900/10 transition-all hover:scale-105 hover:before:opacity-0 "
                                            onChange={(e) =>
                                              setVendorData(
                                                (prevVendorData) => ({
                                                  ...prevVendorData,
                                                  customer: e.target.checked,
                                                })
                                              )
                                            }
                                          />
                                          <Checkbox
                                            name="vendor"
                                            label="Vendor"
                                            ripple={false}
                                            checked={vendorData.vendor || false}
                                            onChange={(e) =>
                                              setVendorData(
                                                (prevVendorData) => ({
                                                  ...prevVendorData,
                                                  vendor: e.target.checked,
                                                })
                                              )
                                            }
                                            className="h-5 w-5 rounded-full border-gray-900/20 bg-gray-900/10 transition-all hover:scale-105 hover:before:opacity-0"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabPanel>
                        <TabPanel value="2" sx={{ padding: "8px 0" }}>
                          <div>
                            <TableContainer
                              component={Paper}
                              className=" rounded-lg mt-3"
                              style={{ maxHeight: "200px", overflowY: "auto", backgroundColor: "#f3f4f6", position: "relative", }}
                            >
                              <Table>
                                <TableHead
                                  sx={{
                                    backgroundColor: "#f3f4f6",
                                    position: "sticky",
                                    top: 0,
                                    borderBottom: "1px solid #ccc",

                                  }}
                                >
                                  <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                                    <TableCell
                                      className="font-semibold text-gray-600"
                                      sx={{ padding: "4px" }}
                                    >
                                      Product
                                    </TableCell>
                                    <TableCell
                                      className="font-semibold text-gray-600"
                                      sx={{ padding: "4px" }}
                                    >
                                      Description
                                    </TableCell>
                                    <TableCell
                                      className="font-semibold text-gray-600"
                                      sx={{ padding: "4px" }}
                                    >
                                      HSN Code
                                    </TableCell>
                                    <TableCell
                                      className="font-semibold text-gray-600"
                                      sx={{ padding: "4px" }}
                                    >
                                      Unit
                                    </TableCell>
                                    <TableCell
                                      className="font-semibold text-gray-600"
                                      sx={{ padding: "4px" }}
                                    >
                                      Rate
                                    </TableCell>
                                    <TableCell
                                      className="font-semibold text-gray-600"
                                      sx={{ padding: "4px" }}
                                    >
                                      Amount
                                    </TableCell>
                                    <TableCell
                                      className="font-semibold text-gray-600"
                                      sx={{ padding: "4px" }}
                                    >
                                      GST Rate
                                    </TableCell>

                                    {shouldShowCGSTSGST && (
                                      <>
                                        <TableCell
                                          className="font-semibold text-gray-600"
                                          sx={{ padding: "4px" }}
                                        >
                                          SGST
                                        </TableCell>
                                        <TableCell
                                          className="font-semibold text-gray-600"
                                          sx={{ padding: "4px" }}
                                        >
                                          CGST
                                        </TableCell>
                                      </>
                                    )}

                                    {shouldShowIGST && (
                                      <TableCell
                                        className="font-semibold text-gray-600"
                                        sx={{ padding: "4px" }}
                                      >
                                        Igst
                                      </TableCell>
                                    )}
                                    <TableCell
                                      className="font-semibold text-gray-600"
                                      sx={{ padding: "4px" }}
                                    >
                                      Total Invoice{" "}
                                    </TableCell>
                                    <TableCell
                                      className="font-semibold text-gray-600"
                                      sx={{ padding: "4px" }}
                                    ></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {rows.map((row, index) => (
                                    <TableRow key={index} className="p-0 ">
                                      <TableCell sx={{ padding: "6px" }}>
                                        <Autocomplete
                                          freeSolo
                                          id={`product-autocomplete-${index}`}
                                          disableClearable
                                          options={product_ser_Data}
                                          getOptionLabel={(option) =>
                                            option.product_name || ""
                                          }
                                          onChange={(event, newValue) =>
                                            handleProductChange(index, newValue)
                                          }
                                          inputValue={row.product || ""}
                                          onInputChange={(event, value) =>
                                            handleInputChangeProductField(
                                              index,
                                              value
                                            )
                                          }
                                          value={
                                            product_ser_Data.find(
                                              (option) =>
                                                option.product_name ===
                                                row.product
                                            ) || null
                                          }
                                          renderOption={(props, option) => (
                                            <li {...props} key={option.id}>
                                              {option.product_name}
                                            </li>
                                          )}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              size="small"
                                              placeholder="select product"
                                              name="product_name"
                                              required
                                              sx={{
                                                "& .MuiOutlinedInput-root": {
                                                  padding: "2px",
                                                  fontSize: "0.875rem",
                                                  minHeight: "30px",
                                                  width: "200px",
                                                },
                                                "& .MuiOutlinedInput-input": {
                                                  padding: "4px",
                                                },
                                              }}
                                            />
                                          )}
                                        />
                                      </TableCell>
                                      <TableCell sx={{ padding: "6px" }}>
                                        <TextField
                                          type="text"
                                          name="description"
                                          required
                                          value={row.description}
                                          onChange={(e) =>
                                            handleInputChangeProduct(
                                              index,
                                              "description",
                                              e.target.value
                                            )
                                          }
                                          variant="outlined"
                                          size="small"
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              padding: "2px",
                                              fontSize: "0.875rem",
                                              minHeight: "30px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                              padding: "4px",
                                            },
                                          }}
                                        />
                                      </TableCell>

                                      <TableCell sx={{ padding: "6px" }}>
                                        <TextField
                                          value={row.hsnCode}
                                          type="text"
                                          name="hsn_code"
                                          required
                                          onChange={(e) => {
                                            const inputValue = e.target.value;
                                            // Allow only numbers
                                            if (/^\d*$/.test(inputValue)) {
                                              handleInputChangeProduct(
                                                index,
                                                "hsnCode",
                                                inputValue
                                              );
                                            }
                                          }}
                                          variant="outlined"
                                          size="small"
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              padding: "2px",
                                              fontSize: "0.875rem",
                                              minHeight: "30px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                              padding: "4px",
                                            },
                                          }}
                                        />
                                      </TableCell>

                                      <TableCell sx={{ padding: "6px" }}>
                                        <TextField
                                          value={row.unit}
                                          required
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                              handleInputChangeProduct(
                                                index,
                                                "unit",
                                                value
                                              );
                                            }
                                          }}
                                          variant="outlined"
                                          size="small"
                                          type="text"
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              padding: "2px",
                                              fontSize: "0.875rem",
                                              minHeight: "30px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                              padding: "4px",
                                            },
                                          }}
                                        />
                                      </TableCell>

                                      <TableCell sx={{ padding: "6px" }}>
                                        <TextField
                                          value={row.rate}
                                          type="text"
                                          required
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                              handleInputChangeProduct(
                                                index,
                                                "rate",
                                                value
                                              );
                                            }
                                          }}
                                          variant="outlined"
                                          size="small"
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              padding: "2px",
                                              fontSize: "0.875rem",
                                              minHeight: "30px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                              padding: "4px",
                                            },
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell sx={{ padding: "6px" }}>
                                        <TextField
                                          value={row.product_amount}
                                          type="text"
                                          required
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                              handleInputChangeProduct(
                                                index,
                                                "product_amount",
                                                value
                                              );
                                            }
                                          }}
                                          variant="outlined"
                                          size="small"
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              padding: "2px",
                                              fontSize: "0.875rem",
                                              minHeight: "30px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                              padding: "4px",
                                            },
                                          }}
                                          slotProps={{
                                            inputLabel: {
                                              shrink: true,
                                            },
                                          }}
                                          inputProps={{
                                            readOnly: true,
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell sx={{ padding: "6px" }}>
                                        <TextField
                                          value={row.gstRate}
                                          type="text"
                                          required
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                              handleInputChangeProduct(
                                                index,
                                                "gstRate",
                                                value
                                              );
                                            }
                                          }}
                                          variant="outlined"
                                          size="small"
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              padding: "2px",
                                              fontSize: "0.875rem",
                                              minHeight: "30px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                              padding: "4px",
                                            },
                                          }}
                                        />
                                      </TableCell>

                                      {shouldShowCGSTSGST && (
                                        <>
                                          <TableCell sx={{ padding: "6px" }}>
                                            <TextField
                                              value={row.cgst || ""}
                                              type="text"
                                              required
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d*$/.test(value)) {
                                                  handleInputChangeProduct(
                                                    index,
                                                    "cgst",
                                                    value
                                                  );
                                                }
                                              }}
                                              variant="outlined"
                                              size="small"
                                              sx={{
                                                "& .MuiOutlinedInput-root": {
                                                  padding: "2px",
                                                  fontSize: "0.875rem",
                                                  minHeight: "30px",
                                                },
                                                "& .MuiOutlinedInput-input": {
                                                  padding: "4px",
                                                },
                                              }}
                                              slotProps={{
                                                inputLabel: {
                                                  shrink: true,
                                                },
                                              }}
                                              inputProps={{
                                                readOnly: true,
                                              }}
                                            />
                                          </TableCell>
                                          <TableCell sx={{ padding: "6px" }}>
                                            <TextField
                                              value={row.sgst || ""}
                                              type="number"
                                              required
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d*$/.test(value)) {
                                                  handleInputChangeProduct(
                                                    index,
                                                    "sgst",
                                                    value
                                                  );
                                                }
                                              }}
                                              variant="outlined"
                                              size="small"
                                              sx={{
                                                "& .MuiOutlinedInput-root": {
                                                  padding: "2px",
                                                  fontSize: "0.875rem",
                                                  minHeight: "30px",
                                                },
                                                "& .MuiOutlinedInput-input": {
                                                  padding: "4px",
                                                },
                                              }}
                                              slotProps={{
                                                inputLabel: {
                                                  shrink: true,
                                                },
                                              }}
                                              inputProps={{
                                                readOnly: true,
                                              }}
                                            />
                                          </TableCell>
                                        </>
                                      )}

                                      {shouldShowIGST && (
                                        <TableCell sx={{ padding: "6px" }}>
                                          <TextField
                                            value={row.igst || ""}
                                            type="number"
                                            required
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              if (/^\d*$/.test(value)) {
                                                handleInputChangeProduct(
                                                  index,
                                                  "igst",
                                                  value
                                                );
                                              }
                                            }}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                              "& .MuiOutlinedInput-root": {
                                                padding: "2px",
                                                fontSize: "0.875rem",
                                                minHeight: "30px",
                                              },
                                              "& .MuiOutlinedInput-input": {
                                                padding: "4px",
                                              },
                                            }}
                                            slotProps={{
                                              inputLabel: {
                                                shrink: true,
                                              },
                                            }}
                                            inputProps={{
                                              readOnly: true,
                                            }}
                                          />
                                        </TableCell>
                                      )}

                                      <TableCell sx={{ padding: "6px" }}>
                                        <TextField
                                          value={row.total_invoice}
                                          type="number"
                                          required
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                              handleInputChangeProduct(
                                                index,
                                                "total_invoice",
                                                value
                                              );
                                            }
                                          }}
                                          variant="outlined"
                                          size="small"
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              padding: "2px",
                                              fontSize: "0.875rem",
                                              minHeight: "30px",
                                            },
                                            "& .MuiOutlinedInput-input": {
                                              padding: "4px",
                                            },
                                          }}
                                          slotProps={{
                                            inputLabel: {
                                              shrink: true,
                                            },
                                          }}
                                          inputProps={{
                                            readOnly: true,
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell sx={{ padding: "6px" }}>
                                        <IconButton
                                          size="small"
                                          color="error"
                                          onClick={() => handleDeleteRow(index)}
                                          aria-label="delete"
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  {/* </div> */}
                                  <TableRow>
                                    <TableCell
                                      colSpan={12}
                                      className="text-blue-500 space-x-5 text-sm"
                                    >
                                      <div className="flex justify-between">
                                        <div>
                                          <button
                                            onClick={handleAddRow}
                                            type="button"
                                            className=" bg-primary text-white p-2 rounded-md"
                                          >
                                            Add New Product
                                          </button>
                                        </div>
                                        <div className="flex gap-4 py-3">
                                          <div>
                                            <div>
                                              <label htmlFor="invoice_type">
                                                <Typography
                                                  variant="small"
                                                  color="blue-gray"
                                                  className="block font-semibold mb-1"
                                                >
                                                  Invoice Type
                                                </Typography>
                                              </label>
                                            </div>
                                            <div className="">
                                              <div className="">
                                                <select
                                                  name="invoice_type"
                                                  required
                                                  className="!border !border-[#cecece] bg-white pt-1 rounded-md text-gray-900 text-sm ring-4 ring-transparent placeholder-gray-500 focus:!border-[#366FA1] focus:outline-none focus:ring-0 min-w-[80px]"
                                                  style={{
                                                    height: "28px",
                                                    padding: "4px 6px",
                                                    fontSize: "0.875rem",
                                                    width: 300,
                                                  }}
                                                  value={invoiceData[0].invoice_type}
                                                  onChange={handleInputChangeInvoiceData}
                                                >
                                                  <option value="">Select Invoice Type</option>

                                                  {vendorData.gst_no === ""
                                                    ? ["Unregistered Local", "Unregistered Non-Local"].map((option) => (
                                                      <option key={option} value={option.toLowerCase()}>
                                                        {option}
                                                      </option>
                                                    ))
                                                    : [
                                                      "B2B",
                                                      "B2C-L",
                                                      "BSC-O",
                                                      "Nil Rated",
                                                      "Advance Received",
                                                      "SEZ",
                                                      "Export",
                                                    ].map((option) => (
                                                      <option key={option} value={option.toLowerCase()}>
                                                        {option}
                                                      </option>
                                                    ))}
                                                </select>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="w-36">
                                            <div className="col-span-6 font-bold mb-1 ">
                                              Taxable Amount :
                                            </div>
                                            <TextField
                                              value={
                                                invoiceData[0].taxable_amount
                                              }
                                              required
                                              variant="outlined"
                                              size="small"
                                              sx={{
                                                "& .MuiOutlinedInput-root": {
                                                  padding: "2px",
                                                  fontSize: "0.875rem",
                                                  minHeight: "30px",
                                                },
                                                "& .MuiOutlinedInput-input": {
                                                  padding: "4px",
                                                },
                                              }}
                                            />
                                          </div>
                                          <div className="w-36">
                                            <div className="col-span-6 font-bold mb-1 ">
                                              Total Gst Amount :
                                            </div>
                                            <TextField
                                              value={
                                                invoiceData[0].totalall_gst
                                              }
                                              required
                                              variant="outlined"
                                              size="small"
                                              sx={{
                                                "& .MuiOutlinedInput-root": {
                                                  padding: "2px",
                                                  fontSize: "0.875rem",
                                                  minHeight: "30px",
                                                },
                                                "& .MuiOutlinedInput-input": {
                                                  padding: "4px",
                                                },
                                              }}
                                            />
                                          </div>
                                          <div className="w-36">
                                            <div className="col-span-6 font-bold mb-1 ">
                                              Total Invoice Value :
                                            </div>
                                            <TextField
                                              value={
                                                invoiceData[0]
                                                  .total_invoice_value
                                              }
                                              required
                                              variant="outlined"
                                              size="small"
                                              sx={{
                                                "& .MuiOutlinedInput-root": {
                                                  padding: "2px",
                                                  fontSize: "0.875rem",
                                                  minHeight: "30px",
                                                },
                                                "& .MuiOutlinedInput-input": {
                                                  padding: "4px",
                                                },
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                            <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 my-2">
                              <div className="hidden 2xl:block col-span-1"></div>
                              <div className="col-span-1">
                              </div>
                              <div className="col-span-1">
                                <label htmlFor="invoice_type">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="block font-semibold mb-1"
                                  >
                                    Select TDS/TCS
                                  </Typography>
                                </label>
                                <div className="text-sm my-2">
                                  <select
                                    id="option"
                                    value={selectedTDSTCSOption}
                                    onChange={(e) =>
                                      setSelectedTDSTCSOption(e.target.value)
                                    }
                                    className="mt-2 block w-full px-0.5 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  >
                                    <option value="" disabled>
                                      Choose TDS/TCS
                                    </option>
                                    <option value="tcs">TCS</option>
                                    <option value="tds">TDS</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-span-1 ">
                                <div className=" text-sm ">
                                  <div className="">
                                    {selectedTDSTCSOption === "tcs" && (
                                      <>
                                        <div>
                                          Enter Your {selectedTDSTCSOption}
                                        </div>
                                        <div className="flex gap-5 ">
                                          <div>
                                            <input
                                              id="tcs"
                                              type="text"
                                              placeholder="Enter TCS Rate"
                                              name="tds_tcs_rate"
                                              value={
                                                invoiceData[0].tds_tcs_rate
                                              }
                                              onChange={
                                                handleInputChangeInvoiceData
                                              }
                                              onInput={(e) => {
                                                e.target.value =
                                                  e.target.value.replace(
                                                    /[^0-9.]/g,
                                                    ""
                                                  );
                                              }}
                                              className="mt-2 block w-full px-2 py-0.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                          </div>
                                          <div>
                                            <input
                                              id="tcs"
                                              type="text"
                                              name="tcs"
                                              placeholder="Enter TCS value"
                                              value={invoiceData[0].tcs}
                                              onChange={
                                                handleInputChangeInvoiceData
                                              }
                                              onInput={(e) => {
                                                e.target.value =
                                                  e.target.value.replace(
                                                    /[^0-9.]/g,
                                                    ""
                                                  );
                                              }}
                                              className="mt-2 block w-full px-2 py-0.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    {selectedTDSTCSOption === "tds" && (
                                      <>
                                        <div>
                                          Enter Your {selectedTDSTCSOption}
                                        </div>
                                        <div className="flex gap-5 ">
                                          <div>
                                            <input
                                              id="tcs"
                                              type="text"
                                              placeholder="Enter TDS Rate"
                                              name="tds_tcs_rate"
                                              onChange={
                                                handleInputChangeInvoiceData
                                              }
                                              value={
                                                invoiceData[0].tds_tcs_rate
                                              }
                                              onInput={(e) => {
                                                e.target.value =
                                                  e.target.value.replace(
                                                    /[^0-9.]/g,
                                                    ""
                                                  );
                                              }}
                                              className="mt-2 block w-full px-2 py-0.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                          </div>
                                          <div>
                                            <input
                                              id="tds"
                                              type="text"
                                              name="tds"
                                              placeholder="Enter TDS value"
                                              onChange={
                                                handleInputChangeInvoiceData
                                              }
                                              value={invoiceData[0].tds}
                                              onInput={(e) => {
                                                e.target.value =
                                                  e.target.value.replace(
                                                    /[^0-9.]/g,
                                                    ""
                                                  );
                                              }}
                                              className="mt-2 block w-full px-2 py-0.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-12 text-sm mt-3 my-auto">
                                  <div className="col-span-6 font-bold">
                                    Amount Receivable :
                                  </div>
                                  <div className="col-span-6">
                                    <TextField
                                      variant="outlined"
                                      size="small"
                                      name="amount_receivable"
                                      value={invoiceData[0].amount_receivable}
                                      sx={{
                                        "& .MuiOutlinedInput-root": {
                                          padding: "1px",
                                          fontSize: "0.875rem",
                                          minHeight: "1px",
                                        },
                                        "& .MuiOutlinedInput-input": {
                                          padding: "2px",
                                        },
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabPanel>
                        <div></div>
                      </TabContext>
                    </Box>
                  </div>
                </div>
              </div>
              <DialogFooter className="p-0">
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
          <Link to={`/purchaseInvoice/${id}/${rowId}`}>
            <MenuItem>View</MenuItem>
          </Link>
          <MenuItem onClick={handleCreateOpen}>Update</MenuItem>
          {role === "superuser" && (
            <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
          )}
          <Link to={`/clientDetails/creditNote/${id}/${purchID}`}>
            <MenuItem>Credit Note</MenuItem>
          </Link>
        </Menu>
      </div>
    </>
  );
}
