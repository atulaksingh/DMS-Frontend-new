import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
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
      const response = await axiosInstance.get(
        `${API_URL}/api/detail-ack/${id}`
      );
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
                </TabList>
              </Box>
              <TabPanel value="1">
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
