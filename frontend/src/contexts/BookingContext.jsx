import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { backendUrl } from '../App';

import toast, { Toaster } from 'react-hot-toast';
import { useSocket } from './SocketContext';



const BookingContext = createContext();

export const useBookings = () => {
 

  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAdmin } = useAuth();
  const [notifications,setNotifications]=useState([])
    const socket = useSocket();
   console.log(socket)

  // Mock data
  const mockBookings = [
    {
      id: 1,
      userId: 1,
      customerName: 'John Doe',
      date: '2025-01-20',
      time: '10:00',
      service: 'Consultation',
      status: 'confirmed',
      description: 'Initial consultation meeting',
      createdAt: '2025-01-15'
    },


  ];

  const allBooking = async () => {
    console.log("all booking details")
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${backendUrl}booking/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      },)
      setBookings(res.data)
      // toast.success('All Booking uploaded');
      console.log(res)

    } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error('Unauthorized! Redirecting to login...');
      console.error('Unauthorized! Redirecting to login...');
     
    } else {
      console.error('An error occurred:', error.message);
    }
      console.log(error, "not getting all booking details ")

    }

  }

  useEffect(() => {

    
const token = localStorage.getItem("accessToken");
if (user) {
 allBooking()
console.log("user details ",user)
  
}
else  {
      //setBookings(mockBookings);
       console.log("token or user not found")
    
    }
  }, [user]);

  const getFilteredBookings = () => {
    if (!user) return [];
    if (isAdmin()) return bookings;
    return bookings.filter(booking => booking.userId === user.id);
  };



  useEffect(() => {
  if (!socket) return;

  const handleNotification = (message) => {
    console.log("message from ", message);
   // toast(message); // optional UI feedback
   
   setNotifications(prev => [...prev, message]);
  if(isAdmin()){
    toast.custom((t) => (
  <div
    className={`${
      t.visible ? 'animate-enter' : 'animate-leave'
    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
  >
    <div className="flex-1 w-0 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <img
            className="h-10 w-10 rounded-full"
            src="https://png.pngtree.com/png-clipart/20191121/original/pngtree-bell-icon-png-image_5092418.jpg"
            alt="New Booking"
          />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">
            📢 New Booking Alert
          </p>
          <p className="mt-1 text-sm text-gray-500">
            A new booking has been added. Booking ID: <strong>{message?.customerName
 || 'N/A'}</strong>
          </p>
        </div>
      </div>
    </div>
    <div className="flex border-l border-gray-200">
      <button
        onClick={() => toast.dismiss(t.id)}
        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Close
      </button>
    </div>
  </div>
), { bookingId: "BK12345" }) // pass bookingId here

  }
 
  
   // allBooking(); // refetch data if needed
  };

  socket.on("notification-booking", handleNotification);

  return () => {
    socket.off("notification-booking", handleNotification); // clean up
  };
}, [socket]); // run only when socket changes

  //socket.on("notification-booking",(message)=>{console.log("message from ",message)})


  const createBooking = async (bookingData) => {
    console.log("booking data inserting into database  using axios", bookingData)
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${backendUrl}booking/add`, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // setBookings(prev => [...prev, bookingData]);
      if (res.status === 201) {
       console.log("data added ")
       socket.emit("add-booking",bookingData);
       // toast.success(" booking added successfully ")
       toast.success('Successfully created!');
       // alert("booking added sucessfully")
      }
      console.log(res)
     // alert("booking added sucessfully")
      allBooking()

      //alert(res.data.message)
    } catch (error) {

       if (error.response && error.response.status === 403) {
          toast.error('Access denied for this route');
      console.error('Unauthorized! Redirecting to login...');
     
    }  
    else {
             toast.error('Server error');
      console.error('An error occurred:', error.message);
    }

    }


    // return newBooking;
  };

  const updateBooking = async (id, updates) => {
    console.log("Update booking data", id, updates)
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${backendUrl}booking/edit/${id}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      //toast.success("updated..")
          if (res.status === 200) {
       console.log("data added ")
        toast.success(" booking updated successfully ")
      }
      //alert(res.data.message)
      allBooking()
      console.log(res)

    } catch (error) {
      console.log(error)

    }
  };

  const deleteBooking = async (id) => {
    console.log(id)
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${backendUrl}booking/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.status === 200) {
        toast.success('booking delete successfully');
        //toast(" booking delete successfully")
      }
      console.log("deletion successfully ")
      allBooking()

    } catch (error) {
      console.log("not deletion seror")

    }
    //setBookings(prev => prev.filter(booking => booking.id !== id));
  };

  const getBookingStats = () => {
    const filtered = getFilteredBookings();
    return {
      total: filtered.length,
      pending: filtered.filter(b => b.status === 'pending').length,
      confirmed: filtered.filter(b => b.status === 'confirmed').length,
      completed: filtered.filter(b => b.status === 'completed').length,
      cancelled: filtered.filter(b => b.status === 'cancelled').length
    };
  };

  const value = {
    bookings: getFilteredBookings(),
    loading,
   notifications,
   setNotifications,
    createBooking,
    updateBooking,
    deleteBooking,
    getBookingStats
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};