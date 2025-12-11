import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MobileMenu from '../../components/ui/MobileMenu';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingBar from '../../components/ui/LoadingBar';
import EventInfoCard from './components/EventInfoCard';
import RegistrationForm from './components/RegistrationForm';
import QRCodeModal from './components/QRCodeModal';
import { EventDetails, RegistrationFormData, RegistrationResponse, FormErrors } from './types';

const EventRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEventExpanded, setIsEventExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationResponse | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const mockEvent: EventDetails = {
    id: "evt-001",
    title: "Global Tech Summit 2024",
    date: "March 15, 2024",
    time: "9:00 AM - 6:00 PM EST",
    location: "San Francisco Convention Center, 747 Howard St, San Francisco, CA 94103",
    description: "Join industry leaders, innovators, and technology enthusiasts for a full day of keynote speeches, panel discussions, and networking opportunities. Explore the latest trends in artificial intelligence, cloud computing, cybersecurity, and digital transformation. Connect with over 2,000 professionals from around the world and discover cutting-edge solutions that are shaping the future of technology.",
    capacity: 2000,
    registered: 1547,
    category: "Technology",
    organizer: "TechEvents Global",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c75419f2-1764666356653.png",
    alt: "Modern conference hall with rows of blue seats facing large presentation screen, professional lighting and stage setup for technology summit"
  };

  const validateForm = (data: RegistrationFormData): FormErrors => {
    const errors: FormErrors = {};

    if (!data.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!data.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!data.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s()-]{10,}$/.test(data.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!data.company.trim()) {
      errors.company = "Company name is required";
    }

    if (!data.jobTitle.trim()) {
      errors.jobTitle = "Job title is required";
    }

    return errors;
  };

  const generateRegistrationId = (): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `REG-${timestamp}-${random}`.toUpperCase();
  };

  const generateQRCode = (registrationId: string): string => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(registrationId)}`;
  };

  const handleRegistrationSubmit = async (data: RegistrationFormData) => {
    const errors = validateForm(data);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const registrationId = generateRegistrationId();
    const qrCode = generateQRCode(registrationId);

    const response: RegistrationResponse = {
      registrationId,
      qrCode,
      participantName: `${data.firstName} ${data.lastName}`,
      eventTitle: mockEvent.title,
      eventDate: mockEvent.date
    };

    setRegistrationData(response);
    setIsSubmitting(false);
    setIsLoading(false);
    setShowQRModal(true);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleModalClose = () => {
    setShowQRModal(false);
    navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuToggle={() => setIsMobileMenuOpen(true)}
        userName="John Anderson"
        userRole="Event Organizer"
        onLogout={handleLogout} />


      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)} />


      <LoadingBar isLoading={isLoading} />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Breadcrumb />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="order-2 lg:order-1">
              <EventInfoCard
                event={mockEvent}
                isExpanded={isEventExpanded}
                onToggle={() => setIsEventExpanded(!isEventExpanded)} />

            </div>

            <div className="order-1 lg:order-2">
              <RegistrationForm
                onSubmit={handleRegistrationSubmit}
                isSubmitting={isSubmitting}
                errors={formErrors} />

            </div>
          </div>
        </div>
      </main>

      <QRCodeModal
        isOpen={showQRModal}
        onClose={handleModalClose}
        registrationData={registrationData} />

    </div>);

};

export default EventRegistration;