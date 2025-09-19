import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Mail,
  RefreshCw
} from 'lucide-react';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const email = location.state?.email || 'user@example.com';

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      setLoading(false);
      return;
    }

    try {
      const email = (location.state?.email as string) || 'youremail@example.com';
      const { apiEndpoints } = await import('../../lib/api');
      await apiEndpoints.verifyOTP(email, otpString);
      setSuccess('Email verified successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const email = (location.state?.email as string) || 'user@example.com';
      const { apiEndpoints } = await import('../../lib/api');
      await apiEndpoints.sendOTP(email);
      setTimeLeft(60);
      setError('');
      setSuccess('Verification code sent to your email');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2000ms' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/auth/register')}
          className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Registration</span>
        </button>

        {/* Verification Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Oryntal AI</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
            <p className="text-gray-300">We've sent a 6-digit code to</p>
            <p className="text-purple-400 font-semibold">{email}</p>
          </div>

          {/* Demo Code */}
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="text-blue-300 text-sm">
              <strong>Demo Code:</strong> 123456
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-300">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-300">{success}</span>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input Fields */}
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-2xl font-bold bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            <p className="text-gray-300 mb-4">
              Didn't receive the code?
            </p>
            {timeLeft > 0 ? (
              <p className="text-sm text-gray-400">
                Resend code in {timeLeft}s
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors disabled:opacity-50 flex items-center space-x-2 mx-auto"
              >
                {resendLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    <span>Resend Code</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;