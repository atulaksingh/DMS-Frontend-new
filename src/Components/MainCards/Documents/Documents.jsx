import React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Pf from "../PF/Pf";
import TaxAudit from "./TaxAudit/TaxAudit";
import Air from "./Air/Air";
import Sft from "./SFT/Sft";
import TdsReturn from "./TdsReturn/TdsReturn";
import TdsPayment from "./Tdspayment/TdsPayment";
import TdsSection from "./Tdssection/TdsSection";
import Others from "./Others/Others";
function Documents({ PfData, taxAuditData, airData, sftData, tdsReturnData, tdsPaymentData, tdsSectionData, othersData }) {
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      {/* <div>Documents</div> */}

      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              aria-label="customized tabs example"
              TabIndicatorProps={{
                sx: {
                  backgroundColor: "primary",
                },
              }}
            >
              <Tab
                label="PF"
                value="1"
                sx={{
                  "&.Mui-selected": {
                    color: "primary", // Color of the selected tab text
                    fontWeight: "bold",
                    // border: 2,
                  },
                  "&:hover": {
                    color: "primary", // Color when hovering over the tab
                  },
                }}
              />
              <Tab
                label="Tax Audit"
                value="2"
                sx={{
                  "&.Mui-selected": {
                    color: "primary",
                    fontWeight: "bold",
                    // border: 2,
                  },
                  "&:hover": {
                    color: "primary",
                  },
                }}
              />
              <Tab
                label="AIR"
                value="3"
                fontWeight="bold"
                sx={{
                  "&.Mui-selected": {
                    color: "primary",
                    fontWeight: "bold",
                    // border: 2,
                  },
                  "&:hover": {
                    color: "primary",
                  },
                }}
              />
              <Tab
                label="SFT"
                value="4"
                fontWeight="bold"
                sx={{
                  "&.Mui-selected": {
                    color: "primary",
                    fontWeight: "bold",
                    // border: 2,
                  },
                  "&:hover": {
                    color: "primary",
                  },
                }}
              />
              <Tab
                label="TDS Payments"
                value="5"
                fontWeight="bold"
                sx={{
                  "&.Mui-selected": {
                    color: "primary",
                    fontWeight: "bold",
                    border: 2,
                  },
                  "&:hover": {
                    color: "primary",
                  },
                }}
              />
              <Tab
                label="TDS Return"
                value="6"
                fontWeight="bold"
                sx={{
                  "&.Mui-selected": {
                    color: "primary",
                    fontWeight: "bold",
                    border: 2,
                  },
                  "&:hover": {
                    color: "primary",
                  },
                }}
              />
              {/* <Tab
                label="TDS Section"
                value="7"
                fontWeight="bold"
                sx={{
                  "&.Mui-selected": {
                    color: "primary",
                    fontWeight: "bold",
                    border: 2,
                  },
                  "&:hover": {
                    color: "primary",
                  },
                }}
              /> */}
              <Tab
                label="Others"
                value="8"
                fontWeight="bold"
                sx={{
                  "&.Mui-selected": {
                    color: "primary",
                    fontWeight: "bold",
                    border: 2,
                  },
                  "&:hover": {
                    color: "primary",
                  },
                }}
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Pf PfData={PfData} />
          </TabPanel>
          <TabPanel value="2"><TaxAudit taxAuditData={taxAuditData} /></TabPanel>
          <TabPanel value="3"><Air airData={airData} /></TabPanel>
          <TabPanel value="4"><Sft sftData={sftData} /></TabPanel>
          <TabPanel value="5"><TdsPayment tdsPaymentData={tdsPaymentData} tdsSectionData={tdsSectionData} /></TabPanel>
          <TabPanel value="6"><TdsReturn tdsReturnData={tdsReturnData} /></TabPanel>
          {/* <TabPanel value="7"><TdsSection tdsSectionData={tdsSectionData} /> </TabPanel> */}
          <TabPanel value="8"><Others othersData={othersData} /></TabPanel>
        </TabContext>
      </Box>
    </>
  );
}

export default Documents;
