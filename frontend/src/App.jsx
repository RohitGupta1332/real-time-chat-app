import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom"
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

import { useAuthStore } from "./store/userAuth";

import AuthPage from "./pages/Auth";
import Otp from './pages/Otp';
import Profile from './pages/Profile'
import Chat from "./pages/Chat";

import RootLayout from "./layouts/RootLayout";

import NotFound from './components/NotFound'
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {

  const checkAuth = useAuthStore((state) => state.checkAuth);
  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  const route = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<ProtectedRoute>
          <AuthPage />
        </ProtectedRoute>} />

        <Route path="otp" element={
          <ProtectedRoute>
            <Otp />
          </ProtectedRoute>} />

        <Route path="profile" element={<ProtectedRoute />} />

        <Route path="profile/view" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>} />

        <Route path="profile/update" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>} />

        <Route path="profile/create" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>} />

        <Route path="chat" element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>} />

        <Route path='groups' element={
          <ProtectedRoute> 
            <Chat />
          </ProtectedRoute>
        } />

        <Route path='ai' element={
          <ProtectedRoute> 
            <Chat />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Route>
    ));

  return (
    <>
      <ToastContainer />
      <RouterProvider router={route} />
    </>
  );
}

export default App;