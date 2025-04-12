import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/userAuth";

const ProtectedRoute = ({ children }) => {
  const {
    authUser,
    isVerificationCodeSent,
    isProfileCreated,
  } = useAuthStore();

  const location = useLocation();

  const currentPath = location.pathname;

  if (currentPath === "/" && authUser) {
    return <Navigate to={isProfileCreated ? "/chat" : "/profile"} replace />;
  }

  if (currentPath === "/otp" && !isVerificationCodeSent) {
    return <Navigate to="/" replace />;
  }

  if ((currentPath === "/profile" || currentPath === "/chat") && !authUser) {
    return <Navigate to="/" replace />;
  }

  if (currentPath === "/chat" && !isProfileCreated) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
