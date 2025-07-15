import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import axios from "axios";
import Product from "../Components/MainCards/Product/Product";
const API_URL = import.meta.env.VITE_API_BASE_URL;

function ProductDetails() {

  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/list-client`);
      // console.log("response",response.data)
      setProductData(response.data.product); // Assuming the data is returned in the response body
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
      <div className=" px-40 py-12 rounded-md ">
        <Product productData={productData} fetchClients={fetchClients} />
      </div>
    </>
  );
}

export default ProductDetails;
