import React, { useState, useEffect } from "react";
import axios from "axios";
import MuiTable from "../Components/MainCards/MuiTable";
import axiosInstance from "../utils/axiosInstance";
import { CircularProgress, Box } from "@mui/material";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// console.log("API_URL", API_URL);
function HomePage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      // const response = await axiosInstance.get("http://127.0.0.1:8000/api/list-client");
      const response = await axiosInstance.get(`${API_URL}/api/list-client`);
      console.log("res", response.data)
      // http://127.0.0.1:8000/api/create-client
      setClients(response?.data?.clients); // Assuming the data is returned in the response body
      setLoading(false);
    } catch (error) {
      console.error("Error fetching clients:", error);
      // Keep loading state as true in case of a network error
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }
  if (loading) {
    return (
      <Box
        // className="flex justify-center items-center h-screen"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          backgroundColor: "white",
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }


  return (
    <div className="  py-6 rounded-md ">
      <MuiTable tableData={clients} fetchClients={fetchClients} />
    </div>
  );
}

export default HomePage;
