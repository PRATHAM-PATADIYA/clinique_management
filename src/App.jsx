import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Patient pages
import BookAppointment from './pages/Patient/BookAppointment';
import MyAppointments from './pages/Patient/MyAppointments';
import AppointmentDetail from './pages/Patient/AppointmentDetail';
import MyPrescriptions from './pages/Patient/MyPrescriptions';
import MyReports from './pages/Patient/MyReports';

// Receptionist pages
import DailyQueue from './pages/Receptionist/DailyQueue';

// Doctor pages
import DoctorQueue from './pages/Doctor/DoctorQueue';
import AddPrescription from './pages/Doctor/AddPrescription';
import AddReport from './pages/Doctor/AddReport';

// Admin pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserList from './pages/Admin/UserList';
import CreateUser from './pages/Admin/CreateUser';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Patient Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['patient', 'admin', 'receptionist', 'doctor']}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Patient specific */}
          <Route
            path="/book-appointment"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Layout>
                  <BookAppointment />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Layout>
                  <MyAppointments />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointment/:id"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Layout>
                  <AppointmentDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-prescriptions"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Layout>
                  <MyPrescriptions />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reports"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Layout>
                  <MyReports />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Receptionist Routes */}
          <Route
            path="/daily-queue"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <Layout>
                  <DailyQueue />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor-queue"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <Layout>
                  <DoctorQueue />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-prescription/:appointmentId"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <Layout>
                  <AddPrescription />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-report/:appointmentId"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <Layout>
                  <AddReport />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <UserList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-user"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout>
                  <CreateUser />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
