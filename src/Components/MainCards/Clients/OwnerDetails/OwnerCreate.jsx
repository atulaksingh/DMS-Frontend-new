import { Button, DialogFooter } from "@material-tailwind/react";
import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
function OwnerCreate() {

  return (
    <>
      {/* //////////////////////////Create Data Modal open//////// */}

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
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
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
                          className="block font-semibold mb-2"
                        >
                          Share
                        </Typography>
                      </label>

                      <div className="">
                        <Input
                          type="number"
                          size="lg"
                          name="share"
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
                          Email
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
                      <label htmlFor="password">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="block font-semibold mb-2"
                        >
                          Password
                        </Typography>
                      </label>

                      <div className="">
                        <Input
                          type="password"
                          size="lg"
                          name="password"
                          placeholder="Password"
                          value={formData.password}
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
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreateClose}
                    variant="text"
                    color="red"
                    className="mr-1 "
                  >
                    <span>Cancel</span>
                  </Button>
                  <Button
                    name="owner-confirm"
                    variant="contained"
                    type="submit"
                    // name="owner-confirm"
                    //   color="green"
                    // onClick={handleCreateClose}
                    className="bg-primary"
                  >
                    <span >Confirm</span>
                  </Button>
                </DialogFooter>
              </Typography>
            </form>
          </Box>
        </Modal>
      </div>
      <Button
        variant="conained"
        size="md"
        name="owner-crt"
        className="bg-primary hover:bg-[#2d5e85]"
      //   onClick={handleCreateOpen}
      >
        Create
      </Button>
    </>
  );
}

export default OwnerCreate;
