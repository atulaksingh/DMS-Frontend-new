import React, { useState } from "react";
import { Typography, Menu, MenuItem, IconButton } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Card from "./Card";
import { Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
function MuiTable({ tableData, fetchClients }) {
  // console.log("tableData", tableData);
  const role = getUserRole();
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("525px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [searchBtn, setSearchBtn] = useState(true);
  const [downloadBtn, setDownloadBtn] = useState(true);
  const [printBtn, setPrintBtn] = useState(true);
  const [viewColumnBtn, setViewColumnBtn] = useState(true);
  const [filterBtn, setFilterBtn] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const navigate = useNavigate();

  const handleClick = (event, rowData) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(rowData);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = () => {
    // console.log("Update:", currentRow);
    handleClose();
  };

  const handleDelete = () => {
    // console.log("Delete:", currentRow);
    handleClose();
  };

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
      name: "entity_type",
      label: "Entity Type",
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
      name: "contact_person",
      label: "Contact Person",
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
      name: "designation",
      label: "Designation",
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
      name: "status",
      label: "Status",
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
          const rowData = tableData[dataIndex];
          return (
            <div>

              <Card rowId={rowData.id} fetchClients={fetchClients} />

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
    responsive: responsive,
    search: searchBtn,
    download: downloadBtn,
    print: printBtn,
    viewColumns: viewColumnBtn,
    filter: filterBtn,
    filterType: "dropdown",
    selectableRows: "none",
    rowsPerPage: 13,
    rowsPerPageOptions: [13, 25, 50, 100],
    page: 0,

    // 👇👇 Set these two blank or undefined
    tableBodyHeight: "",
    tableBodyMaxHeight: "",

    // Optional: log actions
    onTableChange: (action, state) => {
      console.log(action);
      console.dir(state);
    },
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
      {/* <ToastContainer /> */}
      {/* <div style={{ padding: "40px 80px" }}> */}
      <div >
        <div className="flex justify-between align-middle items-center mb-5">
          <div className="text-2xl text-gray-800 font-semibold">
            Client Details
          </div>
          <div>
            {((role === "superuser")) && (
              <Link to={"/client"}>
                <Button size="md" className="bg-[#366FA1] hover:bg-[#2d5e85]">
                  Create
                </Button>
              </Link>
            )}
          </div>
        </div>
        <CacheProvider value={muiCache}>
          <ThemeProvider theme={theme}>
            <MUIDataTable
              // title={"Client Details"}
              data={tableData}
              columns={columns}
              options={options}
            />
          </ThemeProvider>
        </CacheProvider>
      </div>
    </>
  );
}

export default MuiTable;
