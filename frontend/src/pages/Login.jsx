import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import {jwtDecode } from "jwt-decode";
import { backendUrl } from "../App";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isResetMode) {
        // 🔹 CALL UPDATE PASSWORD API
        const res = await axios.put(
          `${backendUrl}user/update-password`,
          {
            email,
            newPassword: password,
          }
        );

        alert(res.data.message);
        setIsResetMode(false); // Switch back to login
      } else {
        // 🔹 NORMAL LOGIN
        const result = await login(email, password);

        if (result.success) {
          navigate(from, { replace: true });
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    }

    setLoading(false);
  };

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (err) {
      return true;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      console.log("Token expired");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            BookingCRM
          </h1>
          <p className="text-gray-600">
            {isResetMode ? "Reset Password" : "Sign in to your account"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isResetMode ? "New Password" : "Password"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12"
                placeholder={
                  isResetMode
                    ? "Enter new password"
                    : "Enter your password"
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : isResetMode
              ? "Update Password"
              : "Sign In"}
          </button>
        </form>

        {/* FORGOT PASSWORD BUTTON */}
        <div className="mt-4 text-center">
          <button
            className="text-blue-600 text-sm hover:underline"
            onClick={() => {
              setIsResetMode(!isResetMode);
              setError("");
            }}
          >
            {isResetMode
              ? "Back to Sign In"
              : "Forgot Password?"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;