import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import { Input, Typography } from "@material-tailwind/react";
// import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { DialogFooter, Button } from "@material-tailwind/react";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import { Country, State, City } from "country-state-city";
import { ToastContainer, toast } from "react-toastify";
import { Autocomplete, Stack, TextField } from "@mui/material";
// import "react-toastify/dist/ReactToastify.css";
const options = ["None", "Atria", "Callisto"];
const API_URL = import.meta.env.VITE_API_BASE_URL;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: "90%", md: "700px" },
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "10px",
  p: { xs: 2, sm: 3, md: 4 },
};


const ITEM_HEIGHT = 48;

export default function OfficeLocCard({ rowId, fetchBranchDetails }) {
  const { clientID, branchID } = useParams();
  const role = getUserRole();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    location: "",
    contact: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });

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
  const handleCityChange = (city) => {
    setSelectedCity(city);
    setFormData((prev) => ({
      ...prev,
      city: city?.name, // Update formData with selected city
    }));
  };

  const [officeLocationErrors, setOfficeLocationErrors] = useState({});

  const locationRules = {
    location: [
      {
        test: (v) => v && v.trim().length > 0,
        message: "Location is required",
      },
      {
        test: (v) => /^[A-Za-z0-9\s,.-]+$/.test(v),
        message:
          "Location can only contain letters, numbers, spaces, commas, dots, and hyphens",
      },
    ],
    contact: [
      // { test: v => v && String(v).trim().length > 0, message: "Contact number is required" },
      {
        test: (v) => /^\d{10}$/.test(String(v)),
        message: "Contact number must be exactly 10 digits",
      },
    ],
    address: [
      { test: (v) => v && v.trim().length > 0, message: "Address is required" },
      {
        test: (v) => v.length >= 5,
        message: "Address must be at least 5 characters long",
      },
    ],
    city: [
      { test: (v) => v && v.trim().length > 0, message: "City is required" },
      {
        test: (v) => /^[A-Za-z\s]+$/.test(v),
        message: "City can only contain alphabets and spaces",
      },
    ],
    state: [
      { test: (v) => v && v.trim().length > 0, message: "State is required" },
      {
        test: (v) => /^[A-Za-z\s]+$/.test(v),
        message: "State can only contain alphabets and spaces",
      },
    ],
    country: [
      { test: (v) => v && v.trim().length > 0, message: "Country is required" },
      {
        test: (v) => /^[A-Za-z\s]+$/.test(v),
        message: "Country can only contain alphabets and spaces",
      },
    ],
  };

  const validateLocationField = (name, value) => {
    const fieldRules = locationRules[name];
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

    const errorMsg = validateLocationField(name, value);
    setOfficeLocationErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    let hasError = false;
    for (let [field, value] of Object.entries(formData)) {
      const errorMsg = validateLocationField(field, value);
      if (errorMsg) {
        toast.error(errorMsg);
        hasError = true;
        break; // stop at first error
      }
    }

    if (hasError) return; // ❌ Stop submit if validation failed

    try {
      // Create a FormData object
      const formDataToSend = new FormData();

      // Append text fields to FormData
      formDataToSend.append("location", formData.location);
      formDataToSend.append("contact", formData.contact);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("country", formData.country);

      // Make a POST request to your API
      const response = await axiosInstance.post(
        `${API_URL}/api/edit-officelocation/${branchID}/${rowId}`,
        formDataToSend
      );

      // Check for success response
      if (response.status === 200 || response.status === 201) {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });

        // Refresh branch details and close modal
        setTimeout(() => {
          fetchBranchDetails();
          handleCreateClose();
        }, 500);

        // Reset the form
        setFormData({
          location: "",
          contact: "",
          address: "",
          city: "",
          state: "",
          country: "",
        });
      } else {
        // Handle unexpected response statuses
        throw new Error(
          response.data?.message || "Failed to update Office Location details."
        );
      }
    } catch (error) {
      console.error("Error submitting data:", error);

      // Show error toast with meaningful message
      toast.error(
        error.response?.data?.Message ||
          "Failed to update Office Location details. Please try again.",
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    }
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // console.log("row123", deleteId);
  const handleDeleteOpen = () => {
    setDeleteId(rowId);
    setOpenDeleteModal(true);
    setAnchorEl(null);
  };
  const handleDeleteID = async () => {
    try {
      const response = await axiosInstance.delete(
        `${API_URL}/api/delete-officelocation/${clientID}/${branchID}/${deleteId}`
      );
      // console.log("res-----Office Location---->", response);
      setOpenDeleteModal(false);
      if (response.status === 200) {
        toast.success("Office Location deleted successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
        fetchBranchDetails();
      } else {
        toast.error("Failed to delete Office Location. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting Office Location data:", error);
      toast.error("Failed to delete Office Location. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleViewOpen = () => {
    setOpenViewModal(true);
    setAnchorEl(null);
    const fetchBankDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_URL}/api/single-officelocation/${branchID}/${rowId}`
        );
        setLocationData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchBankDetails();
  };

  const handleDeleteClose = () => setOpenDeleteModal(false);
  const handleViewClose = () => setOpenViewModal(false);
  const handleCreateOpen = async () => {
    setOpenCreateModal(true);
    setAnchorEl(null);

    try {
      const response = await axiosInstance.get(
        `${API_URL}/api/edit-officelocation/${branchID}/${rowId}`
      );
      // console.log("dd", response.data);
      // setFormData(response.data);

      if (
        response.status === 200 ||
        response.status === 200 ||
        response.data.success
      ) {
        const branchData = response.data;

        // console.log("Branch Data:", branchData);

        // Find the matching country, state, and city based on the received data
        const country = countries.find((c) => c.name === branchData.country);
        const state = country
          ? State.getStatesOfCountry(country.isoCode).find(
              (s) => s.name === branchData.state
            )
          : null;
        const city = state
          ? City.getCitiesOfState(country.isoCode, state.isoCode).find(
              (ci) => ci.name === branchData.city
            )
          : null;

        // Set the form data with the received branch data
        setFormData({
          location: branchData.location,
          contact: branchData.contact,
          address: branchData.address,
          country: branchData.country,
          state: branchData.state,
          city: branchData.city,
        });

        // Set selected country, state, and city
        setSelectedCountry(country);
        setSelectedState(state);
        setSelectedCity(city);

        // Update states and cities lists based on the selected country and state
        setStates(country ? State.getStatesOfCountry(country.isoCode) : []);
        setCities(
          state ? City.getCitiesOfState(country.isoCode, state.isoCode) : []
        );

        // Dispatch action to fetch client details
        // dispatch(fetchClientDetails(id));
      } else {
        throw new Error("Failed to load Branch data.");
      }
    } catch (error) {
      console.error("Error fetching Office Location data:", error);
      toast.error("Failed to load Office Location data. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleCreateClose = () => setOpenCreateModal(false);
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_URL}/api/edit-officelocation/${branchID}/${rowId}`
        );
        // console.log("ddd",response.data)
        setLocationData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchLocationDetails();
  }, [branchID, rowId]);

  return (
    <>
      {/* <ToastContainer /> */}
      <div>
        <Modal
          open={openViewModal}
          onClose={handleViewClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
        >
          <Box sx={style}>
            {/* Title */}
            <Typography
              variant="h5"
              className="text-center border-b-2 border-[#366FA1] pb-3"
            >
              Details View
            </Typography>

            {locationData && (
              <>
                <div className="px-2 sm:px-4 mt-4 w-full">
                  {/* GRID → Mobile:1 column / Tablet+:2 column */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Location */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-1">
                      <Typography className="font-semibold text-gray-700 mb-1">
                        Location:
                      </Typography>
                      <p className="text-gray-800 text-[15px]">
                        {locationData.location}
                      </p>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-1">
                      <Typography className="font-semibold text-gray-700 mb-1">
                        Contact No.:
                      </Typography>
                      <p className="text-gray-800 text-[15px]">
                        {locationData.contact}
                      </p>
                    </div>

                    {/* State */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-1">
                      <Typography className="font-semibold text-gray-700 mb-1">
                        State:
                      </Typography>
                      <p className="text-gray-800 text-[15px]">
                        {locationData.state}
                      </p>
                    </div>

                    {/* Country */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-1">
                      <Typography className="font-semibold text-gray-700 mb-1">
                        Country:
                      </Typography>
                      <p className="text-gray-800 text-[15px]">
                        {locationData.country}
                      </p>
                    </div>

                    {/* City */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-1">
                      <Typography className="font-semibold text-gray-700 mb-1">
                        City:
                      </Typography>
                      <p className="text-gray-800 text-[15px]">
                        {locationData.city}
                      </p>
                    </div>
                  </div>

                  {/* Address (Full width always) */}
                  <div className="mt-4 flex flex-col lg:flex-row lg:items-center gap-1">
                    <Typography className="font-semibold text-gray-700 mb-1">
                      Address:
                    </Typography>
                    <p className="text-gray-800 text-[15px] leading-relaxed">
                      {locationData.address}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <DialogFooter className="mt-5 flex justify-end gap-3">
                  <Button color="red" onClick={handleViewClose}>
                    Cancel
                  </Button>

                  <Button className="bg-primary" onClick={handleViewClose}>
                    Confirm
                  </Button>
                </DialogFooter>
              </>
            )}
          </Box>
        </Modal>
      </div>

      {/* //////////////////////////Update Data Modal open//////// */}

      <div>
        <Modal open={openCreateModal} onClose={handleCreateClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "95%", sm: "90%", lg: "850px" },
              maxHeight: "90vh",
              overflowY: "auto",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: "10px",
              p: { xs: 2, sm: 3, md: 4 },
            }}
          >
            {/* TITLE */}
            <Typography
              variant="h5"
              className="text-center border-b-2 border-[#366FA1] pb-3"
            >
              Update Office Location Details
            </Typography>

            <form className="my-5 w-full" onSubmit={handleSubmit}>
              {/* MASTER GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Location (full width) */}
                <div className="lg:col-span-4">
                  <Typography className="font-semibold mb-1">
                    Location
                  </Typography>
                  <Input
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900
             placeholder:text-gray-500 placeholder:opacity-100
             focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    labelProps={{ className: "hidden" }}
                  />
                </div>

                {/* Contact */}
                <div className="lg:col-span-2">
                  <Typography className="font-semibold mb-1">
                    Contact
                  </Typography>
                  <Input
                    name="contact"
                    type="number"
                    placeholder="Contact Number"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900
             placeholder:text-gray-500 placeholder:opacity-100
             focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    labelProps={{ className: "hidden" }}
                  />
                </div>

                {/* Country */}
                <div className="lg:col-span-2">
                  <Typography className="font-semibold mb-1">
                    Country
                  </Typography>
                  <Autocomplete
                    options={countries}
                    getOptionLabel={(o) =>
                      typeof o === "string" ? o : `${o.flag} ${o.name}`
                    }
                    value={selectedCountry}
                    onChange={(e, v) => handleCountryChange(v)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
                        placeholder="Select Country"
                      />
                    )}
                  />
                </div>

                {/* State */}
                <div className="lg:col-span-2">
                  <Typography className="font-semibold mb-1">State</Typography>
                  <Autocomplete
                    options={states}
                    getOptionLabel={(o) => o.name}
                    isOptionEqualToValue={(o, v) => o.name === v.name}
                    value={selectedState}
                    onChange={(e, v) => {
                      setSelectedState(v);
                      handleStateChange(v);
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
                </div>

                {/* City */}
                <div className="lg:col-span-2">
                  <Typography className="font-semibold mb-1">City</Typography>
                  <Autocomplete
                    options={cities}
                    getOptionLabel={(o) => o.name}
                    isOptionEqualToValue={(o, v) => o.name === v.name}
                    value={selectedCity}
                    onChange={(e, v) => {
                      setSelectedCity(v);
                      setFormData({ ...formData, city: v?.name });
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
                </div>

                {/* Address full width */}
                <div className="lg:col-span-4">
                  <Typography className="font-semibold mb-1">
                    Address
                  </Typography>
                  <Input
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="!border !border-[#cecece] bg-white py-1 text-gray-900
             placeholder:text-gray-500 placeholder:opacity-100
             focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    labelProps={{ className: "hidden" }}
                  />
                </div>
              </div>

              {/* FOOTER */}
              <DialogFooter className="mt-4 gap-4">
                <Button onClick={handleCreateClose} color="red">
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

      {/* /////////////////////////////delete modal//////////////////// */}

      <div>
        <Modal
          open={openDeleteModal}
          onClose={handleDeleteClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              className="text-center border-b-2 border-[#366FA1] pb-3"
            >
              Delete
            </Typography>

            <div>
              <div className="w-full max-w-md mx-auto pb-7">
                <div className="my-8 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-14 fill-red-500 inline"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                      data-original="#000000"
                    />
                    <path
                      d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                      data-original="#000000"
                    />
                  </svg>
                  <h4 className="text-gray-800 text-lg font-semibold mt-4">
                    Are you sure you want to delete it?
                  </h4>
                  <p className="text-sm text-gray-600 mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    auctor auctor arcu, at fermentum dui. Maecenas
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <button
                    type="button"
                    onClick={handleDeleteID}
                    className="px-4 py-2 rounded-lg text-white text-sm tracking-wide bg-red-500 hover:bg-red-600 active:bg-red-500"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteClose}
                    className="px-4 py-2 rounded-lg text-gray-800 text-sm tracking-wide bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      </div>

      <div>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: "20ch",
              },
            },
          }}
        >
          <MenuItem onClick={handleViewOpen}>View</MenuItem>
          <MenuItem onClick={handleCreateOpen}>Update</MenuItem>
          {role === "superuser" && (
            <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
          )}
        </Menu>
      </div>
    </>
  );
}
