



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

import { Link, useLocation, useParams } from "react-router-dom";

import axios from "axios";
import IncomeDebitNoteFileCreation from "./IncomeDebitNoteFileCreation";
import IncomeDebitNoteCreation from "./IncomeDebitNoteCreation";
import IncomeDebitNoteCard from "./IncomeDebitNoteCard";
import IncomeDNCreation from "./IncomeDNCreation";
import { HomeIcon } from "@heroicons/react/16/solid";
// import DebitNoteCreation from "./DebitNoteCreation";
// import DebitNoteFileCreation from "./DebitNoteFileCreation";
// import DebitNoteCard from "./DebitNoteCard";
const API_URL = import.meta.env.VITE_API_BASE_URL;
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


function IncomeDebitNote() {

  const { id, incomeID } = useParams();
  // console.log("res", useParams());
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoiceDetails = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/incomedebitnote-list/${id}/${incomeID}`
      );
      const apiData = response.data;
      // console.log("gggggggg",response.data)

      setInvoiceData(apiData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchInvoiceDetails();
  }, [id, incomeID]);

  const calculateTableBodyHeight = () => {
    const rowHeight = 80;
    const maxHeight = 525;
    const calculatedHeight = invoiceData.length * rowHeight;
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
  }, [invoiceData]);

  const columns = [
    // {
    //   name: "id",
    //   label: "Sr No",
    //   options: {
    //     setCellHeaderProps: () => ({
    //       style: {
    //         backgroundColor: "#366FA1",
    //         color: "#ffffff",
    //       },
    //     }),
    //   },
    // },

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
    // {
    //   name: "attach_invoice",
    //   label: "Attachments",
    //   options: {
    //     setCellHeaderProps: () => ({
    //       style: {
    //         backgroundColor: "#366FA1",
    //         color: "#ffffff",
    //       },
    //     }),
    //     customBodyRender: (value) => (
    //       value ? (
    //         <a href={`https://admin.dms.zacoinfotech.com${value}`} target="_blank" rel="noopener noreferrer">
    //           <ImFilePicture size={20} color="#366FA1" />
    //         </a>
    //       ) : null
    //     ),
    //   },
    // },
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
      name: "invoice_date",
      label: "Invoice Date",
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
          const rowData = invoiceData[dataIndex];
          return <div>{/* <BankCard rowId={rowData.id} /> */}
            {/* <DebitNoteCard rowId={rowData.id} fileData={invoiceData.attach_e_way_bill} incomeID={incomeID} fetchInvoiceDetails={fetchInvoiceDetails}/> */}
            <IncomeDebitNoteCard rowId={rowData.id} fileData={invoiceData.attach_e_way_bill} incomeID={incomeID} fetchInvoiceDetails={fetchInvoiceDetails} />
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

  const location = useLocation(); // Get the current location object

  // Extract the pathnames and exclude numeric segments
  const pathnames = location.pathname
    .split("/")
    .filter((x) => x && isNaN(Number(x))); // Exclude numeric IDs like `1`

  // Construct breadcrumb items
  const breadcrumbItems = [
    { name: "Home", path: "/master" },
    ...pathnames.map((segment, index) => {
      let path = `/${pathnames.slice(0, index + 1).join("/")}`;
      if (segment.toLowerCase() === "clientdetails") {
        path = `/clientDetails/${id}`;
      } else if (segment.toLowerCase() === "incomedebitnote") {
        path = ""; // Non-clickable path for expensesCreditNote
      }
      return { name: segment.charAt(0).toUpperCase() + segment.slice(1), path };
    }),
  ];

  const renderNoData = () => (
    <div className="w-full border rounded-lg shadow-md p-10 flex flex-col items-center justify-center text-red-900 text-lg bg-white">
      No incomedebitnote data available !!
    </div>
  );




  return (
    <>
      <ToastContainer />

      <div className="p-20">

        <nav className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md w-fit mb-1">
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              {index === 0 ? (
                // Home breadcrumb with link
                <Link
                  to={item.path}
                  className="flex items-center text-primary hover:text-primary"
                >
                  <HomeIcon className="h-5 w-5" />
                  <span className="ml-1">{item.name}</span>
                </Link>
              ) : item.name.toLowerCase() === "incomedebitnote" ? (
                // Non-clickable breadcrumb for expensesCreditNote
                <span className="text-gray-700">{item.name}</span>
              ) : (
                // Clickable breadcrumbs for other items
                <Link
                  to={item.path}
                  className="text-gray-700 hover:text-primary"
                >
                  {item.name}
                </Link>
              )}
              {/* Arrow icon between breadcrumbs */}
              {index < breadcrumbItems.length - 1 && (
                <span className="text-gray-400">{">"}</span>
              )}
            </div>
          ))}
        </nav>



        <div className="flex justify-between align-middle items-center mb-5">
          <div className="text-2xl text-gray-800 font-semibold">
            Income  DebitNote Details
          </div>

          <div className="flex align-middle items-center gap-2">

            {/* <SalesFileCreation /> */}
            {/* <DebitNoteFileCreation fetchInvoiceDetails={fetchInvoiceDetails}/> */}
            {/* <DebitNoteCreation fetchInvoiceDetails={fetchInvoiceDetails}/> */}
            {/* <IncomeDebitNoteFileCreation fetchInvoiceDetails={fetchInvoiceDetails}/>0000000000000 */}
            {/* <IncomeDebitNoteCreation fetchInvoiceDetails={fetchInvoiceDetails}/> */}
            <IncomeDNCreation fetchInvoiceDetails={fetchInvoiceDetails} />
          </div>
        </div>
        {Array.isArray(invoiceData) && invoiceData.length > 0 ? (
          <CacheProvider value={muiCache}>
            <ThemeProvider theme={theme}>
              <MUIDataTable data={invoiceData} columns={columns} options={options} />
            </ThemeProvider>
          </CacheProvider>
        ) : (
          renderNoData()
        )}
      </div>
    </>
  );
}

export default IncomeDebitNote;








