import React, { Suspense, lazy, memo } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

//  Protected Route
const ProtectedRoute = () => {
  const user = localStorage.getItem("user");
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

//  Public Route
const PublicRoute = () => {
  const user = localStorage.getItem("user");
  return user ? <Navigate to="/client-details" replace /> : <Outlet />;
};

//  Protected Layout
const Header = lazy(() => import("./Components/MainCards/Header"));
const ProtectedLayout = memo(() => (
  <>
    <Header />
    <Outlet />
  </>
));

//  Lazy-loaded pages
const Login = lazy(() => import("./pages/Login"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ForgetPassword = lazy(() => import("./pages/ForgetPassword"));
const ClientDetailsMain = lazy(() => import("./pages/ClientDetails"));
const HsnDetails = lazy(() => import("./pages/HsnDetails"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const ProductDesc = lazy(() => import("./pages/ProductDesc"));
const Master = lazy(() => import("./pages/Master"));
const ClientCreation = lazy(() =>
  import("./Components/MainCards/Clients/ClientCreation")
);
const ClientUpdate = lazy(() =>
  import("./Components/MainCards/Clients/ClientUpdate")
);
const ClientDetails = lazy(() =>
  import("./Components/MainCards/Clients/ClientDetails")
);
const BranchDetails = lazy(() =>
  import("./Components/MainCards/BranchD/BranchDetails")
);
const PurchaseInvoice = lazy(() => import("./pages/PurchaseInvoice"));
const SalesInvoice = lazy(() => import("./pages/SalesInvoice"));
const CreditNote = lazy(() =>
  import("./Components/MainCards/Clients/Credit Note/CreditNote")
);
const DebitNote = lazy(() =>
  import("./Components/MainCards/Clients/DebitNote/DebitNote")
);
const IncomeDebitNote = lazy(() =>
  import("./Components/MainCards/Clients/IncomeDebitNote/IncomeDebitNote")
);
const ExpenseCreditNote = lazy(() =>
  import("./Components/MainCards/Clients/ExpenseCreditNote/ExpenseCreditNote")
);
const AckDetails = lazy(() => import("./Components/MainCards/Ack/AckDetails"));

//  Loader
const Loader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#fafafa",
    }}
  >
    <CircularProgress size={60} thickness={3} color="primary" />
  </div>
);

//  App
const App = () => {
  return (
    <>
      {/* <ToastContainer
  containerId="global-toast"
  position="top-center"
  autoClose={2000}
  newestOnTop
  closeOnClick
  theme="light"
/> */}

  {/* <ToastContainer position="top-right" autoClose={2000} /> */}
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/*  Public Routes */}
            <Route element={<PublicRoute />}>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgetpassword" element={<ForgetPassword />} />
              <Route
                path="/reset-password/:uidb64/:token"
                element={<ResetPassword />}
              />
            </Route>

            {/*  Protected Routes  */}
            <Route element={<ProtectedRoute />}>
              <Route element={<ProtectedLayout />}>
                <Route path="/client-details" element={<ClientDetailsMain />} />
                <Route path="/hsn-details" element={<HsnDetails />} />
                <Route path="/product-details" element={<ProductDetails />} />
                <Route path="/product-description" element={<ProductDesc />} />
                <Route path="/master" element={<Master />} />
                <Route path="/client" element={<ClientCreation />} />
                <Route path="/clientUpdate/:id" element={<ClientUpdate />} />
                <Route path="/clientDetails/:id" element={<ClientDetails />} />
                <Route
                  path="/clientDetails/branchDetails/:clientID/:branchID"
                  element={<BranchDetails />}
                />
                <Route
                  path="/purchaseInvoice/:id/:rowId"
                  element={<PurchaseInvoice />}
                />
                <Route
                  path="/salesInvoice/:id/:rowId"
                  element={<SalesInvoice />}
                />
                <Route
                  path="/clientDetails/creditNote/:id/:purchID"
                  element={<CreditNote />}
                />
                <Route
                  path="/clientDetails/debitNote/:id/:salesID"
                  element={<DebitNote />}
                />
                <Route
                  path="/clientDetails/expensesCreditNote/:id/:expensesID"
                  element={<ExpenseCreditNote />}
                />
                <Route
                  path="/clientDetails/incomeDebitNote/:id/:incomeID"
                  element={<IncomeDebitNote />}
                />
                <Route
                  path="/clientDetails/acknowledgement/:id"
                  element={<AckDetails />}
                />
              </Route>
            </Route>

            {/*  Default  */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </Router>




    </>
  );
};

export default App;
