import { Button, DialogFooter } from "@material-tailwind/react";
import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import axiosInstance, { getUserRole } from "/src/utils/axiosInstance";
import { useState } from "react";
import { Input, Typography } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchClientDetails } from "../../../Redux/clientSlice";
const API_URL = import.meta.env.VITE_API_BASE_URL;
const styleCreateMOdal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 750,
  bgcolor: "background.paper",
  boxShadow: 24,
  paddingTop: "17px",
  paddingInline: "40px",
  borderRadius: "10px",
};
function PurchaseFileCreation() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleCreateOpen = () => {
    setOpenCreateModal(true);
    setAnchorEl(null);
  };
  const handleCreateClose = () => setOpenCreateModal(false);
  const [formData, setFormData] = useState({
    files: [],
  });
  const handleFileChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      files: Array.from(event.target.files),
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.files || formData.files.length === 0) {
      toast.error("Please upload at least one file!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      const formDataToSend = new FormData();

      for (let i = 0; i < formData.files.length; i++) {
        formDataToSend.append("attach_invoice", formData.files[i]);
      }

      const response = await axiosInstance.post(
        `${API_URL}/api/create-purchase/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Purchase Attach Invoice uploaded  successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      dispatch(fetchClientDetails(id));
      handleCreateClose();
      setFormData((prevData) => ({
        ...prevData,
        files: [],
      }));
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to create purchase details. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
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
            <form className=" mt-10 w-full " onSubmit={handleSubmit}>
              <div>
                <div className="grid grid-cols-4 gap-4 ">
                  <div className="col-span-4 ">


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
                      {formData.files && formData.files.length > 0 && (
                        <div className="text-sm text-gray-500 mt-2">
                          <p>Selected files:</p>
                          {formData.files.map((file, index) => (
                            <p key={index} className="text-blue-500">
                              {file.name}
                            </p>
                          ))}
                        </div>
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
        Upload Invoice
      </Button>
    </>
  );
}

export default PurchaseFileCreation;
