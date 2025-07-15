import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the default styles
function Date() {
    const [selectedDate, setSelectedDate] = useState(null);

    // Function to handle the date change and format it to DD/MM/YYYY
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };
  return (
    <div className="flex flex-col items-center p-4">
    <label
      htmlFor="custom-date"
      className="mb-2 text-lg font-semibold text-gray-700"
    >
      Select Date (DD/MM/YYYY):
    </label>
    <DatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      dateFormat="dd/MM/yyyy" // Format the date as DD/MM/YYYY
      className="w-60 border border-gray-300 rounded-lg p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholderText="DD/MM/YYYY"
      isClearable
    />
    <p className="mt-2 text-sm text-gray-600">
      Example: 25/12/2025
    </p>
  </div>
  )
}

export default Date