import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Components/NewHome/Home';
import Navbar from './Components/Navbar/Navbar';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import PermitDashboard from './Components/PermitDashboard/PermitDashboard';
import ApprovalPage from './Components/ApprovalPage/ApprovalPage';
import SafetyApprovalPage from './Components/ApprovalPage/SafetyApprovalPage';
import ForgotPassword from './Components/LoginSignup/ForgotPassword';
import Cancel from './Components/Subscription/Cancel';
import CheckoutPage from './Components/Subscription/CheckoutPage';
import Success from './Components/Subscription/Success';
import AdminPortal from './Components/AdminDashboard/AdminForm/AdminPortal';
import Login from './Components/LoginSignup/Login/Login';
import Signup from './Components/LoginSignup/Signup/Signup';
import PrivateRoute from './Components/PrivateRoute';
import ProtectedRoute from './Components/ProtectedRoute';
import { AuthProvider } from './Components/useAuth';
import UserManagement from './Components/AdminDashboard/UserManagement/UserManagement';
import CommonPermitForm from './Components/CommonPermitForm/CommonPermitForm';
import PackageDetails from './Components/AdminDashboard/PackageDetails/PackageDetails';
import SafetyDepartmentManagement from './Components/AdminDashboard/SafetyDepartmentManagement/SafetyDepartmentManagement';
import AdminPermitSettings from './Components/AdminDashboard/AdminPermitSettings/AdminPermitSettings';
import NoAccess from './Components/NoAccess/NoAccess';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/no-access" element={<NoAccess />} />
          <Route path="/permitdashboard" element={
            <PrivateRoute>
              <PermitDashboard />
            </PrivateRoute>
          } />
          <Route path="/:permitType" element={
            <PrivateRoute>
              <CommonPermitForm />
            </PrivateRoute>
          } />
          <Route path="/approve/:permitNumber" element={
            <PrivateRoute>
              <ApprovalPage />
            </PrivateRoute>
          } />
          <Route path="/safety-approve/:permitNumber" element={
            <PrivateRoute>
              <SafetyApprovalPage />
            </PrivateRoute>
          } />


          <Route path="/subscription" element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          } />
          <Route path="/failure" element={
            <PrivateRoute>
              <Cancel />
            </PrivateRoute>
          } />
          <Route path="/success" element={
            <PrivateRoute>
              <Success />
            </PrivateRoute>
          } />
          <Route path="/admin-form" element={
            <ProtectedRoute>
              <AdminPortal />
            </ProtectedRoute>
          } />
          <Route path="/adminDashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/adminUserManagement" element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/adminSafetyDepartmentManagement" element={
            <ProtectedRoute>
              <SafetyDepartmentManagement />
            </ProtectedRoute>
          } />
          <Route path="/adminApproverManagement" element={
            <ProtectedRoute>
              <AdminPortal />
            </ProtectedRoute>
          } />
          <Route path="/packageDetails" element={
            <ProtectedRoute>
              <PackageDetails />
            </ProtectedRoute>
          } />
          <Route path="/generateUniquePermitNumber" element={
            <ProtectedRoute>
              <AdminPermitSettings />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
