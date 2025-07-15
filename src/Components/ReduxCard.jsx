import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useParams } from "react-router-dom";
import axios from "axios";

import Owner from "./MainCards/Clients/OwnerDetails/Owner";
import Bank from "./MainCards/Clients/BankDetails/Bank";
import Branch from "./MainCards/Clients/BranchDetails/Branch";
import ClientUser from "./MainCards/Clients/ClientUser/ClientUser";
import CompanyDocuments from "./MainCards/Clients/CompanyDocuments/CompanyDocuments";
import CV from "./MainCards/Clients/CorV/CV";
import Documents from "./MainCards/Documents/Documents";
import Purchase from "./MainCards/Clients/Purchase/Purchase";
import Sales from "./MainCards/Clients/Sales/Sales";
import { useDispatch, useSelector } from "react-redux";
import { fetchClientDetails } from "./Redux/clientSlice";
function ReduxCard() {
  const id = 1;

  const [value, setValue] = React.useState("1");

  const [loading, setLoading] = useState(true);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const dispatch = useDispatch();

  // Select data from Redux store
  const {
    clientData,
    ownerData,
    bankData,
    branchData,
    clientUserData,
    companyDocData,
    CVData,
    PfData,
    taxAuditData,
    airData,
    sftData,
    tdsReturnData,
    tdsPaymentData,
    salesInvoiceData,
    status,
    error,
  } = useSelector((state) => state.client);

  // Fetch data on component mount
  useEffect(() => {
    // console.log(id)
    dispatch(fetchClientDetails(id));
  }, [id, dispatch]);

  //   if (status === "loading") {
  //     return <div>Loading...</div>;
  //   }

  //   if (status === "failed") {
  //     return <div>Error: {error}</div>;
  //   }

  //   if (loading) {
  //     return <div>Loading...</div>;
  //   }

  //   if (error) {
  //     return <div>Error loading client details: {error.message}</div>;
  //   }
  return (
    <>
      <div className="pt-20 px-32 ">
        <div className="bg-secondary  px-6 py-5 rounded-md shadow-lg">
          <div className="text-xl font-bold ">ClientDetails</div>
          <div className="py-3 mx-2">
            {clientData && (
              <>
                <div className="grid grid-cols-3 gap-5  py-3 ">
                  <div className="col-span-1 flex gap-x-4 justify-start">
                    <div className=" text-gray-700 font-[550] ">
                      <div>Client Name :</div>
                    </div>
                    <div className="text-gray-600  ">
                      {clientData?.client_name}
                    </div>
                  </div>
                  <div className="col-span-1 flex gap-x-4 justify-start">
                    <div className=" font-semibold text-gray-700">
                      <div>Entity Type :</div>
                    </div>
                    <div className=" text-gray-700 font-medium subpixel-antialiased ">
                      {clientData?.entity_type}
                    </div>
                  </div>
                  <div className="col-span-1 flex gap-x-4 justify-start">
                    <div className=" font-semibold text-gray-700">
                      <div>Date of Incorporation :</div>
                    </div>
                    <div className=" text-gray-700 font-medium subpixel-antialiased ">
                      {clientData.date_of_incorporation}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-5  py-3 ">
                  <div className="col-span-1 flex gap-x-4 justify-start">
                    <div className=" text-gray-700 font-[550] ">
                      <div>Contact Person :</div>
                    </div>
                    <div className="text-gray-600 subpixel-antialiased ">
                      {clientData.contact_person}
                    </div>
                  </div>
                  <div className="col-span-1 flex gap-x-4 justify-start">
                    <div className=" font-semibold text-gray-700">
                      <div>Designation :</div>
                    </div>
                    <div className=" text-gray-700 font-medium subpixel-antialiased ">
                      {clientData.designation}
                    </div>
                  </div>
                  <div className="col-span-1 flex gap-x-4 justify-start">
                    <div className=" font-semibold text-gray-700">
                      <div>Contact No :</div>
                    </div>
                    <div className=" text-gray-700 font-medium subpixel-antialiased ">
                      {clientData.contact_no_1}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-5  py-3 ">
                  <div className="col-span-1 flex gap-x-4 justify-start">
                    <div className=" text-gray-700 font-[550] ">
                      <div>Another No :</div>
                    </div>
                    <div className="text-gray-600 subpixel-antialiased ">
                      {clientData.contact_no_2}
                    </div>
                  </div>
                  <div className="col-span-1 flex gap-x-4 justify-start">
                    <div className=" font-semibold text-gray-700">
                      <div>Business Details :</div>
                    </div>
                    <div className=" text-gray-700 font-medium subpixel-antialiased ">
                      {clientData.business_detail}
                    </div>
                  </div>
                  <div className="col-span-1 flex gap-x-4 justify-start">
                    <div className=" font-semibold text-gray-700">
                      <div>Status :</div>
                    </div>
                    <div className=" text-gray-700 font-medium subpixel-antialiased ">
                      {clientData.status}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="py-10 px-32">
        <div className="bg-secondary px-6 py-3 rounded-md shadow-lg">
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                  TabIndicatorProps={{
                    sx: {
                      backgroundColor: "primary",
                    },
                  }}
                >
                  <Tab
                    label="Owner Details"
                    value="1"
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
                    label="Bank Details"
                    value="2"
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
                    label="Branch Details"
                    value="3"
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
                    label="Client Users"
                    value="4"
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
                    label="Company Documents"
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
                    label="Customer Vendor"
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
                  <Tab
                    label="Documents"
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
                  />
                  <Tab
                    label="Purchase"
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
                  <Tab
                    label="Sales"
                    value="9"
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
                {ownerData ? (
                  <Owner ownerData={ownerData} />
                ) : (
                  <div>No owner data available</div>
                )}
              </TabPanel>
              <TabPanel value="2">
                <Bank bankData={bankData} />
              </TabPanel>
              <TabPanel value="3">
                <Branch branchData={branchData} />
              </TabPanel>
              <TabPanel value="4">
                <ClientUser clientUserData={clientUserData} />
              </TabPanel>
              <TabPanel value="5">
                <CompanyDocuments companyDocData={companyDocData} />
              </TabPanel>
              <TabPanel value="6">
                <CV cvData={CVData} />
              </TabPanel>
              <TabPanel value="7">
                
                <Documents
                  PfData={PfData}
                  taxAuditData={taxAuditData}
                  airData={airData}
                  sftData={sftData}
                  tdsReturnData={tdsReturnData}
                  tdsPaymentData={tdsPaymentData}
                />

              </TabPanel>
              <TabPanel value="8">
                <Purchase salesInvoiceData={salesInvoiceData}/>
              </TabPanel>
              <TabPanel value="9">
                <Sales salesInvoiceData={salesInvoiceData}/>
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
    </>
  );
}

export default ReduxCard;
