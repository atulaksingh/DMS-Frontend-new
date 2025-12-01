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
import { Country, State, City } from "country-state-city";
import axios from "axios";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { Autocomplete, Stack } from "@mui/material";
import { TextField } from "@mui/material";
import { fetchClientDetails } from "../../../Redux/clientSlice";
import { useDispatch } from "react-redux";
const options = ["None", "Atria", "Callisto"];
const API_URL = import.meta.env.VITE_API_BASE_URL;
const style = {
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
};

const ITEM_HEIGHT = 48;

export default function BranchCard({ rowId }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const role = getUserRole();
  // console.log("rowIdBranch", rowId);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

  const [branchErrors, setBranchErrors] = useState({});

  const branchRules = {
    branch_name: [
      { test: (v) => v.length > 0, message: "Branch name is required" },
      {
        test: (v) => /^[A-Za-z0-9\s,']+$/.test(v),
        message:
          "Branch name can only contain letters, numbers, commas, apostrophes, and spaces",
      },
    ],
    contact: [
      // { test: v => v.length > 0, message: "Contact number is required" },
      {
        test: (v) => /^\d{10}$/.test(v),
        message: "Contact number must be exactly 10 digits",
      },
    ],
    gst_no: [
      { test: (v) => v.length > 0, message: "GST number is required" },
      // { test: v => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v), message: "GST number must be valid (e.g., 22AAAAA0000A1Z5)" },
      {
        test: (v) => v.length === 15,
        message: "GST number must be exactly 15 characters long",
      },
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
      // { test: v => v.length > 0, message: "Pincode is required" },
      {
        test: (v) => /^\d{6}$/.test(v),
        message: "Pincode must be exactly 6 digits",
      },
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
  // Handle file input change
  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    let hasError = false;
    for (let [field, value] of Object.entries(formData)) {
      const errorMsg = validateBranchField(field, value);
      if (errorMsg) {
        toast.error(errorMsg);
        hasError = true;
        break; // stop at first error
      }
    }

    if (hasError) return;

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
        `${API_URL}/api/edit-branch/${id}/${rowId}`,
        formDataToSend
      );
      // console.log("response",response)
      // Check if the response is successful
      if (response.status === 200 || response.status === 201) {
        toast.success(`${response.data.message}`, {
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
      toast.error("Failed to update Branch details. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
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
        `${API_URL}/api/delete-branch/${id}/${deleteId}`
      );
      // console.log("res-----Branch---->", response);

      setOpenDeleteModal(false);
      if (response.status === 200 || response.status === 201) {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
        // dispatch(fetchClientDetails(id));
        dispatch(fetchClientDetails({ id, tabName: "Branch" }));
      } else {
        toast.error("Failed to delete Branch. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting Branch data:", error);
      toast.error("Failed to delete Branch. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleViewOpen = () => {
    setOpenViewModal(true);
    setAnchorEl(null);
  };

  const handleDeleteClose = () => setOpenDeleteModal(false);
  const handleViewClose = () => setOpenViewModal(false);
  const handleCreateOpen = async () => {
    setAnchorEl(null);
    setOpenCreateModal(true);

    try {
      const response = await axiosInstance.get(
        `${API_URL}/api/edit-branch/${id}/${rowId}`
      );

      // Check if the response is successful
      if (response.status === 200 || response.data.success) {
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
          branch_name: branchData.branch_name,
          contact: branchData.contact,
          gst_no: branchData.gst_no,
          country: branchData.country,
          state: branchData.state,
          city: branchData.city,
          address: branchData.address,
          pincode: branchData.pincode,
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

        // dispatch(fetchClientDetails({ id, tabName: "Branch" }));
      } else {
        throw new Error("Failed to load Branch data.");
      }
    } catch (error) {
      console.error("Error fetching Branch data:", error);
      toast.error("Failed to load Branch data. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleCreateClose = () => setOpenCreateModal(false);
  const [bankData, setBankData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <>
      {/* <ToastContainer /> */}

      {/* //////////////////////////Update Data Modal open//////// */}

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
              Update Branch Details
            </Typography>

            <form className="my-5 w-full" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Branch Name — full width */}
                <div className="lg:col-span-2">
                  <Typography className="block font-semibold mb-2">
                    Branch Name
                  </Typography>
                  <Input
                    type="text"
                    name="branch_name"
                    value={formData.branch_name}
                    onChange={handleInputChange}
                    placeholder="Branch Name"
                    className="!w-full !border !border-[#cecece] bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
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
                    className="!w-full !border !border-[#cecece] bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
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
                    className="!w-full !border !border-[#cecece] bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
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

                {/* State */}
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

                {/* Pincode */}
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
                    className="!w-full !border !border-[#cecece] bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    labelProps={{ className: "hidden" }}
                  />
                </div>

                {/* Address — full width */}
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
                    className="!w-full !border !border-[#cecece] bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                    labelProps={{ className: "hidden" }}
                  />
                </div>
              </div>

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
          {/*   */}
          <Link to={`/clientDetails/branchDetails/${id}/${rowId}`}>
            <MenuItem>View</MenuItem>
          </Link>
          <MenuItem onClick={handleCreateOpen}>Update</MenuItem>
          {role === "superuser" && (
            <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
          )}
        </Menu>
      </div>
    </>
  );
}
