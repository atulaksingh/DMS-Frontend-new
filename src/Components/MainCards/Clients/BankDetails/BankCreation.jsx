import { Button, DialogFooter } from "@material-tailwind/react";
import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import { useState } from "react";
import { Input, Typography } from "@material-tailwind/react";
import {  toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchClientDetails } from "../../../Redux/clientSlice";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const styleCreateMOdal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  width: "95%",        // All mobile screens
  maxWidth: "650px",   // Medium / Laptop
  backgroundColor: "white",
  boxShadow: 24,
  borderRadius: "12px",

  maxHeight: "90vh",    // Mobile safe area
  overflowY: "auto",    // Scroll if content is long

  padding: "20px",
};


function BankCreation() {
  const { id } = useParams();
  const role = getUserRole();
  // console.log("Role from token:", getUserRole());

  // console.log("ddddddddddddd",id)
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch(); // To dispatch actions for fetching client details
  // const history = useHistory(); // For redirecting after successful form submission
  const open = Boolean(anchorEl);
  const handleCreateOpen = () => {
    setOpenCreateModal(true);
    setAnchorEl(null);
  };

  const [bankErrors, setBankErrors] = useState({});

  const handleCreateClose = () => setOpenCreateModal(false);
  const [formData, setFormData] = useState({
    account_no: "",
    bank_name: "",
    ifsc: "",
    account_type: "",
    branch: "",
    files: [],
  });

  const bankRules = {
    account_no: [
      { test: (v) => v.length > 0, message: "Bank Account number is required" },
      {
        test: (v) => /^\d{9,18}$/.test(v),
        message: "Bank Account number must be 9 to 18 digits",
      },
    ],
    bank_name: [
      { test: (v) => v.length > 0, message: "Bank name is required" },
      // { test: v => /^[A-Za-z\s]+$/.test(v), message: "Bank name can only contain alphabets and spaces" },
    ],
    ifsc: [
      { test: (v) => v.length > 0, message: "Bank IFSC code is required" },
      // { test: (v) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v), message: "IFSC must be in format: 4 letters, 0, followed by 6 characters (e.g., SBIN0001234)" },
    ],
    account_type: [
      { test: (v) => v.length > 0, message: "Bank Account type is required" },
      // { test: v => ["savings", "current", "salary"].includes(v.toLowerCase()), message: "Account type must be Savings, Current, or Salary" },
    ],
    branch: [
      { test: (v) => v.length > 0, message: "Bank Branch name is required" },
      // { test: v => /^[A-Za-z0-9\s,']+$/.test(v), message: "Branch can only contain letters, numbers and spaces" },
    ],
    // files: [
    //   { test: v => v && v.length > 0, message: "At least one file is required" },
    //   {
    //     test: v => v.every(f =>
    //       f.type === "application/pdf" ||
    //       f.type.startsWith("image/") ||
    //       f.type === "application/vnd.ms-excel" ||
    //       f.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    //       f.type === "text/plain"
    //     ),
    //     message: "Only PDF, Image, Excel, or TXT files are allowed"
    //   },
    // ],
    files: [
      {
        test: (v) => Array.isArray(v) && v.length > 0,
        message: "Bank At least one file is required",
      },
      // {
      //   test: (v) =>
      //     Array.isArray(v) &&
      //     v.every(
      //       (f) =>
      //         f.type === "application/pdf" ||
      //         f.type.startsWith("image/") ||
      //         f.type === "application/vnd.ms-excel" ||
      //         f.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      //         f.type === "text/plain"
      //     ),
      //   message: "Only PDF, Image, Excel, or TXT files are allowed",
      // },
    ],
  };

  const validateBankField = (name, value) => {
    const fieldRules = bankRules[name];
    if (!fieldRules) return "";
    for (let rule of fieldRules) {
      if (!rule.test(value)) return rule.message;
    }
    return "";
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // FileList → Array

    setFormData((prev) => ({
      ...prev,
      files: selectedFiles, // store as array
    }));

    // validate with correct array
    const errorMsg = validateBankField("files", selectedFiles);
    setBankErrors((prev) => ({ ...prev, files: errorMsg }));
  };

  const [attachment, setAttachment] = useState(null); // State for file input

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const errorMsg = validateBankField(name, value);
    setBankErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const errorMsg = validateBankField(key, value);
      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

    setBankErrors(newErrors);
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
      formDataToSend.append("account_no", formData.account_no);
      formDataToSend.append("bank_name", formData.bank_name);
      formDataToSend.append("ifsc", formData.ifsc);
      formDataToSend.append("account_type", formData.account_type);
      formDataToSend.append("branch", formData.branch);

      // Append multiple files if selected
      for (let i = 0; i < formData.files.length; i++) {
        formDataToSend.append("files", formData.files[i]);
      }

      // Make a POST request to your API
      const response = await axiosInstance.post(
        `${API_URL}/api/create-bank/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("bank", response);
      // Check if the response indicates success
      if (response.status === 200 || response.status === 201) {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });

        // Dispatch action to fetch client details

        dispatch(fetchClientDetails({ id, tabName: "Bank" }));
        // Optionally close the modal and reset form
        handleCreateClose();
        setFormData({
          account_no: "",
          bank_name: "",
          ifsc: "",
          account_type: "",
          branch: "",
        });
        setAttachment(null); // Clear the file input
      } else {
        // If response doesn't indicate success, show error toast
        toast.error("Failed to create bank details. Please check your input.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error("Error submitting data:", error);
      toast.error("Failed to create bank details. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
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
              Create Bank Details
            </Typography>
            <form className=" my-5 w-full " onSubmit={handleSubmit}>
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                  <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                    <label htmlFor="account_no">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Account Number
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="number"
                        size="lg"
                        name="account_no"
                        placeholder="Account Number"
                        value={formData.account_no}
                        onChange={handleInputChange}
                        required
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                    <label htmlFor="bank_name">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Bank Name
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="bank_name"
                        placeholder="Bank Name"
                        value={formData.bank_name}
                        onChange={handleInputChange}
                        required
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                    <label htmlFor="account_type">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Account Type
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="account_type"
                        placeholder="Account Type"
                        value={formData.account_type}
                        onChange={handleInputChange}
                        required
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                    <label htmlFor="branch">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Branch
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="branch"
                        placeholder="Branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        required
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                    <label htmlFor="ifsc">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        IFSC Code
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="ifsc"
                        placeholder="IFSC Code"
                        value={formData.ifsc}
                        onChange={handleInputChange}
                        required
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                    <label htmlFor="attachment">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Attachments
                      </Typography>
                    </label>

                    <div className="">
                      <input
                        type="file"
                        name="files"
                        onChange={handleFileChange}
                        required
                        multiple
                        className="file-input file-input-bordered file-input-success w-full max-w-sm"
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
                  name="bank_cancel"
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
      {(role === "superuser" || role === "clientuser") && (
        <Button
          conained="conained"
          size="md"
          className="bg-primary hover:bg-[#2d5e85]"
          onClick={handleCreateOpen}
        >
          Create
        </Button>
      )}
    </>
  );
}
export default BankCreation;
