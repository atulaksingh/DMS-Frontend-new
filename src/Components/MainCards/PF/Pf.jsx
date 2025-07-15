import React, { useState, useEffect } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { Input, Typography } from "@material-tailwind/react";
import MUIDataTable, { TableBody } from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useParams } from "react-router-dom";
import PfCreation from "./PfCreation";
import PfCard from "./PfCard";
import PfFileCreation from "./PfFileCreation";
import axios from "axios";
import { set } from "date-fns";

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
function Pf({ PfData }) {
  const calculateTableBodyHeight = () => {
    const rowHeight = 80; // Approximate height for one row
    const maxHeight = 525; // Maximum table body height
    const calculatedHeight = PfData.length * rowHeight;
    return calculatedHeight > maxHeight
      ? `${maxHeight}px`
      : `${calculatedHeight}px`;
  };
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState(
    calculateTableBodyHeight
  );
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("525px");
  const [searchBtn, setSearchBtn] = useState(true);
  const [downloadBtn, setDownloadBtn] = useState(true);
  const [printBtn, setPrintBtn] = useState(true);
  const [viewColumnBtn, setViewColumnBtn] = useState(true);
  const [filterBtn, setFilterBtn] = useState(true);

  // useEffect(() => {
  //   setTableBodyHeight(calculateTableBodyHeight());
  // }, [PfData]);
  useEffect(() => {
    const newHeight = calculateTableBodyHeight();
    console.log("Updated height:", newHeight);
    setTableBodyHeight(newHeight);
  }, [PfData]);





  const columns = [
    {
      name: "employee_code",
      label: "Employee Code",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "employee_name",
      label: "Employee Name",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "uan",
      label: "UAN",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
            paddingLeft: "50px",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "pf_number",
      label: "PF Number",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
            paddingLeft: "30px",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "pf_deducted",
      label: "PF Deducted",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return value ? "Yes" : "No";
        },
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "date_of_joining",
      label: "Date of Joining",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        // customBodyRender: (value, tableMeta, updateValue) => {
        //   return value ? "Active" : "InActive";
        // },
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
            paddingLeft: "50px",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "gender",
      label: "Gender",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
            paddingLeft: "50px",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "month",
      label: "Month",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
            textAlign: "center",
            paddingLeft: "50px",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "gross_ctc",
      label: "Gross Ctc",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
            paddingLeft: "30px",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "basic_pay",
      label: "Basic Pay",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
            paddingLeft: "30px",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "hra",
      label: "HRA",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
            paddingLeft: "50px",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "statutory_bonus",
      label: "Statutory Bonus",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "special_allowance",
      label: "Special Allowance",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "pf",
      label: "PF",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
            paddingLeft: "60px",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "gratuity",
      label: "Gratuity",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
            paddingLeft: "45px",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "total_gross_salary",
      label: "Total Gross Salary",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "number_of_days_in_month",
      label: "Number of Days in month",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "160px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "present_days",
      label: "Present Days",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "lwp",
      label: "LWP",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
            paddingLeft: "60px",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "leave_adjustment",
      label: "Leave Adjustment",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "basic_pay_monthly",
      label: "Basic pay monthly",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "hra_monthly",
      label: "HRA Monthly",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "statutory_bonus_monthly",
      label: "Statutory Bonus Monthly",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "160px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "special_allowance_monthly",
      label: "Special Allowance Monthly",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "180px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "total_gross_salary_monthly",
      label: "Total gross salary monthly",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "160px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "provident_fund",
      label: "Provident Fund",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "professional_tax",
      label: "Professional Tax",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "advance",
      label: "Advance",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
            paddingLeft: "45px",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "esic_employee",
      label: "Esic Employee",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "tds",
      label: "TDS",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
            paddingLeft: "50px",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "total_deduction",
      label: "Total Deduction",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "net_pay",
      label: "Net Pay",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
            textAlign: "center",
            paddingLeft: "45px",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "140px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "advance_esic_employer_cont",
      label: "Advance ESIC Employer cont",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({
          style: {
            minWidth: "160px",
            whiteSpace: "nowrap", // 👈 prevent wrapping
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "Actions",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const rowData = PfData[dataIndex];
          return (
            <div>
              {/* <BankCard rowId={rowData.id} /> */}
              <PfCard rowId={rowData?.id} fetchPfTotals={fetchPfTotals} />
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
    scrollX: true, //
    onTableChange: (action, state) => {
      // console.log(action);
      // console.dir(state);
    },
    selectableRows: "none",
    selectableRowsHeader: false,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50, 100],
    page: 0,
    customTableBodyFooterRender: () => (

      <tbody>

        <tr style={{ fontWeight: "normal", fontSize: 17, backgroundColor: "#366FA1", color: "#fff", height: "50px", textAlign: "center", width: "100%" }}>
          {/* <td colSpan={columns.length}></td> */}
          {allKeys.map((key) => (
            <td key={key} >
              {typeof data[0][key] === "number" ? totals[key] : "-"}
            </td>
          ))}
          <td></td>
        </tr>
      </tbody>
      // <tbody>
      //   <tr style={{
      //     fontWeight: "normal",
      //     fontSize: 17,
      //     backgroundColor: "#366FA1",
      //     color: "#fff",
      //     height: "50px",
      //     textAlign: "center",
      //     width: "100%"
      //   }}>
      //     {allKeys.map((key) => (
      //       <td key={key}>
      //         {typeof data[0][key] === "number" ? totals[key] : "-"}
      //       </td>
      //     ))}
      //     {/* Extra empty TD for Actions column */}
      //     <td> </td>
      //   </tr>
      // </tbody>

    ),
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
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get(`http://127.0.0.1:8000/api/get-pf-totals/${id}`)
  //     .then((response) => {
  //       // Agar response single object ho toh array me wrap kar le
  //       const result = Array.isArray(response.data)
  //         ? response.data
  //         : [response.data];
  //       setData(result);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []);

  const fetchPfTotals = async (id) => {
    console.log("gggggg")
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/get-pf-totals/${id}`);
      const result = Array.isArray(response.data) ? response.data : [response.data];
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPfTotals(id);
    }
  }, [id]);


  if (data.length === 0) return <p>Loading...</p>;

  const allKeys = Object.keys(data[0]);

  // Create a blank/dummy row object.
  // (You need a key/value pair for each column; adjust keys as needed.)
  const blankRow = {
    employee_code: "",
    employee_name: "",
    uan: "",
    pf_number: "",
    pf_deducted: "",
    date_of_joining: "",
    status: "",
    gender: "",
    month: "",
    gross_ctc: "",
    basic_pay: "",
    hra: "",
    statutory_bonus: "",
    special_allowance: "",
    pf: "",
    gratuity: "",
    total_gross_salary: "",
    number_of_days_in_month: "",
    present_days: "",
    lwp: "",
    leave_adjustment: "",
    basic_pay_monthly: "",
    hra_monthly: "",
    statutory_bonus_monthly: "",
    special_allowance_monthly: "",
    total_gross_salary_monthly: "",
    provident_fund: "",
    professional_tax: "",
    advance: "",
    esic_employee: "",
    tds: "",
    total_deduction: "",
    net_pay: "",
    advance_esic_employer_cont: ""
    // Note: You might not need an "Actions" field if that column uses custom rendering.
  };

  // Create an extended array with the blank row added at the end.
  const extendedPfData = [...PfData, blankRow];



  // Totals for numeric fields
  const totals = {};
  allKeys.forEach((key) => {
    if (typeof data[0][key] === "number") {
      totals[key] = data.reduce((sum, row) => sum + (row[key] || 0), 0);
    }
  });
  return (
    <>
      <ToastContainer />

      <div>
        <div className="flex justify-between align-middle items-center mb-5">
          <div className="text-2xl text-gray-800 font-semibold">
            PF Details
          </div>
          <div className="flex align-middle items-center gap-2">
            <PfFileCreation fetchPfTotals={fetchPfTotals} />
            <PfCreation fetchPfTotals={fetchPfTotals} />
          </div>
        </div>
        <CacheProvider value={muiCache}>
          <ThemeProvider theme={theme}>
            <div style={{ overflowX: "auto" }}>
              <MUIDataTable data={PfData} columns={columns} options={options} />
            </div>

          </ThemeProvider>
        </CacheProvider>
      </div>
    </>
  );
}

export default Pf;
