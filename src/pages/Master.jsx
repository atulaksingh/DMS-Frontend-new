import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Hsn from "../Components/MainCards/HSN/Hsn";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import axios from "axios";
import HomePage from "./HomePage";
import Product from "../Components/MainCards/Product/Product";
import ProductDescription from "../Components/MainCards/ProductDescription/ProductDescription";
const API_URL = import.meta.env.VITE_API_BASE_URL;

function Master() {
  const location = useLocation();
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [hsnData, setHsnData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [productDescriptionData, setProductDescriptionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchClients = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/list-client`
      );
      // console.log("response",response.data)
      setHsnData(response.data.hsn); 
      setProductData(response.data.product); 
      setProductDescriptionData(response.data.product_description);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to fetch client data.", {
        position: "top-right",
        autoClose: 2000,
      });
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchClients();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get("tab");
    if (tab === "hsn") {
      setValue("2");
    } else if (tab === "product") {
      setValue("3");
    } else if (tab === "description") {
      setValue("4");
    }
  }, [location]);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="py-0 px-0">
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
                    label="Client Details"
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
                    label="HSN Details"
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
                    label="Product Details"
                    value="3"
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
                    label="Product Description "
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
                </TabList>
              </Box>
              <TabPanel value="1">
                <HomePage />
              </TabPanel>
              <TabPanel value="2">
                <Hsn hsnData={hsnData} fetchClients={fetchClients} />

              </TabPanel>
              <TabPanel value="3"><Product productData={productData} fetchClients={fetchClients} /></TabPanel>
              <TabPanel value="4"><ProductDescription productDescriptionData={productDescriptionData} fetchClients={fetchClients} /></TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>

    </>
  );
}

export default Master;
