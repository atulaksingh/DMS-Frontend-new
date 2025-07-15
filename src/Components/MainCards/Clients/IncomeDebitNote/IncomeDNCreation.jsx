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
import { ImFilePicture } from "react-icons/im";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRef } from "react";
import { format, parse, isValid } from "date-fns";
import { RxSlash } from "react-icons/rx";
const options = ["None", "Atria", "Callisto"];

import {
  Button,
  // Checkbox,
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
// import SalesInvoice from "./SalesInvoice";
import { useDispatch } from "react-redux";
import { fetchClientDetails } from "../../../Redux/clientSlice";
// import DebitNoteInvoice from "./DebitNoteInvoice";
//   import { useEffect } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  //   border: "1px solid #000",
  boxShadow: 24,
  //   paddingTop: "17px",
  //   paddingInline: "10px",
  marginBlock: "80px",
  borderRadius: "10px",
};
const styleCreateModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90%", // Mobile devices (extra-small screens)
    sm: "90%", // Small screens (e.g., tablets)
    md: "90%", // Medium screens
    lg: "90%", // Large screens%
    xl: "85%", // Large screens
  },
  bgcolor: "background.paper",
  boxShadow: 24,
  paddingTop: "17px",
  paddingInline: {
    xs: "20px", // Smaller padding for smaller screens
    sm: "30px", // Medium padding for small screens
    md: "40px", // Default padding for medium and larger screens
  },
  borderRadius: "10px",
};
const ITEM_HEIGHT = 48;

