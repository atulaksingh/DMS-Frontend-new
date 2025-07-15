import React, { useState, useEffect } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { Input, tab, Typography } from "@material-tailwind/react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
// import AcknowledgementCard from "./AcknowledgementCard";
// import AcknowledgementCreation from "./AcknowledgementCreation";
import AckCreation from "./AckCreation";
import AcknowledgementCard from "../Clients/Acknowledgement/AcknowledgementCard";
import AcknowledgementCreation from "../Clients/Acknowledgement/AcknowledgementCreation";
import AckCard from "./AckCard";


/////
// import Accordion, {
//     accordionClasses,
// } from '@mui/material/Accordion';
// import {
//   Accordion, AccordionSummary, AccordionDetails,
//   Typography, Tabs, Tab, Box, Fade
// } from '@mui/material';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import AccordionDetails, {
//     accordionDetailsClasses,
// } from '@mui/material/AccordionDetails';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Fade from '@mui/material/Fade';
// import React, { useState } from 'react';
import {
    Accordion, AccordionSummary, AccordionDetails,
    Tabs, Tab, Box, Fade, List, ListItemButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { min } from "date-fns";
import { Key } from "@mui/icons-material";
import { get } from "jquery";



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
function Ack({ acknowledgementData, fetchAckDetails }) {

    console.log("ye data hai", acknowledgementData);


    const calculateTableBodyHeight = () => {
        const rowHeight = 80; // Approximate height for one row
        const maxHeight = 525; // Maximum table body height
        const calculatedHeight = acknowledgementData?.length * rowHeight;
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
    }, [acknowledgementData]);

    const columns = [
        {
            name: "id",          // The ID column
            label: "ID",
            options: {
                display: false,  // Hide this column from the table view
                filter: false,   // Optionally hide it from filtering
                sort: false,     // Optionally disable sorting on this column
            },
        },
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
            name: "month",
            label: "Month",
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
                // customBodyRenderLite: (dataIndex) => {
                //     const rowData = acknowledgementData[dataIndex];
                //     return (
                //         <div>
                //             {/* <BankCard rowId={rowData.id} /> */}
                //             <AckCard rowId={rowData.id} />
                //         </div>/./././././././././././././././././././././././././././././././././././././././././././././
                //././././././././././././././././././././././././././././././

                //     );
                //  
                // },
                customBodyRender: (value, tableMeta) => {
                    const rowIndex = tableMeta.rowIndex;
                    const rowData = tableMeta.rowData; // or use rowIndex safely
                    const actualRow = acknowledgementData.find(row =>
                        row.return_type === rowData[1] && row.return_period === rowData[4] && row.id === rowData[0]);
                    return <AckCard rowId={actualRow?.id} fetchAckDetails={fetchAckDetails} />;
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



    ////

    const [expanded, setExpanded] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);

    const handleExpansion = (event, isExpanded) => {
        setExpanded(isExpanded);
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const tabLabels = ['GST', 'CMP 8', 'ITC 04', 'Income Tax', 'Tax Audit', 'AIR', 'SFT', 'TDS Return', 'TDS Payment', 'PF', 'ESIC', 'GST Notice', 'Income Tax Notice'];

    const getSubTab = [
        'GSTR 1', 'GSTR 3B', 'GSTR 4', 'GSTR 5',
        'GSTR 5A', 'GSTR 6', 'GSTR 7', 'GSTR 8',
        'GSTR 9', 'GSTR 10', 'GSTR 11',
    ];

    const getSubTabs = {
        gstr_1: 'GSTR 1',
        gstr_3b: 'GSTR 3B',
        gstr_4: 'GSTR 4',
        gstr_5: 'GSTR 5',
        gstr_5a: 'GSTR 5A',
        gstr_6: 'GSTR 6',
        gstr_7: 'GSTR 7',
        gstr_8: 'GSTR 8',
        gstr_9: 'GSTR 9',
        gstr_10: 'GSTR 10',
        gstr_11: 'GSTR 11',
    }

    const reverseSubTabs = Object.fromEntries(
        Object.entries(getSubTabs).map(([key, value]) => [value, key])
    );


    const [selectedGSTR, setSelectedGSTR] = useState(0);

    const [selectedSubTab, setSelectedSubTab] = useState(getSubTabs[0]);
    const backendKey = reverseSubTabs[getSubTab[selectedGSTR]];



    // 🧠 Track which month is currently expanded
    // const [expandedMonth, setExpandedMonth] = useState(false);

    // useEffect(() => {
    //     setExpandedMonth(false);
    // }, [selectedGSTR]);
    // ///////\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    // const handleAccordionChange = (month) => (event, isExpanded) => {
    //     setExpandedMonth(isExpanded ? month : false);
    // };

    const getFinancialYearKey = (startStr) => {
        const [startMonthName, startYearStr] = startStr.split(" ");
        const startYear = parseInt(startYearStr);

        const monthMap = {
            "January": 1,
            "February": 2,
            "March": 3,
            "April": 4,
            "May": 5,
            "June": 6,
            "July": 7,
            "August": 8,
            "September": 9,
            "October": 10,
            "November": 11,
            "December": 12
        };

        const startMonth = monthMap[startMonthName];

        // if (startMonth <= 4) {
        //     return `${startYear} - ${startYear + 1}`
        // }
        // else {
        //     return `${startYear - 1} - ${startYear}`
        // }
        if (startMonth >= 4) {
            return `${startYear} - ${startYear + 1}`;
        } else {
            return `${startYear - 1} - ${startYear}`;
        }

    }

    const groupByFinancialYear = (data) => {

        const grouped = {};

        data.forEach(item => {
            const [startStr] = item.return_period.split("-");
            const key = getFinancialYearKey(startStr);

            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(item);


        })


        return grouped;
    }

    // const isInFinancialYear = (item, yearRange) => {
    //     const [startStr, endStr] = item.return_period.split(" - ");
    //     const startDate = new Date(`${startStr} 1`);
    //     const endDate = new Date(`${endStr} 1`);

    //     const [startYear, endYear] = yearRange.split(" - ").map(Number);

    //     const fyStart = new Date(`April 1, ${startYear}`);
    //     const fyEnd = new Date(`March 31, ${endYear}`);

    //     return startDate <= fyEnd && endDate >= fyStart;
    // };


    // const taxAuditData = acknowledgementData.filter(item => item.return_type === "tax_audit" && isInFinancialYear(item, yearRange));
    // const incomeTaxData = acknowledgementData.filter(item => item.return_type === "income_tax" && isInFinancialYear(item, yearRange));
    // const airData = acknowledgementData.filter(item => item.return_type === "air" && isInFinancialYear(item, yearRange))
    // const sftData = acknowledgementData.filter(item => item.return_type === "sft" && isInFinancialYear(item, yearRange));
    // const tdsReturnData = acknowledgementData.filter(item => item.return_type === "tds_return" && isInFinancialYear(item, yearRange));
    // const tdsPaymentData = acknowledgementData.filter(item => item.return_type === "tds_payment" && isInFinancialYear(item, yearRange));
    // const pfData = acknowledgementData.filter(item => item.return_type === "pf" && isInFinancialYear(item, yearRange));
    // const esicData = acknowledgementData.filter(item => item.return_type === "esic" && isInFinancialYear(item, yearRange));
    // const gstData = acknowledgementData.filter(item => item.return_type === "gst_notice" && isInFinancialYear(item, yearRange));
    // const cmp8Data = acknowledgementData.filter(item => item.return_type === "cmp_8" && isInFinancialYear(item, yearRange));
    // const itc04Data = acknowledgementData.filter(item => item.return_type === "itc_04" && isInFinancialYear(item, yearRange));
    // const incomeTaxNoticeData = acknowledgementData.filter(item => item.return_type === "income_tax_notice" && isInFinancialYear(item, yearRange));
    // const subTabData = acknowledgementData.filter(
    //     item => item.return_type === backendKey && isInFinancialYear(item, yearRange)
    // );

    const taxAuditData = acknowledgementData.filter(item => item.return_type === "tax_audit");
    const incomeTaxData = acknowledgementData.filter(item => item.return_type === "income_tax");
    const airData = acknowledgementData.filter(item => item.return_type === "air")
    const sftData = acknowledgementData.filter(item => item.return_type === "sft");
    const tdsReturnData = acknowledgementData.filter(item => item.return_type === "tds_return");
    const tdsPaymentData = acknowledgementData.filter(item => item.return_type === "tds_payment");
    const pfData = acknowledgementData.filter(item => item.return_type === "pf");
    const esicData = acknowledgementData.filter(item => item.return_type === "esic");
    const gstData = acknowledgementData.filter(item => item.return_type === "gst_notice");
    const cmp8Data = acknowledgementData.filter(item => item.return_type === "cmp_8");
    const itc04Data = acknowledgementData.filter(item => item.return_type === "itc_04");
    const incomeTaxNoticeData = acknowledgementData.filter(item => item.return_type === "income_tax_notice");
    const subTabData = acknowledgementData.filter(
        item => item.return_type === backendKey
    );

    const groupedData = groupByFinancialYear(acknowledgementData || []);




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
                        {/* <AcknowledgementCreation /> */}
                        <AckCreation fetchAckDetails={fetchAckDetails} />
                        {/* <AcknowledgementCreation /> */}
                    </div>
                </div>
                <div>
                    <div>
                        {/* <Accordion
                        expanded={expanded}
                        onChange={handleExpansion} 
                        slots={{ transition: Fade }}
                        slotProps={{ transition: { timeout: 400 } }}
                        sx={[
                            // { 
                            //     backgroundColor: '#366FA1', // ✅ Change this color
                            //     color: '#FFFFFF',     
                            // },
                            //
                            expanded
                                ? {
                                    [`& .${accordionClasses.region}`]: {
                                        height: 'auto',
                                    },
                                    [`& .${accordionDetailsClasses.root}`]: {
                                        display: 'block',
                                    },
                                }
                                : {
                                    [`& .${accordionClasses.region}`]: {
                                        height: 0,
                                    },
                                    [`& .${accordionDetailsClasses.root}`]: {
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
                                    color: '#FFFFFF', // applies to Typography inside
                                },
                            }}
                        >
                            <Typography component="span">2019-2020</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                malesuada lacus ex, sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion> */}
                    </div>
                    <div>
                        {/* {Object.entries(groupedData).map(([yearRange, dataForYear]) => ( */}
                        {Object.entries(groupedData)
                            .sort((a, b) => {
                                const aStart = parseInt(a[0].split(" - ")[0].trim());
                                const bStart = parseInt(b[0].split(" - ")[0].trim());
                                return aStart - bStart;
                            })
                            .map(([yearRange, dataForYear]) => (
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
                                        expandIcon={<ExpandMoreIcon
                                            sx={{
                                                color: '#366FA1',
                                                '&:hover': {
                                                    backgroundColor: '#3D79AD',
                                                    color: '#FFFFFF',
                                                },
                                            }} />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                        sx={{
                                            backgroundColor: '#FFFFFF',
                                            color: '#366FA1',
                                            fontWeight: 'bold',
                                            '& .MuiTypography-root': {
                                                color: '#FFFFFF',
                                            },
                                            '&:hover': {
                                                backgroundColor: '#3D79AD',
                                                color: '#FFFFFF',
                                            },
                                            border: '1px solid #366FA1',
                                            borderRadius: '5px',
                                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        <Typography component="span">{yearRange}</Typography>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        {/* Tabs */}
                                        <Tabs
                                            value={tabIndex}
                                            onChange={handleTabChange}
                                            textColor="inherit"
                                            // indicatorColor="secondary"
                                            variant="scrollable"
                                            scrollButtons="auto"
                                            allowScrollButtonsMobile
                                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                                            TabIndicatorProps={{
                                                style: {
                                                    backgroundColor: '#366FA1', // 🔵 your custom blue color

                                                },
                                            }}
                                        >
                                            {tabLabels.map((label, index) => (
                                                <Tab
                                                    key={index}
                                                    label={label}
                                                    sx={{
                                                        color: '#366FA1', // normal text color (blue)
                                                        fontWeight: 'bold',
                                                        '&:hover': {
                                                            color: '#004B87', // darker blue on hover
                                                        },
                                                        '&.Mui-selected': {
                                                            color: '#366FA1', // selected tab stays blue
                                                            fontWeight: 'bold',
                                                        },
                                                    }}
                                                />
                                            ))}
                                        </Tabs>

                                        {/* Tab Content with Nested Accordions */}
                                        {tabIndex === 0 && (
                                            <>
                                                {/* GSTR Sub Tabs */}
                                                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                                                    <Tabs
                                                        value={selectedGSTR}
                                                        onChange={(e, newValue) => setSelectedGSTR(newValue)}
                                                        variant="scrollable"
                                                        scrollButtons="auto"
                                                        allowScrollButtonsMobile
                                                        sx={{
                                                            borderBottom: 1,
                                                            borderColor: 'divider',
                                                            mt: 2,

                                                        }}
                                                        TabIndicatorProps={{
                                                            style: { backgroundColor: '#366FA1' },
                                                        }}
                                                    >
                                                        {getSubTab.map((label, index) => (
                                                            <Tab
                                                                key={index}
                                                                label={label}
                                                                sx={{
                                                                    color: '#366FA1',
                                                                    whiteSpace: 'nowrap', // ✅ Prevents tab labels from wrapping
                                                                    '&:hover': { color: '#004B87' },
                                                                    '&.Mui-selected': {
                                                                        color: '#366FA1',
                                                                        fontWeight: 'bold',
                                                                    },
                                                                    mr: '25px',
                                                                }}
                                                            />
                                                        ))}
                                                    </Tabs>
                                                    <AccordionDetails>
                                                        <CacheProvider value={muiCache}>
                                                            <ThemeProvider theme={theme}>
                                                                <MUIDataTable data={dataForYear.filter(item => item.return_type === backendKey)} columns={columns} options={options} />
                                                            </ThemeProvider>
                                                        </CacheProvider>
                                                    </AccordionDetails>
                                                </Box>


                                                {/* Sub Tab Content */}
                                                {/* <Box sx={{ p: 2 }}>
                                            {months.map((month, index) => (
                                                <Accordion
                                                    key={index}
                                                    expanded={expandedMonth === month}
                                                    onChange={handleAccordionChange(month)}
                                                    sx={{
                                                        mb: 1,
                                                        color: '#366FA1',
                                                        border: '1px solid #366FA1',
                                                        borderRadius: '5px',
                                                        whiteSpace: 'nowrap',
                                                        '&:hover': { color: '#004B87' },
                                                        '&.Mui-selected': {
                                                            color: '#366FA1',
                                                            fontWeight: 'bold',
                                                        },
                                                    }}
                                                >
                                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                        <Typography>{month}</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <CacheProvider value={muiCache}>
                                                            <ThemeProvider theme={theme}>
                                                                <MUIDataTable data={acknowledgementData || []} columns={columns} options={options} />
                                                            </ThemeProvider>
                                                        </CacheProvider>
                                                    </AccordionDetails>
                                                </Accordion>
                                            ))}
                                        </Box> */}

                                            </>
                                        )}
                                        {tabIndex === 1 && (
                                            <AccordionDetails>
                                                <CacheProvider value={muiCache}>
                                                    <ThemeProvider theme={theme}>
                                                        <MUIDataTable data={dataForYear.filter(item => item.return_type === "cmp_8") || []} columns={columns} options={options} />
                                                    </ThemeProvider>
                                                </CacheProvider>
                                            </AccordionDetails>
                                        )}
                                        {tabIndex === 2 && (
                                            <AccordionDetails>
                                                <CacheProvider value={muiCache}>
                                                    <ThemeProvider theme={theme}>
                                                        <MUIDataTable data={dataForYear.filter(item => item.return_type === "itc_04") || []} columns={columns} options={options} />
                                                    </ThemeProvider>
                                                </CacheProvider>
                                            </AccordionDetails>
                                        )}
                                        {tabIndex === 3 && (
                                            <AccordionDetails>
                                                <CacheProvider value={muiCache}>
                                                    <ThemeProvider theme={theme}>
                                                        <MUIDataTable data={dataForYear.filter(item => item.return_type === "income_tax") || []} columns={columns} options={options} />
                                                    </ThemeProvider>
                                                </CacheProvider>
                                            </AccordionDetails>
                                        )}
                                        {tabIndex === 4 && (
                                            <AccordionDetails>
                                                <CacheProvider value={muiCache}>
                                                    <ThemeProvider theme={theme}>
                                                        <MUIDataTable data={dataForYear.filter(item => item.return_type === "tax_audit") || []} columns={columns} options={options} />
                                                    </ThemeProvider>
                                                </CacheProvider>
                                            </AccordionDetails>
                                        )}
                                        {tabIndex === 5 && (
                                            <AccordionDetails>
                                                <CacheProvider value={muiCache}>
                                                    <ThemeProvider theme={theme}>
                                                        <MUIDataTable data={dataForYear.filter(item => item.return_type === "air") || []} columns={columns} options={options} />
                                                    </ThemeProvider>
                                                </CacheProvider>
                                            </AccordionDetails>
                                        )}
                                        {tabIndex === 6 && (
                                            <AccordionDetails>
                                                <CacheProvider value={muiCache}>
                                                    <ThemeProvider theme={theme}>
                                                        <MUIDataTable data={dataForYear.filter(item => item.return_type === "sft") || []} columns={columns} options={options} />
                                                    </ThemeProvider>
                                                </CacheProvider>
                                            </AccordionDetails>
                                        )}
                                        {tabIndex === 7 && (
                                            <AccordionDetails>
                                                <CacheProvider value={muiCache}>
                                                    <ThemeProvider theme={theme}>
                                                        <MUIDataTable data={dataForYear.filter(item => item.return_type === "tds_return") || []} columns={columns} options={options} />
                                                    </ThemeProvider>
                                                </CacheProvider>
                                            </AccordionDetails>
                                        )}
                                        {tabIndex === 8 && (
                                            <AccordionDetails>
                                                <CacheProvider value={muiCache}>
                                                    <ThemeProvider theme={theme}>
                                                        <MUIDataTable data={dataForYear.filter(item => item.return_type === "tds_payment") || []} columns={columns} options={options} />
                                                    </ThemeProvider>
                                                </CacheProvider>
                                            </AccordionDetails>
                                        )}
                                        {tabIndex === 9 && (
                                            <AccordionDetails>
                                                <CacheProvider value={muiCache}>
                                                    <ThemeProvider theme={theme}>
                                                        <MUIDataTable data={dataForYear.filter(item => item.return_type === "pf") || []} columns={columns} options={options} />
                                                    </ThemeProvider>
                                                </CacheProvider>
                                            </AccordionDetails>
                                        )}
                                        {tabIndex === 10 && (
                                            <AccordionDetails>
                                                <CacheProvider value={muiCache}>
                                                    <ThemeProvider theme={theme}>
                                                        <MUIDataTable data={dataForYear.filter(item => item.return_type === "esic") || []} columns={columns} options={options} />
                                                    </ThemeProvider>
                                                </CacheProvider>
                                            </AccordionDetails>
                                        )}
                                        {tabIndex === 11 && (
                                            <AccordionDetails>
                                                <CacheProvider value={muiCache}>
                                                    <ThemeProvider theme={theme}>
                                                        <MUIDataTable data={dataForYear.filter(item => item.return_type === "gst_notice") || []} columns={columns} options={options} />
                                                    </ThemeProvider>
                                                </CacheProvider>
                                            </AccordionDetails>
                                        )}
                                        {tabIndex === 12 && (
                                            <AccordionDetails>
                                                <CacheProvider value={muiCache}>
                                                    <ThemeProvider theme={theme}>
                                                        <MUIDataTable data={dataForYear.filter(item => item.return_type === "income_tax_notice") || []} columns={columns} options={options} />
                                                    </ThemeProvider>
                                                </CacheProvider>
                                            </AccordionDetails>
                                        )}

                                        {/* Add more tabs similarly */}
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                    </div>

                </div>


            </div>
        </>
    );
}
// 
export default Ack;
