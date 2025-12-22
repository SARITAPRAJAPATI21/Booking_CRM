import React from "react";
import { X } from 'lucide-react';
const historyData = {
  bookingId: "64fa2f8896a3123e7c8f230b",
  history: [
    {
      updatedAt: "2025-07-25T10:00:00.000Z",
      updatedBy: {
        name: "Admin User",
        email: "admin@example.com",
      },
      changes: {
        status: {
          from: "Pending",
          to: "Confirmed",
        },
      },
    },
  
  ],
};

const BookingHistory = ({ booking, onClose }) => {
  return (
    <div className="bg-white rounded-xl max-w-lg w-full">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Booking history</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-6 space-y-4">
 <div className="max-w-4xl mx-auto p-4">

          {(booking.history).length === 0 ? (
            <p className="text-center text-gray-500">No history available.</p>
          ) : (
            <div className="space-y-6">
              {(booking.history).map((entry, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-lg font-semibold">
                        Updated by: <span className="text-blue-600">{entry.updatedBy}</span>
                      </p>
                      <p className="text-sm text-gray-500">{entry.updatedBy.email}</p>
                    </div>
                    <p className="text-sm text-gray-400">
                      {new Date(entry.updatedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <p className="font-medium mb-2">Changes:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(entry.changes).map(([field, change], idx) => (
                        <li key={idx} className="text-gray-700">
                          <span className="font-semibold capitalize">{field}</span>:
                          <span className="text-red-600 ml-1">"{change.from}"</span> →
                          <span className="text-green-600 ml-1">"{change.to}"</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>



      </div>

      <div className="p-6 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BookingHistory;
