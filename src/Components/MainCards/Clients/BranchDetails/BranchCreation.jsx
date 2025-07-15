import { Button, DialogFooter, Option, Select } from "@material-tailwind/react";
import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import { useState } from "react";
import { Input, Typography } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import { Autocomplete, Stack, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { fetchClientDetails } from "../../../Redux/clientSlice";

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
function BranchCreation() {
  const { id } = useParams();
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
      formDataToSend.append("branch_name", formData.branch_name);
      formDataToSend.append("contact", formData.contact);
      formDataToSend.append("gst_no", formData.gst_no);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("pincode", formData.pincode);

      // Make a POST request to your API
      const response = await axios.post(
        `http://127.0.0.1:8000/api/create-branch/${id}`,
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
        dispatch(fetchClientDetails(id));

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
          <Box sx={styleCreateMOdal}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              className="text-center border-b-2 border-[#366FA1] pb-3"
            >
              Create Branch Details
            </Typography>
            <form className=" my-5 w-full " onSubmit={handleSubmit}>
              <div>
                <div className="grid grid-cols-4 gap-x-[85px]">
                  <div className="col-span-4">
                    <label htmlFor="branch_name">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Branch Name
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="branch_name"
                        placeholder="Branch Name"
                        value={formData.branch_name}
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] !h-[28px] !py-[16px] !px-[10px]"
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="contact">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold  mb-1"
                      >
                        Contact No
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="number"
                        size="lg"
                        name="contact"
                        placeholder="Contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white  text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] !h-[28px] !py-[16px] !px-[10px]"
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="gst_no">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-1 "
                      >
                        Gst No
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="gst_no"
                        placeholder="Gst No"
                        value={formData.gst_no}
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white  text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] !h-[28px] !py-[16px] !px-[10px]"
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="gst_no">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-1 "
                      >
                        Country
                      </Typography>
                    </label>

                    <div className="">
                      <div className="">
                        <div className="">
                          <Stack spacing={1} sx={{ width: 300 }}>
                            {/* <Autocomplete
                              id="country-select"
                              options={countries}
                              freeSolo={false} // Disable free text input if you want to prevent extra clear button
                              disableClearable
                              getOptionLabel={(option) =>
                                `${option.flag} ${option.name}`
                              }
                              onChange={(event, newValue) =>
                                handleCountryChange(newValue)
                              }
                              renderOption={(props, option) => (
                                <li
                                  {...props}
                                  key={option.isoCode}
                                  style={{
                                    padding: "4px 8px",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {option.flag} {option.name}
                                </li>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  value={formData.location || ""}
                                  placeholder="Select Country"
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: 33,
                                      padding: "4px 6px",
                                    },
                                    "& .MuiOutlinedInput-input": {
                                      padding: "4px 6px",
                                    },
                                  }}
                                  InputProps={{
                                    ...params.InputProps,
                                    type: "search",
                                  }}
                                />
                              )}
                            /> */}
                            <Autocomplete
                              id="country-select"
                              options={countries}
                              freeSolo={false}
                              disableClearable
                              getOptionLabel={(option) =>
                                typeof option === "string" ? option : `${option.flag} ${option.name}`
                              }
                              isOptionEqualToValue={(option, value) => option.name === value.name}
                              value={selectedCountry} // your selected country object
                              inputValue={formData.location || ""}
                              onInputChange={(event, newInputValue) => {
                                setFormData({ ...formData, location: newInputValue });

                                const matchedCountry = countries.find(
                                  (country) => country.name.toLowerCase() === newInputValue.toLowerCase()
                                );

                                if (matchedCountry) {
                                  setSelectedCountry(matchedCountry); // select the match
                                  handleCountryChange(matchedCountry);
                                }
                              }}
                              onChange={(event, newValue) => {
                                if (newValue) {
                                  setSelectedCountry(newValue);
                                  setFormData({ ...formData, location: newValue.name });
                                  handleCountryChange(newValue);
                                }
                              }}
                              renderOption={(props, option) => (
                                <li
                                  {...props}
                                  key={option.isoCode}
                                  style={{
                                    padding: "4px 8px",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {option.flag} {option.name}
                                </li>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select Country"
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: 33,
                                      padding: "4px 6px",
                                    },
                                    "& .MuiOutlinedInput-input": {
                                      padding: "4px 6px",
                                    },
                                  }}
                                  InputProps={{
                                    ...params.InputProps,
                                    type: "search",
                                  }}
                                />
                              )}
                            />

                          </Stack>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="gst_no">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-1 "
                      >
                        State
                      </Typography>
                    </label>

                    <div className="">
                      <div className="">
                        <div className="" name="state">
                          <Stack spacing={1} sx={{ width: 300 }}>
                            {/* <Autocomplete
                              id="state-select"
                              options={states}
                              disableClearable
                              getOptionLabel={(option) => option.name}
                              onChange={(event, newValue) =>
                                handleStateChange(newValue)
                              }
                              renderOption={(props, option) => (
                                <li
                                  {...props}
                                  key={option.isoCode}
                                  style={{
                                    padding: "4px 8px",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {option.name}
                                </li>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select State"
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: 33,
                                      padding: "4px 6px",
                                    },
                                    "& .MuiOutlinedInput-input": {
                                      padding: "4px 6px",
                                    },
                                  }}
                                />
                              )}
                            /> */}
                            <Autocomplete
                              id="state-select"
                              options={states}
                              disableClearable
                              getOptionLabel={(option) =>
                                typeof option === "string" ? option : option.name
                              }
                              isOptionEqualToValue={(option, value) => option.name === value.name}
                              value={selectedState} // selected state object
                              inputValue={formData.state || ""}
                              onInputChange={(event, newInputValue) => {
                                setFormData({ ...formData, state: newInputValue });

                                const matchedState = states.find(
                                  (state) => state.name.toLowerCase() === newInputValue.toLowerCase()
                                );

                                if (matchedState) {
                                  setSelectedState(matchedState); // auto-select match
                                  handleStateChange(matchedState);
                                }
                              }}
                              onChange={(event, newValue) => {
                                if (newValue) {
                                  setSelectedState(newValue);
                                  setFormData({ ...formData, state: newValue.name });
                                  handleStateChange(newValue);
                                }
                              }}
                              renderOption={(props, option) => (
                                <li
                                  {...props}
                                  key={option.isoCode}
                                  style={{
                                    padding: "4px 8px",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {option.name}
                                </li>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select State"
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: 33,
                                      padding: "4px 6px",
                                    },
                                    "& .MuiOutlinedInput-input": {
                                      padding: "4px 6px",
                                    },
                                  }}
                                />
                              )}
                            />

                          </Stack>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="gst_no">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-1 mt-2"
                      >
                        City
                      </Typography>
                    </label>

                    <div className="">
                      <div className="">
                        <div className="">
                          <Stack spacing={1} sx={{ width: 300 }}>
                            {/* <Autocomplete
                              id="city-select"
                              options={cities}
                              disableClearable
                              getOptionLabel={(option) => option.name}
                              onChange={(event, newValue) => {
                                setSelectedCity(newValue);
                                setFormData((prevData) => ({
                                  ...prevData,
                                  city: newValue ? newValue.name : "",
                                }));
                              }}
                              renderOption={(props, option) => (
                                <li
                                  {...props}
                                  key={option.name}
                                  style={{
                                    padding: "4px 8px",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {option.name}
                                </li>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select City"
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: 33,
                                      padding: "20px 6px",
                                    },
                                    "& .MuiOutlinedInput-input": {
                                      padding: "20px 6px",
                                    },
                                  }}
                                />
                              )}
                            /> */}
                            <Autocomplete
                              id="city-select"
                              options={cities}
                              disableClearable
                              getOptionLabel={(option) =>
                                typeof option === "string" ? option : option.name
                              }
                              isOptionEqualToValue={(option, value) => option.name === value.name}
                              value={selectedCity} // selected city object
                              inputValue={formData.city || ""}
                              onInputChange={(event, newInputValue) => {
                                setFormData((prevData) => ({
                                  ...prevData,
                                  city: newInputValue,
                                }));

                                const matchedCity = cities.find(
                                  (city) => city.name.toLowerCase() === newInputValue.toLowerCase()
                                );

                                if (matchedCity) {
                                  setSelectedCity(matchedCity);
                                }
                              }}
                              onChange={(event, newValue) => {
                                setSelectedCity(newValue);
                                setFormData((prevData) => ({
                                  ...prevData,
                                  city: newValue ? newValue.name : "",
                                }));
                              }}
                              renderOption={(props, option) => (
                                <li
                                  {...props}
                                  key={option.name}
                                  style={{
                                    padding: "4px 8px",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {option.name}
                                </li>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select City"
                                  sx={{
                                    "& .MuiInputBase-root": {
                                      height: 33,
                                      padding: "4px 6px",
                                    },
                                    "& .MuiOutlinedInput-input": {
                                      padding: "4px 6px",
                                    },
                                  }}
                                />
                              )}
                            />
                          </Stack>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="col-span-2">
                    <label htmlFor="pincode">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-1 mt-2"
                      >
                        Pin Code
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="number"
                        size="lg"
                        name="pincode"
                        placeholder="Pin Code"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] !h-[28px] !py-[16px] !px-[10px]"
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-4">
                    <label htmlFor="address">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-1 mt-2"
                      >
                        Address
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] !h-[28px] !py-[16px] !px-[10px]"
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

export default BranchCreation;
