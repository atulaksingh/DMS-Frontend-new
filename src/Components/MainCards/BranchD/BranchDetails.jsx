import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import BranchDoc from "./BranchDoc/BranchDoc";
import OfficeLoc from "./OfficeLoc/OfficeLoc";
import { HomeIcon } from "@heroicons/react/16/solid";
const API_URL = import.meta.env.VITE_API_BASE_URL;

function BranchDetails() {
  const { clientID, branchID } = useParams();
  //   console.log("useee",useParams())
  const [value, setValue] = React.useState("1");
  const [branchData, setBranchData] = useState(null);
  const [officeLocationData, setOfficeLocationData] = useState(null);
  const [branchDocumentsData, setBranchDocumentsData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const fetchBranchDetails = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/detail-branch/${clientID}/${branchID}`
      );
      // console.log("branch------------->", response.data);
      setBranchData(response.data.Branch);
      setOfficeLocationData(response.data.Office_Location);
      setBranchDocumentsData(response.data.Branch_Document);

      console.log("branchDocumentsData", response.data.Branch_Document);
      console.log("officeLocationData", response.data.Office_Location);

      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBranchDetails();
  }, [clientID, branchID]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading client details: {error.message}</div>;
  }

  const location = useLocation(); // Get the current location object
  const pathnames = location.pathname
    .split("/")
    .filter((x) => x && isNaN(Number(x))); // Exclude numeric segments like IDs

  // Construct breadcrumb items
  const breadcrumbItems = [
    { name: "Home", path: "/master" },
    ...pathnames.map((segment, index) => {
      let path = `/${pathnames.slice(0, index + 1).join("/")}`;
      if (segment.toLowerCase() === "clientdetails") {
        path = `/clientDetails/${clientID}`;
      }
      return { name: segment.charAt(0).toUpperCase() + segment.slice(1), path };
    }),
  ];

  return (
    <>
      {/* {console.log("clientid", clientID)} */}
      <div className="pt-20 px-32 ">
        <div>
          <nav className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md w-fit mb-1">
            {breadcrumbItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                {index === 0 ? (
                  // Home breadcrumb with link
                  <Link
                    to={item.path}
                    className="flex items-center text-primary hover:text-primary"
                  >
                    <HomeIcon className="h-5 w-5" />
                    <span className="ml-1">{item.name}</span>
                  </Link>
                ) : item.name === "BranchDetails" ? (
                  // Non-clickable breadcrumb for BranchDetails
                  <span className="text-gray-700">{item.name}</span>
                ) : (
                  // Other clickable breadcrumbs
                  <Link
                    to={item.path}
                    className="text-gray-700 hover:text-primary"
                  >
                    {item.name}
                  </Link>
                )}
                {/* Arrow icon between breadcrumbs */}
                {index < breadcrumbItems.length - 1 && (
                  <span className="text-gray-400">{">"}</span>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="bg-secondary  px-6 py-5 rounded-md shadow-lg">
          <div className="text-xl font-bold ">BranchDetails</div>
          <div className="py-3 mx-2">
            {branchData && (
              <>
                {/* First Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3">
                    <div className="font-semibold text-gray-700">
                      Branch Name:
                    </div>
                    <div className="text-gray-600">
                      {branchData?.branch_name}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-5">
                    <div className="font-semibold text-gray-700">GST NO:</div>
                    <div className="text-gray-700 font-medium">
                      {branchData?.gst_no}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-5">
                    <div className="font-semibold text-gray-700">Contact:</div>
                    <div className="text-gray-700 font-medium">
                      {branchData?.contact}
                    </div>
                  </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-3">
                  <div className="grid grid-cols-1 sm:grid-cols-6">
                    <div className="font-semibold text-gray-700">State:</div>
                    <div className="text-gray-600">{branchData?.state}</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-6">
                    <div className="font-semibold text-gray-700">City:</div>
                    <div className="text-gray-700 font-medium">
                      {branchData?.city}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex flex-row items-start py-3">
                  <div className="sm:col-span-2 mr-5 font-semibold text-gray-700">
                    Address:
                  </div>
                  <div className="sm:col-span-10 text-gray-700 font-medium">
                    {branchData?.address}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div className="grid grid-cols-2">
            <div></div>
            <div></div>
          </div>
          <div className="grid grid-cols-2">
            <div></div>
            <div></div>
          </div>
          <div className="grid grid-cols-2">
            <div></div>
            <div></div>
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
                  aria-label="customized tabs example"
                  TabIndicatorProps={{
                    sx: {
                      backgroundColor: "primary",
                    },
                  }}
                >
                  <Tab
                    label="Branch Documents"
                    value="1"
                    sx={{
                      "&.Mui-selected": {
                        color: "primary", // Color of the selected tab text
                        fontWeight: "bold",
                        border: 2,
                      },
                      "&:hover": {
                        color: "primary", // Color when hovering over the tab
                      },
                    }}
                  />
                  <Tab
                    label="Office Location"
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
                </TabList>
              </Box>
              <TabPanel value="1">
                <BranchDoc
                  branchDocumentsData={branchDocumentsData}
                  fetchBranchDetails={fetchBranchDetails}
                />
              </TabPanel>
              <TabPanel value="2">
                {/* <Bank bankData={bankData} /> */}
                <OfficeLoc
                  officeLocationData={officeLocationData}
                  fetchBranchDetails={fetchBranchDetails}
                />
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
    </>
  );
}

export default BranchDetails;
