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
import AcknowledgementCard from "./AcknowledgementCard";
import AcknowledgementCreation from "./AcknowledgementCreation";


///////
import {
  Accordion, AccordionSummary, AccordionDetails,
  Tabs, Tab, Box, Fade, List, ListItemButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { min } from "date-fns";


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
function Acknowledgement({ ackData }) {

  console.log("ye data hai", ackData);


  const calculateTableBodyHeight = () => {
    const rowHeight = 80; // Approximate height for one row
    const maxHeight = 525; // Maximum table body height
    const calculatedHeight = ackData?.length * rowHeight;
    return calculatedHeight > maxHeight
      ? `${maxHeight}px`
      : `${calculatedHeight}px`;
  };
  const [errorMessage, setErrorMessage] = useState("");
  // const [selectedMonth, setSelectedMonth] = useState(null);
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
  }, [ackData]);

  const columns = [
    {
      name: "return_type",
      label: "Return Type",
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
      name: "frequency",
      label: "Frequency",
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
      name: "return_period",
      label: "Return Period",
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
      name: "from_date",
      label: "From Date",
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
      name: "to_date",
      label: "To Date",
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
          const rowData = ackData[dataIndex];
          return (
            <div>
              {/* <BankCard rowId={rowData.id} /> */}
              <AcknowledgementCard rowId={rowData.id} />
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

  const [expanded, setExpanded] = useState(false);
  const handleExpansion = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  // const filteredAckData2019_2020 = ackData?.filter((item) => {
  //   const [startStr, endStr] = item.return_period.split(" - ");

  //   const startDate = new Date(`${startStr} 1`); // "May 2019" => "May 1, 2019"
  //   const endDate = new Date(`${endStr} 1`);

  //   const periodStart = new Date("April 1, 2019");
  //   const periodEnd = new Date("March 31, 2020");

  //   return (
  //     startDate <= periodEnd && endDate >= periodStart
  //   );
  // });

  const getFinancialYearKey = (startStr) => {                          // in this line we r creating a function with the following name and giving it a parameter
    const [startMonthName, startYearStr] = startStr.split(" ");        // in this line we r spliting the parameter value based on the space in that string
    const startYear = parseInt(startYearStr);                          // in this line we r converting the startYearStr value which is now in string it will be converted in integer

    const monthMap = {    // here we a creating a dictionary in which we r mapping each month by a number
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    const startMonth = monthMap[startMonthName];   // in this line we r storing the number which is mapped to month which is store in startMonthName variable in a "startMonth" variable

    if (startMonth >= 4) {                        
      return `${startYear}-${startYear + 1}`;       // in this line we r checking if the startMonth number is greater than or equal to 4 the it will return startYear and startYear + 1 
    } else {
      return `${startYear - 1}-${startYear}`;      // in this line we r checking if the startMonth number is less than 4 than it will return startYear - 1 and startYear
    }
  };

  const groupByFinancialYear = (data) => {        // in this line we r now again creating a function with the following name and pass a parameter through it
      const grouped = {};                         // now we create empty object with "grouped" name which will store grouped data in this formate 
                                                  // grouped = {
                                                  //   "2019-2020": [ item1, item2 ],
                                                  //   "2020-2021": [ item3, item4 ],
                                                  // }
    data.forEach(item => {                                       // now we r using forEach loop to go through each item from the data we got
      const [startStr] = item.return_period.split(" - ");        // in this line the data  we got we r splitting it based on "-" the first value after spliting got now we r sending it to  startStr
      const key = getFinancialYearKey(startStr);             // now we r calling the function we created above and passing the startStr value to it and storing the return value in key variable

      if (!grouped[key]) {                // now we r checking the key we got if it is present in the grouped object or not
        grouped[key] = [];                 // if it is not then we will create a new key in the grouped objest and assign it an empty array
      }

      grouped[key].push(item);       // now we will push the items in the grouped object with the key we got
    });

    return grouped;          // now we will return the grouped object
  };

  const groupedAckData = groupByFinancialYear(ackData || []);  // in this line we r sending the ackData we got into groupByFinancialYear function and storing the return value in groupedAckData variable

  // const groupByFinancialYear = (data) => {
  //   const grouped = {};
  //   data.forEach(item => {
  //     const [startStr, endStr] = item.return_period.split(" - ");
  //     const startYear = new Date(`${startStr} 1`).getFullYear();
  //     const endYear = new Date(`${endStr} 1`).getFullYear();

  //     const key = `${startYear}-${endYear}`;

  //     if (!grouped[key]) {
  //       grouped[key] = [];
  //     }

  //     grouped[key].push(item);
  //   });

  //   return grouped;
  // };

  // const groupedAckData = groupByFinancialYear(ackData || []);



  return (
    <>
      <ToastContainer />

      <div>
        <div className="flex justify-between align-middle items-center mb-5">
          <div className="text-2xl text-gray-800 font-semibold">
            Acknowledgement Details
          </div>
          <div>

            {/* <BankCreation /> */}
            <AcknowledgementCreation />
          </div>
        </div>
        <CacheProvider value={muiCache}>
          <ThemeProvider theme={theme}>
            <MUIDataTable data={ackData} columns={columns} options={options} />
          </ThemeProvider>
        </CacheProvider>
        <div>
          {/* <Accordion
          expanded={expanded}
          onChange={handleExpansion}
          slots={{ transition: Fade }}
          slotProps={{ transition: { timeout: 400 } }}
          sx={[
            expanded
              ? {
                [`& .MuiAccordion-region`]: {
                  height: 'auto',
                },
                [`& .MuiAccordionDetails-root`]: {
                  display: 'block',
                },
              }
              : {
                [`& .MuiAccordion-region`]: {
                  height: 0,
                },
                [`& .MuiAccordionDetails-root`]: {
                  display: 'none',
                },
              },
          ]}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: '#ffffff' }} />}
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{
              backgroundColor: '#366FA1',
              color: '#FFFFFF',
              '& .MuiTypography-root': {
                color: '#FFFFFF',
              },
            }}
          >
            <Typography component="span">2019-2020</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CacheProvider value={muiCache}>
              <ThemeProvider theme={theme}>
                <MUIDataTable data={filteredAckData2019_2020} columns={columns} options={options} />
              </ThemeProvider>
            </CacheProvider>
          </AccordionDetails>
        </Accordion> */}
        </div>

        <div>
          {/*{Object.entries(groupedAckData).map(([yearRange, dataForYear]) => (
            <Accordion
              key={yearRange}
              expanded={expanded === yearRange}
              onChange={(e, isExpanded) => setExpanded(isExpanded ? yearRange : false)}
              slots={{ transition: Fade }}
              slotProps={{ transition: { timeout: 400 } }}
              sx={[expanded === yearRange
                ? {
                  [`& .MuiAccordion-region`]: {
                    height: 'auto',
                  },
                  [`& .MuiAccordionDetails-root`]: {
                    display: 'block',
                  },
                }
                : {
                  [`& .MuiAccordion-region`]: {
                    height: 0,
                  },
                  [`& .MuiAccordionDetails-root`]: {
                    display: 'none',
                  },
                }]}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#ffffff' }} />}
                sx={{
                  backgroundColor: '#366FA1',
                  color: '#FFFFFF',
                  '& .MuiTypography-root': {
                    color: '#FFFFFF',
                  },
                }}
              >
                <Typography>{yearRange}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CacheProvider value={muiCache}>
                  <ThemeProvider theme={theme}>
                    <MUIDataTable
                      data={dataForYear}
                      columns={columns}
                      options={options}
                    />
                  </ThemeProvider>
                </CacheProvider>
              </AccordionDetails>
            </Accordion>
          ))}*/}

        </div> 

        <div>
          {/* {Object.entries(groupedAckData).map(([yearRange, dataForYear]) => (
            <Accordion
              key={yearRange}
              expanded={expanded === yearRange}
              onChange={(e, isExpanded) => setExpanded(isExpanded ? yearRange : false)}
              slots={{ transition: Fade }}
              slotProps={{ transition: { timeout: 400 } }}
              sx={[
                expanded === yearRange
                  ? {
                    [`& .MuiAccordion-region`]: {
                      height: 'auto',
                    },
                    [`& .MuiAccordionDetails-root`]: {
                      display: 'block',
                    },
                  }
                  : {
                    [`& .MuiAccordion-region`]: {
                      height: 0,
                    },
                    [`& .MuiAccordionDetails-root`]: {
                      display: 'none',
                    },
                  },
              ]}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#ffffff' }} />}
                sx={{
                  backgroundColor: '#366FA1',
                  color: '#FFFFFF',
                  '& .MuiTypography-root': {
                    color: '#FFFFFF',
                  },
                }}
              >
                <Typography>{yearRange}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CacheProvider value={muiCache}>
                  <ThemeProvider theme={theme}>
                    <MUIDataTable
                      data={dataForYear}
                      columns={columns}
                      options={options}
                    />
                  </ThemeProvider>
                </CacheProvider>
              </AccordionDetails>
            </Accordion>
          ))} */}
        </div>



      </div>
    </>
  );
}

export default Acknowledgement;
