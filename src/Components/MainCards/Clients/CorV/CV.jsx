
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
import CVCard from "./CVCard";
// import CVCards from "./cvcards";
import CVCreation from "./CVCreation";
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
function CV({ cvData }) {


  const calculateTableBodyHeight = () => {
    const rowHeight = 80; // Approximate height for one row
    const maxHeight = 525; // Maximum table body height
    const calculatedHeight = cvData.length * rowHeight;
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
  }, [cvData]);

  const columns = [
    {
      name: "name",
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
      name: "gst_no",
      label: "Gst No",
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
      name: "pan",
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
      name: "address",
      label: "Address",
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
      name: "email",
      label: "Email",
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
      name: "type",
      label: "Type",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const rowData = cvData[tableMeta.rowIndex];
          if (rowData.customer && rowData.vendor) return "Customer and Vendor";
          if (rowData.customer) return "Customer";
          if (rowData.vendor) return "Vendor";
          return "";
        },
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
          const rowData = cvData[dataIndex];
          return (
            <div>
              <CVCard rowId={rowData.id} />
              {/* <CVCards rowId={rowData.id} /> */}

            </div>
          );
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
      No customer or vendor data available !!
    </div>
  );

  return (
    <>
      <ToastContainer />

      <div>
        <div className="flex justify-between align-middle items-center mb-5">
          <div className="text-2xl text-gray-800 font-semibold">
            Client and Vendor Details
          </div>
          <div>
            <CVCreation />
          </div>
        </div>
        {Array.isArray(cvData) && cvData.length > 0 ? (
          <CacheProvider value={muiCache}>
            <ThemeProvider theme={theme}>
              <MUIDataTable data={cvData} columns={columns} options={options} />
            </ThemeProvider>
          </CacheProvider>
        ) : (
          renderNoData()
        )}
      </div>
    </>
  );
}

export default CV;

