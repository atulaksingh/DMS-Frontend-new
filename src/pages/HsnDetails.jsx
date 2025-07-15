import React, { useEffect, useState } from "react";

import Hsn from "../Components/MainCards/HSN/Hsn";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import axios from "axios";


function HsnDetails() {

   
      const [hsnData, setHsnData] = useState([]);
     
      const [loading, setLoading] = useState(true);
      const fetchClients = async () => {
        try {
          const response = await axios.get(
            "http://127.0.0.1:8000/api/list-client"
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
      <div className=" px-20 py-6 rounded-md ">
        <Hsn hsnData={hsnData} fetchClients={fetchClients} />
      </div>
    </>
  );
}

export default HsnDetails;