function IncomeDNCreation({ fetchInvoiceDetails }) {
  const { id, incomeID } = useParams();
  //   const salesID = rowId;
  //   console.log("use",useParams())
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

  const handleViewOpen = () => {
    setOpenViewModal(true);
    setAnchorEl(null);
  };

  const handleDeleteClose = () => setOpenDeleteModal(false);
  const handleViewClose = () => setOpenViewModal(false);
  const helloworld = () => setOpenViewModal(false);
  // dj = new t
  //   const handleCreateClose = () => setOpenCreateModal(false);
  const [bankData, setBankData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log("gggggggg", bankData);

  ///////////////////////////////////////////////////////  sales Update ////////////////////////////////////

  const [offData, setOffData] = useState([]);
  const [value, setValue] = React.useState("1");
  const [selectedValueInvoiceType, setSelectedValueInvoiceType] = useState("");
  const [customerData, setCustomerData] = useState([]);
  const [product_ser_Data, setProduct_ser_Data] = useState([]);
  const [branch_ser_name, setBranch_ser_name] = useState([]);
  const [showBranchInput, setShowBranchInput] = useState(false);
  const [branchNoGst, setBranchNoGst] = useState("");
  //   const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [units, setUnits] = useState("");
  const [selectedTDSTCSOption, setSelectedTDSTCSOption] = useState("");
  const [selectedTDSTCSRateOption, setSelectedTDSTCSRateOption] = useState("");
  const [selectedTDSTCSectionOption, setSelectedTDSTCSectionOption] =
    useState("");
  // console.log("123456", units);
  const [shouldShowIGST, setShouldShowIGST] = useState(false);
  const [shouldShowCGSTSGST, setShouldShowCGSTSGST] = useState(false);
  const [isGstNoEmpty, setIsGstNoEmpty] = useState(true);
  const [filteredInvoiceTypes, setFilteredInvoiceTypes] = useState([
    "Unregistered Local",
    "Unregistered Non-Local",
  ]);
  // const handleCreateOpen = () => {

  //   setOpenCreateModal(true);
  //   setAnchorEl(null);
  // };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCreateClose = () => setOpenCreateModal(false);
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
    customer_address: "",
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
      // tds_tcs_section: "",
      tcs: "",
      tds: "",
      amount_receivable: "",
    },
  ]);
  // console.log("formdata", formData);
  // console.log("vendorData", vendorData);
  // console.log("rows", rows);
  // console.log("invoiceData", invoiceData);
  // console.log("offfff", offData);
  const handleCreateOpen = async () => {
    setOpenCreateModal(true);
    setAnchorEl(null);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/get-incomedebitnote/${id}/${incomeID}`
      );
      //   console.log("dd123", response.data);
      setFormData(response.data.client_location);
      setVendorData(response.data.customer);
      setRows(response.data.product_summaries);
      setUnits(response.data.product_summaries);
      // setInvoiceData(response.data.sales_invoice);
      if (response.data.debit_note) {
        setInvoiceData([
          {
            ...response.data.debit_note,
            invoice_type: response.data.debit_note.invoice_type || "", // Ensure the field is populated
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
    const { name, value, type } = e.target;
    const fieldValue = type === "file" ? e.target.files[0] : value;

    setInvoiceData((prevData) => {
      const updatedData = [...prevData];
      let updatedEntry = {
        ...updatedData[0],
        [name]: name === "invoice_type" ? fieldValue.toLowerCase() : fieldValue,
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
  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/get-debitnote/${id}`
        );
        // console.log("ggggggg->", response.data);
        setOffData(response.data.serializer);
        setCustomerData(response.data.serializer_customer);
        setProduct_ser_Data(response.data.product_serializer);
        setBranch_ser_name(response.data.branch_serializer);
      } catch (error) { }
    };
    fetchBankDetails();
  }, [id]);

  const handleLocationChange = async (newValue, isBranch = false) => {
    if (!newValue) return;

    try {
      if (isBranch && newValue.branch_name) {
        setBranchNoGst(newValue?.gst_no);
        setFormData((prev) => ({
          ...prev,
          branchID: newValue.id, // Store branch ID
        }));
      } else if (newValue.location) {
        const updatedFormData = {
          offLocID: newValue.id,
          location: newValue.location,
          contact: newValue.contact || "",
          address: newValue.address || "",
          city: newValue.city || "",
          state: newValue.state || "",
          country: newValue.country || "",
          branchID: newValue.branch || "",
        };
        setFormData(updatedFormData);
        setShowBranchInput(false);

        const response = await axios.get(
          `http://127.0.0.1:8000/api/get-debitnote/${id}/?newValue=${newValue.id}&productID=${productID}`
        );
        setBranchNoGst(response.data.branch_gst || "N/A");
      }
    } catch (error) {
      console.error("Error fetching branch/location data:", error);
      toast.error("Failed to fetch location data. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // console.log("123",branchNoGst)
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

    const matchingLocation = offData.find(
      (option) => option.location.toLowerCase() === newInputValue.toLowerCase()
    );

    if (matchingLocation) {
      handleLocationChange(matchingLocation);
    } else {
      setShowBranchInput(true);
      setFormData((prev) => ({
        ...prev,
        location: newInputValue,
        offLocID: "",
      }));
    }
  };

  const handleGstNoChange = (event, newValue1) => {
    // If user clears the input
    setIsGstNoEmpty(!newValue1);
    if (!newValue1) {
      setVendorData((prevVendorData) => ({
        ...prevVendorData,
        vendorID: "",
        gst_no: "",
        name: "",
        pan: "",
        customer_address: "",
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
          customer_address: matchedCustomer.address,
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
          customer_address: "",
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
        customer_address: newValue1.address || "",
        customer: newValue1.customer || false,
        vendor: newValue1.vendor || false,
      }));
    }
  };

  const handleProductChange = async (index, newValue) => {
    if (newValue) {
      setProductID(newValue.id); // Assuming setProductID is defined elsewhere
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/get-debitnote/${id}/?newValue=${selectedLocation}&productID=${newValue.id}`
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

  const handleInputChangeProductField = (index, value) => {
    setRows((prevRows) =>
      prevRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, product: value } : row
      )
    );
  };

  const handleInputChangeProduct = (index, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row, rowIndex) => {
        if (rowIndex === index) {
          const updatedRow = { ...row, [field]: value };

          // If invoice type is "Nil Rated", reset GST and total_invoice values
          if (invoiceData[0]?.invoice_type.toLowerCase() === "nil rated") {
            updatedRow.cgst = "0.00";
            updatedRow.sgst = "0.00";
            updatedRow.igst = "0.00";
            updatedRow.product_amount =
              (parseFloat(updatedRow.unit) || 0) *
              (parseFloat(updatedRow.rate) || 0).toFixed(2);
            updatedRow.total_invoice = updatedRow.product_amount; // Just product amount as total_invoice
          } else {
            // Recalculate product_amount if unit or rate changes
            if (field === "unit" || field === "rate") {
              const unit = parseFloat(updatedRow.unit) || 0;
              const rate = parseFloat(updatedRow.rate) || 0;
              updatedRow.product_amount = (unit * rate).toFixed(2); // Format to 2 decimal places
            }

            // Recalculate GST values when gstRate changes
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
                updatedRow.igst = "0.00"; // Reset IGST if CGST/SGST is enabled
              } else if (shouldShowIGST) {
                updatedRow.cgst = "0.00"; // Reset CGST
                updatedRow.sgst = "0.00"; // Reset SGST
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
            row.igst = "0.00"; // Reset IGST if CGST/SGST is enabled
          } else if (shouldShowIGST) {
            row.cgst = "0.00"; // Reset CGST
            row.sgst = "0.00"; // Reset SGST
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
    // Calculate totals for taxable_amount, totalall_gst, and total_invoice_value
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

      // Sum up total_invoice values
      totalInvoiceValueSum += parseFloat(row.total_invoice) || 0;
    });

    // If invoice_type is Nil Rated, set totalall_gst to 0
    const updatedTotalGST = isNilRated ? "0.00" : totalGSTValue.toFixed(2);

    // Avoid infinite loop by checking if the values have actually changed
    const updatedInvoiceData = {
      ...invoiceData[0],
      taxable_amount: totalAmount.toFixed(2),
      totalall_gst: updatedTotalGST,
      total_invoice_value: totalInvoiceValueSum.toFixed(2),
    };

    // Only update invoiceData if something has changed
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
    const TotalAllInvoice =
      parseFloat(invoiceData[0]?.total_invoice_value) || 0;

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
        cgst: "0.00",
        sgst: "0.00",
        igst: "0.00", // Set default GST values to 0 when new row is added
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

    const payload = {
      // salesInvoice,
      formData,
      vendorData,
      rows,
      invoiceData,
    };

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/update-incomedebitnote/${id}/${incomeID}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log("Data submitted successfully:", response.data);
      // Handle successful response
      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 2000,
        });
        // dispatch(fetchClientDetails(id));
        fetchInvoiceDetails();
        handleCreateClose();
      } else {
        toast.error("Failed to Update Sales Invoice. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      if (error.response) {
        const errorMessage =
          error.response.data.message || "An unexpected error occurred.";

        toast.error(` ${errorMessage}`);
      } else if (error.request) {
        alert("No response received from the server. Please try again later.");
      } else {
        console.error("Error in request setup:", error.message);
      }
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

  const truncateFileName = (fileName, maxLength = 20) => {
    if (fileName.length <= maxLength) return fileName;
    const start = fileName.slice(0, 10); // First 10 characters
    const end = fileName.slice(-10); // Last 10 characters
    return `${start}...${end}`;
  };

  const month = useRef(null);
  const invoice = useRef(null);

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

  return (
    <>
      {/* <ToastContainer /> */}
      <div>
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
                Create Income DebitNote Details
              </Typography>

              <form
                className=" my-5 w-full  overflow-auto "
                onSubmit={handleSubmit}
              >
                <div className="font-bold text-[15px] text-primary my-1">
                  Office Location Details
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
                              disabled
                              options={offData}
                              getOptionLabel={(option) => option.location || ""}
                              onChange={(event, newValue) =>
                                handleLocationChange(newValue)
                              }
                              onInputChange={handleInputChangeLocation}
                              value={
                                offData.find(
                                  (option) =>
                                    option.location === formData.location
                                ) || null
                              } // Bind the value
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
                                  disabled
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
                        {/* <div className="h-7">
                          <Input
                            type="text"
                            size="md"
                            name="contact"
                            placeholder="Contact No"
                            value={formData.contact}
                            onChange={handleInputChange}
                            disabled
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
                        </div> */}
                        <div>
                          <TextField
                            value={formData.contact}
                            disabled
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "contact",
                                e.target.value
                              )
                            }
                            variant="outlined"
                            size="small"
                            sx={{
                              "& .MuiInputBase-root": {
                                height: 28,
                                padding: "4px 6px",
                                width: 300,
                              },
                              "& .MuiOutlinedInput-input": {
                                padding: "4px 6px",
                              },
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
                          <TextField
                            value={formData.address}
                            disabled
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "address",
                                e.target.value
                              )
                            }
                            variant="outlined"
                            size="small"
                            sx={{
                              "& .MuiInputBase-root": {
                                height: 28,
                                padding: "4px 6px",
                                width: 300,
                              },
                              "& .MuiOutlinedInput-input": {
                                padding: "4px 6px",
                              },
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
                          <TextField
                            value={formData.city}
                            disabled
                            onChange={(e) =>
                              handleInputChange(index, "city", e.target.value)
                            }
                            variant="outlined"
                            size="small"
                            sx={{
                              "& .MuiInputBase-root": {
                                height: 28,
                                padding: "4px 6px",
                                width: 300,
                              },
                              "& .MuiOutlinedInput-input": {
                                padding: "4px 6px",
                              },
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
                          <TextField
                            value={formData.state}
                            disabled
                            onChange={(e) =>
                              handleInputChange(index, "state", e.target.value)
                            }
                            variant="outlined"
                            size="small"
                            sx={{
                              "& .MuiInputBase-root": {
                                height: 28,
                                padding: "4px 6px",
                                width: 300,
                              },
                              "& .MuiOutlinedInput-input": {
                                padding: "4px 6px",
                              },
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
                          <TextField
                            value={formData.country}
                            disabled
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "country",
                                e.target.value
                              )
                            }
                            variant="outlined"
                            size="small"
                            sx={{
                              "& .MuiInputBase-root": {
                                height: 28,
                                padding: "4px 6px",
                                width: 300,
                              },
                              "& .MuiOutlinedInput-input": {
                                padding: "4px 6px",
                              },
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
                        {/* <Input
                          type="text"
                          disabled
                          size="md"
                          name="branchNoGst"
                          placeholder="GST No"
                          value={branchNoGst}
                          onChange={handleInputChange}
                          className="!border !border-[#cecece] bg-white py-1 text-gray-500   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                          labelProps={{
                            className: "hidden",
                          }}
                          style={{
                            height: "28px",
                            padding: "4px 6px",
                            fontSize: "0.875rem",
                            width: 300,
                          }}
                        /> */}
                        <TextField
                          value={branchNoGst}
                          disabled
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "branchNoGst",
                              e.target.value
                            )
                          }
                          variant="outlined"
                          size="small"
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 28,
                              padding: "4px 6px",
                              width: 300,
                            },
                            "& .MuiOutlinedInput-input": {
                              padding: "4px 6px",
                            },
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
                                options={branch_ser_name}
                                getOptionLabel={(option) =>
                                  option.branch_name || ""
                                }
                                onChange={(event, newValue) =>
                                  handleLocationChange(newValue, true)
                                } // Handle branch selection
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
                                    disabled
                                    className="border border-red-500"
                                    placeholder="Branch Select"
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
                        <TextField
                          value={invoiceData[0].invoice_no}
                          disabled
                          onChange={(e) =>
                            handleInputChangeInvoiceData(
                              index,
                              "invoice_no",
                              e.target.value
                            )
                          }
                          variant="outlined"
                          type="text"
                          size="small"
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 28,
                              padding: "4px 6px",
                              width: 300,
                            },
                            "& .MuiOutlinedInput-input": {
                              padding: "4px 6px",
                            },
                          }}
                        />
                      </div>
                    </div>



                    {/* <div>
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
                            className="!border !border-[#cecece] bg-white pt-1 rounded-md text-gray-900 text-sm ring-4 ring-transparent placeholder-gray-500 focus:!border-[#366FA1] focus:outline-none focus:ring-0 min-w-[80px]"
                            style={{
                              height: "28px",
                              padding: "4px 6px",
                              fontSize: "0.875rem",
                              width: 300,
                            }}
                            value={invoiceData[0].invoice_type || ""}
                            disabled
                            onChange={handleInputChangeInvoiceData}
                          >
                            {filteredInvoiceTypes.map((option) => (
                              <option key={option} value={option.toLowerCase()}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div> */}

                    {/* <div>
                      <div>
                        <label htmlFor="entry_type">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="block font-semibold mb-1"
                          >
                            Entity Type
                          </Typography>
                        </label>
                      </div>
                      <div className="">
                        <div className="">
                          <select
                            className="!border !border-[#cecece] bg-white pt-1 rounded-md text-gray-900 text-sm ring-4 ring-transparent placeholder-gray-500 focus:!border-[#366FA1] focus:outline-none focus:ring-0 min-w-[80px]"
                            style={{
                              height: "28px", // Match this to your Autocomplete's root height
                              padding: "4px 6px", // Match this padding
                              fontSize: "0.875rem", // Ensure font size is consistent
                              width: 300,
                            }}
                            name="entry_type"
                            value={invoiceData[0].entry_type}
                            disabled
                            onChange={handleInputChangeInvoiceData}
                          >
                            <option value="">Select Entity Type</option>
                            <option value="sales_invoice">Sales Invoice</option>
                            <option value="debit_note">Debit Note</option>
                            <option value="income">Income</option>
                          </select>
                        </div>
                      </div>
                    </div> */}

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
                            href={`https://admin.dms.zacoinfotech.com${invoiceData[0]?.attach_invoice || ""
                              }`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <p className="text-blue-500">
                              {invoiceData[0]?.attach_invoice
                                ? typeof invoiceData[0]?.attach_invoice ===
                                  "string"
                                  ? truncateFileName(
                                    invoiceData[0]?.attach_invoice
                                      .split("/")
                                      .pop()
                                  )
                                  : ""
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
                          name="attach_e_way_bill"
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
                            href={`https://admin.dms.zacoinfotech.com${invoiceData[0]?.attach_e_way_bill || ""
                              }`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <p className="text-blue-500">
                              {invoiceData[0]?.attach_e_way_bill
                                ? typeof invoiceData[0]?.attach_e_way_bill ===
                                  "string"
                                  ? truncateFileName(
                                    invoiceData[0]?.attach_e_way_bill
                                      .split("/")
                                      .pop()
                                  )
                                  : ""
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
                      <div className="">
                        {/* <TextField
                          value={invoiceData[0].month}
                          disabled
                          onChange={(e) =>
                            handleInputChangeInvoiceData(
                              index,
                              "month",
                              e.target.value
                            )
                          }
                          variant="outlined"
                          size="small"
                          type="date"
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 28,
                              padding: "4px 6px",
                              width: 300,
                            },
                            "& .MuiOutlinedInput-input": {
                              padding: "4px 6px",
                            },
                          }}
                        /> */}
                        <div className="relative w-full">
                          <DatePicker
                            ref={month}
                            disabled
                            selected={
                              invoiceData[0]?.month
                                ? isValid(parse(invoiceData[0].month, "dd-MM-yyyy", new Date()))
                                  ? parse(invoiceData[0].month, "dd-MM-yyyy", new Date())
                                  : null
                                : null
                            }
                            onChange={handleDateChange}
                            value={invoiceData[0].month}
                            dateFormat="dd-MM-yyyy"
                            className="w-full !border !border-[#cecece] bg-white py-0.5 pl-3 text-gray-500 
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
                      <div className="mb-2">
                        {/* <TextField
                          value={invoiceData[0].invoice_date}
                          disabled
                          onChange={(e) =>
                            handleInputChangeInvoiceData(
                              index,
                              "invoice_date",
                              e.target.value
                            )
                          }
                          variant="outlined"
                          type="date"
                          size="small"
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 28,
                              padding: "4px 6px",
                              width: 300,
                            },
                            "& .MuiOutlinedInput-input": {
                              padding: "4px 6px",
                            },
                          }}
                        /> */}
                        <div className="relative w-full">
                          <DatePicker
                            ref={invoice}
                            disabled
                            selected={
                              invoiceData[0]?.invoice_date
                                ? isValid(parse(invoiceData[0].invoice_date, "dd-MM-yyyy", new Date()))
                                  ? parse(invoiceData[0].invoice_date, "dd-MM-yyyy", new Date())
                                  : null
                                : null
                            }
                            value={invoiceData[0].invoice_date}
                            onChange={handleToDateChange}
                            dateFormat="dd-MM-yyyy"
                            className="w-full !border !border-[#cecece] bg-white py-0.5 pl-3 text-gray-500 
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
                </div>

                <div>
                  <div className="py-5 px-0">
                    <div className="bg-secondary px-0 py-3 rounded-md ">
                      <Box sx={{ width: "100%", typography: "body1" }}>
                        <TabContext value={value}>
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
                                      {/* <Stack spacing={1} sx={{ width: 300 }}> */}
                                      <Autocomplete
                                        sx={{ width: 300 }}
                                        freeSolo
                                        id="gst-no-autocomplete"
                                        disableClearable
                                        options={customerData}
                                        disabled
                                        getOptionLabel={(option) =>
                                          typeof option === "string"
                                            ? option
                                            : option.gst_no || ""
                                        }
                                        onChange={handleGstNoChange}
                                        value={vendorData.gst_no || ""} // Bind value to formData.gst_no
                                        renderOption={(props, option) => (
                                          <li {...props} key={option.id}>
                                            {option.gst_no}
                                          </li>
                                        )}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            size="small"
                                            name="gst_no"
                                            disabled
                                            value={vendorData.gst_no || ""} // Reset input value when formData.gst_no changes
                                            onChange={(e) =>
                                              handleGstNoChange(
                                                e,
                                                e.target.value
                                              )
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
                                    <div className="h-7">
                                      <TextField
                                        value={vendorData.name}
                                        disabled
                                        onChange={(e) =>
                                          handleInputChangeInvoiceData(
                                            index,
                                            "name",
                                            e.target.value
                                          )
                                        }
                                        variant="outlined"
                                        type="text"
                                        size="small"
                                        sx={{
                                          "& .MuiInputBase-root": {
                                            height: 28,
                                            padding: "4px 6px",
                                            width: 300,
                                          },
                                          "& .MuiOutlinedInput-input": {
                                            padding: "4px 6px",
                                          },
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
                                        PAN
                                      </Typography>
                                    </label>
                                  </div>
                                  <div className="col-span-8 h-7">
                                    <div className="">
                                      <TextField
                                        value={vendorData.pan}
                                        disabled
                                        onChange={(e) =>
                                          handleInputChangeInvoiceData(
                                            index,
                                            "pan",
                                            e.target.value
                                          )
                                        }
                                        variant="outlined"
                                        type="text"
                                        size="small"
                                        sx={{
                                          "& .MuiInputBase-root": {
                                            height: 28,
                                            padding: "4px 6px",
                                            width: 300,
                                          },
                                          "& .MuiOutlinedInput-input": {
                                            padding: "4px 6px",
                                          },
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
                                      <TextField
                                        value={vendorData.customer_address}
                                        disabled
                                        onChange={(e) =>
                                          handleInputChangeInvoiceData(
                                            index,
                                            "customer_address",
                                            e.target.value
                                          )
                                        }
                                        variant="outlined"
                                        type="text"
                                        size="small"
                                        sx={{
                                          "& .MuiInputBase-root": {
                                            height: 28,
                                            padding: "4px 6px",
                                            width: 300,
                                          },
                                          "& .MuiOutlinedInput-input": {
                                            padding: "4px 6px",
                                          },
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
                                      <TextField
                                        value={vendorData.email}
                                        disabled
                                        onChange={(e) =>
                                          handleInputChangeInvoiceData(
                                            index,
                                            "email",
                                            e.target.value
                                          )
                                        }
                                        variant="outlined"
                                        type="text"
                                        size="small"
                                        sx={{
                                          "& .MuiInputBase-root": {
                                            height: 28,
                                            padding: "4px 6px",
                                            width: 300,
                                          },
                                          "& .MuiOutlinedInput-input": {
                                            padding: "4px 6px",
                                          },
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
                                      <TextField
                                        value={vendorData.contact}
                                        disabled
                                        onChange={(e) =>
                                          handleInputChangeInvoiceData(
                                            index,
                                            "contact",
                                            e.target.value
                                          )
                                        }
                                        variant="outlined"
                                        type="text"
                                        size="small"
                                        sx={{
                                          "& .MuiInputBase-root": {
                                            height: 28,
                                            padding: "4px 6px",
                                            width: 300,
                                          },
                                          "& .MuiOutlinedInput-input": {
                                            padding: "4px 6px",
                                          },
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
                                              disabled
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
                                              disabled
                                              checked={
                                                vendorData.vendor || false
                                              }
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
                                style={{
                                  maxHeight: "200px",
                                  overflowY: "auto",
                                }}
                              >
                                <Table>
                                  <TableHead>
                                    <TableRow
                                      sx={{ backgroundColor: "#f3f4f6" }}
                                    >
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
                                        Total Unit / Unit
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
                                    {/* <div style={{ maxHeight: "450px", overflowY: "auto" }}> */}
                                    {rows.map((row, index) => (
                                      <TableRow key={index} className="p-0 ">
                                        <TableCell sx={{ padding: "6px" }}>
                                          <Autocomplete
                                            freeSolo
                                            id={`product-autocomplete-${index}`}
                                            disableClearable
                                            options={product_ser_Data}
                                            disabled
                                            getOptionLabel={(option) =>
                                              option.product_name || ""
                                            }
                                            onChange={(event, newValue) =>
                                              handleProductChange(
                                                index,
                                                newValue
                                              )
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
                                                disabled
                                                placeholder="select product"
                                                sx={{
                                                  "& .MuiOutlinedInput-root": {
                                                    padding: "2px",
                                                    fontSize: "0.875rem",
                                                    minHeight: "30px",
                                                    width: "100px",
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
                                            value={row.description}
                                            disabled
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
                                            disabled
                                            onChange={(e) =>
                                              handleInputChangeProduct(
                                                index,
                                                "hsnCode",
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

                                        <TableCell
                                          sx={{ padding: "6px" }}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <TextField
                                            value={units[index]?.unit} // Static part: unit from 'units'
                                            disabled // Disable to make it non-editable
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                              "& .MuiOutlinedInput-root": {
                                                padding: "2px",
                                                fontSize: "0.875rem",
                                                minHeight: "30px",
                                              },
                                              "& .MuiOutlinedInput-input": {
                                                padding: "0px",
                                              },
                                            }}
                                          />
                                          <span style={{ margin: "0 5px" }}>
                                            <RxSlash />
                                          </span>
                                          <TextField
                                            value={rows[index]?.unit || ""} // Editable part: unit from 'rows'
                                            type="number"
                                            onChange={(e) => {
                                              const enteredValue =
                                                e.target.value.replace(
                                                  /-/g,
                                                  ""
                                                ); // Remove negative sign
                                              const maxAllowed =
                                                units[index]?.unit || 0; // Get the maximum allowed value

                                              if (
                                                parseFloat(enteredValue) >
                                                parseFloat(maxAllowed)
                                              ) {
                                                // Show toast notification if the value exceeds
                                                toast.error(
                                                  `Value cannot exceed ${maxAllowed}`,
                                                  {
                                                    position: "top-right",
                                                    autoClose: 2000,
                                                    hideProgressBar: true,
                                                    closeOnClick: true,
                                                    pauseOnHover: true,
                                                    draggable: true,
                                                    theme: "colored",
                                                  }
                                                );
                                                return; // Prevent updating the state
                                              }

                                              // Update state if value is valid
                                              handleInputChangeProduct(
                                                index,
                                                "unit",
                                                enteredValue
                                              );
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
                                            value={row.rate}
                                            onChange={(e) =>
                                              handleInputChangeProduct(
                                                index,
                                                "rate",
                                                e.target.value
                                              )
                                            }
                                            variant="outlined"
                                            disabled
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
                                            disabled
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
                                            disabled
                                            onChange={(e) =>
                                              handleInputChangeProduct(
                                                index,
                                                "gstRate",
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

                                        {shouldShowCGSTSGST && (
                                          <>
                                            <TableCell sx={{ padding: "6px" }}>
                                              <TextField
                                                value={row.cgst || ""}
                                                disabled
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
                                                disabled
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
                                              disabled
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
                                            disabled
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
                                          {/* <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() =>
                                              handleDeleteRow(index)
                                            }
                                            aria-label="delete"
                                          >
                                            <DeleteIcon fontSize="small" />
                                          </IconButton> */}
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
                                            {/* <button
                                              onClick={handleAddRow}
                                              type="button"
                                              className=" bg-primary text-white p-2 rounded-md"
                                            >
                                              Add New Product
                                            </button> */}
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
                                                    className="!border !border-[#cecece] bg-white pt-1 rounded-md text-gray-900 text-sm ring-4 ring-transparent placeholder-gray-500 focus:!border-[#366FA1] focus:outline-none focus:ring-0 min-w-[80px]"
                                                    style={{
                                                      height: "28px",
                                                      padding: "4px 6px",
                                                      fontSize: "0.875rem",
                                                      width: 300,
                                                    }}
                                                    value={invoiceData[0].invoice_type || ""}
                                                    disabled
                                                    onChange={handleInputChangeInvoiceData}
                                                  >
                                                    {filteredInvoiceTypes.map((option) => (
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
                                                disabled
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
                                                // onChange={(e) =>
                                                //   handleInputChangeProduct(
                                                //     index,
                                                //     "igst",
                                                //     e.target.value
                                                //   )
                                                // }
                                                disabled
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
                                                disabled
                                                // onChange={(e) =>
                                                //   handleInputChangeProduct(
                                                //     index,
                                                //     "igst",
                                                //     e.target.value
                                                //   )
                                                // }
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
                                  {/* <div>
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
                                                                      className="!border !border-[#cecece] bg-white pt-1 rounded-md text-gray-900 text-sm ring-4 ring-transparent placeholder-gray-500 focus:!border-[#366FA1] focus:outline-none focus:ring-0 min-w-[80px]"
                                                                      style={{
                                                                        height: "28px", // Match this to your Autocomplete's root height
                                                                        padding: "4px 6px", // Match this padding
                                                                        fontSize: "0.875rem", // Ensure font size is consistent
                                                                        width: 300,
                                                                      }}
                                                                      value={invoiceData[0].invoice_type} // Ensures the selected value matches the state
                                                                      onChange={handleInputChangeInvoiceData}
                                                                    >
                                                                      {vendorData.gst_no === "" // Check if gst_no is empty
                                                                        ? // Show only these options when gst_no is empty
                                                                          [
                                                                            "Select Invoice Type",
                                                                            "Unregistered Local",
                                                                            "Unregistered Non-Local",
                                                                          ].map((option) => (
                                                                            <option
                                                                              key={option}
                                                                              value={option.toLowerCase()}
                                                                            >
                                                                              {option}
                                                                            </option>
                                                                          ))
                                                                        : // Show other options when gst_no is not empty
                                                                          [
                                                                            "Select Invoice Type",
                                                                            "B2B",
                                                                            "B2C-L",
                                                                            "BSC-O",
                                                                            "Nil Rated",
                                                                            "Advance Received",
                                                                            "SEZ",
                                                                            "Export",
                                                                          ].map((option) => (
                                                                            <option
                                                                              key={option}
                                                                              value={option.toLowerCase()}
                                                                            >
                                                                              {option}
                                                                            </option>
                                                                          ))}
                                                                    </select>
                                                                  </div>
                                                                </div>
                                                              </div> */}
                                </div>
                                <div className="col-span-1">
                                  <label htmlFor="invoice_type">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="block font-semibold mb-1"
                                    >
                                      Select TDS/ TCS
                                    </Typography>
                                  </label>
                                  <div className="text-sm my-2">
                                    <select
                                      id="option"
                                      value={selectedTDSTCSOption}
                                      onChange={(e) =>
                                        setSelectedTDSTCSOption(e.target.value)
                                      }
                                      className="mt-2 block w-full px-  0.5 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                      <option value="" disabled>
                                        Choose TDS/TCS
                                      </option>
                                      <option value="tcs">TCS</option>
                                      <option value="tds">TDS</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="col-span-1">
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
                                                type="number"
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
                                                    ); // Allows only digits and decimal
                                                }}
                                                className="mt-2 block w-full px-2 py-0.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                              />
                                            </div>
                                            <div>
                                              <input
                                                id="tcs"
                                                type="number"
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
                                                id="tds"
                                                type="number"
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
                                                    ); // Allows only digits and decimal
                                                }}
                                                className="mt-2 block w-full px-2 py-0.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                              />
                                            </div>
                                            <div>
                                              <input
                                                id="tds"
                                                type="number"
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
                                  {/* <div className=" text-sm my-2">
                                                                <div className="">
                                                                  {selectedTDSTCSRateOption === "TCS" && (
                                                                    <div>
                                                                      <label
                                                                        htmlFor="tcs"
                                                                        className="block text-sm font-medium text-gray-700"
                                                                      >
                                                                        TCS Input
                                                                      </label>
                                                                      <input
                                                                        id="tcs"
                                                                        type="text"
                                                                        placeholder="Enter TCS Rate value"
                                                                        className="mt-2 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                      />
                                                                    </div>
                                                                  )}
                                                                  {selectedTDSTCSRateOption === "TDS" && (
                                                                    <div>
                                                                      <label
                                                                        htmlFor="tds"
                                                                        className="block text-sm font-medium text-gray-700"
                                                                      >
                                                                        TDS Input
                                                                      </label>
                                                                      <input
                                                                        id="tds"
                                                                        type="text"
                                                                        placeholder="Enter TDS Rate value"
                                                                        className="mt-2 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                      />
                                                                    </div>
                                                                  )}
                                                                </div>
                                                              </div> */}
                                  {/* <div className=" text-sm my-2">
                                                                <div className="">
                                                                  {selectedTDSTCSectionOption === "TCS" && (
                                                                    <div>
                                                                      <input
                                                                        id="tcs"
                                                                        type="text"
                                                                        placeholder="Enter TCS Section value"
                                                                        className="mt-2 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                      />
                                                                    </div>
                                                                  )}
                                                                  {selectedTDSTCSectionOption === "TDS" && (
                                                                    <div>
                                                                      <input
                                                                        id="tds"
                                                                        type="text"
                                                                        placeholder="Enter TDS Section value"
                                                                        className="mt-2 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                      />
                                                                    </div>
                                                                  )}
                                                                </div>
                                                              </div> */}
                                  <div className="grid grid-cols-12 text-sm mt-8">
                                    <div className="col-span-6 font-bold">
                                      Amount Receivable :
                                    </div>
                                    <div className="col-span-6">
                                      <TextField
                                        variant="outlined"
                                        size="small"
                                        name="amount_receivable"
                                        // value={amount_receivable}
                                        value={invoiceData[0].amount_receivable}
                                        // onChange={handleInputChangeInvoiceData}
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
                        </TabContext>
                      </Box>
                    </div>
                  </div>
                </div>
                {/* <div className="p-4">
                <label
                  htmlFor="option"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select an option
                </label>
                <select
                  id="option"
                  value={selectedTDSTCSOption}
                  onChange={(e) => setSelectedTDSTCSOption(e.target.value)}
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="" disabled>
                    Choose an option
                  </option>
                  <option value="TCS">TCS</option>
                  <option value="TDS">TDS</option>
                </select>

                <div className="mt-4">
                  {selectedTDSTCSOption === "TCS" && (
                    <div>
                      <label
                        htmlFor="tcs"
                        className="block text-sm font-medium text-gray-700"
                      >
                        TCS Input
                      </label>
                      <input
                        id="tcs"
                        type="text"
                        placeholder="Enter TCS value"
                        className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  )}
                  {selectedTDSTCSOption === "TDS" && (
                    <div>
                      <label
                        htmlFor="tds"
                        className="block text-sm font-medium text-gray-700"
                      >
                        TDS Input
                      </label>
                      <input
                        id="tds"
                        type="text"
                        placeholder="Enter TDS value"
                        className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  )}
                </div>
              </div> */}
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

export default IncomeDNCreation;
