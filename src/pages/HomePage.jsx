import React, { useState, useEffect } from "react";
import axios from "axios";
import MuiTable from "../Components/MainCards/MuiTable";

function HomePage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/list-client");
      console.log("res", response)
      // http://127.0.0.1:8000/api/create-client
      setClients(response.data.clients); // Assuming the data is returned in the response body
      setLoading(false);
    } catch (error) {
      console.error("Error fetching clients:", error);
      // Keep loading state as true in case of a network error
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <MuiTable tableData={clients} fetchClients={fetchClients} />
    </div>
  );
}

export default HomePage;
