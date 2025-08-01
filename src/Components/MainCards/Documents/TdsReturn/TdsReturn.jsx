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
import TdsReturnCreation from "./TdsReturnCreation";
import TdsReturnCard from "./TdsReturnCard";
import axios from "axios";
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
function TdsReturn({ tdsReturnData }) {

  const { id } = useParams();
  const calculateTableBodyHeight = () => {
    const rowHeight = 80; // Approximate height for one row
    const maxHeight = 525; // Maximum table body height
    const calculatedHeight = tdsReturnData.length * rowHeight;
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
  }, [tdsReturnData]);

  const columns = [
    {
      name: "challan_date",
      label: "Challan Date",
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
      name: "challan_no",
      label: "Challan No",
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
      name: "challan_type",
      label: "Challan Type",
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
    //   name: "tds_section",
    //   label: "TDS Section",
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
      name: "last_filed_return_ack_date",
      label: "Last filed return Ack Date",
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
      name: "last_filed_return_ack_no",
      label: "Last filed return Ack No",
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
          const rowData = tdsReturnData[dataIndex];
          return <div>
            <TdsReturnCard rowId={rowData.id} allTdsSectionData={allTdsSectionData} fetchAllTdsSectionDetails={fetchAllTdsSectionDetails} />
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

  const renderNoData = () => (
    <div className="w-full border rounded-lg shadow-md p-10 flex flex-col items-center justify-center text-red-900 text-lg bg-white">
      No TDS Return data available !!
    </div>
  );

  return (
    <>
      <ToastContainer />

      <div>
        <div className="flex justify-between align-middle items-center mb-5">
          <div className="text-2xl text-gray-800 font-semibold">
            TDS Return Details
          </div>
          <div>
            <TdsReturnCreation allTdsSectionData={allTdsSectionData} fetchAllTdsSectionDetails={fetchAllTdsSectionDetails} />
          </div>
        </div>
        {Array.isArray(tdsReturnData) && tdsReturnData.length > 0 ? (
        <CacheProvider value={muiCache}>
          <ThemeProvider theme={theme}>
            <MUIDataTable
              data={tdsReturnData}
              columns={columns}
              options={options}
            />
          </ThemeProvider>
        </CacheProvider>
        ):(
          renderNoData()
        )}
      </div>
    </>
  );
}

export default TdsReturn;
