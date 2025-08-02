import React, { useEffect, useState } from "react";

import Hsn from "../Components/MainCards/HSN/Hsn";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import axios from "axios";
import axiosInstance from "/src/utils/axiosInstance";
const API_URL = import.meta.env.VITE_API_BASE_URL;
function HsnDetails() {


  const [hsnData, setHsnData] = useState([]);

  const [loading, setLoading] = useState(true);
  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_URL}/api/list-client`
      );
      // console.log("response",response.data)
      setHsnData(response.data.hsn); // Assuming the data is returned in the response body

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



  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className=" px-40 py-12 rounded-md ">
        <Hsn hsnData={hsnData} fetchClients={fetchClients} />
      </div>
    </>
  );
}

export default HsnDetails;
