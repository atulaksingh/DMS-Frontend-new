
import React, { useState, useEffect } from "react";
import {
    Menu, MenuItem, IconButton, Accordion, AccordionSummary, AccordionDetails,
    Tabs, Tab, Box, Fade
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography } from "@material-tailwind/react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AckCreation from "./AckCreation";
import AckCard from "./AckCard";

const muiCache = createCache({ key: "mui-datatables", prepend: true });

const Ack = ({ acknowledgementData, fetchAckDetails }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [selectedGSTR, setSelectedGSTR] = useState({});
    const [searchBtn, setSearchBtn] = useState(true);
    const [downloadBtn, setDownloadBtn] = useState(true);
    const [printBtn, setPrintBtn] = useState(true);
    const [viewColumnBtn, setViewColumnBtn] = useState(true);
    const [filterBtn, setFilterBtn] = useState(true);
    const [responsive, setResponsive] = useState("vertical");
    const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
    const calculateTableBodyHeight = () => {
        const rowHeight = 80; // Approximate height for one row
        const maxHeight = 525; // Maximum table body height
        const calculatedHeight = acknowledgementData?.length * rowHeight;
        return calculatedHeight > maxHeight
            ? `${maxHeight}px`
            : `${calculatedHeight}px`;
    };
    const [tableBodyHeight, setTableBodyHeight] = useState(
        calculateTableBodyHeight
    );


    useEffect(() => {
        setTableBodyHeight(calculateTableBodyHeight());
    }, [acknowledgementData]);

    const allMainTabs = [
        { label: "GST", key: "gst_group" },
        { label: "CMP 8", key: "cmp_8" },
        { label: "ITC 04", key: "itc_04" },
        { label: "INCOME TAX", key: "income_tax" },
        { label: "TAX AUDIT", key: "tax_audit" },
        { label: "AIR", key: "air" },
        { label: "SFT", key: "sft" },
        { label: "TDS RETURN", key: "tds_return" },
        { label: "TDS PAYMENT", key: "tds_payment" },
        { label: "PF", key: "pf" },
        { label: "ESIC", key: "esic" },
        { label: "GST NOTICE", key: "gst_notice" },
        { label: "INCOME TAX NOTICE", key: "income_tax_notice" },
    ];

    const getSubTabs = {
        gstr_1: "GSTR 1",
        gstr_3b: "GSTR 3B",
        gstr_4: "GSTR 4",
        gstr_5: "GSTR 5",
        gstr_5a: "GSTR 5A",
        gstr_6: "GSTR 6",
        gstr_7: "GSTR 7",
        gstr_8: "GSTR 8",
        gstr_9: "GSTR 9",
        gstr_10: "GSTR 10",
        gstr_11: "GSTR 11",
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
                customBodyRender: (value, tableMeta) => {
                    const rowData = tableMeta.rowData;
                    const actualRow = acknowledgementData.find(row =>
                        row.return_type === rowData[0] && // return_type
                        row.frequency === rowData[1] &&
                        row.return_period === rowData[2] &&
                        row.from_date === rowData[3] &&
                        row.to_date === rowData[4]
                    );
                    return (
                        <AckCard rowId={actualRow?.id} fetchAckDetails={fetchAckDetails} setTabIndex={setTabIndex} />
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

    const getFinancialYearKey = (startStr) => {
        const [startMonthName, startYearStr] = startStr.split(" ");
        const startYear = parseInt(startYearStr);
        const monthMap = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 };
        const startMonth = monthMap[startMonthName];
        return (startMonth >= 4) ? `${startYear} - ${startYear + 1}` : `${startYear - 1} - ${startYear}`;
    };

    const groupByFinancialYear = (data) => {
        const grouped = {};
        data.forEach(item => {
            const [startStr] = item.return_period.split("-");
            const key = getFinancialYearKey(startStr);
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(item);
        });
        return grouped;
    };

    const RenderTable = ({ type, dataForYear }) => (
        <AccordionDetails>
            <CacheProvider value={muiCache}>
                <ThemeProvider theme={theme}>
                    <MUIDataTable
                        data={dataForYear.filter(item => item.return_type === type)}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            </CacheProvider>
        </AccordionDetails>
    );

    const groupedData = groupByFinancialYear(acknowledgementData || []);

    return (
        <>
            {/* <ToastContainer /> */}
            <div className="flex justify-between items-center mb-5">
                <div className="text-2xl text-gray-800 font-semibold">Acknowledgement Details</div>
                <AckCreation fetchAckDetails={fetchAckDetails} />
            </div>
            {/* make changes from here *************************************************************** */}

            {Object.entries(groupedData).map(([yearRange, dataForYear]) => {
                const tabLabels = allMainTabs.filter(tab => {
                    if (tab.key === "gst_group") {
                        return Object.keys(getSubTabs).some(gstKey =>
                            dataForYear.some(item => item.return_type === gstKey));
                    }
                    return dataForYear.some(item => item.return_type === tab.key);
                });

                const availableSubTabs = Object.entries(getSubTabs).filter(
                    ([key]) => dataForYear.some(item => item.return_type === key)
                );
                const currentSelectedGSTR = selectedGSTR[yearRange] || 0;
                const backendKey = availableSubTabs[currentSelectedGSTR]?.[0];

                return (
                    <Accordion key={yearRange} expanded={expanded === yearRange} onChange={() => setExpanded(prev => prev === yearRange ? false : yearRange)}
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
                        <AccordionSummary expandIcon={
                            <ExpandMoreIcon
                                sx={{
                                    color: '#366FA1',
                                    '&:hover': {
                                        backgroundColor: '#3D79AD',
                                        color: '#FFFFFF',
                                    },
                                }}
                            />}
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
                        ><Typography>{yearRange}</Typography></AccordionSummary>
                        <AccordionDetails>
                            <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} variant="scrollable"
                                sx={{ borderBottom: 1, borderColor: 'divider' }}
                                TabIndicatorProps={{
                                    style: {
                                        backgroundColor: '#366FA1', // 🔵 your custom blue color

                                    },
                                }}
                            >
                                {tabLabels.map((tab, i) => (
                                    <Tab key={i} label={tab.label}
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

                            {tabLabels[tabIndex]?.key === "gst_group" && (
                                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                                    <Tabs
                                        value={typeof currentSelectedGSTR === "number" ? currentSelectedGSTR : 0}
                                        onChange={(e, newValue) =>
                                            setSelectedGSTR(prev => ({ ...prev, [yearRange]: newValue }))
                                        }
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        allowScrollButtonsMobile
                                        // sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}
                                        sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}
                                        TabIndicatorProps={{ style: { backgroundColor: '#366FA1' } }}
                                    >
                                        {availableSubTabs.map(([key, label], index) => (
                                            <Tab key={index} label={label}
                                                sx={{
                                                    color: '#366FA1',
                                                    whiteSpace: 'nowrap',
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
                                                <MUIDataTable
                                                    data={dataForYear.filter(item => item.return_type === backendKey)}
                                                    columns={columns}
                                                    options={options}
                                                />
                                            </ThemeProvider>
                                        </CacheProvider>
                                    </AccordionDetails>
                                </Box>
                            )}

                            {tabLabels[tabIndex] && tabLabels[tabIndex].key !== "gst_group" && (
                                <RenderTable type={tabLabels[tabIndex].key} dataForYear={dataForYear} />
                            )}
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </>
    );
};

export default Ack;
