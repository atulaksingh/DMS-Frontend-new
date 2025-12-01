import { Button, DialogFooter, Option, Select } from "@material-tailwind/react";
import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import { useState } from "react";
import { Input, Typography } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import { useParams } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import { Autocomplete, Stack, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { fetchClientDetails } from "../../../Redux/clientSlice";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const styleCreateMOdal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: "750px",
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: "12px",
};

function BranchCreation() {
  const { id } = useParams();
  const role = getUserRole();
  console.log("Role from token:", getUserRole());
  const dispatch = useDispatch();
  const [openCreateModal, setOpenCreateModal] = React.useState(false);

  const [countries, setCountries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setStates(State.getStatesOfCountry(country?.isoCode));
    setCities([]);
    setSelectedState(null);
    setSelectedCity(null); // Reset city when country changes
    setFormData((prev) => ({
      ...prev,
      country: country?.name, // Update formData with selected country
    }));
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    setCities(City.getCitiesOfState(selectedCountry?.isoCode, state?.isoCode));
    setSelectedCity(null); // Reset city when state changes
    setFormData((prev) => ({
      ...prev,
      state: state?.name, // Update formData with selected state
    }));
  };
  console.log("cities", cities);

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setFormData((prev) => ({
      ...prev,
      city: city?.name, // Update formData with selected city
    }));
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleCreateOpen = () => {
    setOpenCreateModal(true);
    setAnchorEl(null);
  };
  // console.log("aa", countries);
  const handleCreateClose = () => setOpenCreateModal(false);
  const [formData, setFormData] = useState({
    branch_name: "",
    contact: "",
    gst_no: "",
    country: "",
    state: "",
    city: "",
    address: "",
    pincode: "",
  });
  // console.log("hhhh->", formData);

  const [branchErrors, setBranchErrors] = useState({});

  const branchRules = {
    branch_name: [
      { test: (v) => v.length > 0, message: "Branch name is required" },
      // { test: v => /^[A-Za-z0-9\s,']+$/.test(v), message: "Branch name can only contain letters, numbers, commas, apostrophes, and spaces" },
    ],
    contact: [
      { test: (v) => v.length > 0, message: "Contact number is required" },
      {
        test: (v) => /^\d{10}$/.test(v),
        message: "Contact number must be exactly 10 digits",
      },
    ],
    gst_no: [
      { test: (v) => v.length > 0, message: "GST number is required" },
      // { test: v => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v), message: "GST number must be valid (e.g., 22AAAAA0000A1Z5)" },
      // { test: v => v.length === 15, message: "GST number must be exactly 15 characters long" },
    ],
    country: [
      { test: (v) => v.length > 0, message: "Country is required" },
      {
        test: (v) => /^[A-Za-z\s]+$/.test(v),
        message: "Country can only contain alphabets and spaces",
      },
    ],
    state: [
      { test: (v) => v.length > 0, message: "State is required" },
      {
        test: (v) => /^[A-Za-z\s]+$/.test(v),
        message: "State can only contain alphabets and spaces",
      },
    ],
    city: [
      { test: (v) => v.length > 0, message: "City is required" },
      {
        test: (v) => /^[A-Za-z\s]+$/.test(v),
        message: "City can only contain alphabets and spaces",
      },
    ],
    address: [
      { test: (v) => v.length > 0, message: "Address is required" },
      {
        test: (v) => v.length >= 5,
        message: "Address must be at least 5 characters long",
      },
    ],
    pincode: [
      { test: (v) => v.length > 0, message: "Pincode is required" },
      // { test: v => /^\d{6}$/.test(v), message: "Pincode must be exactly 6 digits" },
    ],
  };

  const validateBranchField = (name, value) => {
    const fieldRules = branchRules[name];
    if (!fieldRules) return "";
    for (let rule of fieldRules) {
      if (!rule.test(value)) return rule.message;
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const errorMsg = validateBranchField(name, value);
    setBranchErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const errorMsg = validateBranchField(key, value);
      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

    setBranchErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      toast.error(newErrors[firstErrorField], {
        position: "top-right",
        autoClose: 2000,
      });
      return; // ❌ Stop submit
    }

    try {
      // Create a FormData object
      const formDataToSend = new FormData();

      // Append text fields to FormData
      formDataToSend.append("branch_name", formData.branch_name);
      formDataToSend.append("contact", formData.contact);
      formDataToSend.append("gst_no", formData.gst_no);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("pincode", formData.pincode);

      // Make a POST request to your API
      const response = await axiosInstance.post(
        `${API_URL}/api/create-branch/${id}`,
        formDataToSend
      );

      // console.log("Response Data:", response.data);

      // Check if the response is successful
      if (response.status === 201 || response.status === 200) {
        toast.success("Branch details created successfully!", {
          position: "top-right",
          autoClose: 2000,
        });

        // Dispatch action to fetch client details
        // dispatch(fetchClientDetails(id));
        dispatch(fetchClientDetails({ id, tabName: "Branch" }));
        // Optionally close the modal and reset form
        handleCreateClose();
        setFormData({
          branch_name: "",
          contact: "",
          gst_no: "",
          country: "",
          state: "",
          city: "",
          address: "",
          pincode: "",
        });
      } else {
        toast.error("Unexpected response from the server.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);

      // Check if error has a response object from Axios
      if (error.response) {
        toast.error(
          error.response.data.message ||
            "Failed to create branch details. Please try again.",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
      } else {
        // Fallback error message for unexpected errors
        toast.error("An unexpected error occurred. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }
  };

  return (
    <>
      {/* <ToastContainer />       */}
      <div>
        <Modal
          open={openCreateModal}
          onClose={handleCreateClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "95%", sm: "90%", md: "750px" },
              maxHeight: "90vh",
              overflowY: "auto",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 3,
              borderRadius: "10px",
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              className="text-center border-b-2 border-[#366FA1] pb-3"
            >
              Create Branch Details
            </Typography>

            <form className="my-5 w-full" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Branch Name – Full Width */}
                <div className="lg:col-span-2">
                  <label htmlFor="branch_name">
                    <Typography className="block font-semibold mb-2">
                      Branch Name
                    </Typography>
                  </label>

                  <Input
                    type="text"
                    name="branch_name"
                    value={formData.branch_name}
                    onChange={handleInputChange}
                    placeholder="Branch Name"
                    required
                    className="!w-full !border !border-[#cecece] bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    labelProps={{ className: "hidden" }}
                  />
                </div>

                {/* Contact */}
                <div>
                  <Typography className="block font-semibold mb-1">
                    Contact No
                  </Typography>
                  <Input
                    type="number"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="Contact"
                    required
                    className="!w-full !border !border-[#cecece] bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    labelProps={{ className: "hidden" }}
                  />
                </div>

                {/* GST */}
                <div>
                  <Typography className="block font-semibold mb-1">
                    GST No
                  </Typography>
                  <Input
                    type="text"
                    name="gst_no"
                    value={formData.gst_no}
                    onChange={handleInputChange}
                    placeholder="GST No"
                    required
                    className="!w-full !border !border-[#cecece] bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    labelProps={{ className: "hidden" }}
                  />
                </div>

                {/* Country */}
                <div>
                  <Typography className="block font-semibold mb-1">
                    Country
                  </Typography>

                  <Stack spacing={1} sx={{ width: "100%" }}>
                    <Autocomplete
                      options={countries}
                      disableClearable
                      getOptionLabel={(o) =>
                        typeof o === "string" ? o : `${o.flag} ${o.name}`
                      }
                      value={selectedCountry}
                      inputValue={formData.location || ""}
                      onInputChange={(e, nv) => {
                        setFormData({ ...formData, location: nv });
                        const match = countries.find(
                          (c) => c.name.toLowerCase() === nv.toLowerCase()
                        );
                        if (match) {
                          setSelectedCountry(match);
                          handleCountryChange(match);
                        }
                      }}
                      onChange={(e, nv) => {
                        setSelectedCountry(nv);
                        setFormData({ ...formData, location: nv.name });
                        handleCountryChange(nv);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          placeholder="Select Country"
                        />
                      )}
                    />
                  </Stack>
                </div>

                <div>
                  <Typography className="block font-semibold mb-1">
                    State
                  </Typography>

                  <Stack spacing={1} sx={{ width: "100%" }}>
                    <Autocomplete
                      options={states}
                      disableClearable
                      getOptionLabel={(o) =>
                        typeof o === "string" ? o : o.name
                      }
                      value={selectedState}
                      inputValue={formData.state || ""}
                      onInputChange={(e, nv) => {
                        setFormData({ ...formData, state: nv });
                        const match = states.find(
                          (s) => s.name.toLowerCase() === nv.toLowerCase()
                        );
                        if (match) {
                          setSelectedState(match);
                          handleStateChange(match);
                        }
                      }}
                      onChange={(e, nv) => {
                        setSelectedState(nv);
                        setFormData({ ...formData, state: nv.name });
                        handleStateChange(nv);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          placeholder="Select State"
                        />
                      )}
                    />
                  </Stack>
                </div>

                {/* City */}
                <div>
                  <Typography className="block font-semibold mb-1">
                    City
                  </Typography>

                  <Stack spacing={1} sx={{ width: "100%" }}>
                    <Autocomplete
                      options={cities}
                      disableClearable
                      getOptionLabel={(o) =>
                        typeof o === "string" ? o : o.name
                      }
                      value={selectedCity}
                      inputValue={formData.city || ""}
                      onInputChange={(e, nv) => {
                        setFormData({ ...formData, city: nv });
                        const match = cities.find(
                          (c) => c.name.toLowerCase() === nv.toLowerCase()
                        );
                        if (match) setSelectedCity(match);
                      }}
                      onChange={(e, nv) => {
                        setSelectedCity(nv);
                        setFormData({ ...formData, city: nv?.name || "" });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          placeholder="Select City"
                        />
                      )}
                    />
                  </Stack>
                </div>

                {/* Pin Code */}
                <div>
                  <Typography className="block font-semibold mb-1">
                    Pin Code
                  </Typography>
                  <Input
                    type="number"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="Pin Code"
                    required
                    className="!w-full !border !border-[#cecece] bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    labelProps={{ className: "hidden" }}
                  />
                </div>

                {/* Address – Full Width */}
                <div className="lg:col-span-2">
                  <Typography className="block font-semibold mb-1">
                    Address
                  </Typography>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    required
                    className="!w-full !border !border-[#cecece] bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    labelProps={{ className: "hidden" }}
                  />
                </div>
              </div>

              {/* Footer */}
              <DialogFooter>
                <Button
                  onClick={handleCreateClose}
                  color="red"
                  className="mr-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary">
                  Confirm
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

export default BranchCreation;
