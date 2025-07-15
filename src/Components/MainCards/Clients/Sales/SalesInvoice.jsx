import React from "react";

function SalesInvoice({ invoiceData }) {
  // console.log("123", invoiceData);
  return (
    <div>
      {" "}
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Invoice</h1>
          <p className="text-gray-500">
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
              Address: lo
              {invoiceData?.address || "Not Available"}
            </p>
            <p className="text-gray-600">
              Phone: {invoiceData?.contact || "Not Available"}
            </p>
            <p className="text-gray-600">
              Email: {invoiceData?.state || "Not Available"}
            </p>
            <p className="text-gray-600">Contact: John Smith</p>
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
        <div className="border-t border-b py-2 font-bold text-sm grid grid-cols-6 text-left">
          <div className="col-span-2">DESCRIPTION</div>
          <div>UNIT</div>
          <div>UNIT PRICE</div>
          <div>GST Rate</div>
          
          <div className="text-right">AMOUNT</div>

        </div>

        {/* Table Rows */}
      {invoiceData?.product_summaries?.map((product, index) => (
  <div key={product.id || index} className="text-sm text-gray-700 border-b py-2 grid grid-cols-6 ">
    {/* DESCRIPTION */}
    <div className="col-span-2">
      <p>{product.description_text || "No description available"}</p>
    </div>

    {/* UNIT */}
    <div>{product.unit || "N/A"}</div>

    {/* UNIT PRICE */}
    <div>₹{parseFloat(product.rate).toLocaleString("en-IN", { minimumFractionDigits: 2 }) || "0.00"}</div>

    {/* GST Rate */}
    <div>{product.gst_rate || "0.00"}%</div>

    {/* AMOUNT */}
    <div className="text-right">₹{product.product_amount?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || "0.00"}</div>
  </div>
))}

        {/* Summary */}
        <div className="text-sm text-gray-700 mt-4">
          <div className="flex justify-between py-2 border-t">
            <span>Untaxed Amount</span>
            <span>₹60,000.00</span>
          </div>
          <div className="flex justify-between py-2 border-t">
            <span>SGST on ₹60,000.00</span>
            <span>₹5,400.00</span>
          </div>
          <div className="flex justify-between py-2 border-t">
            <span>CGST on ₹60,000.00</span>
            <span>₹5,400.00</span>
          </div>
          <div className="flex justify-between py-2 border-t font-bold text-lg">
            <span>Total</span>
            <span>₹70,800.00</span>
          </div>
        </div>

        {/* Amount Due */}
        <div className="text-center text-2xl font-bold bg-gray-100 py-4 mb-8">
          Amount Due (AUD): $5000.25
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
    </div>
  );
}

export default SalesInvoice;
