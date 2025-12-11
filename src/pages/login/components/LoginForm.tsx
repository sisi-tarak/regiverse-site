import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import type { LoginFormData, LoginFormErrors, MockCredentials } from '../types';

interface LoginFormProps {
  mockCredentials: MockCredentials[];
  onLoadingChange: (loading: boolean) => void;
}

const LoginForm = ({ mockCredentials, onLoadingChange }: LoginFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return undefined;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    setIsLoading(true);
    onLoadingChange(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const validCredential = mockCredentials.find(
      (cred) => cred.email === formData.email && cred.password === formData.password
    );

    if (validCredential) {
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', formData.email);
      }
      localStorage.setItem('userRole', validCredential.role);
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/admin-dashboard');
    } else {
      setErrors({
        general: `Invalid credentials. Please use: ${mockCredentials[0].email} / ${mockCredentials[0].password}`,
      });
    }

    setIsLoading(false);
    onLoadingChange(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {errors.general && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
          <Icon name="AlertCircle" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{errors.general}</p>
        </div>
      )}

      <Input
        type="email"
        label="Email Address"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        error={errors.email}
        required
        disabled={isLoading}
        autoComplete="email"
        className="w-full"
      />

      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={errors.password}
          required
          disabled={isLoading}
          autoComplete="current-password"
          className="w-full"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors duration-150"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          disabled={isLoading}
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          checked={formData.rememberMe}
          onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
          disabled={isLoading}
        />
        <button
          type="button"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-150"
          disabled={isLoading}
        >
          Forgot Password?
        </button>
      </div>

      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        iconName="LogIn"
        iconPosition="right"
      >
        Sign In
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/event-registration')}
            className="font-medium text-primary hover:text-primary/80 transition-colors duration-150"
            disabled={isLoading}
          >
            Create Account
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;