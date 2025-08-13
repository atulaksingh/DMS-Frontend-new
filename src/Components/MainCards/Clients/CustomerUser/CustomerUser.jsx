
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
import CustomerUserCard from "./CustomerUserCard";
import CustomerUserCreation from "./CustomerUserCreation";
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
function CustomerUser({ customerUserData }) {
  console.log("customerUserData", customerUserData)

  const calculateTableBodyHeight = () => {
    const rowHeight = 80; // Approximate height for one row
    const maxHeight = 525; // Maximum table body height
    const calculatedHeight = customerUserData.length * rowHeight;
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
  }, [customerUserData]);

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
    // {
    //   name: "is_active",
    //   label: "Status",
    //   // label: "Active",
    //   options: {
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       console.log('tttt', tableMeta)
    //       const rowData = customerUserData[tableMeta.rowIndex];
    //       if (rowData.true) return "Active";
    //       if (rowData.false) return "InActive";
    //       // if (rowData.vendor) return "Vendor";
    //       // return "";
    //     },
    //     setCellHeaderProps: () => ({
    //       style: {
    //         backgroundColor: "#366FA1",
    //         color: "#ffffff",
    //       },
    //     }),
    //   },
    // },
    {
      name: "is_active",
      label: "Status",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return value ? "Active" : "InActive";
        },
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },

    // {
    //   name: "customer_name",
    //   label: "Customer/Vendor Name",
    //   options: {
    //     customBodyRenderLite: (dataIndex) => {
    //       const rowData = customerUserData[dataIndex];
    //       const customer = rowData?.customer; // Use optional chaining

    //       // Show the name of the customer if it exists
    //       return customer?.name || "No Name";
    //     },
    //     setCellHeaderProps: () => ({
    //       style: {
    //         backgroundColor: "#366FA1",
    //         color: "#ffffff",
    //       },
    //     }),
    //   },
    // },

    // {
    //   name: "Customer/Vendor",
    //   label: "Customer/Vendor",
    //   options: {
    //     customBodyRenderLite: (dataIndex) => {
    //       const rowData = customerUserData[dataIndex];
    //       const customer = rowData?.customer?.customer;
    //       const vendor = rowData?.customer?.vendor;

    //       let status = "No Data"; // Default if both are undefined
    //       if (customer && vendor) {
    //         status = "Customer and Vendor";
    //       } else if (customer) {
    //         status = "Customer";
    //       } else if (vendor) {
    //         status = "Vendor";
    //       }

    //       return <div>{status}</div>;
    //     },
    //     setCellHeaderProps: () => ({
    //       style: {
    //         backgroundColor: "#366FA1",
    //         color: "#ffffff",
    //       },
    //     }),
    //   },
    // },

    {
      name: "Actions",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const rowData = customerUserData[dataIndex];
          return (
            <div>
              <CustomerUserCard rowId={rowData.id} />
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
      No user data available !!
    </div>
  );

  return (
    <>
      <ToastContainer />

      <div>
        <div className="flex justify-between align-middle items-center mb-5">
          <div className="text-2xl text-gray-800 font-semibold">
            User Details
          </div>
          <div>
            <CustomerUserCreation />
          </div>
        </div>
        {Array.isArray(customerUserData) && customerUserData.length > 0 ? (
          <CacheProvider value={muiCache}>
            <ThemeProvider theme={theme}>
              <MUIDataTable data={customerUserData} columns={columns} options={options} />
            </ThemeProvider>
          </CacheProvider>
        ) : (
          renderNoData()
        )}
      </div>
    </>
  );
}

export default CustomerUser;

