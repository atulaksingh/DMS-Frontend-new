import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress"; // ✅ Import loader
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Owner from "./OwnerDetails/Owner";
import Bank from "./BankDetails/Bank";
import Branch from "./BranchDetails/Branch";
import ClientUser from "./ClientUser/ClientUser";
import CustomerUser from "./CustomerUser/CustomerUser";
import CompanyDocuments from "./CompanyDocuments/CompanyDocuments";
import CV from "./CorV/CV";
import Documents from "../Documents/Documents";
import Purchase from "./Purchase/Purchase";
import Sales from "./Sales/Sales";
import { fetchClientDetails } from "../../Redux/clientSlice";
import Income from "./Income/Income";
import Expenses from "./Expenses/Expenses";
import ZipFile from "./ZipFile/ZipFile";
import Acknowledgement from "./Acknowledgement/Acknowlwdgement";
import Ack from "../Ack/Ack";
import { HomeIcon } from "@heroicons/react/16/solid";
import AckDetails from "../Ack/AckDetails";
const navItems = [
  { name: "Client Details" },
  { name: "Owner Details" },
  { name: "Bank Details" },
  { name: "Branch Details" },
  // { name: "Client Users" },
  {
    name: "Users Creation",
    subItems: ["Client User", "Customer User"], // <- added
  },
  { name: "Company Documents" },
  { name: "Documents" },
  { name: "Customer&Vendor" },
  { name: "Purchase" },
  { name: "Sales" },
  { name: "Income" },
  { name: "Expenses" },
  { name: "Zipfile Upload" },
  { name: "Acknowledgement" },
];
function ClientDetails() {
  // const id = 1;
  const { id } = useParams();
  const [value, setValue] = React.useState("1");
  const [selectedTab, setSelectedTab] = useState(navItems[0].name);
  const [loading, setLoading] = useState(true);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const dispatch = useDispatch();
  const [selectedSubTab, setSelectedSubTab] = useState("Client User");
  const [userTypeTab, setUserTypeTab] = useState("Client User");

  const {
    clientData,
    ownerData,
    bankData,
    branchData,
    clientUserData,
    customerUserData,
    companyDocData,
    CVData,
    PfData,
    taxAuditData,
    airData,
    sftData,
    tdsReturnData,
    tdsPaymentData,
    tdsSectionData,
    othersData,
    salesInvoiceData,
    purchaseInvoiceData,
    incomeInvoiceData,
    expensesInvoiceData,
    zipFileData,
    ackData,
    acksData,
    status,
    error,
  } = useSelector((state) => state.client);

  // Fetch data on component mount
  useEffect(() => {
    // console.log(id)
    dispatch(fetchClientDetails(id));
  }, [id, dispatch]);

  const location = useLocation(); // Get the current location object
  const pathnames = location.pathname
    .split("/")
    .filter((x) => x && isNaN(Number(x))); // Split the URL into path segments

  const breadcrumbItems = [
    { name: "Home", path: "/master" }, // Hardcoded Home breadcrumb
    ...pathnames.map((segment, index) => {
      const path = `/${pathnames.slice(0, index + 1).join("/")}`;
      return { name: segment.charAt(0).toUpperCase() + segment.slice(1), path };
    }),
  ];

  useEffect(() => {
    setLoading(true);
    dispatch(fetchClientDetails(id))
      .unwrap() // If you’re using createAsyncThunk
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [id, dispatch]);
  return (
    <>

      {/* Navbar */}

      {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

      <div className="w-full">
        {/* Horizontal Nav */}
        <div className="bg-white border-b border-gray-200 shadow-sm w-full overflow-x-auto">
          <div className="flex flex-nowrap gap-4 px-4 py-2 text-sm text-gray-700 min-w-max">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <div
                  className={`cursor-pointer whitespace-nowrap px-2 py-1 ${selectedTab === item.name
                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                    : "hover:text-blue-500"
                    }`}
                  onClick={() => setSelectedTab(item.name)}
                >
                  {item.name}
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* <h2 className="text-xl font-bold text-gray-800 mb-4">
            {selectedTab}
          </h2> */}
          {loading ? (
            <div className="flex justify-center items-center h-[60vh]">
              <CircularProgress size={50} thickness={4} />
            </div>
          ) : (
            <>

              {selectedTab === "Client Details" && (
                <>
                  <div className=" px-20 py-6 rounded-md ">
                    {/* <p>📊 This is Dashboard content</p> */}
                    {clientData ? (
                      <>

                        <div className="bg-white shadow-lg rounded-xl px-6 py-3  mx-auto w-full border border-gray-100 mb-10">
                          <h2 className="text-2xl font-semibold text-[#2B4F81] mb-2 border-b pb-2">
                            🧾 Client Details
                          </h2>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[15px] text-gray-800">
                            <div className="flex">
                              <span className="text-gray-500 text-sm min-w-[150px]">
                                Client Name:
                              </span>
                              <span className="font-medium"> {clientData.client_name}</span>
                            </div>
                            <div className="flex">
                              <span className="text-gray-500 text-sm min-w-[150px]">
                                Entity Type:
                              </span>
                              <span className="font-medium"> {clientData.entity_type}</span>
                            </div>
                            <div className="flex">
                              <span className="text-gray-500 text-sm min-w-[150px]">
                                Date of Incorporation:
                              </span>
                              <span className="font-medium"> {clientData.date_of_incorporation}</span>
                            </div>
                            <div className="flex">
                              <span className="text-gray-500 text-sm min-w-[150px]">
                                Contact Person:
                              </span>
                              <span className="font-medium"> {clientData.contact_person}</span>
                            </div>
                            <div className="flex">
                              <span className="text-gray-500 text-sm min-w-[150px]">
                                Designation:
                              </span>
                              <span className="font-medium"> {clientData.designation}</span>
                            </div>
                            <div className="flex">
                              <span className="text-gray-500 text-sm min-w-[150px]">
                                Contact No:
                              </span>
                              <span className="font-medium"> {clientData.contact_no_1}</span>
                            </div>
                            <div className="flex">
                              <span className="text-gray-500 text-sm min-w-[150px]">
                                Another No:
                              </span>
                              <span className="font-medium">{clientData.contact_no_2}</span>
                            </div>
                            <div className="flex">
                              <span className="text-gray-500 text-sm min-w-[150px]">
                                Status:
                              </span>
                              <span className="font-medium capitalize text-green-600">
                                {clientData.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex mr-2 mt-6">
                            <span className="text-gray-500 text-sm min-w-[150px]">
                              Email:
                            </span>
                            <span className="font-medium text-gray-800">
                              {clientData.email}
                            </span>
                          </div>

                          <div className="mt-6">
                            <span className="text-gray-500 text-sm block mb-1">
                              Business Details
                            </span>
                            <div className="bg-gray-50 p-4 rounded-md text-sm leading-relaxed text-gray-700 border">
                              {clientData.business_detail}
                            </div>
                          </div>

                        </div>

                        {/* <Owner ownerData={ownerData} /> */}
                      </>
                    ) : (
                      <div>No Client data available</div>
                    )}
                  </div>
                </>
              )}
              {selectedTab === "Owner Details" && (
                <>
                  <div className=" px-20 py-6 rounded-md ">
                    {/* <p>📊 This is Dashboard content</p> */}
                    {ownerData ? (
                      <>
                        <Owner ownerData={ownerData} />
                      </>
                    )
                      : (
                        <div>No owner data available</div>
                      )
                    }
                  </div>
                </>
              )}
              {selectedTab === "Bank Details" && (
                <>
                  <div className=" px-20 py-6 rounded-md ">
                    <Bank bankData={bankData} />
                    {/* <p>🏦 Bank details content goes here.</p> */}
                  </div>
                </>
              )}
              {selectedTab === "Branch Details" && (
                <>
                  <div className=" px-20 py-6 rounded-md ">
                    <Branch branchData={branchData} />
                    {/* <p>📜 Branch Details content goes here.</p> */}
                  </div>
                </>
              )}
              {/* {selectedTab === "Client Users" && (
            <>
              <div className=" px-20 py-6 rounded-md ">
                <ClientUser clientUserData={clientUserData} />
              </div>
            </>
          )} */}
              {selectedTab === "Users Creation" && (
                <>
                  <div className="px-20 py-6 rounded-md">
                    {/* Sub-tabs for user types */}
                    <div className="flex gap-4 mb-4">
                      <button
                        className={`px-4 py-2 rounded-md text-sm font-medium border ${userTypeTab === "Client User"
                          ? "bg-primary hover:bg-[#2d5e85] text-white"
                          : "bg-white text-gray-700 border-gray-300"
                          }`}
                        onClick={() => setUserTypeTab("Client User")}
                      >
                        Client User
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm font-medium border ${userTypeTab === "Customer User"
                          ? "bg-primary hover:bg-[#2d5e85] text-white"
                          : "bg-white text-gray-700 border-gray-300"
                          }`}
                        onClick={() => setUserTypeTab("Customer User")}
                      >
                        User
                      </button>
                    </div>

                    {/* Render the correct component */}
                    {userTypeTab === "Client User" && (
                      <ClientUser clientUserData={clientUserData} />
                    )}
                    {userTypeTab === "Customer User" && (
                      <CustomerUser customerUserData={customerUserData} />
                      // <div className="text-gray-600 font-medium text-md">
                      //   📌 Customer User component goes here.
                      // </div>
                      // OR: <CustomerUser /> if you have it
                    )}
                  </div>
                </>
              )}

              {selectedTab === "Company Documents" && (
                <>
                  <div className=" px-20 py-6 rounded-md ">
                    <CompanyDocuments companyDocData={companyDocData} />
                    {/* <p>📁 Company documents content goes here.</p> */}
                  </div>
                </>
              )}
              {selectedTab === "Documents" && (
                <>
                  <div className=" px-20 py-6 rounded-md ">
                    <Documents
                      PfData={PfData}
                      taxAuditData={taxAuditData}
                      airData={airData}
                      sftData={sftData}
                      tdsReturnData={tdsReturnData}
                      tdsPaymentData={tdsPaymentData}
                      tdsSectionData={tdsSectionData}
                      othersData={othersData}
                    />
                    {/* <p>📄 General documents content goes here.</p> */}
                  </div>
                </>
              )}
              {selectedTab === "Customer&Vendor" && (
                <>
                  <div className=" px-20 py-6 rounded-md ">
                    <CV cvData={CVData} />
                    {/* <p>🧾 Customer & Vendor content goes here.</p> */}
                  </div>
                </>
              )}
              {selectedTab === "Purchase" && (
                <>
                  <div className=" px-20 py-6 rounded-md ">
                    <Purchase purchaseInvoiceData={purchaseInvoiceData} />
                    {/* <p>🛒 Purchase section content goes here.</p> */}
                  </div>
                </>
              )}
              {selectedTab === "Sales" && (
                <>
                  <div className=" px-20 py-6 rounded-md ">
                    <Sales salesInvoiceData={salesInvoiceData} />
                    {/* <p>💼 Sales section content goes here.</p> */}
                  </div>
                </>
              )}
              {selectedTab === "Income" && (
                <>
                  <div className=" px-20 py-6 rounded-md ">
                    <Income incomeInvoiceData={incomeInvoiceData} />
                    {/* <p>💰 Income-related content goes here.</p> */}
                  </div>
                </>
              )}
              {selectedTab === "Expenses" && (
                <>
                  <div className=" px-20 py-6 rounded-md ">
                    <Expenses expensesInvoiceData={expensesInvoiceData} />
                    {/* <p>📉 Expenses-related content goes here.</p> */}
                  </div>
                </>
              )}
              {selectedTab === "Zipfile Upload" && (
                <>
                  <div className=" px-20 py-6 rounded-md ">
                    <ZipFile zipFileData={zipFileData} />
                    {/* <p>📦 Zip file upload area content goes here.</p> */}
                  </div>
                </>
              )}
              {selectedTab === "Acknowledgement" && (
                <>
                  <div className=" px-20 py-6 rounded-md ">
                    {/* <Ack acksData={acksData} /> */}
                    <AckDetails />
                    {/* <p>✅ Acknowledgement content goes here.</p> */}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ClientDetails;
