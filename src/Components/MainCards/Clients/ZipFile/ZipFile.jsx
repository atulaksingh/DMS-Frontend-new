

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
import ZipFileCreation from "./ZipFileCreation";
import ZipFileCard from "./ZipFileCard";

// import IncomeFileCreation from "./IncomeFileCreation";
// import IncomeCreation from "./IncomeCreation";
// import IncomeCard from "./IncomeCard";


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
function ZipFile({zipFileData}) {
  const calculateTableBodyHeight = () => {
    const rowHeight = 80; 
    const maxHeight = 525; 
    const calculatedHeight = zipFileData.length * rowHeight;
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
  }, [zipFileData]);

  const columns = [
    {
      name: "id",
      label: "Sr No",
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
      name: "files",
      label: "Attachments",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        customBodyRender: (value) => {
          if (value) {
            // Extracting the file name from the URL
            const fileName = value.split('/').pop();
    
            return (
             <>

             <a
                href={`https://admin.dms.zacoinfotech.com${value}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "#366FA1" }}
              >
               <div className="flex gap-2">
               <ImFilePicture size={20} color="#366FA1" style={{ marginRight: 8 }} />
               {fileName}
               </div>
              </a>
             </>
            );
          }
          return null;
        },
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
        customBodyRender: (value) => {
          if (value) {
            const date = new Date(value);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
          }
          return ""; // Return an empty string for null or invalid values
        },
      },
    }
    
,    
{
  name: "date",
  label: " Time",
  options: {
    setCellHeaderProps: () => ({
      style: {
        backgroundColor: "#366FA1",
        color: "#ffffff",
      },
    }),
    customBodyRender: (value) => {
      if (value) {
        const date = new Date(value);
       
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return ` ${hours}:${minutes}:${seconds}`;
      }
      return ""; // Return an empty string for null or invalid values
    },
  },
}
,    

   
   
    {
      name: "Actions",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const rowData = zipFileData[dataIndex];
          return <div>{/* <BankCard rowId={rowData.id} /> */} 
          {/* <PurchaseCard rowId={rowData.id} fileData={purchaseInvoiceData.attach_e_way_bill}/>  */}
          {/* <IncomeCard rowId={rowData.id} fileData={zipFileData.attach_e_way_bill} /> */}
          <ZipFileCard rowId={rowData.id}/>
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
            Zip File Upload Details
          </div>
      
          <div className="flex align-middle items-center gap-2">
          
           
            <ZipFileCreation />
          </div>
        </div>
        <CacheProvider value={muiCache}>
          <ThemeProvider theme={theme}>
            <MUIDataTable data={zipFileData} columns={columns} options={options} />
          </ThemeProvider>
        </CacheProvider>
      </div>
    </>
  );
}

export default ZipFile;





