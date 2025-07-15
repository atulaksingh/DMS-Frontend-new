

import React, { useState, useEffect } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { Input, Typography } from "@material-tailwind/react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ImFilePicture } from "react-icons/im";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useParams } from "react-router-dom";
import PurchaseCreation from "./PurchaseCreation";
import PurchaseFileCreation from "./PurchaseFileCreation";
import PurchaseCard from "./PurchaseCard";
import Date from "./Date";
import axios from "axios";
// import SalesCreation from "./SalesCreation";
// import SalesFileCreation from "./SalesFileCreation";
// import SalesCard from "./SalesCard";

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});

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
function Purchase({ purchaseInvoiceData, }) {
  console.log("purchaseInvoiceData", purchaseInvoiceData)

  const { id } = useParams();
  console.log("useo", useParams())
  const [allLocationBranchProductData, setAllLocationBranchProductData] = useState([])
  const fetchAllLocBranchDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/get-purchase/${id}`);
      console.log("response purchase", response?.data)
      setAllLocationBranchProductData({
        serializer: response?.data?.serializer || [],
        serializer_customer: response?.data?.serializer_customer || [],
        product_serializer: response?.data?.product_serializer || [],
        branch_serializer: response?.data?.branch_serializer || []
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setAllLocationBranchProductData({
        serializer: [],
        serializer_customer: [],
        product_serializer: [],
        branch_serializer: []
      });
    }
  };

  useEffect(() => {
    fetchAllLocBranchDetails();
  }, [id]);

  const calculateTableBodyHeight = () => {
    const rowHeight = 80;
    const maxHeight = 525;
    const calculatedHeight = purchaseInvoiceData.length * rowHeight;
    return calculatedHeight > maxHeight
      ? `${maxHeight}px`
      : `${calculatedHeight}px`;
  };
  const [errorMessage, setErrorMessage] = useState("");
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState(
    calculateTableBodyHeight
  );
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [searchBtn, setSearchBtn] = useState(true);
  const [downloadBtn, setDownloadBtn] = useState(true);
  const [printBtn, setPrintBtn] = useState(true);
  const [viewColumnBtn, setViewColumnBtn] = useState(true);
  const [filterBtn, setFilterBtn] = useState(true);

  useEffect(() => {
    setTableBodyHeight(calculateTableBodyHeight());
  }, [purchaseInvoiceData]);

  const columns = [
    {
      name: "customer_name",
      label: "Name",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "attach_invoice",
      label: "Attachments",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        customBodyRender: (value) => (
          value ? (
            <a href={`https://admin.dms.zacoinfotech.com${value}`} target="_blank" rel="noopener noreferrer">
              <ImFilePicture size={20} color="#366FA1" />
            </a>
          ) : null
        ),
      },
    },
    {
      name: "customer_gst_no",
      label: "GST No",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "taxable_amount",
      label: "Taxable Amount",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "totalall_gst",
      label: "Total GST Amount",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "total_invoice_value",
      label: "Total Invoice Amount",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "utilise_month",
      label: "Utilise Month",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "Actions",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const rowData = purchaseInvoiceData[dataIndex];
          return <div>{/* <BankCard rowId={rowData.id} /> */}
            <PurchaseCard rowId={rowData.id} allLocationBranchProductData={allLocationBranchProductData} fetchAllLocBranchDetails={fetchAllLocBranchDetails} />
          </div>;
        },
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
  ];

  const options = {
    search: searchBtn,
    download: downloadBtn,
    print: printBtn,
    viewColumns: viewColumnBtn,
    filter: filterBtn,
    filterType: "dropdown",
    responsive,
    tableBodyHeight,
    tableBodyMaxHeight,
    onTableChange: (action, state) => {
      // console.log(action);
      // console.dir(state);
    },
    selectableRows: "none",
    selectableRowsHeader: false,
    rowsPerPage: 13,
    rowsPerPageOptions: [13, 25, 50, 100],
    page: 0,
  };

  const theme = createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: "#366FA1",
            paddingBlock: "2px",
            color: "#ffffff !important",
            "&.MuiTableSortLabel-root": {
              color: "#ffffff !important",
              "&:hover": {
                color: "#ffffff !important",
              },
              "&.Mui-active": {
                color: "#ffffff !important",
                "& .MuiTableSortLabel-icon": {
                  color: "#ffffff !important",
                },
              },
            },
          },
          body: {
            paddingBlock: "0px",
          },
        },
      },
    },
  });

  return (
    <>
      <ToastContainer />

      <div>
        <div className="flex justify-between align-middle items-center mb-5">
          <div className="text-2xl text-gray-800 font-semibold">
            Purchase Details
          </div>

          <div className="flex align-middle items-center gap-2">

            {/* <Date /> */}
            <PurchaseFileCreation />
            <PurchaseCreation allLocationBranchProductData={allLocationBranchProductData} fetchAllLocBranchDetails={fetchAllLocBranchDetails} />
          </div>
        </div>
        <CacheProvider value={muiCache}>
          <ThemeProvider theme={theme}>
            <MUIDataTable data={purchaseInvoiceData} columns={columns} options={options} />
          </ThemeProvider>
        </CacheProvider>
      </div>
    </>
  );
}

export default Purchase;

