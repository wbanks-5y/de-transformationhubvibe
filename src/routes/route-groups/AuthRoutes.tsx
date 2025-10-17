
import { Route } from "react-router-dom";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import SetPassword from "@/pages/Auth/SetPassword";
import VerifyInvitation from "@/pages/Auth/VerifyInvitation";
import ApproveAdmin from "@/pages/Admin/ApproveAdmin";

const AuthRoutes = () => {
  return (
    <>
      {/* Auth Routes - publicly accessible */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-invitation" element={<VerifyInvitation />} />
      <Route path="/set-password" element={<SetPassword />} />
      
      {/* Special admin approval route */}
      <Route path="/approve-admin" element={<ApproveAdmin />} />
    </>
  );
};

export default AuthRoutes;
