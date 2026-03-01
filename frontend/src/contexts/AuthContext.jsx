import React, { createContext, useContext, useState, useEffect } from 'react';
import { backendUrl } from '../App';
import axios from 'axios';
import toast from 'react-hot-toast';
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 const [token,setToken]=useState(null)

  function isTokenExpired(token) {
   if (!token) return true; // No token = treated as expired
 
   try {
     const payload = JSON.parse(atob(token.split(".")[1])); // decode payload
     const exp = payload.exp;
     const now = Math.floor(Date.now() / 1000); // current time in seconds
 
     return exp < now; // true = expired, false = still valid
   } catch (error) {
     console.error("Invalid token:", error);
     return true; // Treat invalid tokens as expired
   }
 }
 useEffect(()=>{

  const token = localStorage.getItem("token");

if (isTokenExpired(token)) {
    localStorage.removeItem("token")
    localStorage.removeItem('userData');
  console.log("Token expired");
 // toast.error("token expired login again..")


  // e.g., redirect to login or refresh token
} else {
  console.log("Token is still valid");
}
},[])
 

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

 const login = async (email, password) => {
  console.log('login time')
  try {
    const res = await axios.post(`${backendUrl}user/login`, {
      email,
      password
    });

    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
   
    
    const userData=res.data.UserModel;
    localStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);

    return { success: true };

  } catch (error) {

    let statusCode = 500;
    let errorMessage = "Something went wrong";

    if (error.response) {
      statusCode = error.response.status;
      errorMessage = error.response.data?.message;
    } else if (error.request) {
      errorMessage = "Server not responding";
    } else {
      errorMessage = error.message;
    }

    return {
      success: false,
      status: statusCode,
      error: errorMessage,
      
    };
  }
};


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';
  const isUser = () => user?.role === 'user';

  const value = {
    user,
    login,
    logout,
    isAdmin,
    isUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};