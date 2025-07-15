import { Button, DialogFooter } from "@material-tailwind/react";
import React from "react";
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
function TdsSectionCreation() {
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
        name: "",
    });

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

            // Make a POST request to your API
            const response = await axios.post(
                `http://127.0.0.1:8000/api/create-tdssection`,
                formDataToSend
            );

            if (response.status === 200 || response.status === 201) { // Check if response is successful
                console.log(response.data); // Handle success response
                toast.success(`${response.data.message}`, {
                    position: "top-right",
                    autoClose: 2000,
                });

                // Dispatch fetchClientDetails action
                dispatch(fetchClientDetails(id));

                // Optionally close the modal and reset form
                handleCreateClose();
                setFormData({
                    name: "",
                });
            } else {
                throw new Error(toast.error("Failed to create Tds Payment details. Please try again.", {
                    position: "top-right",
                    autoClose: 2000,
                }));
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            toast.error("Failed to create Tds Payment details. Please try again.", {
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
                    <Box sx={styleCreateMOdal} className="max-h-screen overflow-scroll">
                        <Typography
                            id="modal-modal-title"
                            variant="h5"
                            component="h2"
                            className="text-center border-b-2 border-[#366FA1] pb-3"
                        >
                            Create TDS Sections
                        </Typography>
                        <form className="my-5 w-full" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-4 gap-4">
                                {/* Client Name */}
                                <div className="col-span-4">
                                    <label htmlFor="client_name">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="block font-semibold mb-2"
                                        >
                                            TDS Section Name
                                        </Typography>
                                    </label>
                                    <Input
                                        type="text"
                                        size="lg"
                                        name="name"
                                        placeholder="TDS Section Name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="!border !border-[#cecece] bg-white py-1 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1]"
                                        containerProps={{ className: "min-w-full" }}
                                        labelProps={{
                                            className: "hidden",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Date */}


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
                Create
            </Button>
        </>
    );
}

export default TdsSectionCreation;
