import {
  Button,
  Checkbox,
  DialogFooter,
  Option,
  Radio,
  Select,
} from "@material-tailwind/react";
import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import { useState } from "react";
import { Input, Typography } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRef } from "react";
import { format, parse } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TabPanel from "@mui/lab/TabPanel";
import { useEffect } from "react";
import { fetchClientDetails } from "../../../Redux/clientSlice";
import { useDispatch } from "react-redux";
const API_URL = import.meta.env.VITE_API_BASE_URL;
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
function ExpensesCreation({
  allLocationBranchProductData,
  fetchAllLocBranchDetails,
}) {
  const { id } = useParams();
  const dispatch = useDispatch();

  const offData = allLocationBranchProductData?.serializer || [];
  const customerData = allLocationBranchProductData?.serializer_customer || [];
  const product_ser_Data =
    allLocationBranchProductData?.product_serializer || [];
  const branch_ser_name = allLocationBranchProductData?.branch_serializer || [];

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
      email: "",
      contact: "",
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
        tds_tcs_rate: 0,
        tcs: "",
        tds: "",
        amount_receivable: "",
      },
    ]);
    setBranchNoGst("");
  };
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [value, setValue] = React.useState("1");
  const [selectedValueInvoiceType, setSelectedValueInvoiceType] = useState("");

  const [showBranchInput, setShowBranchInput] = useState(false);
  const [branchNoGst, setBranchNoGst] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [selectedTDSTCSOption, setSelectedTDSTCSOption] = useState("");
  const [selectedTDSTCSRateOption, setSelectedTDSTCSRateOption] = useState("");
  const [selectedTDSTCSectionOption, setSelectedTDSTCSectionOption] =
    useState("");
  const [shouldShowIGST, setShouldShowIGST] = useState(false);
  const [shouldShowCGSTSGST, setShouldShowCGSTSGST] = useState(false);
  const [isGstNoEmpty, setIsGstNoEmpty] = useState(true);
  const [filteredInvoiceTypes, setFilteredInvoiceTypes] = useState([
    "Unregistered Local",
    "Unregistered Non-Local",
  ]);
  const handleCreateOpen = () => {
    setOpenCreateModal(true);
    setAnchorEl(null);
  };
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
    customer: false,
    vendor: false,
    email: "",
    contact: "",
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
      cgst: 0,
      sgst: 0,
      igst: 0,
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
      attach_invoice: "",
      attach_e_way_bill: "",
      taxable_amount: "",
      totalall_gst: "",
      total_invoice_value: "",
      tds_tcs_rate: 0,
      tcs: "",
      tds: "",
      amount_receivable: "",
    },
  ]);
  const [expensesErrors, setExpensesErrors] = useState({})

  const expensesRules = {
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

  const validateExpensesField = (name, value) => {
    const fieldRules = expensesRules[name];
    if (!fieldRules) return "";
    for (let rule of fieldRules) {
      if (!rule.test(value)) return rule.message;
    }
    return "";
  };

  const [activeTab, setActiveTab] = useState("1");

  const handleInputChangeInvoiceData = (e) => {
    const { name, value, type, checked } = e.target; // Include `checked`
    let fieldValue;

    if (type === "checkbox") {
      fieldValue = checked;
    } else if (type === "file") {
      fieldValue = e.target.files[0];
    } else if (name === "tds_tcs_rate" && value === "") {
      fieldValue = ""; // Default to 0.00 if empty
    } else {
      fieldValue = value;
    }

    setInvoiceData((prevData) => {
      const updatedData = Array.isArray(prevData) ? [...prevData] : [{}];

      if (!updatedData[0]) {
        updatedData[0] = {};
      }

      let updatedEntry = {
        ...updatedData[0],
        [name]: fieldValue, // Use fieldValue directly
      };

      // Handle resetting related fields (if needed for TDS/TCS)
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

    const errorMsg = validateExpensesField(name, value);
    setExpensesErrors(prev => ({ ...prev, [name]: errorMsg }));
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
    if (isBranch && newValue && newValue.branch_name) {
      // console.log("branchiddd--->",isBranch,newValue,newValue.branch_name)
      setBranchNoGst(newValue?.gst_no);
      setFormData({
        ...formData,
        branchID: newValue.id, // Store branchID when branch is selected
      });
    } else if (newValue && newValue.location) {
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
      setShowBranchInput(false); // Hide branch input when a location is selected

      // Fetch additional data if needed
      try {
        const response = await axiosInstance.get(
          `${API_URL}/api/get-expenses/${id}/?newValue=${newValue.id}&productID=${productID}`
        );
        // console.log("Location Data:---->", response.data.branch_gst);
        setBranchNoGst(response.data.branch_gst);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    }
  };
  // console.log("123",branchNoGst)
  const handleInputChangeLocation = async (event, newInputValue) => {
    if (newInputValue === "") {
      setFormData({
        offLocID: "",
        location: "",
        contact: "",
        address: "",
        city: "",
        state: "",
        country: "",
        branchID: "", // Reset branchID as well
      });
      setShowBranchInput(false); // Hide custom branch input
    } else {
      const isLocationFound = offData.some(
        (option) =>
          option.location.toLowerCase() === newInputValue.toLowerCase()
      );

      if (!isLocationFound) {
        setShowBranchInput(true);
      } else {
        setShowBranchInput(false);
      }

      setFormData({
        ...formData,
        location: newInputValue,
        offLocID: "",
      });

      const matchingLocation = offData.find(
        (option) =>
          option.location.toLowerCase() === newInputValue.toLowerCase()
      );

      if (matchingLocation) {
        try {
          const response = await axiosInstance.get(
            `${API_URL}/api/get-income/${id}/?newValue=${matchingLocation.id}&productID=${productID}`
          );
          setBranchNoGst(response?.data?.branch_gst);
          console.log("Full matchingLocation:", matchingLocation);
          console.log("Branch object:", matchingLocation.branch);
          console.log("Location Data:---->", response.data.branch_gst);

          setFormData({
            ...formData,
            offLocID: matchingLocation.id,
            location: matchingLocation.location,
            contact: matchingLocation.contact || "",
            address: matchingLocation.address || "",
            city: matchingLocation.city || "",
            state: matchingLocation.state || "",
            country: matchingLocation.country || "",
            gst_no: response?.data?.branch_gst || "",
            branch: matchingLocation.branch || "",
          });
        } catch (error) {
          console.error("Error fetching location data:", error);
        }
      }
      else {
        setFormData((prev) => ({
          ...prev,
          offLocID: "",
          location: newInputValue,   // ✅ preserve new typed name
          contact: "",
          address: "",
          city: "",
          state: "",
          country: "",
          gst_no: "",
        }));
        setBranchNoGst("")
      }
    }
  };
  const handleGstNoChange = (event, newValue1) => {
    setIsGstNoEmpty(!newValue1);

    if (!newValue1) {
      setVendorData({
        vendorID: "",
        gst_no: "",
        name: "",
        pan: "",
        vendor_address: "",
        customer: false,
        vendor: false,
        email: "",
        contact: "",
      });
      return;
    }

    const matchedCustomer = customerData.find(
      (customer) =>
        (typeof newValue1 === "string" && customer.gst_no === newValue1) ||
        (typeof newValue1 === "object" && customer.gst_no === newValue1.gst_no)
    );

    if (matchedCustomer) {
      setVendorData({
        vendorID: matchedCustomer.id,
        gst_no: matchedCustomer.gst_no,
        name: matchedCustomer.name,
        pan: matchedCustomer.pan,
        vendor_address: matchedCustomer.address,
        customer: matchedCustomer.customer,
        vendor: matchedCustomer.vendor,
        contact: matchedCustomer.contact,
        email: matchedCustomer.email,
      });
    } else {
      // If it's a new GST entry, clear all other fields
      setVendorData({
        vendorID: "",
        gst_no: typeof newValue1 === "string" ? newValue1 : "",
        name: "",
        pan: "",
        vendor_address: "",
        customer: false,
        vendor: false,
        email: "",
        contact: "",
      });
    }
  };

  const handleNameChange = (event, newValue2) => {
    if (!newValue2) {
      setVendorData((prev) => ({
        ...prev,
        vendorID: "",
        name: "",
        pan: "",
        vendor_address: "",
        customer: false,
        vendor: false,
        email: "",
        contact: "",
      }));
      return;
    }

    const matchedCustomer = customerData.find(
      (customer) =>
        (typeof newValue2 === "string" && customer.name === newValue2) ||
        (typeof newValue2 === "object" && customer.name === newValue2.name)
    );

    if (matchedCustomer) {
      setVendorData({
        vendorID: matchedCustomer.id,
        gst_no: matchedCustomer.gst_no,
        name: matchedCustomer.name,
        pan: matchedCustomer.pan,
        vendor_address: matchedCustomer.address,
        customer: matchedCustomer.customer,
        vendor: matchedCustomer.vendor,
        contact: matchedCustomer.contact,
        email: matchedCustomer.email,
      });
    } else {
      // If it's a new Name entry, clear all other fields except gst_no
      setVendorData((prev) => ({
        ...prev,
        name: typeof newValue2 === "string" ? newValue2 : "",
        vendorID: "",
        pan: "",
        vendor_address: "",
        customer: false,
        vendor: false,
        email: "",
        contact: "",
      }));
    }
  };
  const handleProductChange = async (index, newValue) => {
    if (newValue) {
      setProductID(newValue.id); // Assuming setProductID is defined elsewhere
      try {
        const response = await axiosInstance.get(
          `${API_URL}/api/get-expenses/${id}/?newValue=${selectedLocation}&productID=${newValue.id}`
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
      // Clear the product field if the value is cleared
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

    const errorMsg = validateExpensesField(name, value);
    setExpensesErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleInputChangeProduct = (index, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row, rowIndex) => {
        if (rowIndex === index) {
          const updatedRow = { ...row, [field]: value };

          // Recalculate product_amount if unit or rate changes
          if (field === "unit" || field === "rate") {
            const unit = parseFloat(updatedRow.unit) || 0;
            const rate = parseFloat(updatedRow.rate) || 0;
            updatedRow.product_amount = (unit * rate).toFixed(2); // Format to 2 decimal places
          }

          // Check if invoice_type is "Nil Rated"
          if (invoiceData[0]?.invoice_type.toLowerCase() === "nil rated") {
            updatedRow.cgst = "0";
            updatedRow.sgst = "0";
            updatedRow.igst = "0";
          } else if (updatedRow.gstRate) {
            // Recalculate GST values when gstRate changes
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
              updatedRow.igst = 0; // Reset IGST if CGST/SGST is enabled
            } else if (shouldShowIGST) {
              updatedRow.cgst = 0; // Reset CGST
              updatedRow.sgst = 0; // Reset SGST
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

          return updatedRow;
        }
        return row;
      })
    );
  };

  useEffect(() => {
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row) => {
        let updatedRow = { ...row }; // Create a copy to avoid direct mutation of state

        // Check if the invoice type is "Nil Rated"
        if (invoiceData[0]?.invoice_type.toLowerCase() === "nil rated") {
          // Set all GST values to 0 when Nil Rated is selected
          if (
            updatedRow.cgst !== "0.00" ||
            updatedRow.sgst !== "0.00" ||
            updatedRow.igst !== "0.00"
          ) {
            updatedRow.cgst = "0.00";
            updatedRow.sgst = "0.00";
            updatedRow.igst = "0.00";
          }

          // Set total_invoice to product_amount since no GST applies
          updatedRow.total_invoice = (
            parseFloat(updatedRow.product_amount) || 0
          ).toFixed(2);
        } else if (updatedRow.product_amount && updatedRow.gstRate) {
          // Recalculate GST and total_invoice if not "Nil Rated"
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
            updatedRow.igst = "0.00"; // Reset IGST if CGST/SGST is enabled
          } else if (shouldShowIGST) {
            updatedRow.cgst = "0.00"; // Reset CGST
            updatedRow.sgst = "0.00"; // Reset SGST
            updatedRow.igst = gstValue;
          }

          // Calculate total_invoice for this row
          const gstValueRow = shouldShowCGSTSGST
            ? (parseFloat(updatedRow.cgst) || 0) +
            (parseFloat(updatedRow.sgst) || 0)
            : parseFloat(updatedRow.igst) || 0;

          updatedRow.total_invoice = (
            (parseFloat(updatedRow.product_amount) || 0) + gstValueRow
          ).toFixed(2);
        }

        return updatedRow;
      });

      // Only set the state if the rows have actually changed
      // If the updated rows are different from the previous ones, then set state
      if (JSON.stringify(updatedRows) !== JSON.stringify(prevRows)) {
        return updatedRows;
      }

      // Otherwise, return the previous state (no change)
      return prevRows;
    });
  }, [shouldShowCGSTSGST, shouldShowIGST, invoiceData]);

  useEffect(() => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        // Ensure SGST, CGST, IGST are set to 0 if invoice_type is "Nil Rated"
        if (invoiceData[0]?.invoice_type.toLowerCase() === "nil rated") {
          row.cgst = "0";
          row.sgst = "0";
          row.igst = "0";
        } else {
          if (row.product_amount && row.gstRate) {
            const gstValue = (
              (parseFloat(row.gstRate) * parseFloat(row.product_amount)) /
              100
            ).toFixed(2);

            if (shouldShowCGSTSGST) {
              const cgstValue = (gstValue / 2).toFixed(2);
              const sgstValue = (gstValue / 2).toFixed(2);
              row.cgst = cgstValue;
              row.sgst = sgstValue;
              row.igst = 0;
            } else if (shouldShowIGST) {
              row.cgst = 0;
              row.sgst = 0;
              row.igst = gstValue;
            }
          }
        }

        // Calculate total_invoice for this row (product_amount + gstValue)
        const gstValueRow = shouldShowCGSTSGST
          ? (parseFloat(row.cgst) || 0) + (parseFloat(row.sgst) || 0)
          : parseFloat(row.igst) || 0;

        row.total_invoice = (
          (parseFloat(row.product_amount) || 0) + gstValueRow
        ).toFixed(2);

        return row;
      })
    );
  }, [shouldShowCGSTSGST, shouldShowIGST, invoiceData[0]?.invoice_type]);

  useEffect(() => {
    // Calculate totals for taxable_amount, totalall_gst, and total_invoice_value
    let totalAmount = 0;
    let totalGSTValue = 0;
    let totalInvoiceValueSum = 0;

    rows.forEach((row) => {
      totalAmount += parseFloat(row.product_amount) || 0;

      if (shouldShowCGSTSGST) {
        totalGSTValue +=
          (parseFloat(row.cgst) || 0) + (parseFloat(row.sgst) || 0);
      } else if (shouldShowIGST) {
        totalGSTValue += parseFloat(row.igst) || 0;
      }

      // Sum up total_invoice values
      totalInvoiceValueSum += parseFloat(row.total_invoice) || 0;
    });

    // Update invoiceData with calculated values
    setInvoiceData((prevData) =>
      prevData.map((data, index) =>
        index === 0
          ? {
            ...data,
            taxable_amount: totalAmount.toFixed(2),
            totalall_gst: totalGSTValue.toFixed(2),
            total_invoice_value: totalInvoiceValueSum.toFixed(2),
          }
          : data
      )
    );
  }, [rows, shouldShowCGSTSGST, shouldShowIGST]);

  useEffect(() => {
    const tdsTcsRate = parseFloat(invoiceData[0]?.tds_tcs_rate) || 0;
    const totalAmount = parseFloat(invoiceData[0]?.taxable_amount) || 0;
    const TotalAllInvoice =
      parseFloat(invoiceData[0]?.total_invoice_value) || 0;

    // Calculate TCS or TDS amount and format to 2 decimal places
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

  // console.log("Amount Receivable:", amountReceivable);
  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        product: "",
        hsnCode: "",
        gstRate: "",
        description: "",
        unit: "",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
  };
  const [salesInvoice, setSalesInvoice] = useState("100");
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const newErrors = {};

    // Validate Office/Location formData
    Object.entries(formData).forEach(([key, value]) => {
      const errorMsg = validateExpensesField(key, value);
      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

    // Validate Customer/Vendor vendorData
    Object.entries(vendorData).forEach(([key, value]) => {
      const errorMsg = validateExpensesField(key, value);
      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

    // Validate Invoice Data (first object only)
    Object.entries(invoiceData[0]).forEach(([key, value]) => {
      const errorMsg = validateExpensesField(key, value);
      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

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
        row.unit.trim() !== "" &&
        row.rate !== "" &&
        !isNaN(row.rate)
    );

    // Optional: show a warning if rows were removed
    if (rows.length !== cleanedRows.length) {
      toast.warning("Some empty product rows were ignored.");
    }

    const payload = {
      // salesInvoice,
      formData,
      vendorData,
      // rows,
      rows: cleanedRows,
      invoiceData,
    };

    try {
      const response = await axiosInstance.post(
        `${API_URL}/api/create-expenses-post2/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log("Data submitted successfully:", response);
      // Handle successful response
      if (response.status === 200 || response.status === 201) {
        // Handle success response
        // console.log(response.data);
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });

        // Dispatch fetchClientDetails action
        // dispatch(fetchClientDetails(id));
        dispatch(fetchClientDetails({ id, tabName: "Expenses" }));
        await fetchAllLocBranchDetails(id);
        handleCreateClose();

        // Clear all form data
        resetFields();
      } else {
        Error(
          toast.error(`${response.data.message}`, {
            position: "top-right",
            autoClose: 2000,
          })
        );
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle error response
      toast.error(`${error.response.data.error_message}`, {
        position: "top-right",
        autoClose: 2000,
      });
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

  // Auto-detect TCS or TDS on initial load based on prepopulated values

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

  const month = useRef(null);
  const invoice = useRef(null);

  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY
      setInvoiceData((prevData) =>
        prevData.map((item, index) =>
          index === 0 ? { ...item, month: formattedDate } : item
        )
      )
    }
  };
  const [selectedInvoiceDate, setSelectedInvoiceDate] = useState(null);
  const handleToDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = format(date, "dd-MM-yyyy"); // Convert to DD-MM-YYYY

      // Invoice Data ke first object ka invoice_date update karein
      setInvoiceData((prevData) =>
        prevData.map((item, index) =>
          index === 0 ? { ...item, invoice_date: formattedDate } : item
        )
      );
    }
  };
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);


  return (
    <>
      {/* <ToastContainer /> */}
      <div>
        <Modal
          open={openCreateModal}
          onClose={handleCreateClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        // className="overflow-auto"
        >
          <Box sx={styleCreateModal} className="max-h-full overflow-scroll">
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              className="text-center border-b-2 border-[#366FA1] pb-3 "
            >
              Create Expenses Details
            </Typography>
            <form
              className=" my-5 w-full   "
              onSubmit={handleSubmit}
            >
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
                            required
                            options={offData}
                            getOptionLabel={(option) => option.location || ""}
                            onChange={(event, newValue) =>
                              handleLocationChange(newValue)
                            } // Handle location selection
                            onInputChange={handleInputChangeLocation} // Handle location input change
                            renderOption={(props, option) => (
                              <li
                                {...props}
                                key={option.id}
                                style={{
                                  padding: "4px 8px",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {option.location}
                              </li>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                value={formData.location || ""}
                                required
                                className="border border-red-500"
                                placeholder="Office Location"
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
                          Contact
                        </Typography>
                      </label>
                    </div>
                    <div className="col-span-8">
                      {" "}
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
                              } // Handle branch selection
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
                                  required
                                  className="border border-red-500"
                                  placeholder="Branch Select"
                                  inputProps={{
                                    ...params.inputProps,
                                    readOnly: true, // Make the input field read-only
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
                        placeholder="Invoice No"
                        value={invoiceData[0].invoice_no}
                        required
                        onChange={handleInputChangeInvoiceData}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        // containerProps={{ className: "min-w-full" }}
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
                        required
                        name="attach_invoice"
                        placeholder="Invoice Date"
                        onChange={handleInputChangeInvoiceData}
                      />
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
                        required
                        name="attach_e_way_bill"
                        placeholder="Eway Bill"
                        onChange={handleInputChangeInvoiceData}
                      />
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
                    <div className="">
                      <div className="relative w-full">
                        <DatePicker
                          ref={month}
                          required
                          selected={
                            invoiceData[0].month
                              ? parse(invoiceData[0].month, "dd-MM-yyyy", new Date())
                              : null
                          }
                          // value={invoiceData[0].month}
                          name="month"
                          onChange={handleDateChange}
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
                          onClick={() => month.current.setFocus()} // Focus the correct DatePicker
                        />
                      </div>
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
                        required
                        selected={
                          invoiceData[0].invoice_date
                            ? parse(invoiceData[0].invoice_date, "dd-MM-yyyy", new Date())
                            : null
                        }
                        onChange={handleToDateChange}
                        name="invoice_date"
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
                        onClick={() => invoice.current.setFocus()} // Focus the correct DatePicker
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
                                display: "none", // Hide the default tab indicator
                                padding: 0,
                                margin: 0,
                              },
                            }}
                            sx={{
                              padding: 0, // Remove any default padding from the TabList
                              minHeight: "20px", // Set a specific minHeight for the TabList
                            }}
                          >
                            <Tab
                              label="Customer And Vendor Details"
                              value="1"
                              sx={{
                                padding: "0px 10px", // Adjust padding as needed
                                minHeight: "0px", // Reduced min height
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
                                padding: "0px 10px", // Adjust padding as needed
                                minHeight: "25px", // Reduced min height
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
                                    {/* <Stack spacing={1} sx={{ width: 300 }}> */}
                                    <Autocomplete
                                      sx={{ width: 300 }}
                                      freeSolo
                                      required
                                      id="gst-no-autocomplete"
                                      disableClearable
                                      options={customerData}
                                      getOptionLabel={(option) =>
                                        typeof option === "string"
                                          ? option
                                          : option.gst_no || ""
                                      }
                                      onChange={handleGstNoChange}
                                      value={vendorData.gst_no || ""} // Bind value to formData.gst_no
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
                                          required
                                          value={vendorData.gst_no || ""} // Reset input value when formData.gst_no changes
                                          onChange={(e) =>
                                            handleGstNoChange(e, e.target.value)
                                          } // Update input value on type
                                          placeholder="Enter or select GST No."
                                          sx={{
                                            // Adjust the height and padding to reduce overall size
                                            "& .MuiInputBase-root": {
                                              height: 28, // Set your desired height here
                                              padding: "4px 6px", // Adjust padding to make it smaller
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
                                      Name
                                    </Typography>
                                  </label>
                                </div>
                                <div className="col-span-8">
                                  {" "}
                                  <Autocomplete
                                    sx={{ width: 300 }}
                                    freeSolo
                                    required
                                    id="name-autocomplete"
                                    disableClearable
                                    options={customerData}
                                    getOptionLabel={(option) =>
                                      typeof option === "string"
                                        ? option
                                        : option.name || ""
                                    }
                                    onChange={handleNameChange}
                                    value={vendorData.name || ""} // Bind value to formData.gst_no
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
                                        required
                                        value={vendorData.name || ""} // Reset input value when formData.gst_no changes
                                        onChange={(e) =>
                                          handleNameChange(e, e.target.value)
                                        } // Update input value on type
                                        placeholder="Enter or select Name"
                                        sx={{
                                          // Adjust the height and padding to reduce overall size
                                          "& .MuiInputBase-root": {
                                            height: 28, // Set your desired height here
                                            padding: "4px 6px", // Adjust padding to make it smaller
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
                                  {/* <div className="h-7">
                                    <Input
                                      type="text"
                                      size="lg"
                                      name="name"
                                      placeholder="Name"
                                      value={vendorData.name}
                                      onChange={handleInputChangeCL}
                                      className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                                      labelProps={{
                                        className: "hidden",
                                      }}
                                      // containerProps={{ className: "min-w-full" }}
                                      style={{
                                        height: "28px", 
                                        padding: "4px 6px", 
                                        fontSize: "0.875rem", 
                                        width: 300,
                                      }}
                                    />
                                  </div> */}
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
                                      required
                                      placeholder="PAN No"
                                      value={vendorData.pan}
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
                                      required
                                      placeholder="Customer Address"
                                      value={vendorData.vendor_address}
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
                                      required
                                      placeholder="Email"
                                      value={vendorData.email}
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
                                      required
                                      value={vendorData.contact}
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
                              className="shadow-md rounded-lg mt-3"
                              style={{ maxHeight: "200px", overflowY: "auto" }}
                            >
                              <Table>
                                <TableHead
                                  sx={{
                                    backgroundColor: "#f3f4f6",
                                    position: "sticky", // Makes the header sticky
                                    top: 0, // Ensures it sticks to the top of the container
                                    zIndex: 0, // Keeps it above the table rows
                                  }}
                                >
                                  <TableRow
                                    className="font-semibold bg-primary text-white"
                                    sx={{
                                      color: "white", // Text color
                                      padding: "4px",
                                    }}
                                  >
                                    <TableCell
                                      className="font-semibold text-gray-600"
                                      sx={{
                                        color: "white", // Text color
                                        padding: "4px",
                                      }}
                                    >
                                      Product
                                    </TableCell>
                                    <TableCell
                                      className="font-semibold text-gray-600"
                                      sx={{
                                        color: "white", // Text color
                                        padding: "4px",
                                      }}
                                    >
                                      Description
                                    </TableCell>
                                    <TableCell
                                      className="font-semibold text-gray-600"
                                      sx={{
                                        color: "white", // Text color
                                        padding: "4px",
                                      }}
                                    >
                                      HSN Code
                                    </TableCell>
                                    <TableCell
                                      className="font-semibold text-gray-600"
                                      sx={{
                                        color: "white", // Text color
                                        padding: "4px",
                                      }}
                                    >
                                      Unit
                                    </TableCell>
                                    <TableCell
                                      className="font-semibold text-gray-600"
                                      sx={{
                                        color: "white", // Text color
                                        padding: "4px",
                                      }}
                                    >
                                      Rate
                                    </TableCell>
                                    <TableCell
                                      className="font-semibold text-gray-600"
                                      sx={{
                                        color: "white", // Text color
                                        padding: "4px",
                                      }}
                                    >
                                      Amount
                                    </TableCell>
                                    <TableCell
                                      className="font-semibold text-gray-600"
                                      sx={{
                                        color: "white", // Text color
                                        padding: "4px",
                                      }}
                                    >
                                      GST Rate
                                    </TableCell>

                                    {shouldShowCGSTSGST && (
                                      <>
                                        <TableCell
                                          className="font-semibold text-gray-600"
                                          sx={{
                                            color: "white", // Text color
                                            padding: "4px",
                                          }}
                                        >
                                          SGST
                                        </TableCell>
                                        <TableCell
                                          className="font-semibold text-gray-600"
                                          sx={{
                                            color: "white", // Text color
                                            padding: "4px",
                                          }}
                                        >
                                          CGST
                                        </TableCell>
                                      </>
                                    )}

                                    {shouldShowIGST && (
                                      <TableCell
                                        className="font-semibold text-gray-600"
                                        sx={{
                                          color: "white", // Text color
                                          padding: "4px",
                                        }}
                                      >
                                        Igst
                                      </TableCell>
                                    )}
                                    <TableCell
                                      className="font-semibold text-gray-600"
                                      sx={{
                                        color: "white", // Text color
                                        padding: "4px",
                                      }}
                                    >
                                      Total Invoice{" "}
                                    </TableCell>
                                    <TableCell
                                      className="font-semibold text-gray-600"
                                      sx={{
                                        color: "white", // Text color
                                        padding: "4px",
                                      }}
                                    ></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {/* <div style={{ maxHeight: "450px", overflowY: "auto" }}> */}
                                  {rows.map((row, index) => (
                                    <TableRow key={index} className="p-0 ">
                                      <TableCell sx={{ padding: "6px" }}>
                                        <Autocomplete
                                          freeSolo
                                          id={`product-autocomplete-${index}`}
                                          disableClearable
                                          options={product_ser_Data}
                                          required
                                          getOptionLabel={(option) =>
                                            option.product_name || ""
                                          }
                                          onChange={(event, newValue) =>
                                            handleProductChange(index, newValue)
                                          }
                                          inputValue={row.product || ""} // Ensure inputValue is always a string
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
                                              required
                                              placeholder="select product"
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
                                          name="description"
                                          id={`description-${index}`}
                                          value={row.description}
                                          required
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
                                          id={`hsn_code-${index}`}
                                          name="hsn_code"
                                          required
                                          value={row.hsnCode}
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
                                          name="unit"
                                          id={`unit-${index}`}
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
                                          name="rate"
                                          id={`rate-${index}`}
                                          value={row.rate}
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
                                          required
                                          onChange={(e) =>
                                            handleInputChangeProduct(
                                              index,
                                              "product_amount",
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
                                          slotProps={{
                                            inputLabel: {
                                              shrink: true, // Ensures the label stays visible
                                            },
                                          }}
                                          inputProps={{
                                            readOnly: true, // Making the field read-only
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell sx={{ padding: "6px" }}>
                                        <TextField
                                          value={row.gstRate}
                                          name="gst_rate"
                                          id={`gst_rate-${index}`}
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
                                              required
                                              onChange={(e) =>
                                                handleInputChangeProduct(
                                                  index,
                                                  "cgst",
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
                                              slotProps={{
                                                inputLabel: {
                                                  shrink: true, // Ensures the label stays visible
                                                },
                                              }}
                                              inputProps={{
                                                readOnly: true, // Making the field read-only
                                              }}
                                            />
                                          </TableCell>
                                          <TableCell sx={{ padding: "6px" }}>
                                            <TextField
                                              value={row.sgst || ""}
                                              required
                                              onChange={(e) =>
                                                handleInputChangeProduct(
                                                  index,
                                                  "sgst",
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
                                              slotProps={{
                                                inputLabel: {
                                                  shrink: true, // Ensures the label stays visible
                                                },
                                              }}
                                              inputProps={{
                                                readOnly: true, // Making the field read-only
                                              }}
                                            />
                                          </TableCell>
                                        </>
                                      )}

                                      {shouldShowIGST && (
                                        <TableCell sx={{ padding: "6px" }}>
                                          <TextField
                                            value={row.igst || ""}
                                            required
                                            onChange={(e) =>
                                              handleInputChangeProduct(
                                                index,
                                                "igst",
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
                                            slotProps={{
                                              inputLabel: {
                                                shrink: true, // Ensures the label stays visible
                                              },
                                            }}
                                            inputProps={{
                                              readOnly: true, // Making the field read-only
                                            }}
                                          />
                                        </TableCell>
                                      )}

                                      <TableCell sx={{ padding: "6px" }}>
                                        <TextField
                                          value={row.total_invoice}
                                          required
                                          onChange={(e) =>
                                            handleInputChangeProduct(
                                              index,
                                              "total_invoice",
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
                                          slotProps={{
                                            inputLabel: {
                                              shrink: true, // Ensures the label stays visible
                                            },
                                          }}
                                          inputProps={{
                                            readOnly: true, // Making the field read-only
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
                                            name="add-product"
                                            className=" bg-primary text-white p-2 rounded-md"
                                          >
                                            Add New Product
                                          </button>
                                        </div>
                                        <div className="flex gap-4">
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
                                              variant="outlined"
                                              required
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
                                              variant="outlined"
                                              required
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
                                              variant="outlined"
                                              required
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
                                <div>
                                  <label htmlFor="invoice_type">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="block font-semibold mb-1"
                                    >
                                      Select TDS/TCS
                                    </Typography>
                                  </label>
                                </div>
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
                                              value={invoiceData[0].tds_tcs_rate}
                                              onChange={
                                                handleInputChangeInvoiceData
                                              }
                                              onInput={(e) => {
                                                e.target.value =
                                                  e.target.value.replace(
                                                    /[^0-9.]/g,
                                                    ""
                                                  ); // Allows only digits and a decimal point
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
                                                  ); // Allows only digits and a decimal point
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
                                              value={invoiceData[0].tds_tcs_rate}
                                              onInput={(e) => {
                                                e.target.value =
                                                  e.target.value.replace(
                                                    /[^0-9.]/g,
                                                    ""
                                                  ); // Allows only digits and a decimal point
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
                                                  ); // Allows only digits and a decimal point
                                              }}
                                              className="mt-2 block w-full px-2 py-0.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-12 text-sm mt-7">
                                  <div className="col-span-6 font-bold my-auto ">
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
                        <div>

                        </div>
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
                  name="expenses_cancel"
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
        className="bg-primary hover:bg-[#2d5e85] "
        onClick={handleCreateOpen}
      >
        Create
      </Button>
    </>
  );
}

export default ExpensesCreation;
