import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AdminDashboard from './pages/admin-dashboard';
import QRCodeGenerator from './pages/qr-code-generator';
import Login from './pages/login';
import EventRegistration from './pages/event-registration';
import ParticipantManagement from './pages/participant-management';
import CheckInStation from './pages/check-in-station';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your routes here */}
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/qr-code-generator" element={<QRCodeGenerator />} />
        <Route path="/login" element={<Login />} />
        <Route path="/event-registration" element={<EventRegistration />} />
        <Route path="/participant-management" element={<ParticipantManagement />} />
        <Route path="/check-in-station" element={<CheckInStation />} />
        <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
