// import React from 'react'

// function ExpensesCreditNoteInvoice() {
//   return (
//     <div>ExpensesCreditNoteInvoice</div>
//   )
// }

// export default ExpensesCreditNoteInvoice




import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ExpensesCreditNoteInvoice({ rowId }) {
  const { id, expensesID } = useParams();
  //   console.log("res", useParams());
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log("gggggggg",invoiceData)
  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/expensescreditnote-view/${id}/${expensesID}/${rowId}`
        );
        setInvoiceData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchBankDetails();
  }, [id, rowId]);
  console.log("res", invoiceData);
  const handlePrint = () => {
    window.print();
  };
  return (
    <>
      <div className="py-5">
        {" "}
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Invoice</h1>
            <p className="text-gray-500 ">
              NO: {invoiceData?.invoice_no} | DATE:{" "}
              {invoiceData?.invoice_date &&
                new Date(invoiceData.invoice_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
            </p>
          </div>

          {/* Company & Customer Details */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Company Details */}
            <div className="border p-4">
              <h2 className="text-lg font-bold">Location Details</h2>
              <p className="text-gray-600">
                {" "}
                Office Location: {invoiceData?.city || "Not Available"}
              </p>
              <p className="text-gray-600">
                Address:
                {invoiceData?.address || "Not Available"}
              </p>
              <p className="text-gray-600">
                Contact: {invoiceData?.contact || "Not Available"}
              </p>
              <p className="text-gray-600">
                State: {invoiceData?.state || "Not Available"}
              </p>
              <p className="text-gray-600">
                City: {invoiceData?.city || "Not Available"}
              </p>
              <p className="text-gray-600">
                Country: {invoiceData?.country || "Not Available"}
              </p>
            </div>

            {/* Customer Details */}
            <div className="border p-4">
              <h2 className="text-lg font-bold">Customer And Vendor Details</h2>
              <p className="text-gray-600">
                Name : {invoiceData?.customer_name || "Not Available"}
              </p>
              <p className="text-gray-600">
                Address : {invoiceData?.customer_address || "Not Available"}
              </p>
              <p className="text-gray-600">
                GST No : {invoiceData?.customer_gst_no || "Not Available"}
              </p>
              <p className="text-gray-600">
                Pan No : {invoiceData?.customer_pan || "Not Available"}
              </p>
              <p className="text-gray-600">
                Email : {invoiceData?.customer_email || "Not Available"}
              </p>
              {/* <p className="text-gray-600">
                Contact : {invoiceData?.customer_contact || "Not Available"}
              </p> */}
              <p className="text-gray-600">
                Customer and Vendor Type :{" "}
                {invoiceData?.customer_customer === "True" &&
                  invoiceData?.customer_vendor === "True"
                  ? "Both"
                  : invoiceData?.customer_customer === "True"
                    ? "Customer"
                    : invoiceData?.customer_vendor === "True"
                      ? "Vendor"
                      : "Not Available"}
              </p>
            </div>
          </div>

          {/* Invoice Table */}

          {/* Table Header */}
          <div className="border-t border-b py-2 font-bold text-sm grid grid-cols-12 text-right">
            <div className="col-span-4 text-left">DESCRIPTION</div>
            <div>UNIT</div>
            <div>PRICE</div>
            <div className="col-span-1">AMOUNT</div>
            <div>Gst Rate</div>

            {invoiceData?.product_summaries?.some(
              (product) =>
                product?.igst === "0.00" &&
                (product?.cgst !== "0.00" || product?.sgst !== "0.00")
            ) ? (
              <>
                <div className="col-span-1 text-right"> CGST</div>
                <div className="col-span-1 text-right"> SGST</div>
              </>
            ) : (
              <div className="col-span-2 text-right">IGST</div>
            )}

            <div className="col-span-2 text-right">Total Invoice</div>
          </div>

          {/* Table Rows */}
          {invoiceData?.product_summaries?.map((product, index) => (
            <div
              key={product.id || index}
              className="text-sm text-gray-700 border-b py-2 grid grid-cols-12 text-right"
            >
              {/* DESCRIPTION */}
              <div className="col-span-4 text-left">
                <p>{product.description_text || "No description available"}</p>
              </div>

              {/* UNIT */}
              <div className="text-right">{product.unit || "N/A"}</div>

              {/* UNIT PRICE */}
              <div>
                ₹
                {parseFloat(product.rate).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                }) || "0.00"}
              </div>
              <div className="col-span-1">
                ₹
                {product.product_amount?.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                }) || "0.00"}
              </div>

              {/* GST Rate */}
              <div>{product?.gst_rate || "0.00"}%</div>
              {/* <div className=" text-right"> */}

              {invoiceData?.product_summaries?.some(
                (product) =>
                  product?.igst === "0.00" &&
                  (product?.cgst !== "0.00" || product?.sgst !== "0.00")
              ) ? (
                <>
                  <div className="col-span-1 text-right">{product?.cgst}</div>
                  <div className="col-span-1 text-right">{product?.sgst}</div>
                </>
              ) : (
                <div className="col-span-2 text-right">{product?.igst}</div>
              )}

              {/* </div> */}
              <div className="col-span-2 text-right">
                {" "}
                ₹
                {invoiceData.total_invoice_value?.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                }) || "0.00"}
              </div>

              {/* AMOUNT */}
            </div>
          ))}

          {/* Summary */}
          <div className="text-sm text-gray-700 mt-4">
            <div className="flex justify-between py-2 border-t">
              <span>Taxable Amount</span>
              <span>
                ₹
                {invoiceData?.taxable_amount
                  ? parseFloat(invoiceData.taxable_amount).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )
                  : "0.00"}
              </span>
            </div>

            <div className="flex justify-between py-2 border-t">
              <span>Total Invoice Value</span>
              <span>
                ₹
                {invoiceData?.total_invoice_value
                  ? parseFloat(invoiceData.total_invoice_value).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )
                  : "0.00"}
              </span>
            </div>

            {invoiceData?.tcs === "0.00" ? (
              <div className="flex justify-between py-2 border-t">
                <span>TDS:- {invoiceData?.tds_tcs_rate || 0}%</span>
                <span>
                  - ₹
                  {invoiceData?.tds?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  }) || "0.00"}
                </span>
              </div>
            ) : (
              <div className="flex justify-between py-2 border-t">
                <span>TCS:- {invoiceData?.tds_tcs_rate || 0}%</span>
                <span>
                  + ₹
                  {invoiceData?.tcs?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  }) || "0.00"}
                </span>
              </div>
            )}
            {/* <div className="flex justify-between py-2 border-t">
              <span>TCS:- {invoiceData?.tds_tcs_rate || 0}%</span>
              <span>
                + ₹
                {invoiceData?.tcs?.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                }) || "0.00"}
              </span>
            </div> */}
            <div className="flex justify-between py-2 border-t">
              <span>Amount Receivable :- </span>
              <span>
                ₹
                {invoiceData?.amount_receivable?.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                }) || "0.00"}
              </span>
            </div>
          </div>

          {/* Amount Due */}
          <div className="text-center text-2xl font-bold bg-gray-100 py-4 mb-8">
            Amount Due (INR): ₹
            {invoiceData?.amount_receivable?.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            }) || "0.00"}
          </div>

          {/* Payment Details and Notes */}
          <div className="grid grid-cols-2 gap-6">
            {/* Payment Details */}
            <div className="border p-4">
              <h2 className="text-lg font-bold">Payment Details</h2>
              <p className="text-gray-600">Account Name: "RCJA"</p>
              <p className="text-gray-600">BSB: 111-111</p>
              <p className="text-gray-600">Account Number: 1234101</p>
            </div>

            {/* Notes */}
            <div className="border p-4">
              <h2 className="text-lg font-bold">Notes</h2>
              <p className="text-gray-600">
                Payment is requested within 15 days of receiving this invoice.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end mb-4">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </>
  );
}

export default ExpensesCreditNoteInvoice;
