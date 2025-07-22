import React, { useState, useEffect } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { Input, Typography } from "@material-tailwind/react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useParams } from "react-router-dom";
import TdsPaymentCreation from "./TdsPaymentCreation";
import TdsPaymentCard from "./TdsPaymentCard";
import TdsPaymentFileCreation from "./TdsPaymentFileCreation";
// import TdsSectionCreationPayment from "./TdsSectionCreationPayment";
// import TdsSectionPayments from "./TdsSectionPayments";
import axios from "axios";
import TdsSectionPayments from "./TdsSectionPayments";
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
function TdsPayment({ tdsPaymentData, tdsSectionData }) {

  const { id } = useParams();
  const calculateTableBodyHeight = () => {
    const rowHeight = 80; // Approximate height for one row
    const maxHeight = 525; // Maximum table body height
    const calculatedHeight = tdsPaymentData.length * rowHeight;
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
  const [allTdsSectionData, setAllTdsSectionData] = useState([]);
  const fetchAllTdsSectionDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/get-tdssection`);
      console.log("response tds section", response?.data)
      setAllTdsSectionData({
        tds_section: response?.data?.tds_section || [],
      });
    }
    catch (error) {
      console.error("Error fetching data:", error);
      setAllTdsSectionData({
        tds_section: [],
      });
    }
  };

  useEffect(() => {
    fetchAllTdsSectionDetails();
  }, [id]);

  useEffect(() => {
    setTableBodyHeight(calculateTableBodyHeight());
  }, [tdsPaymentData]);

  const columns = [
    {
      name: "client_name",
      label: "Client Name",
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
      name: "PAN",
      label: "PAN",
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
      name: "date",
      label: "Date",
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
      name: "amount",
      label: "Amount",
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
      name: "tds_rate",
      label: "TDS Rate",
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
      name: "total_amt",
      label: "Total Amount",
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
          const rowData = tdsPaymentData[dataIndex];
          return <div>
            <TdsPaymentCard rowId={rowData.id} allTdsSectionData={allTdsSectionData} fetchAllTdsSectionDetails={fetchAllTdsSectionDetails} />
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
            TDS Payment Details
          </div>
          <div className="flex align-middle items-center gap-2">
            <TdsSectionPayments tdsSectionData={tdsSectionData} />
            <TdsPaymentFileCreation/>
            <TdsPaymentCreation allTdsSectionData={allTdsSectionData} fetchAllTdsSectionDetails={fetchAllTdsSectionDetails} />
          </div>
        </div>
        <CacheProvider value={muiCache}>
          <ThemeProvider theme={theme}>
            <MUIDataTable
              data={tdsPaymentData}
              columns={columns}
              options={options}
            />
          </ThemeProvider>
        </CacheProvider>
      </div>
    </>
  );
}
export default TdsPayment;
