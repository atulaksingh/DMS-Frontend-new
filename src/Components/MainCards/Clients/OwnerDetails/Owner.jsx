import React, { useState, useEffect } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { Checkbox, Input, Typography } from "@material-tailwind/react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Card from "../../Card";
import { Button, DialogFooter } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OwnerCard from "./OwnerCard";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchClientDetails } from "../../../Redux/clientSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
// import { DialogFooter, Button } from "@material-tailwind/react";
const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});

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
function Owner({ ownerData }) {
  if (!ownerData) return <div>No owner data available</div>;
  const [ownerShare, setOwnerShare] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const { id } = useParams();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    owner_name: "",
    share: "",
    pan: "",
    aadhar: "",
    email: "",
    it_password: "",
    mobile: "",
    username: "",
    isadmin: false,
    is_active: true,
  });
  const notify = (message, type = "success") => {
    toast[type](message, { position: "top-right", autoClose: 1000 });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // const handleCheckboxChange = (e) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     isadmin: e.target.checked,  // Update isadmin based on checkbox state
  //     is_active: e.target.checked, // Update is_active based on checkbox state
  //   }));
  // };
  // console.log("formmmowner", ownerShare);
  const handleCheckboxChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      isadmin: e.target.checked,  // Update isadmin based on checkbox state
      // is_active: e.target.checked, // Update is_active based on checkbox state
    }));
  };

  const handleActiveCheckboxChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      // isadmin: e.target.checked,  // Update isadmin based on checkbox state
      is_active: e.target.checked, // Update is_active based on checkbox state
    }));
  };



  const createOwnerShare = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/create-owner/${id}`,
        formData
      );
      setOwnerShare(response?.data?.remaining_shares)

    } catch (error) {
      console.error("Error creating owner:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };
  useEffect(() => {

    if (id) {
      createOwnerShare();
    }
  }, [id,]); // Re-run if `id` or `formData` changes

  const handleSubmit = async (e) => {
    // console.log("enter");
    e.preventDefault(); // Prevent default form submission

    try {
      // Make a POST request to your API
      const response = await axios.post(
        `http://127.0.0.1:8000/api/create-owner/${id}`,
        formData
      );
      console.log(response.data); // Handle success response


      if (response.status === 200 || response.status === 201) {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
        createOwnerShare()
        dispatch(fetchClientDetails(id));
        handleCreateClose();
        // setErrorMessage("");
        setFormData({
          owner_name: "",
          share: "",
          pan: "",
          aadhar: "",
          email: "",
          it_password: "",
          mobile: "",
          username: "",
          // isadmin: "",
          // is_active: "",
        });

      } else {
        toast.error(`${response.data.error_message || response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
      }





    } catch (error) {
      setErrorMessage("Error submitting data. Please try again.");
      console.error("Error submitting data:1111", error);
      // toast.error(` ${error.response.data.error_message && error.response.data.message}`, {
      //   position: "top-right",
      //   autoClose: 2000,
      // });
      const backendMessage = error.response?.data?.message || error.response?.data?.error_message || "An error occurred";
      const backendErrors = error.response?.data?.error_message;

      // If error_message is an object (like { email: [...] }), extract and join all messages
      let detailedErrors = "";
      if (backendErrors && typeof backendErrors === "object") {
        detailedErrors = Object.entries(backendErrors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join(" | ");
      }
      toast.error(`${backendMessage}${detailedErrors ? ` | ${detailedErrors}` : ""}`, {
        position: "top-right",
        autoClose: 2000,
      });
      // Handle error here, show a notification if necessary
    }
  };

  const calculateTableBodyHeight = () => {
    const rowHeight = 80; // Approximate height for one row
    const maxHeight = 525; // Maximum table body height
    const calculatedHeight = ownerData.length * rowHeight;
    return calculatedHeight > maxHeight
      ? `${maxHeight}px`
      : `${calculatedHeight}px`;
  };
  const [errorMessage, setErrorMessage] = useState("");
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState(
    calculateTableBodyHeight
  );
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [searchBtn, setSearchBtn] = useState(true);
  const [downloadBtn, setDownloadBtn] = useState(true);
  const [printBtn, setPrintBtn] = useState(true);
  const [viewColumnBtn, setViewColumnBtn] = useState(true);
  const [filterBtn, setFilterBtn] = useState(true);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleCreateOpen = () => {
    setOpenCreateModal(true);
    setAnchorEl(null);
  };

  const handleCreateClose = () => setOpenCreateModal(false);
  useEffect(() => {
    setTableBodyHeight(calculateTableBodyHeight());
  }, [ownerData]);

  const columns = [
    {
      name: "owner_name",
      label: "Name",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "share",
      label: "Share",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "pan",
      label: "PAN",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "aadhar",
      label: "Aadhar",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "mobile",
      label: "Mobile",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    {
      name: "is_active",
      label: "Status",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return value ? "Active" : "InActive";
        },
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
    // {
    //   name: "it_password",
    //   label: "Password",
    //   options: {
    //     setCellHeaderProps: () => ({
    //       style: {
    //         backgroundColor: "#366FA1",
    //         color: "#ffffff",
    //       },
    //     }),
    //   },
    // },
    {
      name: "Actions",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const rowData = ownerData[dataIndex];
          return (
            <div>
              <OwnerCard rowId={rowData.id} createOwnerShare={createOwnerShare} ownerShare={ownerShare} />
            </div>
          );
        },
        setCellHeaderProps: () => ({
          style: {
            backgroundColor: "#366FA1",
            color: "#ffffff",
          },
        }),
      },
    },
  ];

  const options = {
    search: searchBtn,
    download: downloadBtn,
    print: printBtn,
    viewColumns: viewColumnBtn,
    filter: filterBtn,
    filterType: "dropdown",
    responsive,
    tableBodyHeight,
    tableBodyMaxHeight,
    onTableChange: (action, state) => {
      // console.log(action);
      // console.dir(state);
    },
    selectableRows: "none",
    selectableRowsHeader: false,
    rowsPerPage: 13,
    rowsPerPageOptions: [13, 25, 50, 100],
    page: 0,
  };

  const theme = createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: "#366FA1",
            paddingBlock: "2px",
            color: "#ffffff !important",
            "&.MuiTableSortLabel-root": {
              color: "#ffffff !important",
              "&:hover": {
                color: "#ffffff !important",
              },
              "&.Mui-active": {
                color: "#ffffff !important",
                "& .MuiTableSortLabel-icon": {
                  color: "#ffffff !important",
                },
              },
            },
          },
          body: {
            paddingBlock: "0px",
          },
        },
      },
    },
  });

  return (
    <>
      <ToastContainer />
      {/* //////////////////////////Create Data Modal open//////// */}
      {/* {console.log("hhhhhhhh",ownerShare)} */}
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
              Create Owner Details
            </Typography>
            <form className=" my-5 w-full " onSubmit={handleSubmit}>
              <div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3">
                    <label htmlFor="owner_name">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Owner Name
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="owner_name"
                        placeholder="Owner Name"
                        value={formData.owner_name}
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label htmlFor="share">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold mb-2 flex gap-2 "
                      >
                        Share    <div className="text-green-400 text-sm">{ownerShare}% left</div>
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="number"
                        size="lg"
                        name="share"
                        required
                        placeholder="Share"
                        value={formData.share}
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="pan">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Pan Number
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="pan"
                        placeholder="Pan Number"
                        value={formData.pan}
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="aadhar">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Aadhar Number
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="number"
                        size="lg"
                        name="aadhar"
                        placeholder="Aadhar Number"
                        value={formData.aadhar}
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="email">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Email Id
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="email"
                        size="lg"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="email">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        UserName
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="text"
                        size="lg"
                        name="username"
                        placeholder="UserName"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="it_password">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        IT Password
                      </Typography>
                    </label>

                    <div className="">
                      {/* <Input
                        type="password"
                        size="lg"
                        name="it_password"
                        placeholder="Password"
                        value={formData.it_password}
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      /> */}
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          size="lg"
                          name="it_password"
                          placeholder="Password"
                          value={formData.it_password}
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
                    <label htmlFor="aadhar">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Mobile Number
                      </Typography>
                    </label>

                    <div className="">
                      <Input
                        type="number"
                        size="lg"
                        name="mobile"
                        placeholder="Mobile Number"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="!border !border-[#cecece] bg-white py-1 text-gray-900   ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                        labelProps={{
                          className: "hidden",
                        }}
                        containerProps={{ className: "min-w-full" }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="aadhar">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Is Admin
                      </Typography>
                    </label>

                    <div className="">
                      <Checkbox
                        color="blue"
                        name="isadmin"
                        checked={formData.isadmin}
                        onChange={handleCheckboxChange}
                        label="Is Admin"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="aadhar">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-semibold mb-2"
                      >
                        Is Active
                      </Typography>
                    </label>

                    <div className="">
                      <Checkbox
                        color="blue"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleActiveCheckboxChange}
                        label="Is Active"
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
                  conained="filled"
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

      <div>
        <div className="flex justify-between align-middle items-center mb-5">
          <div className="text-2xl text-gray-800 font-semibold">
            Owner Details
          </div>
          <div>
            <Button
              variant="filled"
              size="md"
              className="bg-primary hover:bg-[#2d5e85]"
              onClick={handleCreateOpen}
            >
              Create
            </Button>
          </div>
        </div>
        <CacheProvider value={muiCache}>
          <ThemeProvider theme={theme}>
            <MUIDataTable
              data={ownerData}
              columns={columns}
              options={options}
            />
          </ThemeProvider>
        </CacheProvider>
      </div>
    </>
  );
}

export default Owner;
