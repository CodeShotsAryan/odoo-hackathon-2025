import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Key, RefreshCw } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { apiMock } from '../../services/mockApi';
import { ToastType } from '../../types';

enum Step {
  EMAIL = 1,
  OTP = 2,
  RESET = 3
}

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [step, setStep] = useState<Step>(Step.EMAIL);
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [timer, setTimer] = useState(30);

  // Timer for OTP
  useEffect(() => {
    let interval: any;
    if (step === Step.OTP && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiMock.requestPasswordReset(email);
      setStep(Step.OTP);
      setTimer(30);
      addToast('OTP sent to your email', ToastType.SUCCESS);
    } catch (error) {
      addToast('Failed to send OTP', ToastType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiMock.verifyOtp(otp);
      setStep(Step.RESET);
      addToast('OTP Verified', ToastType.SUCCESS);
    } catch (error) {
      addToast('Invalid OTP. Try 123456', ToastType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiMock.resetPassword();
      addToast('Password reset successfully', ToastType.SUCCESS);
      navigate('/login');
    } catch (error) {
      addToast('Failed to reset password', ToastType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case Step.EMAIL:
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-6 animate-fade-in">
             <div className="text-center mb-6">
              <div className="w-12 h-12 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-500">
                <Key size={24} />
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">No worries, we'll send you reset instructions.</p>
            </div>
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Send Instructions
            </Button>
          </form>
        );

      case Step.OTP:
        return (
          <form onSubmit={handleOtpSubmit} className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Enter OTP</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">We sent a code to {email}</p>
            </div>
            <Input
              label="6-Digit Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="text-center tracking-widest font-mono text-lg"
              required
              autoFocus
            />
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Verify Code
            </Button>
            <div className="text-center text-sm">
              {timer > 0 ? (
                <span className="text-gray-500">Resend code in 00:{timer.toString().padStart(2, '0')}</span>
              ) : (
                <button type="button" onClick={() => setTimer(30)} className="text-brand-500 hover:underline">
                  Resend Code
                </button>
              )}
            </div>
          </form>
        );

      case Step.RESET:
        return (
          <form onSubmit={handleResetSubmit} className="space-y-6 animate-fade-in">
             <div className="text-center mb-6">
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Set New Password</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Must be at least 8 characters.</p>
            </div>
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoFocus
            />
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Reset Password
            </Button>
          </form>
        );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-border relative">
        <Link to="/login" className="absolute top-8 left-8 text-gray-400 hover:text-brand-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        
        <div className="mt-6">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;