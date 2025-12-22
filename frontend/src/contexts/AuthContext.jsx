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
    try {
      // Mock API call - replace with real API
      /*const mockUsers = [
        { id: 1, email: 'admin@demo.com', password: 'admin123', role: 'admin', name: 'Admin User' },
        { id: 2, email: 'user@demo.com', password: 'user123', role: 'user', name: 'Regular User' }
      ];

      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }*/
       const res = await axios.post(`${backendUrl}user/login`,{email,password})
       console.log(res)

      const token = res.data.token;
      setToken(token)
      const userData = {
        id: res.data.UserModel.id
,
        email:  res.data.UserModel.email,
        role:  res.data.UserModel.role,
        name:  res.data.UserModel.name
      };

      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
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