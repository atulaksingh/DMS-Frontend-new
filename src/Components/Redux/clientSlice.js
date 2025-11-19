import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

const initialState = {
  clientData: null,
  ownerData: null,
  bankData: null,
  branchData: null,
  clientUserData: null,
  customerUserData: null,
  companyDocData: null,
  CVData: null,
  PfData: null,
  taxAuditData: null,
  airData: null,
  sftData: null,
  tdsReturnData: null,
  tdsPaymentData: null,
  tdsSectionData: null,
  othersData: null,
  salesInvoiceData: null,
  purchaseInvoiceData: null,
  incomeInvoiceData: null,
  expensesInvoiceData: null,
  zipFileData: null,
  ackData: null,
  acksData: null,
  status: "idle",
  error: null,
};
console.log("Initial State:", initialState);

export const fetchClientDetails = createAsyncThunk(
  "client/fetchTabData",
  async ({ id, tabName }) => {
    console.log(`Fetching data for tab: ${tabName} with id: ${id}`);

    const response = await axiosInstance.get(
      `/api/detail-client/${id}/${tabName}`
    );
    // console.log(`Fetched data for tab ${tabName}:`, response.data);
    return { tabName, data: response.data };
  }
);

export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    // 🔥 ADD THIS RESET FUNCTION
    resetClientData: (state) => {
      state.clientData = null;
      state.ownerData = null;
      state.bankData = null;
      state.branchData = null;
      state.clientUserData = null;
      state.customerUserData = null;
      state.companyDocData = null;
      state.CVData = null;
      state.PfData = null;
      state.taxAuditData = null;
      state.airData = null;
      state.sftData = null;
      state.tdsReturnData = null;
      state.tdsPaymentData = null;
      state.tdsSectionData = null;
      state.othersData = null;
      state.salesInvoiceData = null;
      state.purchaseInvoiceData = null;
      state.incomeInvoiceData = null;
      state.expensesInvoiceData = null;
      state.zipFileData = null;
      state.ackData = null;
      state.acksData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchClientDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { tabName, data } = action.payload;
        console.log(
          " API Response for:",
          action.meta.arg.tabName,
          action.payload
        );

        const extractedData =
          typeof data === "object" && Object.keys(data).length === 1
            ? Object.values(data)[0]
            : data;

        switch (tabName) {
          case "Client":
            state.clientData = extractedData;
            break;
          case "Owner":
            state.ownerData = extractedData;
            break;
          case "Bank":
            state.bankData = extractedData;
            break;
          case "Branch":
            state.branchData = extractedData;
            break;
          case "ClientUser":
            state.clientUserData = extractedData;
            break;
          case "CustomerUser":
            state.customerUserData = extractedData;
            break;
          case "CompanyDocuments":
            state.companyDocData = extractedData;
            break;
          case "CV":
            state.CVData = extractedData;
            break;
          case "PF":
            state.PfData = extractedData;
            break;
          case "TaxAudit":
            state.taxAuditData = extractedData;
            break;
          case "AIR":
            state.airData = extractedData;
            break;
          case "SFT":
            state.sftData = extractedData;
            break;
          case "TDSReturn":
            state.tdsReturnData = extractedData;
            break;
          case "TDSPayment":
            state.tdsPaymentData = extractedData;
            break;
          case "TDSSection":
            state.tdsSectionData = extractedData;
            break;
          case "Others":
            state.othersData = extractedData;
            break;
          case "Sales":
            state.salesInvoiceData = extractedData;
            break;
          case "Purchase":
            state.purchaseInvoiceData = extractedData;
            break;
          case "Income":
            state.incomeInvoiceData = extractedData;
            break;
          case "Expenses":
            state.expensesInvoiceData = extractedData;
            break;
          case "ZipFile":
            state.zipFileData = extractedData;
            break;
          case "Ack":
            state.ackData = extractedData;
            break;
          case "Acks":
            state.acksData = extractedData;
            break;
          default:
            break;
        }
      })

      .addCase(fetchClientDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const { resetClientData } = clientSlice.actions;
export default clientSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// const API_URL = import.meta.env.VITE_API_BASE_URL;
// // Async thunk to fetch client details
// import axiosInstance from "../../utils/axiosInstance";

// export const fetchClientDetails = createAsyncThunk(
//   "client/fetchDetails",
//   async (id) => {
//     const response = await axiosInstance.get(`${API_URL}/api/detail-client/${id}`);
//     return response.data;
//   }
// );

// // Create the slice
// const clientSlice = createSlice({
//   name: "client",
//   initialState: {
//     clientData: null,
//     ownerData: null,
//     bankData: null,
//     branchData: null,
//     clientUserData: null,
//     customerUserData: null,
//     companyDocData: null,
//     CVData: null,
//     PfData: null,
//     taxAuditData: null,
//     airData: null,
//     sftData: null,
//     tdsReturnData: null,
//     tdsPaymentData: null,
//     tdsSectionData: null,
//     salesInvoiceData: null,
//     purchaseInvoiceData: null,
//     incomeInvoiceData: null,
//     expensesInvoiceData: null,
//     zipFileData: null,
//     ackData: null,
//     acksData: null,
//     othersData: null,
//     status: "idle", // "idle" | "loading" | "succeeded" | "failed"
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchClientDetails.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchClientDetails.fulfilled, (state, action) => {
//         console.log("action", action.payload)
//         state.status = "succeeded";
//         state.clientData = action?.payload?.Client;
//         state.ownerData = action?.payload?.Owner;
//         state.bankData = action?.payload?.Bank;
//         state.branchData = action?.payload?.Branch;
//         state.clientUserData = action?.payload?.ClientUser;
//         state.customerUserData = action?.payload?.CustomerUser;
//         state.companyDocData = action?.payload?.Company_Document;
//         state.CVData = action?.payload?.Customer_or_Vendor;
//         state.PfData = action?.payload?.PF;
//         state.taxAuditData = action?.payload?.Tax_Audit;
//         state.airData = action?.payload?.AIR;
//         state.sftData = action?.payload?.SFT;
//         state.tdsReturnData = action?.payload?.TDS_Return;
//         state.tdsPaymentData = action?.payload?.TDS_Payment;
//         state.tdsSectionData = action?.payload?.TDS_Section;
//         state.othersData = action?.payload?.Others;
//         state.salesInvoiceData = action?.payload?.sales_invoice;
//         state.purchaseInvoiceData = action?.payload?.purchase_invoice;
//         state.incomeInvoiceData = action?.payload?.income;
//         state.expensesInvoiceData = action?.payload?.expenses;
//         state.zipFileData = action?.payload?.zipupload;
//         state.ackData = action?.payload?.acknowledgement;
//         state.acksData = action?.payload?.Acknowledgement;
//       })
//       .addCase(fetchClientDetails.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       });
//   },
// });

// export default clientSlice.reducer;
