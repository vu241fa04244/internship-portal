import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import NotificationsPage from './pages/NotificationsPage';

// Internship pages
import InternshipList from './pages/internships/InternshipList';
import InternshipDetail from './pages/internships/InternshipDetail';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import MyApplications from './pages/student/MyApplications';
import ResumeAnalyzer from './pages/student/ResumeAnalyzer';
import AIRecommendations from './pages/student/AIRecommendations';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageInternships from './pages/admin/ManageInternships';
import ManageStudents from './pages/admin/ManageStudents';
import ManageApplications from './pages/admin/ManageApplications';

function App() {
  return (
    <>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/internships" element={<InternshipList />} />
          <Route path="/internships/:id" element={<InternshipDetail />} />

          {/* Authenticated Notifications Route */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute allowedRole="student">
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-analyzer"
            element={
              <ProtectedRoute allowedRole="student">
                <ResumeAnalyzer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute allowedRole="student">
                <AIRecommendations />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/internships"
            element={
              <ProtectedRoute allowedRole="admin">
                <ManageInternships />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRole="admin">
                <ManageStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute allowedRole="admin">
                <ManageApplications />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
