

import { Button, DialogFooter } from "@material-tailwind/react";
import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import { useState } from "react";
import { Input, Typography } from "@material-tailwind/react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
// import TdsSectionCreationPayment from "./TdsSectionCreationPayment";
import TdsSectionPayment from "./TdsSectionPayments";

// import { fetchClientDetails } from "../../Redux/clientSlice";
// import { fetchClientDetails } from "@/Redux/clientSlice";

// import { fetchClientDetails } from "../../Redux/clientSlice";
import { fetchClientDetails } from "../../../Redux/clientSlice";
import TdsSection from "../Tdssection/TdsSection";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const styleCreateSectionMOdal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1100,
    bgcolor: "background.paper",
    //   border: "1px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
};
function TdsSectionPayments({ tdsSectionData }) {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [opensectionModal, setOpenSectionModal] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleSectionOpen = () => {
        setOpenSectionModal(true);
        setAnchorEl(null);
    }

    const handleSectionClose = () => setOpenSectionModal(false);



    return (
        <>
            {/* <ToastContainer /> */}
            <div>
                <Modal
                    open={opensectionModal}
                    onClose={handleSectionClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={styleCreateSectionMOdal}>
                        <Typography
                            id="modal-modal-title"
                            variant="h5"
                            component="h2"
                            className="text-center border-b-2 border-[#366FA1] pb-3"
                        >
                            TDS Section
                        </Typography>
                        {/* <form className=" my-5 w-full " onSubmit={handleSubmit}> */}
                        <div>
                            <div className="mt-4 text-center">
                                <TdsSection tdsSectionData={tdsSectionData} />
                            </div>

                        </div>
                        {/* </form> */}
                    </Box>
                </Modal>
            </div>
            <Button
                conained="conained"
                size="md"
                className="bg-primary hover:bg-[#2d5e85]"
                onClick={handleSectionOpen}
            >
                TDS Section
            </Button>
        </>
    );
}

export default TdsSectionPayments;




