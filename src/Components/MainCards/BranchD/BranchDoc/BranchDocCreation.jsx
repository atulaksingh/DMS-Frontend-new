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
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
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
function BranchDocCreation({ fetchBranchDetails }) {
  const { clientID, branchID } = useParams();
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleCreateOpen = () => {
    setOpenCreateModal(true);
    setAnchorEl(null);
  };
  const [formData, setFormData] = useState({
    document_type: "",
    login: "",
    password: "",
    remark: "",
    files: [],
  });

  const handleCreateClose = () => setOpenCreateModal(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Handle file input change
  // Handle file input change
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      files: e.target.files, // Handles multiple files
    }));
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const formDataToSend = new FormData();

      // Append each form field to FormData
      formDataToSend.append("document_type", formData.document_type);
      formDataToSend.append("login", formData.login);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("remark", formData.remark);

      // Append multiple files if selected
      for (let i = 0; i < formData.files.length; i++) {
        formDataToSend.append("files", formData.files[i]);
      }

      // Make a POST request to your API
      const response = await axios.post(
        `http://127.0.0.1:8000/api/create-branchdoc/${branchID}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Check if the response is successful
      if (response.status === 200 || response.status === 201) {
        // Call fetchBranchDetails only on successful response
        fetchBranchDetails();


        setFormData({
          document_type: "",
          login: "",
          password: "",
          remark: "",
          files: [],
        });
        handleCreateClose();

        // Optionally close the modal and reset form
        toast.success("Branch Documents details created successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        // Handle error response (if not 200)
        toast.error("Failed to create Branch documents details. Please try again.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to create Branch details. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
              Create Branch Documents Details
            </Typography>
            <form className=" my-5 w-full " onSubmit={handleSubmit}>
              <div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-4">
                    <div className="">
                      <label htmlFor="document_type">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block  font-semibold  mb-1"
                        >
                          Select File
                        </Typography>
                      </label>

                      <div className="">
                        <Select
                          label="document_type"
                          name="document_type"
                          size="lg"
                          value={formData.document_type}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              document_type: e,
                            }))
                          }
                          animate={{
                            mount: { y: 0 },
                            unmount: { y: 25 },
                          }}
                          className="!border !border-[#cecece] bg-white pt-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                          labelProps={{
                            className: "hidden",
                          }}
                          containerProps={{ className: "min-w-[100px]" }}
                        >
                          <Option value="ptec">PTEC</Option>
                          <Option value="ptrc">PTRC</Option>
                          <Option value="gst">GST</Option>
                          <Option value="eway">EWAY</Option>

                          <Option value="other">Other</Option>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-1"
                      >
                        UserName 
                      </Typography>
                      <Input
                        type="text"
                        size="lg"
                        name="login"
                        value={formData.login}
                        onChange={handleInputChange}
                        placeholder="UserName"
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                        labelProps={{ className: "hidden" }}
                        containerProps={{ className: "min-w-[100px]" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-1"
                      >
                        Password
                      </Typography>


                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          size="lg"
                          name="password"
                          placeholder="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                          labelProps={{
                            className: "hidden",
                          }}
                          containerProps={{ className: "min-w-full" }}
                        />
                        {/* Toggle visibility button */}
                        <button
                          type="button"
                          name="eye-btn"
                          onClick={togglePasswordVisibility}
                          className="absolute top-3 right-3"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>



                    </div>
                  </div>

                  <div className="col-span-2">
                    <div>
                      <label htmlFor="remarks">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-semibold mb-2"
                        >
                          Remark
                        </Typography>
                      </label>

                      <div className="">
                        <Input
                          type="text"
                          size="lg"
                          name="remark"
                          placeholder="Remarks"
                          value={formData.remark}
                          onChange={handleInputChange}
                          className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                          labelProps={{
                            className: "hidden",
                          }}
                          containerProps={{ className: "min-w-[100px]" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-4">
                    <label htmlFor="files">
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

export default BranchDocCreation;
