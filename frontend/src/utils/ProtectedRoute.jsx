import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/userAuth";
import Loading from "../pages/Loading";

const ProtectedRoute = ({ children }) => {
  const {
    authUser,
    isVerificationCodeSent,
    isProfileCreated,
    isCheckingAuth,
  } = useAuthStore();

  const location = useLocation();
  const currentPath = location.pathname;

  if (isCheckingAuth) {
    return <Loading />;
  }

  if (!authUser) {
    if (isVerificationCodeSent && currentPath !== "/otp") {
      return <Navigate to="/otp" replace />;
    } else if (!isVerificationCodeSent && currentPath !== "/") {
      return <Navigate to="/" replace />;
    }
  }

  if (authUser && !isProfileCreated && currentPath !== "/profile/create") {
    return <Navigate to="/profile/create" replace />;
  }

  if (currentPath === "/profile" && !isProfileCreated) {
    return <Navigate to="/profile/create" replace />;
  }

  if (currentPath === "/profile") {
    return <Navigate to="/profile/view" replace />;
  }

  const allowedPaths = [
    "/profile/update",
    "/profile/view",
    '/meetings',
    "/groups",
    "/chat",
    "/ai",
  ];

  if (authUser && isProfileCreated && !allowedPaths.includes(currentPath) && !currentPath.startsWith("/profile/")) {
    return <Navigate to="/chat" replace />;
  }

  if (currentPath === "/profile/create" && isProfileCreated) {
    return <Navigate to="/chat" replace/>
  }

  return children;
};

export default ProtectedRoute;