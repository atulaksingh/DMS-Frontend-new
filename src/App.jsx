import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import MuiTable from "./Components/MainCards/MuiTable";
// import Card from "./Components/MainCards/card";
import Header from "./Components/MainCards/Header";
import MenuBar from "./Components/MainCards/MenuBar";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./pages/Login";
// import Signup from "./pages/ForgetPassword";
import HomePage from "./pages/HomePage";
import ClientCreation from "./Components/MainCards/Clients/ClientCreation";
// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClientDetailsMain from "./pages/ClientDetails";
import HsnDetails from "./pages/HsnDetails";
import ProductDetails from "./pages/ProductDetails";
import ProductDesc from "./pages/ProductDesc";
/////////////////////////////////////////////////////
import ClientDetails from "./Components/MainCards/Clients/ClientDetails";
import ClientUpdate from "./Components/MainCards/Clients/ClientUpdate";
import BranchDetails from "./Components/MainCards/BranchD/BranchDetails";
import Master from "./pages/Master";
import PurchaseInvoice from "./pages/PurchaseInvoice";
import SalesInvoice from "./pages/SalesInvoice";
import CreditNote from "./Components/MainCards/Clients/Credit Note/CreditNote";
import DebitNote from "./Components/MainCards/Clients/DebitNote/DebitNote";
import IncomeDebitNote from "./Components/MainCards/Clients/IncomeDebitNote/IncomeDebitNote";
import ExpenseCreditNote from "./Components/MainCards/Clients/ExpenseCreditNote/ExpenseCreditNote";
import Resetpassword from "./pages/ResetPassword";
// import AckCreation from "./Components/MainCards/Ack/AckCreation";
import Forgetpassword from "./pages/ForgetPassword";
import { logout } from "./pages/Logout";
import AckDetails from "./Components/MainCards/Ack/AckDetails";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Header />
        {/* <MenuBar /> */}
        <Routes>
          <Route path="/client-details" element={<ClientDetailsMain />} />
          <Route path="/hsn-details" element={<HsnDetails />} />
          <Route path="/product-details" element={<ProductDetails />} />
          <Route path="/product-description" element={<ProductDesc />} />
          {/* //////////////////////////////////////////////// */}
          <Route path="/" element={<Login />} />
          <Route path="/master" element={<Master />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/reset" element={<Resetpassword />} /> */}
          <Route path="/reset-password/:uidb64/:token" element={<Resetpassword />} />

          <Route path="/forgetpassword" element={<Forgetpassword />} />
          {/* <Route path="/logout" element={<Logout />} /> */}
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
          <Route path="/salesInvoice/:id/:rowId" element={<SalesInvoice />} />
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
        </Routes>
        {/* <ToastContainer /> */}
      </Router>
    </>
  );
}

export default App;
