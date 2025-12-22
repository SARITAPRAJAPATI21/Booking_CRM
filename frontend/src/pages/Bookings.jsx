import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../contexts/BookingContext';
import BookingForm from '../components/BookingForm';
import BookingDetails from '../components/BookingDetails';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookingHistory from '../components/BookingHistory';


const Bookings = () => {
  const { user } = useAuth();
  const { bookings, loading, createBooking, updateBooking, deleteBooking } = useBookings();
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedBookingHistory, setSelectedBookingHistory] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = searchTerm === '' || 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });


  const handleCreateBooking = async (bookingData) => {
    try {
      await createBooking(bookingData);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const handleUpdateBooking = async (bookingData) => {
    try {
      await updateBooking(editingBooking._id, bookingData);
      setEditingBooking(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking(bookingId);
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const handleEdit = (booking) => {
     console.log("handle edit bookking",booking)
    setEditingBooking(booking);
    setShowForm(true);
   
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
  };

   const handleHistroy =(booking)=>{
     console.log("booking histroy",booking.history)
  setSelectedBookingHistory(booking)

   }
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBooking(null);
  };
 // console.log("edit booking",editingBooking)
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.role === 'admin' ? 'All Bookings' : 'My Bookings'}
        </h1>
        <button
          onClick={() => {
            setEditingBooking(null);
            setShowForm(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Create New Booking
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 capitalize ${
              filter === status
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search bookings by customer, service, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-600 ml-4">
            {filteredBookings.length} booking(s) found
          </div>
        </div>
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {booking.title}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
             
            
              {user?.role === 'admin' && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Customer  :</span> {booking.customerName}
                </p>
              )}
              <p className="text-sm text-gray-600 line-clamp-2">
                <span className="font-medium">Description :</span>  {booking.description}
              </p>
               <p className="text-sm text-gray-600 line-clamp-2">
                <span className="font-medium">Services :</span>  {booking.service}
              </p>
               <p className="text-sm text-gray-600 line-clamp-2">
                <span className="font-medium">Createby :</span>  {booking.userId}
              </p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleView(booking)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                View
              </button>
              {(user?.role === 'admin' || booking.userId === user?.id) && (
                <>
                  <button
                    onClick={() => handleEdit(booking)}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Edit
                  </button>
                  {user?.role === 'admin' && (
                  <button
                    onClick={() => handleDeleteBooking(booking._id)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Delete
                  </button>
                  
                  )}
                    <button
                onClick={() => handleHistroy(booking)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                history
              </button>
                  
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? `No bookings match "${searchTerm}"`
              : filter === 'all' 
                ? 'Create your first booking to get started.'
                : `No ${filter} bookings found.`
            }
          </p>
        </div>
      )}

      {/* Booking Form Modal */}
      {showForm && (
        <div className="fixed inset-0  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingBooking ? 'Edit Booking' : 'Create New Booking'}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <BookingForm
                booking={editingBooking}
                onSubmit={editingBooking ? handleUpdateBooking : handleCreateBooking}
                onCancel={handleCloseForm}
              />
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-20 flex items-center justify-center p-4 z-50">
          <BookingDetails
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        </div>
      )}
        
        {selectedBookingHistory && (
        <div className="  fixed inset-0 bg-gray-500 bg-opacity-20 flex items-center justify-center p-4 z-50">
          <BookingHistory
            booking={selectedBookingHistory}
            onClose={() => setSelectedBookingHistory(null)}
          />
        </div>
      )}
    </div>
     
  );
};

export default Bookings;