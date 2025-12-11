import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import LoadingBar from '../../components/ui/LoadingBar';
import type { TrustSignal, MockCredentials } from './types';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/admin-dashboard');
    }
  }, [navigate]);

  const mockCredentials: MockCredentials[] = [
    {
      email: 'admin@regiverse.com',
      password: 'Admin@123',
      role: 'Administrator',
    },
    {
      email: 'organizer@regiverse.com',
      password: 'Organizer@123',
      role: 'Event Organizer',
    },
    {
      email: 'staff@regiverse.com',
      password: 'Staff@123',
      role: 'Event Staff',
    },
  ];

  const trustSignals: TrustSignal[] = [
    {
      id: 1,
      icon: 'Shield',
      label: 'SSL Secured',
      description: 'Your data is encrypted with 256-bit SSL security',
    },
    {
      id: 2,
      icon: 'Award',
      label: 'Enterprise Certified',
      description: 'SOC 2 Type II and ISO 27001 compliant',
    },
    {
      id: 3,
      icon: 'Lock',
      label: 'Privacy Protected',
      description: 'GDPR and CCPA compliant data handling',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Login - Regiverse Event Management</title>
        <meta
          name="description"
          content="Sign in to Regiverse to access your event management dashboard and manage participants, check-ins, and QR codes."
        />
      </Helmet>

      <LoadingBar isLoading={isLoading} />

      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
            <LoginHeader />
            <LoginForm
              mockCredentials={mockCredentials}
              onLoadingChange={setIsLoading}
            />
          </div>

          <TrustSignals signals={trustSignals} />

          <div className="text-center mt-8">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Regiverse. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;