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

  const { isCheckingAuth, authUser, checkAuth, isProfileCreated, isVerificationCodeSent } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);


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
        <Route path='/' element={authUser ? (isProfileCreated ? <Home /> : <Profile />) : <Login />} />
        <Route path='/login' element={!authUser ? <Login /> : isProfileCreated ? <Home /> : <Profile />} />
        <Route path='/signup' element={!authUser ? <SignUp /> : isProfileCreated ? <Home /> : <Profile />} />
        <Route path='/otp' element={<OTP />} />
        <Route path='/profile' element={authUser ? (!isProfileCreated ? <Profile /> : <Home />) : <Login />} />
      </Routes>
    </div>
  )
}

export default App
