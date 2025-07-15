import React from "react";

// @components
import {
  Card,
  Input,
  Button,
  CardBody,
  CardHeader,
  Typography,
  Checkbox,
} from "@material-tailwind/react";
import LockIcon from "@mui/icons-material/Lock";
// @icons
import { CpuChipIcon } from "@heroicons/react/24/solid";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import logo from "../assets/Zaco_LOGO.png";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleIcon from "@mui/icons-material/Google";
import ReduxCard from "../Components/ReduxCard";

function Login() {
  return (
    <>
    <div className="bg-image">

      <div className="container mx-auto ">
        <div className="max-w-xl mx-auto pt-20">
          <Card
            shadow={false}
            className="md:px-12 md:py-2 py-8 border border-gray-300 shadow-2xl"
          >
            <CardHeader shadow={false} floated={false} className="text-start ">
              <div>
             
                  <img
                    src={logo}
                    alt="Logo"
                    className=" w-36 mx-auto cursor-pointer py-0.5"
                  />
           
              </div>

              <Typography
                variant="h1"
                color="blue-gray"
                className="mb-1 mt-5 !text-3xl lg:text-lg text-[#366FA1]"
              >
                Sign in
              </Typography>
              <Typography className="!text-gray-800 text-[14px] font-normal md:max-w-sm">
                Enter your email and password to login
              </Typography>
            </CardHeader>
            <CardBody>
              <form action="#" className="flex flex-col gap-4 md:mt-1">
                <div>
                  <label htmlFor="email">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      Your Email
                    </Typography>
                  </label>

                  <div className="">
                    <Input
                      type="email"
                      placeholder="Email Address"
                      className="!border !border-[#366FA1] bg-white text-gray-900 shadow-lg  ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                      labelProps={{
                        className: "hidden",
                      }}
                      containerProps={{ className: "min-w-[100px]" }}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="passowrd">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-semibold mb-2"
                    >
                      Your Password
                    </Typography>
                  </label>

                  <div className="">
                    <Input
                      type="password"
                      placeholder="Password"
                      className="!border !border-[#366FA1] bg-white text-gray-900 shadow-lg  ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#366FA1] focus:!border-t-[#366FA1] "
                      labelProps={{
                        className: "hidden",
                      }}
                      containerProps={{ className: "min-w-[100px]" }}
                    />
                  </div>
                </div>
                <Checkbox
                  className="h-4 w-4 py-0"
                  label={
                    <div>
                      <Typography
                        color="blue-gray"
                        className="font-medium text-sm "
                      >
                        Remember Me
                      </Typography>
                    </div>
                  }
                />
                <Button size="md" className="bg-[#366FA1] text-white" fullWidth>
                  Continue
                </Button>
              </form>
              <div className="text-[15px] font-semibold my-2.5 text-center">
                Sign in with
              </div>

              <div className="flex justify-center align-middle items-center gap-3">
                <div className="bg-[#366FA1] w-fit  rounded-full p-1.5 cursor-pointer">
                  <FacebookOutlinedIcon className="text-white " />
                </div>
                <div className="bg-[#50A5F1] w-fit  rounded-full p-1.5 cursor-pointer">
                  <TwitterIcon className="text-white " />
                </div>
                <div className="bg-[#F46A6A] w-fit  rounded-full p-1.5 cursor-pointer">
                  <GoogleIcon className="text-white h-4 w-4" />
                </div>
              </div>

              <div className="flex justify-center align-middle items-center gap-1 my-1">
                <div>
                  <LockIcon fontSize="" className="text-[13px] mb-1" />
                </div>
                <div className="text-[14px] font-medium cursor-pointer">
                  Forgot your password?
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>


    <ReduxCard />
    </>
  );
}

export default Login;
