import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Owner from "./OwnerDetails/Owner";
import Bank from "./BankDetails/Bank";
import Branch from "./BranchDetails/Branch";
import ClientUser from "./ClientUser/ClientUser";
import CustomerUser from "./CustomerUser/CustomerUser";
import CompanyDocuments from "./CompanyDocuments/CompanyDocuments";
import CV from "./CorV/CV";
import Purchase from "./Purchase/Purchase";
import Sales from "./Sales/Sales";
import Income from "./Income/Income";
import Expenses from "./Expenses/Expenses";
import ZipFile from "./ZipFile/ZipFile";
import AckDetails from "../Ack/AckDetails";
import { fetchClientDetails } from "../../Redux/clientSlice";
import Documents from "../Documents/Documents";

const navItems = [
  { name: "Client Details", apiName: "Client" },
  { name: "Owner Details", apiName: "Owner" },
  { name: "Bank Details", apiName: "Bank" },
  { name: "Branch Details", apiName: "Branch" },
  {
    name: "Users Creation",
    subItems: [
      { name: "Client User", apiName: "ClientUser" },
      { name: "Customer User", apiName: "CustomerUser" },
    ],
  },
  { name: "Company Documents", apiName: "CompanyDocuments" },

  {
    name: "Documents",
    subItems: [
      { name: "PF", apiName: "PfData" },
      { name: "Tax Audit", apiName: "taxAuditData" },
      { name: "AIR", apiName: "airData" },
      { name: "SFT", apiName: "sftData" },
      { name: "TDS Return", apiName: "tdsReturnData" },
      { name: "TDS Payment", apiName: "tdsPaymentData" },
      { name: "Other Docs", apiName: "othersData" },
    ],
  },

  { name: "Customer&Vendor", apiName: "CV" },
  { name: "Purchase", apiName: "Purchase" },
  { name: "Sales", apiName: "Sales" },
  { name: "Income", apiName: "Income" },
  { name: "Expenses", apiName: "Expenses" },
  { name: "Zipfile Upload", apiName: "ZipFile" },
  { name: "Acknowledgement", apiName: "Acks" },
];

function ClientDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [docTab, setDocTab] = useState("1");
  const savedTab = localStorage.getItem("selectedTab") || navItems[0].name;
  const savedUserTypeTab =
    localStorage.getItem("selectedUserTypeTab") || "Client User";
  const [selectedTab, setSelectedTab] = useState(savedTab);
  const [userTypeTab, setUserTypeTab] = useState(savedUserTypeTab);

  const savedDocTab = localStorage.getItem("selectedDocTab") || "PF";
  const [selectedDocTab, setSelectedDocTab] = useState(savedDocTab);

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

  const loading = status === "loading";

  const handleTabClick = (tabName, apiName) => {
    //    setSelectedDocTab("PF");
    // localStorage.setItem("selectedDocTab", "PF");

    // Load PF data immediately
    setSelectedTab(tabName);
    localStorage.setItem("selectedTab", tabName);
    dispatch(fetchClientDetails({ id, tabName: "PF" }));

    // Lazy fetch for all tabs
    switch (apiName) {
      case "Client":
        if (!clientData) dispatch(fetchClientDetails({ id, tabName: apiName }));
        break;
      case "Owner":
        if (!ownerData) dispatch(fetchClientDetails({ id, tabName: apiName }));
        break;
      case "Bank":
        if (!bankData) dispatch(fetchClientDetails({ id, tabName: apiName }));
        break;
      case "Branch":
        if (!branchData) dispatch(fetchClientDetails({ id, tabName: apiName }));
        break;
      case "ClientUser":
        if (!clientUserData)
          dispatch(fetchClientDetails({ id, tabName: apiName }));
        break;
      case "CustomerUser":
        if (!customerUserData)
          dispatch(fetchClientDetails({ id, tabName: apiName }));
        break;
      case "CompanyDocuments":
        if (!companyDocData)
          dispatch(fetchClientDetails({ id, tabName: apiName }));
        break;
      case "Documents":
        // Only auto-select PF if no sub-tab is selected already
        if (tabName === "Documents" && !selectedDocTab) {
          const defaultDoc = "PF";
          setSelectedDocTab(defaultDoc);
          localStorage.setItem("selectedDocTab", defaultDoc);

          if (!PfData) {
            dispatch(fetchClientDetails({ id, tabName: "PF" }));
          }
        }
        break;

      case "CV":
        if (!CVData) dispatch(fetchClientDetails({ id, tabName: apiName }));
        break;
      case "Purchase":
        if (!purchaseInvoiceData)
          dispatch(fetchClientDetails({ id, tabName: apiName }));
        break;
      case "Sales":
        if (!salesInvoiceData)
          dispatch(fetchClientDetails({ id, tabName: apiName }));
        break;
      case "Income":
        if (!incomeInvoiceData)
          dispatch(fetchClientDetails({ id, tabName: apiName }));
        break;
      case "Expenses":
        if (!expensesInvoiceData)
          dispatch(fetchClientDetails({ id, tabName: apiName }));
        break;
      case "ZipFile":
        if (!zipFileData)
          dispatch(fetchClientDetails({ id, tabName: apiName }));
        break;
      case "Acks":
        if (!acksData) dispatch(fetchClientDetails({ id, tabName: apiName }));
        break;
      default:
        break;
    }

    // 👇 ADD THIS EXTRA PART FOR DEFAULT BEHAVIOR ON "Users Creation" TAB
    if (tabName === "Users Creation") {
      const defaultUserType = "Client User";
      setUserTypeTab(defaultUserType);
      localStorage.setItem("selectedUserTypeTab", defaultUserType);

      // fetch ClientUser data if not loaded yet
      if (!clientUserData) {
        dispatch(fetchClientDetails({ id, tabName: "ClientUser" }));
      }
    }
  };

  // Sub-tab click for Users Creation
  const handleUserTypeTabClick = (type) => {
    setUserTypeTab(type);
    localStorage.setItem("selectedUserTypeTab", type);
    const apiName = type === "Client User" ? "ClientUser" : "CustomerUser";

    // call fetch directly here
    if (apiName === "ClientUser" && !clientUserData) {
      dispatch(fetchClientDetails({ id, tabName: apiName }));
    } else if (apiName === "CustomerUser" && !customerUserData) {
      dispatch(fetchClientDetails({ id, tabName: apiName }));
    }
  };

  // const handleDocTabClick = (tab,type, apiKey) => {
  //   console.log("📌 Document Tab Clicked:", type, " | API Key =", apiKey);

  //   setSelectedDocTab(type);
  //   localStorage.setItem("selectedDocTab", type);

  //   const apiMap = {
  //     PfData: "PF",
  //     taxAuditData: "TaxAudit",
  //     airData: "AIR",
  //     sftData: "SFT",
  //     tdsReturnData: "TDSReturn",
  //     tdsPaymentData: "TDSPayment",
  //     othersData: "Others",
  //   };

  //   const tabKey = apiMap[apiKey];
  //   console.log("🚀 Sending to Redux:", tabKey);

  //   const storedValue = {
  //     PF: PfData,
  //     TaxAudit: taxAuditData,
  //     AIR: airData,
  //     SFT: sftData,
  //     TDSReturn: tdsReturnData,
  //     TDSPayment: tdsPaymentData,
  //     Others: othersData,
  //   }[tabKey];

  //   if (!storedValue) {
  //     console.log("🟡 Data not found in Redux → fetching from API…");
  //     dispatch(fetchClientDetails({ id, tabName: tabKey }));
  //   } else {
  //     console.log("✅ Data already exists in Redux, no API call");
  //   }
  // };

  // On mount, load saved tab

  const handleDocTabClick = (tabNumber) => {
    setDocTab(tabNumber);
    localStorage.setItem("selectedDocTab", tabNumber);

    const tabMap = {
      1: "PF",
      2: "TaxAudit",
      3: "AIR",
      4: "SFT",
      5: "TDSPayment",
      6: "TDSReturn",
      8: "Others",
    };

    const selectedTabName = tabMap[tabNumber];

    const dataMap = {
      PF: PfData,
      TaxAudit: taxAuditData,
      AIR: airData,
      SFT: sftData,
      TDSReturn: tdsReturnData,
      TDSPayment: tdsPaymentData,
      Others: othersData,
    }[selectedTabName];

    if (!dataMap) {
      dispatch(fetchClientDetails({ id, tabName: selectedTabName }));
    }
  };

  useEffect(() => {
    const item = navItems.find((i) => i.name === savedTab);
    if (item) handleTabClick(item.name, item.apiName);

    if (savedTab === "Users Creation") {
      handleUserTypeTabClick(savedUserTypeTab);
    }
    if (savedTab === "Documents") {
      const saved = localStorage.getItem("selectedDocTab") || "1";
      setDocTab(saved);
      const tabMap = {
        1: "PF",
        2: "TaxAudit",
        3: "AIR",
        4: "SFT",
        5: "TDSPayment",
        6: "TDSReturn",
        8: "Others",
      };
      dispatch(fetchClientDetails({ id, tabName: tabMap[saved] }));
    }
  }, [id]);

  return (
    <div className="w-full">
      {/* Horizontal Nav */}
      <div className="bg-white border-b border-gray-200 shadow-sm w-full overflow-x-auto">
        <div className="flex flex-nowrap gap-4 px-4 py-2 text-sm text-gray-700 min-w-max">
          {navItems.map((item) => (
            <div key={item.name} className="relative group">
              <div
                className={`cursor-pointer whitespace-nowrap px-2 py-1 ${
                  selectedTab === item.name
                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                    : "hover:text-blue-500"
                }`}
                onClick={() => handleTabClick(item.name, item.apiName)}
              >
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <CircularProgress size={50} thickness={4} />
          </div>
        ) : (
          <>
            {/* {console.log("Rendering Tab:",} */}
            {selectedTab === "Client Details" && clientData && (
              <div className="bg-white shadow-lg rounded-xl px-6 py-3 w-full border border-gray-100">
                <h2 className="text-2xl font-semibold text-[#2B4F81] mb-2 border-b pb-2">
                  🧾 Client Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[15px] text-gray-800">
                  <div className="flex">
                    <span className="text-gray-500 text-sm min-w-[150px]">
                      Client Name:
                    </span>
                    <span className="font-medium">
                      {clientData.client_name}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 text-sm min-w-[150px]">
                      Entity Type:
                    </span>
                    <span className="font-medium">
                      {clientData.entity_type}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 text-sm min-w-[150px]">
                      Date of Incorporation:
                    </span>
                    <span className="font-medium">
                      {clientData.date_of_incorporation}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 text-sm min-w-[150px]">
                      Contact Person:
                    </span>
                    <span className="font-medium">
                      {clientData.contact_person}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 text-sm min-w-[150px]">
                      Designation:
                    </span>
                    <span className="font-medium">
                      {clientData.designation}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 text-sm min-w-[150px]">
                      Contact No:
                    </span>
                    <span className="font-medium">
                      {clientData.contact_no_1}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 text-sm min-w-[150px]">
                      Another No:
                    </span>
                    <span className="font-medium">
                      {clientData.contact_no_2}
                    </span>
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
            )}

            {selectedTab === "Owner Details" && ownerData && (
              <Owner ownerData={ownerData} />
            )}
            {selectedTab === "Bank Details" && bankData && (
              <Bank bankData={bankData} />
            )}
            {selectedTab === "Branch Details" && branchData && (
              <Branch branchData={branchData} />
            )}

            {selectedTab === "Users Creation" && (
              <div>
                <div className="flex gap-4 mb-4">
                  <button
                    className={`px-4 py-2 rounded-md border ${
                      userTypeTab === "Client User"
                        ? "bg-primary text-white"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                    onClick={() => handleUserTypeTabClick("Client User")}
                  >
                    Client User
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md border ${
                      userTypeTab === "Customer User"
                        ? "bg-primary text-white"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                    onClick={() => handleUserTypeTabClick("Customer User")}
                  >
                    Customer User
                  </button>
                </div>
                {userTypeTab === "Client User" && clientUserData && (
                  <ClientUser clientUserData={clientUserData} />
                )}
                {userTypeTab === "Customer User" && customerUserData && (
                  <CustomerUser customerUserData={customerUserData} />
                )}
              </div>
            )}

            {selectedTab === "Company Documents" && companyDocData && (
              <CompanyDocuments companyDocData={companyDocData} />
            )}

            {selectedTab === "Documents" && (
              <Documents
                PfData={PfData}
                taxAuditData={taxAuditData}
                airData={airData}
                sftData={sftData}
                tdsReturnData={tdsReturnData}
                tdsPaymentData={tdsPaymentData}
                tdsSectionData={tdsSectionData}
                othersData={othersData}
                handleDocTabClick={handleDocTabClick}
                currentTab={docTab}
              />
            )}

            {selectedTab === "Customer&Vendor" && CVData && (
              <CV cvData={CVData} />
            )}
            {selectedTab === "Purchase" && purchaseInvoiceData && (
              <Purchase purchaseInvoiceData={purchaseInvoiceData} />
            )}
            {selectedTab === "Sales" && salesInvoiceData && (
              <Sales salesInvoiceData={salesInvoiceData} />
            )}
            {selectedTab === "Income" && incomeInvoiceData && (
              <Income incomeInvoiceData={incomeInvoiceData} />
            )}
            {selectedTab === "Expenses" && expensesInvoiceData && (
              <Expenses expensesInvoiceData={expensesInvoiceData} />
            )}
            {selectedTab === "Zipfile Upload" && zipFileData && (
              <ZipFile zipFileData={zipFileData} />
            )}
            {selectedTab === "Acknowledgement" && acksData && <AckDetails />}
          </>
        )}
      </div>
    </div>
  );
}

export default ClientDetails;
