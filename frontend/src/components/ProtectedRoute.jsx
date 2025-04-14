import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/userAuth";

const ProtectedRoute = ({ children }) => {
  const {
    authUser,
    isVerificationCodeSent,
    isProfileCreated,
  } = useAuthStore();

  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  if (currentPath === "/profile" || currentPath === "/profile/") {
    navigate("/profile/view", { replace: true });
    return null;
  }

  if (currentPath === "/" && authUser) {
    return <Navigate to={isProfileCreated ? "/chat" : "/profile/create"} replace />;
  }

  if ((currentPath === "/otp" || currentPath === "/otp/") && !isVerificationCodeSent) {
    return <Navigate to="/" replace />;
  }

  if ((currentPath === "/profile/create" || currentPath === "/profile/create/" || currentPath === "/chat" || currentPath === "/chat/") && !authUser) {
    return <Navigate to="/" replace />;
  }

  if (currentPath === "/chat" && !isProfileCreated) {
    return <Navigate to="/profile/create" replace />;
  }

  return children;
};

export default ProtectedRoute;