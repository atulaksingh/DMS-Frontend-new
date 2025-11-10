import { Button, DialogFooter } from "@material-tailwind/react";
import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import { useState } from "react";
import { Input, Typography } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { fetchClientDetails } from "../../Redux/clientSlice";
// import { fetchClientDetails } from "@/Redux/clientSlice";

// import { fetchClientDetails } from "../../Redux/clientSlice";
import { fetchClientDetails } from "../../../Redux/clientSlice";

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
function TdsPaymentFileCreation() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleCreateOpen = () => {
    setOpenCreateModal(true);
    setAnchorEl(null);
  };
  const handleDownloadTemplate = async () => {
    try {
      // API call to get the file URL
      const response = await axiosInstance.get(`${API_URL}/api/get-excel-file`);
      console.log("API Response:", response.data); // Debugging line

      if (response.data && response.data.length > 0) {
        // Get the file path from the API response
        const filePath = response.data[1].file; // Ensure correct index

        // Construct the complete file URL
        const fileUrl = `${API_URL}${filePath}`;
        console.log("File URL:", fileUrl); // Debugging line

        // Create an anchor element to download the file
        const anchor = document.createElement("a");
        anchor.href = fileUrl;
        anchor.setAttribute("download", filePath.split("/").pop()); // Extract file name
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      } else {
        alert("File not found!");
      }
    } catch (error) {
      console.error("Error downloading the file:", error);
      alert("Failed to download the file. Please try again.");
    }
  };

  const handleCreateClose = () => setOpenCreateModal(false);

  const [attachment, setAttachment] = useState(null); // State for file input

  // Handle file input change
  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Create a FormData object
      const formDataToSend = new FormData();

      // Append file field to FormData
      if (attachment) {
        formDataToSend.append("file", attachment);
      }

      // Make a POST request to your API
      const response = await axiosInstance.post(
        `${API_URL}/api/create-tdsfile/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Check if the response status is 200 (success)
      if (response.status === 200 || response.status === 201) {
        // Show success toast
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });

        // console.log(response.data);

        //  Wait for Redux to reload data before closing modal
        await dispatch(fetchClientDetails({ id, tabName: "TDSPayment" }));

        //  Slight delay for UI re-render
        setTimeout(() => {
          handleCreateClose();
        }, 300);
        setAttachment(null); // Clear the file input
      }
    } catch (error) {
      // Show error toast
      // toast.error("Failed to create PF File details. Please try again.", {
      toast.error(
        `${error.response.data.error_message || error.response.data.message}`,
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
      console.error("Error submitting data:", error);
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
              File Import
            </Typography>
            <form className=" my-5 w-full " onSubmit={handleSubmit}>
              <div>
                <div className="mt-4 text-center">
                  <button
                    onClick={handleDownloadTemplate}
                    type="button"
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Download Excel Template
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-2">
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
                      <div className="">
                        <div className="flex items-center justify-center bg-grey-lighter">
                          <label className="w-52 flex flex-col items-center px-2 py-4 bg-white text-[#366FA1] rounded-lg shadow-lg tracking-wide uppercase border border-[#366FA1] cursor-pointer hover:bg-[#366FA1] hover:text-white">
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                            </svg>
                            <span className="mt-2 text-base leading-normal">
                              Select a file
                            </span>
                            <input
                              name="file"
                              type="file"
                              className="hidden"
                              multiple
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                      </div>
                      {attachment && (
                        <p className="mt-2 text-sm text-gray-700">
                          Selected file: {attachment.name}
                        </p>
                      )}
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
        File Import
      </Button>
    </>
  );
}

export default TdsPaymentFileCreation;
