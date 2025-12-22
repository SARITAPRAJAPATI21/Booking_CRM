import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Analytics from './pages/Analytics';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import './index.css';
import { toast, ToastContainer } from "react-toastify";
import StarklyAIChatWidget from './chatbot/StarklyAIChatWidget'
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from 'react-hot-toast';


export const backendUrl = 'https://booking-crm-backend.vercel.app/'
import BookingHistory from './components/BookingHistory';
import { io } from "socket.io-client";
import axios from "axios";
import { useEffect } from 'react';

import { useSocket } from './contexts/SocketContext';


function App() {
  //const socket = useSocket();
  useEffect(() => {
   // const socket = io("http://localhost:3000");
   // console.log(socket)

  }, [])


  return (
    <AuthProvider>

      <BookingProvider>
        <Toaster position="bottom-left"
          reverseOrder={false} />
        <Router>
          <StarklyAIChatWidget />


          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <PrivateRoute>
                  <Layout>
                    <Bookings />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <PrivateRoute>
                  <Layout>
                    <Analytics />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute adminOnly>
                  <Layout>
                    <Users />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route path='/history' element={<BookingHistory />

            } />
          </Routes>
        </Router>
      </BookingProvider>


    </AuthProvider>
  );
}

export default App;
