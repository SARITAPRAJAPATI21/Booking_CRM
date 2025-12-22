import { X } from 'lucide-react';

const BookingDetails = ({ booking, onClose }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl max-w-md w-full">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Booking Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
      </div>

      <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Customer Name </label>
            <p className="text-lg text-gray-800">{booking.customerName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Date</label>
              <p className="text-gray-800">{booking.date}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Time</label>
              <p className="text-gray-800">{booking.time}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Service</label>
            <p className="text-gray-800">{booking.service}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="mt-1">
              <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Description</label>
            <p className="text-gray-800">{booking.description || 'No description provided'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Created</label>
            <p className="text-gray-800">{booking.createdAt}</p>
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

export default BookingDetails;