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
function ProductDescriptionCreation({ fetchClients }) {
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
          `${API_URL}/api/create-product-description`
        );
        // console.log("fffff",response.data)
        setCustomerData(response.data);
      } catch (error) { }
    };
    fetchBankDetails();
  }, [id]);
  const handleCreateClose = () => setOpenCreateModal(false);
  const [formData, setFormData] = useState({
    description: "",
    unit: "",
    product: null,
    rate: ""
  });
  //   console.log("form", formData);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Create a FormData object
      const formDataToSend = new FormData();

      // Append text fields to FormData
      formDataToSend.append("description", formData.description);
      formDataToSend.append("unit", formData.unit);
      formDataToSend.append("product", formData.product);
      formDataToSend.append("rate", formData.rate);

      // Make a POST request to your API
      const response = await axiosInstance.post(
        `${API_URL}/api/create-product-description`,
        formDataToSend
      );
      // console.log("ss",response.data)
      // Handle success response
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message || "Product description created successfully!", {
          position: "top-right",
          autoClose: 2000,
        });

        // Fetch updated data
        await fetchClients();

        // Optionally close the modal and reset form
        handleCreateClose();
        setFormData({
          description: "",
          unit: "",
          product: "",
          rate: "",
        });
      } else {
        // Handle unexpected non-success statuses
        toast.error("Unexpected response from the server. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);

      // Extract detailed error messages if available
      const errorMessage =
        error.response?.data?.error_message.product[0] ||
        error.response?.data?.message ||
        "Failed to create Product details. Please try again.";

      // Show error toast with the message
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
        product: newValue.id, // Store the selected option's id in the product field
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
              Create Product Description Details
            </Typography>
            <form className=" my-5 w-full " onSubmit={handleSubmit}>
              <div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-4">
                    <label htmlFor="product">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Product Name
                      </Typography>
                    </label>

                    <div className="">
                      <Autocomplete
                        freeSolo
                        id="product"
                        disableClearable
                        options={customerData}
                        getOptionLabel={(option) =>
                          option &&
                            typeof option === "object" &&
                            option.product_name
                            ? String(option.product_name)
                            : ""
                        }
                        onChange={handleGstNoChange} // Call the updated handleGstNoChange
                        value={
                          customerData.find(
                            (option) => option.id === formData.product
                          ) || null // Set the value to match selected option's id
                        }
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            {String(option.product_name)}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            name="product"
                            value={formData.product || ""} // Bind value to formData.hsn
                            onChange={(e) =>
                              handleGstNoChange(e, e.target.value)
                            } // Handle changes manually
                            placeholder="Enter or select product Code."
                            slotProps={{
                              input: {
                                ...params.InputProps,
                                type: "search",
                              },
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="description">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Description
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="description"
                        placeholder="Description"
                        value={formData.description}
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
                    <label htmlFor="unit">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Unit
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="number"
                        size="lg"
                        name="unit"
                        placeholder="Unit"
                        value={formData.unit}
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
                    <label htmlFor="rate">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Rate
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="number"
                        size="lg"
                        name="rate"
                        placeholder="Rate"
                        value={formData.rate}
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

export default ProductDescriptionCreation;
