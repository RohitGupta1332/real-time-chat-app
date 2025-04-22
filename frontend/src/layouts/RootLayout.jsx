import { Outlet } from "react-router-dom"
import { useAuthStore } from "../store/userAuth";
import Loading from "../pages/Loading";

const RootLayout = () => {
  const {
    isCheckingAuth,
    isSigningIn,
    isLoggingIn,
    isCreatingProfile,
    isUpdatingProfile,
    isResending,
    isVerifing,
    isLoadingProfile
  } = useAuthStore(); 


  if (isCheckingAuth || isSigningIn || isLoggingIn || isCreatingProfile || isUpdatingProfile || isResending || isVerifing || isLoadingProfile) {
    return (
      <>
        <Outlet />
        <Loading />
      </>
    );
  }

  return (
    <div>
        <Outlet />
    </div>
  )
}

export default RootLayout