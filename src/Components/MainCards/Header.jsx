import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Card,
  IconButton,
  Collapse,
  ListItem,
} from "@material-tailwind/react";
import {
  CubeTransparentIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  RocketLaunchIcon,
  Bars2Icon,
  Bars3Icon,
  XMarkIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import { Input } from "@material-tailwind/react";
import logo from "../../assets/Zacow1.png";
import { Link, useParams } from "react-router-dom";
import { DialogFooter } from "@material-tailwind/react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
// profile menu component
const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
  },
  {
    label: "Edit Profile",
    icon: Cog6ToothIcon,
  },
  {
    label: "Inbox",
    icon: InboxArrowDownIcon,
  },
  {
    label: "Help",
    icon: LifebuoyIcon,
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
  },
];

const nestedMenuItems = [
  {
    title: "Hero",
  },
  {
    title: "Features",
  },
  {
    title: "Testimonials",
  },
  {
    title: "Ecommerce",
  },
];

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

function NavListMenuMaster() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMenuOpen1, setIsMenuOpen1] = React.useState(false);
  const [openNestedMenu, setopenNestedMenu] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { id } = useParams();
  // console.log("idddd",id)
  const renderItems = nestedMenuItems.map(({ title }, key) => (
    <a href="#" key={key}>
      <MenuItem>{title}</MenuItem>
    </a>
  ));
  const [formData, setFormData] = useState({
    files: [],
  });
  // console.log("form",formData)
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleCreateOpen = () => {
    setOpenCreateModal(true);
    setAnchorEl(null);
  };
  const handleFileChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      files: Array.from(event.target.files),
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Create a FormData object
      const formDataToSend = new FormData();

      // Append multiple files if selected
      for (let i = 0; i < formData.files.length; i++) {
        formDataToSend.append("files", formData.files[i]);
      }

      // Make a POST request to your API
      const response = await axios.post(
        `http://127.0.0.1:8000/api/create-sales/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log(response.data); // Handle success response
      toast.success("Upload Invoice  successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      // Optionally close the modal and reset form
      handleCreateClose();
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to create bank details. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleCreateClose = () => setOpenCreateModal(false);
  return (
    <>
      <ToastContainer />
      <React.Fragment>
        {/* <Menu
          open={isMenuOpen}
          handler={setIsMenuOpen}
          placement="bottom"
          allowHover={true}
        >
          <MenuHandler>
            <Typography as="div" variant="small" className="font-medium ">
              <Link to={"/master"}>
                <ListItem
                  className="flex items-center gap-2 py-2 pr-4  font-medium text-white"
                  selected={isMenuOpen || isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen((cur) => !cur)}
                >
                  Master
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`hidden h-3 w-3 transition-transform lg:block ${
                      isMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`block h-3 w-3 transition-transform lg:hidden ${
                      isMobileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </ListItem>
              </Link>
            </Typography>
          </MenuHandler>
          <MenuList className="hidden rounded-xl lg:block ">
         
            <MenuItem onClick={handleCreateOpen}>Upload Invoice</MenuItem>
         
            <Link to="/master?tab=hsn">
              <MenuItem>HSN</MenuItem>
            </Link>
            <Link to="/master?tab=product">
              <MenuItem>Product</MenuItem>
            </Link>
            <Link to="/master?tab=description">
              <MenuItem>Description</MenuItem>
            </Link>
          </MenuList>
        </Menu> */}
        {/* <Menu
          open={isMenuOpen1}
          handler={setIsMenuOpen1}
          placement="bottom"
          allowHover={true}
        >
          <MenuHandler>
            <Typography as="div" variant="small" className="font-medium ">
              <Link to={"/master"}>
                <div
                  className={`flex items-center gap-2 py-2 pr-4 transition-colors duration-200 
        text-white/70 hover:text-white bg-transparent cursor-pointer`}
                  selected={isMenuOpen1 || isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen((cur) => !cur)}
                >
                  Master
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`hidden h-3 w-3 transition-transform lg:block ${
                      isMenuOpen1 ? "rotate-180" : ""
                    }`}
                  />
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`block h-3 w-3 transition-transform lg:hidden ${
                      isMobileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </Link>
            </Typography>
          </MenuHandler>
          <MenuList className="hidden rounded-xl lg:block ">
            <MenuItem onClick={handleCreateOpen}>Upload Invoice</MenuItem>

            <Link to="/master?tab=hsn">
              <MenuItem>HSN</MenuItem>
            </Link>
            <Link to="/master?tab=product">
              <MenuItem>Product</MenuItem>
            </Link>
            <Link to="/master?tab=description">
              <MenuItem>Description</MenuItem>
            </Link>
          </MenuList>
        </Menu> */}
        {/* <Menu
          open={isMenuOpen1}
          handler={setIsMenuOpen1}
          placement="bottom"
          allowHover={true}
        >
          <MenuHandler>
            <Typography as="div" variant="small" className="font-medium ">
              <Link to={"/master"}>
                <div
                  className={`flex items-center gap-2 py-2 pr-4 transition-colors duration-200 
        text-white/70 hover:text-white bg-transparent cursor-pointer`}
                >
                  HSN
                </div>
              </Link>
            </Typography>
          </MenuHandler>
        </Menu> */}

        <Link to="/client-details">
          <div
            className="flex items-center gap-2 py-2 text-sm pr-4 transition-colors duration-200 
        text-white/70 hover:text-white bg-transparent cursor-pointer"
          >
            Client Details
          </div>
        </Link>
        <Link to="/hsn-details">
          {" "}
          <div
            className="flex items-center gap-2 py-2 text-sm pr-4 transition-colors duration-200 
        text-white/70 hover:text-white bg-transparent cursor-pointer"
          >
            HSN Details
          </div>
        </Link>
        <Link to="/product-details">
          {" "}
          <div
            className="flex items-center gap-2 py-2 pr-4 text-sm transition-colors duration-200 
        text-white/70 hover:text-white bg-transparent cursor-pointer"
          >
            Product Details
          </div>
        </Link>
        <Link to="/product-description">
          <div
            className="flex items-center gap-2 py-2 pr-4 text-sm transition-colors duration-200 
        text-white/70 hover:text-white bg-transparent cursor-pointer"
          >
            Product Description
          </div>
        </Link>
      </React.Fragment>

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
                      <input
                        type="file"
                        name="files"
                        onChange={handleFileChange}
                        multiple
                        className="file-input file-input-bordered file-input-success w-full max-w-sm"
                      />
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
    </>
  );
}

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-white p-0.5"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={label}
              onClick={closeMenu}
              className={`flex items-center gap-2 rounded ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? "red" : "inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

// nav list menu
const navListMenuItems = [
  {
    title: "@material-tailwind/html",
    description:
      "Learn how to use @material-tailwind/html, packed with rich components and widgets.",
  },
  {
    title: "@material-tailwind/react",
    description:
      "Learn how to use @material-tailwind/react, packed with rich components for React.",
  },
  {
    title: "Material Tailwind PRO",
    description:
      "A complete set of UI Elements for building faster websites in less time.",
  },
];

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const renderItems = navListMenuItems.map(({ title, description }) => (
    <div key={title}>
      <MenuItem>
        <Typography variant="h6" color="blue-gray" className="mb-1">
          {title}
        </Typography>
        <Typography variant="small" color="gray" className="font-normal">
          {description}
        </Typography>
      </MenuItem>
    </div>
  ));

  return (
    <React.Fragment>
      <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
        {/* <MenuHandler>
          <Typography as="a" href="#" variant="small" className="font-normal">
            <MenuItem className="hidden items-center gap-2 font-medium text-blue-gray-900 lg:flex lg:rounded-full">
              <Square3Stack3DIcon className="h-[18px] w-[18px] text-blue-gray-500" />{" "}
              Pages{" "}
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </MenuItem>
          </Typography>
        </MenuHandler> */}
        <MenuList className="hidden w-[36rem] grid-cols-7 gap-3 overflow-visible lg:grid">
          <Card
            color="blue"
            shadow={false}
            variant="gradient"
            className="col-span-3 grid h-full w-full place-items-center rounded-md"
          >
            <RocketLaunchIcon strokeWidth={1} className="h-28 w-28" />
          </Card>
          <ul className="col-span-4 flex w-full flex-col gap-1">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <MenuItem className="flex items-center gap-2 font-medium text-blue-gray-900 lg:hidden">
        <Square3Stack3DIcon className="h-[18px] w-[18px] text-blue-gray-500" />{" "}
        Pages{" "}
      </MenuItem>
      <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden">
        {renderItems}
      </ul>
    </React.Fragment>
  );
}

// nav list component
const navListItems = [
  // {
  //   label: "Account",
  //   icon: UserCircleIcon,
  // },
  // {
  //   label: "Blocks",
  //   icon: CubeTransparentIcon,
  // },
  // {
  //   label: "Docs",
  //   icon: CodeBracketSquareIcon,
  // },
];

function NavList() {
  return (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      <NavListMenu />
      {navListItems.map(({ label, icon }, key) => (
        <Typography
          key={label}
          as="a"
          href="#"
          variant="small"
          color="gray"
          className="font-medium text-white"
        >
          <MenuItem className="flex items-center gap-2 lg:rounded-full">
            {React.createElement(icon, { className: "h-[18px] w-[18px]" })}
            <span className="text-white"> {label}</span>
          </MenuItem>
        </Typography>
      ))}
      <NavListMenuMaster />
    </ul>
  );
}

function Header() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);

  return (
    <>
      <Navbar className="mx-auto max-w-full p-2  lg:pl-6 bg-[#366FA1] rounded-none bg-opacity-100 border-none py-0">
        <div className="relative mx-auto flex items-center justify-between  text-white ">
          {/* <Typography as="a"  className=""> */}
          <Link to="/master">
            <img
              src={logo}
              alt="Logo"
              className="mr-4 ml-2 h-16 w-28 cursor-pointer py-0.5"
            />
          </Link>
          {/* </Typography> */}
          <div className="hidden lg:block pl-10">
            <NavList />
          </div>
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={toggleIsNavOpen}
            className="ml-auto mr-2 lg:hidden"
          >
            <Bars2Icon className="h-6 w-6" />
          </IconButton>

          <ProfileMenu />
          {/* <Button size="sm" variant="text" color="blue">
          <span>Log In</span>
        </Button> */}

          <Link to="/login/1">
            <Button size="sm" className="bg-[#788c9e] hover:bg-[#2d5e85]">
              Login
            </Button>
          </Link>
        </div>
        <Collapse open={isNavOpen} className="overflow-scroll">
          <NavList />
        </Collapse>
      </Navbar>
    </>
  );
}

export default Header;
