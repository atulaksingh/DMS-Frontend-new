import {
  Button,
  DialogFooter,
  IconButton,
  Option,
  Select,
} from "@material-tailwind/react";
import React, { useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import { useState } from "react";
import { Input, Typography } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchClientDetails } from "../../../Redux/clientSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { Autocomplete, TextField } from "@mui/material";
const API_URL = import.meta.env.VITE_API_BASE_URL;
const styleCreateMOdal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 750,
  bgcolor: "background.paper",
  //   border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};
function ClientUserCreation() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleCreateOpen = () => {
    setOpenCreateModal(true);
    setAnchorEl(null);
  };
  const [customers, setCustomers] = useState([]);

  // Fetch Data from API
  // useEffect(() => {
  //   fetch("${API_URL}/api/user-clientform/1")
  //     .then((response) => response.json())
  //     .then((data) => setCustomers(data))
  //     .catch((error) => console.error("Error fetching customers:", error));
  // }, []);

  const handleCreateClose = () => setOpenCreateModal(false);
  const [formData, setFormData] = useState({
    name: "",
    customer: "",
    email: "",
    // password: "",
  });
  // console.log(formData)
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
      formDataToSend.append("name", formData.name);
      formDataToSend.append("customer", formData.customer);
      formDataToSend.append("email", formData.email);
      // formDataToSend.append("password", formData.password);

      // Make a POST request to your API
      const response = await axios.post(
        `${API_URL}/api/user-clientform/${id}`,
        formDataToSend
      );
      console.log(response);

      // Check if the response is successful
      if (response.status === 200) {
        // Handle success response
        handleCreateClose();

        // Show success toast
        toast.success(response?.data?.message || "User-client form created successfully.", {
          position: "top-right",
          autoClose: 5000,
        });

        // Dispatch fetchClientDetails action
        dispatch(fetchClientDetails(id));

        // Optionally close the modal and reset form
        setFormData({
          name: "",
          customer: "",
          email: "",
          // password: "",
        });
      } else {
        throw new Error("Failed to create user-client form.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);

      // Show error toast
      toast.error(
        error.response?.data?.error_message || "Failed to create user-client details. Please try again.",
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    }
  };

  // const [showPassword, setShowPassword] = useState(false);

  // const togglePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  // };



  const handleCustomerChange = (event, newValue) => {
    // When a user selects a customer, update the formData with the selected customer
    setFormData((prev) => ({
      ...prev,
      customer: newValue ? newValue.id : "", // Assuming `id` is what you want to store
    }));
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
              Create ClientUser Details
            </Typography>
            <form className=" my-5 w-full " onSubmit={handleSubmit}>
              <div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-4">
                    <label htmlFor="first_name">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Name
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
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
                    <label htmlFor="email">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Email
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="email"
                        size="lg"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>



                  {/* <div className="col-span-2">
                    <label htmlFor="password">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Select Customer or Vendor
                      </Typography>
                    </label>




                    <Autocomplete
                      sx={{ width: 300 }}
                      freeSolo
                      id="gst-no-autocomplete"
                      disableClearable
                      options={customers}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.name || ""
                      }
                      onChange={handleCustomerChange}  // Use the custom handler
                      value={customers.find((customer) => customer.id === formData.customer) || null} // Bind value to formData.customer
                      renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                          {option.gst_no} ({option.name})
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          name="customer"
                          value={formData.customer || ""} // Reset input value when formData.customer changes
                          onChange={handleInputChange} // Update input value on type
                          placeholder="Enter or select GST No."
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 34, // Set your desired height here
                              padding: "4px 6px", // Adjust padding to make it smaller
                            },
                            "& .MuiOutlinedInput-input": {
                              padding: "14px 16px", // Input padding
                            },
                          }}
                          slotProps={{
                            input: {
                              ...params.InputProps,
                              type: "search",
                            },
                          }}
                        />
                      )}
                    />
                  </div> */}

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

export default ClientUserCreation;
