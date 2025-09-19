import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Mail, 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // 1: email input, 2: success message
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStep(2);
      setSuccess('Password reset link sent to your email!');
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <Link 
          to="/auth/login" 
          className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Login</span>
        </Link>

        {/* Forgot Password Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Oryntal AI</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {step === 1 ? 'Forgot Password?' : 'Check Your Email'}
            </h1>
            <p className="text-gray-300">
              {step === 1 
                ? 'Enter your email address and we\'ll send you a link to reset your password'
                : 'We\'ve sent a password reset link to your email address'
              }
            </p>
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

          {step === 1 ? (
            /* Email Input Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
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
                    <span>Sending Reset Link...</span>
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            /* Success State */
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Email Sent!</h3>
                <p className="text-gray-300">
                  We've sent a password reset link to <span className="text-purple-400 font-semibold">{email}</span>
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setStep(1)}
                  className="w-full bg-white/10 text-white py-3 px-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Send to Different Email
                </button>
                
                <Link 
                  to="/auth/login"
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Back to Login</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Help Text */}
          {step === 1 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Remember your password?{' '}
                <Link 
                  to="/auth/login" 
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
