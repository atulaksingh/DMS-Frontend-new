import { Button, DialogFooter } from "@material-tailwind/react";
import React, { useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import { useState } from "react";
import { Input, Typography } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
const API_URL = import.meta.env.VITE_API_BASE_URL;
// import "react-toastify/dist/ReactToastify.css";
import { Autocomplete } from "@mui/material";
const styleCreateMOdal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 750,
  bgcolor: "background.paper",
  //   border: "1px solid #000",
  boxShadow: 24,
  paddingTop: "17px", // For vertical (top and bottom) padding
  paddingInline: "40px",
  borderRadius: "10px",
};
function ProductCreation({ fetchClients }) {
  const { id } = useParams();
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [customerData, setCustomerData] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleCreateOpen = () => {
    setOpenCreateModal(true);
    setAnchorEl(null);
  };
  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_URL}/api/create-product`
        );
        // console.log("fffff",response.data)
        setCustomerData(response.data);
      } catch (error) { }
    };
    fetchBankDetails();
  }, [id]);
  const handleCreateClose = () => setOpenCreateModal(false);
  const [formData, setFormData] = useState({
    product_name: "",
    unit_of_measure: "",
    hsn: null,
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!formData.hsn) {
      toast.error("Please select a valid HSN code from the list!");
      return;
    }


    try {
      // Create a FormData object
      const formDataToSend = new FormData();

      // Append text fields to FormData
      formDataToSend.append("product_name", formData.product_name);
      formDataToSend.append("unit_of_measure", formData.unit_of_measure);
      formDataToSend.append("hsn", formData.hsn);

      // Make a POST request to your API
      const response = await axiosInstance.post(
        `${API_URL}/api/create-product`,
        formDataToSend
      );

      // Handle success response
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message || "Product created successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
        fetchClients()
        // Optionally close the modal and reset form
        handleCreateClose();
        setFormData({
          product_name: "",
          unit_of_measure: "",
          hsn: "",
        });
      } else {
        toast.error("Failed to create Product details. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);

      // Extract and display detailed error message if available
      const errorMessage =
        error.response?.data?.error_message.hsn[0] ||
        error.response?.data?.message ||
        "Failed to create Product details. Please try again.";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };


  const handleGstNoChange = (event, newValue) => {
    if (newValue && newValue.id) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        hsn: newValue.id, // Store the selected option's id in the hsn field
      }));
    }
  };
  return (
    <>
      {/* <ToastContainer /> */}
      <div>
        <Modal
          open={openCreateModal}
          onClose={handleCreateClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleCreateMOdal}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              className="text-center border-b-2 border-[#366FA1] pb-3"
            >
              Create Product Details
            </Typography>
            <form className=" my-5 w-full " onSubmit={handleSubmit}>
              <div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-4">
                    <label htmlFor="hsn_code">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        HSN Code
                      </Typography>
                    </label>

                    <div className="">
                      {/* <Autocomplete
                        // freeSolo
                        id="gst-no-autocomplete"
                        disableClearable
                        required
                        options={customerData}
                        getOptionLabel={(option) =>
                          option &&
                            typeof option === "object" &&
                            option.hsn_code
                            ? String(option.hsn_code)
                            : ""
                        }
                        onChange={handleGstNoChange} // Call the updated handleGstNoChange
                        value={
                          customerData.find(
                            (option) => option.id === formData.hsn
                          ) || null // Set the value to match selected option's id
                        }
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {String(option.hsn_code)}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            name="hsn"
                            required
                            value={formData.hsn || ""} // Bind value to formData.hsn
                            // onChange={(e) =>
                            //   handleGstNoChange(e, e.target.value)
                            // } // Handle changes manually
                            placeholder="Enter or select HSN Code."
                            slotProps={{
                              input: {
                                ...params.InputProps,
                                type: "search",
                              },
                            }}
                          />
                        )}
                      /> */}
                      <Autocomplete
                        id="gst-no-autocomplete"
                        disableClearable
                        options={customerData}
                        // getOptionLabel={(option) => option.hsn_code}
                        getOptionLabel={(option) =>
                          option && typeof option === "object" && option.hsn_code
                            ? String(option.hsn_code)  // convert number to string
                            : ""
                        }
                        onChange={(event, newValue) => {
                          setFormData(prev => ({ ...prev, hsn: newValue ? newValue.id : null }));
                        }}
                        value={customerData.find(option => option.id === formData.hsn) || null}
                        renderInput={(params) => (
                          <TextField {...params} label="HSN Code" required />
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="product_name">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Product Name
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="product_name"
                        placeholder="Product Name"
                        value={formData.product_name}
                        required
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="unit_of_measure">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Unit of Measure
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="number"
                        size="lg"
                        name="unit_of_measure"
                        required
                        placeholder="Unit of Measure"
                        value={formData.unit_of_measure}
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreateClose}
                  conained="text"
                  color="red"
                  className="mr-1 "
                >
                  <span>Cancel</span>
                </Button>
                <Button
                  conained="contained"
                  type="submit"
                  //   color="green"
                  // onClick={handleCreateClose}
                  className="bg-primary"
                >
                  <span>Confirm</span>
                </Button>
              </DialogFooter>
            </form>
          </Box>
        </Modal>
      </div>
      <Button
        conained="conained"
        size="md"
        className="bg-primary hover:bg-[#2d5e85]"
        onClick={handleCreateOpen}
      >
        Create
      </Button>
    </>
  );
}

export default ProductCreation;
