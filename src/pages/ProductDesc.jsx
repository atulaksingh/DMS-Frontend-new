import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import axios from "axios";

import ProductDescription from "../Components/MainCards/ProductDescription/ProductDescription";

function ProductDesc() {


  const [productDescriptionData, setProductDescriptionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchClients = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/list-client");
      // console.log("response",response.data)
      setProductDescriptionData(response.data.product_description); // Assuming the data is returned in the response body
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
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className=" px-20 py-6 rounded-md ">
        <ProductDescription
          productDescriptionData={productDescriptionData}
          fetchClients={fetchClients}
        />
      </div>
    </>
  );
}

export default ProductDesc;
