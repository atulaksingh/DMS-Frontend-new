import React, { useState, useEffect } from "react";

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
  { name: "Statutory Details" },
  { name: "Client Users" },
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
  return (
    <>
      {/* <div className="pt-20 px-32 ">
        <div>
          <nav className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md w-fit mb-1">
            {breadcrumbItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                {index === 0 ? (
                  // Home link
                  <Link
                    to={item.path}
                    className="flex items-center text-primary hover:text-primary"
                  >
                    <HomeIcon className="h-5 w-5" />
                    <span className="ml-1">{item.name}</span>
                  </Link>
                ) : (
                  // Conditional for other breadcrumb links
                  <button
                    onClick={() =>
                      item.name === "Clientdetails"
                        ? navigate(-1)
                        : navigate(item.path)
                    }
                    className="text-gray-700 hover:text-primary"
                  >
                    {item.name}
                  </button>
                )}
                {index < breadcrumbItems.length - 1 && (
                  <span className="text-gray-400">{">"}</span>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="bg-secondary  px-6 py-5 rounded-md shadow-lg">
          <div className="text-xl font-bold ">ClientDetails</div>
          <div className="py-3 mx-2">
            {clientData?.id ? (
              <>
                <div className="grid grid-cols-12 py-3">
                  <div className="grid col-span-1 text-gray-700 font-[550]">
                    Client Name:{" "}
                  </div>
                  <div className="grid col-span-3 text-gray-700 font-medium subpixel-antialiased">
                    {clientData.client_name}
                  </div>
                  <div className="grid col-span-1 text-gray-700 font-[550]">
                    Entity Type:{" "}
                  </div>
                  <div className="grid col-span-3 text-gray-700 font-medium subpixel-antialiased">
                    {clientData.entity_type}
                  </div>
                  <div className="grid col-span-2 text-gray-700 font-[550]">
                    Date of Incorporation:
                  </div>
                  <div className="grid col-span-1 text-gray-700 font-medium subpixel-antialiased text-left">
                    {clientData.date_of_incorporation}
                  </div>
                </div>
                <div className="grid grid-cols-12 py-3">
                  <div className="grid col-span-2 text-gray-700 font-[550]">
                    Contact Person:{" "}
                  </div>
                  <div className="grid col-span-2 text-gray-700 font-medium subpixel-antialiased">
                    {clientData.contact_person}
                  </div>
                  <div className="grid col-span-1 text-gray-700 font-[550]">
                    Designation:{" "}
                  </div>
                  <div className="grid col-span-3 text-gray-700 font-medium subpixel-antialiased">
                    {clientData.designation}
                  </div>
                  <div className="grid col-span-2 text-gray-700 font-[550]">
                    Contact No:
                  </div>
                  <div className="grid col-span-1 text-gray-700 font-medium subpixel-antialiased">
                    {clientData.contact_no_1}
                  </div>
                </div>
                <div className="grid grid-cols-12 py-3">
                  <div className="grid col-span-1 text-gray-700 font-[550]">
                    Another No:{" "}
                  </div>
                  <div className="grid col-span-3 text-gray-700 font-medium subpixel-antialiased">
                    {clientData.contact_no_2}
                  </div>
                  <div className="grid col-span-1 text-gray-700 font-[550]">
                    Status :{" "}
                  </div>
                  <div className="grid col-span-3 text-gray-700 font-medium subpixel-antialiased">
                    {clientData.status}
                  </div>
                </div>
                <div className="grid grid-cols-10 py-3">
                  <div className="grid col-span-1 text-gray-700 font-[550]">
                    Business Details:{" "}
                  </div>
                  <div className="grid col-span-9 text-gray-700 font-medium subpixel-antialiased">
                    {clientData.business_detail}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-gray-700 font-medium text-center py-6">
                Loading...
              </div>
            )}
          </div>
        </div>
      </div> */}

      {/* <div class="text-sm md:text-lg lg:text-xl">Responsive Text</div> */}

      {/* <!-- Sub-navbar below main navbar --> */}

      {/* Navbar */}

      {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

      <div className="w-full">
        {/* Horizontal Nav */}
        <div className="bg-white border-b border-gray-200 shadow-sm w-full overflow-x-auto">
          <div className="flex flex-nowrap gap-4 px-4 py-2 text-sm text-gray-700 min-w-max">
            {navItems.map((item) => (
              <div
                key={item.name}
                className={`cursor-pointer whitespace-nowrap px-2 py-1  ${
                  selectedTab === item.name
                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                    : "hover:text-blue-500"
                }`}
                onClick={() => setSelectedTab(item.name)}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* <h2 className="text-xl font-bold text-gray-800 mb-4">
            {selectedTab}
          </h2> */}

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

                      <div className="mt-6">
                        <span className="text-gray-500 text-sm block mb-1">
                          Business Details
                        </span>
                        <div className="bg-gray-50 p-4 rounded-md text-sm leading-relaxed text-gray-700 border">
                          wertysdfghj sdfghjert dfghjdfghj, sdfghsdfghj
                          wertyuivbnm, xcvbnm, vbnm, xcvbnm, asdfg.
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
                    {/* <div className="bg-white shadow-lg rounded-xl px-6 py-3  mx-auto w-full border border-gray-100 mb-10">
                      <h2 className="text-2xl font-semibold text-[#2B4F81] mb-2 border-b pb-2">
                        🧾 Client Details
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[15px] text-gray-800">
                        <div className="flex flex-col">
                          <span className="text-gray-500 text-sm">
                            Client Name
                          </span>
                          <span className="font-medium">Zaco123</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-gray-500 text-sm">
                            Entity Type
                          </span>
                          <span className="font-medium">Proprietorship</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-gray-500 text-sm">
                            Date of Incorporation
                          </span>
                          <span className="font-medium">11-01-2025</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-gray-500 text-sm">
                            Contact Person
                          </span>
                          <span className="font-medium">oiuytre</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-gray-500 text-sm">
                            Designation
                          </span>
                          <span className="font-medium">CEO</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-gray-500 text-sm">
                            Contact No
                          </span>
                          <span className="font-medium">1234567890</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-gray-500 text-sm">
                            Another No
                          </span>
                          <span className="font-medium">1234567</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-gray-500 text-sm">Status</span>
                          <span className="font-medium capitalize text-green-600">
                            Active
                          </span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <span className="text-gray-500 text-sm block mb-1">
                          Business Details
                        </span>
                        <div className="bg-gray-50 p-4 rounded-md text-sm leading-relaxed text-gray-700 border">
                          wertysdfghj sdfghjert dfghjdfghj, sdfghsdfghj
                          wertyuivbnm, xcvbnm, vbnm, xcvbnm, asdfg.
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="bg-white shadow-lg rounded-xl px-6 py-3  mx-auto w-full border border-gray-100 mb-10">
                      <h2 className="text-2xl font-semibold text-[#2B4F81] mb-2 border-b pb-2">
                        🧾 Client Details
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[15px] text-gray-800">
                        <div className="flex">
                          <span className="text-gray-500 text-sm min-w-[150px]">
                            Client Name:
                          </span>
                          <span className="font-medium">Zaco123</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-500 text-sm min-w-[150px]">
                            Entity Type:
                          </span>
                          <span className="font-medium">Proprietorship</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-500 text-sm min-w-[150px]">
                            Date of Incorporation:
                          </span>
                          <span className="font-medium">11-01-2025</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-500 text-sm min-w-[150px]">
                            Contact Person:
                          </span>
                          <span className="font-medium">oiuytre</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-500 text-sm min-w-[150px]">
                            Designation:
                          </span>
                          <span className="font-medium">CEO</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-500 text-sm min-w-[150px]">
                            Contact No:
                          </span>
                          <span className="font-medium">1234567890</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-500 text-sm min-w-[150px]">
                            Another No:
                          </span>
                          <span className="font-medium">1234567</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-500 text-sm min-w-[150px]">
                            Status:
                          </span>
                          <span className="font-medium capitalize text-green-600">
                            Active
                          </span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <span className="text-gray-500 text-sm block mb-1">
                          Business Details
                        </span>
                        <div className="bg-gray-50 p-4 rounded-md text-sm leading-relaxed text-gray-700 border">
                          wertysdfghj sdfghjert dfghjdfghj, sdfghsdfghj
                          wertyuivbnm, xcvbnm, vbnm, xcvbnm, asdfg.
                        </div>
                      </div>
                    </div> */}

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
          {selectedTab === "Statutory Details" && (
            <>
              <div className=" px-20 py-6 rounded-md ">
                <Branch branchData={branchData} />
                {/* <p>📜 Statutory details content goes here.</p> */}
              </div>
            </>
          )}
          {selectedTab === "Client Users" && (
            <>
              <div className=" px-20 py-6 rounded-md ">
                <ClientUser clientUserData={clientUserData} />

                {/* <p>👥 Client users content goes here.</p> */}
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
        </div>
      </div>

      {/* //////////////////////////////////////////breadcrumb //////////////// */}
      {/* <div className="pt-5 xl:pt-14 px-6 lg:px-14 2xl:px-32 ">
        <div>
          <nav className="flex flex-wrap items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md w-fit mb-4">
            {breadcrumbItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                {index === 0 ? (
                  // Home link
                  <Link
                    to={item.path}
                    className="flex items-center text-primary hover:text-primary"
                  >
                    <HomeIcon className="h-5 w-5" />
                    <span className="ml-1 text-sm lg:text-base">
                      {item.name}
                    </span>
                  </Link>
                ) : (
                  // Conditional for other breadcrumb links
                  <button
                    onClick={() =>
                      item.name === "Clientdetails"
                        ? navigate(-1)
                        : navigate(item.path)
                    }
                    className="text-gray-700 hover:text-primary text-sm lg:text-base"
                  >
                    {item.name}
                  </button>
                )}
             
                {index < breadcrumbItems.length - 1 && (
                  <span className="text-gray-400 text-sm lg:text-base">
                    {">"}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="bg-secondary px-4 py-4 md:px-6 md:py-5 rounded-md shadow-lg">
          <div className="text-lg md:text-xl font-bold">ClientDetails</div>
          <div className="py-3 mx-2">
            {clientData?.id ? (
              <>
              
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4">
                    <div className="font-semibold text-gray-700">
                      Client Name:
                    </div>
                    <div className="text-gray-700 font-medium">
                      {clientData.client_name}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4">
                    <div className="font-semibold text-gray-700">
                      Entity Type:
                    </div>
                    <div className="text-gray-700 font-medium">
                      {clientData.entity_type}
                    </div>
                  </div>
                  <div className="flex flex-row items-start ">
                    <div className="font-semibold text-gray-700 mr-5">
                      Date of Incorporation:
                    </div>
                    <div className="text-gray-700 font-medium">
                      {clientData.date_of_incorporation}
                    </div>
                  </div>
            
                </div>

             
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3">
                    <div className="font-semibold text-gray-700">
                      Contact Person:
                    </div>
                    <div className="text-gray-700 font-medium">
                      {clientData.contact_person}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4">
                    <div className="font-semibold text-gray-700">
                      Designation:
                    </div>
                    <div className="text-gray-700 font-medium">
                      {clientData.designation}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4">
                    <div className="font-semibold text-gray-700">
                      Contact No:
                    </div>
                    <div className="text-gray-700 font-medium">
                      {clientData.contact_no_1}
                    </div>
                  </div>
                </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4">
                    <div className="font-semibold text-gray-700">
                      Another No:
                    </div>
                    <div className="text-gray-700 font-medium">
                      {clientData.contact_no_2}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-6">
                    <div className="font-semibold text-gray-700">Status:</div>
                    <div className="text-gray-700 font-medium">
                      {clientData.status}
                    </div>
                  </div>
                </div>

      
                <div className="flex flex-row items-start py-3">
                  <div className="font-semibold text-gray-700 mr-5">
                    Business Details:
                  </div>
                  <div className="text-gray-700 font-medium">
                    {clientData.business_detail}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-gray-700 font-medium text-center py-6">
                Loading...
              </div>
            )}
          </div>
        </div>
      </div> */}




      {/* <div className="pt-5 xl:pt-14 px-6 lg:px-14 2xl:px-32">
        <div className="bg-secondary py-3 rounded-md shadow-lg">
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
                    label="Statutory Details"
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
                  <Tab
                    label="Income"
                    value="10"
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
                    label="Expenses"
                    value="11"
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
                    label="ZipFile  Upload"
                    value="12"
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
                
               
                  <Link to={`/clientDetails/acknowledgement/${id}`}>
                
                    <Tab
                      label="Acknowledgement"
                      value="14"
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
                  </Link>
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
                  tdsSectionData={tdsSectionData}
                  othersData={othersData}
                />
              </TabPanel>
              <TabPanel value="8">
                <Purchase purchaseInvoiceData={purchaseInvoiceData} />
              </TabPanel>
              <TabPanel value="9">
                <Sales salesInvoiceData={salesInvoiceData} />
              </TabPanel>
              <TabPanel value="10">
                <Income incomeInvoiceData={incomeInvoiceData} />
            
              </TabPanel>
              <TabPanel value="11">
                <Expenses expensesInvoiceData={expensesInvoiceData} />
              </TabPanel>
              <TabPanel value="12">
                <ZipFile zipFileData={zipFileData} />
              </TabPanel>
              <TabPanel value="13">
                <Acknowledgement ackData={ackData} />
              </TabPanel>
              <TabPanel value="14">
               
                <Ack acksData={acksData} />
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div> */}
    </>
  );
}

export default ClientDetails;
