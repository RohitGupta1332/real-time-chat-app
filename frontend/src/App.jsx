import './App.css'
import Home from "./pages/home/Home"
import Login from './pages/login/Login';
import SignUp from './pages/signup/SignUp';
import OTP from "./pages/otp/OTP";
import Profile from "./pages/profile/Profile";
import { Routes, Route } from "react-router-dom";
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { Loader } from "lucide-react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function App() {

  const { isCheckingAuth, authUser, checkAuth, isSigningIn, isProfileCreated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authUser && isProfileCreated) {
      navigate("/");
    } else if (authUser && !isProfileCreated) {
      navigate("/profile");
    }
  }, [authUser, navigate, isProfileCreated]);

  if (isSigningIn) {
    toast.success("Verification code sent")
  }

  if (isCheckingAuth && !authUser) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Full height of viewport
        }}
      >
        <Loader className="size-10 animate-spin" />
      </div>

    )
  }

  return (
    <div className='main-container'>
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Login />} />
        <Route path='/login' element={!authUser ? <Login /> : <Home />} />
        <Route path='/signup' element={!authUser ? <SignUp /> : <Home />} />
        <Route path='/otp' element={<OTP />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Login />} />
      </Routes>
    </div>
  )
}

export default App
