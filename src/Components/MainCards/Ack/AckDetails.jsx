// import React, { useState, useEffect } from "react";
// import { Menu, MenuItem, IconButton } from "@mui/material";
// import { Input, Typography } from "@material-tailwind/react";
// import MUIDataTable from "mui-datatables";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import { CacheProvider } from "@emotion/react";
// import createCache from "@emotion/cache";
// import { Link, useLocation } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { HomeIcon } from "@heroicons/react/16/solid";

// import { useParams } from "react-router-dom";
// // import AcknowledgementCard from "./AcknowledgementCard";
// // import AcknowledgementCreation from "./AcknowledgementCreation";
// const muiCache = createCache({
//     key: "mui-datatables",
//     prepend: true,
// });

// const styleCreateMOdal = {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     width: 750,
//     bgcolor: "background.paper",
//     //   border: "1px solid #000",
//     boxShadow: 24,
//     p: 4,
//     borderRadius: "10px",
// };
// function AckCreation() {
//     const { clientID} = useParams();

//     const location = useLocation(); // Get the current location object
//     const pathnames = location.pathname
//         .split("/")
//         .filter((x) => x && isNaN(Number(x))); // Exclude numeric segments like IDs

//     // Construct breadcrumb items
//     const breadcrumbItems = [
//         { name: "Home", path: "/master" },
//         ...pathnames.map((segment, index) => {
//             let path = `/${pathnames.slice(0, index + 1).join("/")}`;
//             if (segment.toLowerCase() === "clientdetails") {
//                 path = `/clientDetails/${clientID}`;
//             }
//             return { name: segment.charAt(0).toUpperCase() + segment.slice(1), path };
//         }),
//     ];

//     return (
//         <>

//             <div>
//                 <div>
//                     <nav className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md w-fit mb-1">
//                         {breadcrumbItems.map((item, index) => (
//                             <div key={index} className="flex items-center space-x-2">
//                                 {index === 0 ? (
//                                     // Home breadcrumb with link
//                                     <Link
//                                         to={item.path}
//                                         className="flex items-center text-primary hover:text-primary"
//                                     >
//                                         <HomeIcon className="h-5 w-5" />
//                                         <span className="ml-1">{item.name}</span>
//                                     </Link>
//                                 ) : item.name === "BranchDetails" ? (
//                                     // Non-clickable breadcrumb for BranchDetails
//                                     <span className="text-gray-700">{item.name}</span>
//                                 )
//                                 : (
//                                     // Other clickable breadcrumbs
//                                     <Link
//                                         to={item.path}
//                                         className="text-gray-700 hover:text-primary"
//                                     >
//                                         {item.name}
//                                     </Link>
//                                 )
//                                 }
//                                 {/* Arrow icon between breadcrumbs */}
//                                 {index < breadcrumbItems.length - 1 && (
//                                     <span className="text-gray-400">{">"}</span>
//                                 )}
//                             </div>
//                         ))}
//                     </nav>
//                 </div>
//                 <div className="flex justify-between align-middle items-center mb-5">
//                     <div className="text-2xl text-gray-800 font-semibold">
//                         Acknowledgement Details
//                     </div>
//                     <div>

//                         {/* <BankCreation /> */}
//                         {/* <AcknowledgementCreation /> */}
//                     </div>
//                 </div>

//             </div>
//         </>
//     );
// }

// export default AckCreation;

import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
// import BranchDoc from "./BranchDoc/BranchDoc";
// import OfficeLoc from "./OfficeLoc/OfficeLoc";
import { fetchClientDetails } from "../../Redux/clientSlice";
import { HomeIcon } from "@heroicons/react/16/solid";
import Acknowledgement from "./Ack";
import Ack from "./Ack";
import { useSelector } from "react-redux";
const API_URL = import.meta.env.VITE_API_BASE_URL;
function AckDetails() {
  const { id } = useParams();
  //   console.log("useee",useParams())
  const [value, setValue] = React.useState("1");
  // const [branchData, setBranchData] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [officeLocationData, setOfficeLocationData] = useState(null);
  const [branchDocumentsData, setBranchDocumentsData] = useState(null);
  const [acknowledgementData, setAcknowledgementData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const fetchAckDetails = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/detail-ack/${id}`
      );
      // console.log("branch------------->", response.data);
      // setBranchData(response.data.Branch);
      // setOfficeLocationData(response.data.Office_Location);
      // setBranchDocumentsData(response.data.Branch_Document);
      setClientData(response.data.Client);
      setAcknowledgementData(response.data.Acknowledgement);

      console.log("acknowledgementData", response.data.Acknowledgement);

      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAckDetails();
  }, [id]);

  const { ackData } = useSelector((state) => state.client);

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
        path = `/clientDetails/${id}`;
      }
      return { name: segment.charAt(0).toUpperCase() + segment.slice(1), path };
    }),
  ];
  //

  return (
    <>
      {/* {console.log("clientid", clientID)} */}
      <div>
        <div>
          {/* <nav className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md w-fit mb-1">
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
                                ) : item.name === "Acknowledgement" ? (
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
                         
                                {index < breadcrumbItems.length - 1 && (
                                    <span className="text-gray-400">{">"}</span>
                                )}
                            </div>
                        ))}
                    </nav> */}
          <div className="text-2xl text-gray-800 font-semibold">
            Acknowledgement Details
          </div>
        </div>


      </div>
      <div className="py-6">
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
                    label="Acknowledgement"
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
                  {/* <Tab
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
                                    /> */}
                </TabList>
              </Box>
              <TabPanel value="1">
                {/* <BranchDoc
                                    branchDocumentsData={branchDocumentsData}
                                    fetchBranchDetails={fetchBranchDetails}
                                /> */}
                {/* <Ack
                                    ackData={ackData}
                                    fetchBranchDetails={fetchBranchDetails}
                                /> */}
                <Ack
                  acknowledgementData={acknowledgementData}
                  fetchAckDetails={fetchAckDetails}
                />
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
    </>
  );
}

export default AckDetails;
