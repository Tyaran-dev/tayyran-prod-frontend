'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  FaPlane,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaExclamationCircle,
  FaCheckCircle
} from 'react-icons/fa';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthContext } from "@/context/AuthContext";
import { getUserData } from '@/utils/auth';
import Image from 'next/image';
import logo from "/public/assets/icons/logo.svg";

// Define schema for form validation
const createLoginSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t('formErrors.invalidEmail')),
  password: z.string().min(6, t('formErrors.passwordMin')),
});

type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('Login');
  const { setUser } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = createLoginSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Custom toast functions
  const showSuccessToast = (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-center',
      icon: <FaCheckCircle className="text-green-500" />,
      style: {
        background: '#f0fdf4',
        color: '#166534',
        border: '1px solid #bbf7d0',
      },
    });
  };

  const showErrorToast = (message: string) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-center',
      icon: <FaExclamationCircle className="text-red-500" />,
      style: {
        background: '#fef2f2',
        color: '#991b1b',
        border: '1px solid #fecaca',
      },
    });
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    const loginPromise = toast.promise(
      async () => {
        const loginData = {
          email: data.email,
          password: data.password,
        };

        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await axios.post(
          `${baseUrl}/auth/login`,
          loginData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        return response.data;
      },

      {
        loading: t('form.loggingIn'),
        success: async (data) => {
          // Save the access token
          localStorage.setItem("accessToken", data.accessToken);

          console.log(data, "data object")

          // Save raw user if returned
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
          // 🔍 Check verification status
          // (adjust key if backend uses emailVerified instead)
          if (!data.emailVerified) {
            // Clear auth
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");

            // Redirect to verify page
            setTimeout(() => {
              router.push(
                `/verify-account?email=${encodeURIComponent(data.email)}`
              );
            }, 500);

            // Show toast message
            return t('formErrors.accountNotVerified') || 'Please verify your email first';
          }

          // ✅ Fetch full user (verified)
          const userData = await getUserData();

          // Update context
          setUser(userData);

          // Normal redirect
          setTimeout(() => {
            router.push('/');
          }, 1000);

          return t('form.loginSuccess') || 'Login successful!';
        }
        ,
        error: (err) => {
          let errorMessage = t('form.loginFailed') || 'Login failed';

          if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.response?.status === 401) {
            errorMessage = t('formErrors.invalidCredentials') || 'Invalid email or password';
          } else if (err.response?.status === 403) {
            errorMessage = t('formErrors.accountNotVerified') || 'Please verify your email first';
          } else if (err.response?.status === 429) {
            errorMessage = t('formErrors.tooManyAttempts') || 'Too many login attempts. Please try again later.';
          } else if (err.request) {
            errorMessage = t('formErrors.noConnection') || 'No connection to server. Please check your internet.';
          } else if (err.message) {
            errorMessage = err.message;
          }

          return errorMessage;
        },
      },
      {
        style: {
          minWidth: '300px',
        },
      }
    );

    try {
      await loginPromise;
    } catch (error) {
      // Error is already handled by toast.promise
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key for form submission
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="relative overflow-hidden ">
      {/* Toast Container */}
      <Toaster
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'inherit',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          },
        }}
      />



      <div className="relative z-10 flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-4">
              <Image src={logo} alt="Logo" width={86} height={86} />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">
              {t('title')}
            </h2>
            <p className="text-slate-600 text-lg">
              {t('subtitle')}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-slide-up">
            <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  {t('form.email')}
                </label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-emerald-600 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    placeholder={t('form.emailPlaceholder')}
                    className="w-full pl-10 h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all hover:border-emerald-300"
                    {...register('email')}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 animate-in slide-in-from-top-1 flex items-center gap-1">
                    <FaExclamationCircle className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    {t('form.password')}
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                  >
                    {t('form.forgotPassword')}
                  </Link>
                </div>
                <div className="relative group">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-emerald-600 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all hover:border-emerald-300"
                    {...register('password')}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors p-1"
                    disabled={isLoading}
                  >
                    {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1 animate-in slide-in-from-top-1 flex items-center gap-1">
                    <FaExclamationCircle className="w-3 h-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-12 bg-greenGradient text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    {t('form.loggingIn')}
                  </>
                ) : (
                  <>
                    {t('form.login')}
                    <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Remember Me Checkbox (Optional) */}
              {/* <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                  {t('form.rememberMe') || 'Remember me'}
                </label>
              </div> */}
            </form>

            {/* Signup Link */}
            <div className="mt-6 text-center pt-6 border-t border-slate-200">
              <p className="text-slate-600">
                {t('form.noAccount')}{' '}
                <Link
                  href="/signup"
                  className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors inline-flex items-center gap-1"
                >
                  {t('form.signup')}
                  <FaArrowRight className="w-3 h-3 transform rotate-180" />
                </Link>
              </p>
            </div>

            {/* Social Login (Optional) */}
            {/* <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">
                    {t('form.orContinueWith') || 'Or continue with'}
                  </span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                  disabled={isLoading}
                >
                  Google
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                  disabled={isLoading}
                >
                  GitHub
                </button>
              </div>
            </div> */}
          </div>

          {/* Terms & Privacy (Optional) */}
          {/* <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              {t('form.termsPrefix') || 'By continuing, you agree to our'}{' '}
              <Link href="/terms" className="text-emerald-600 hover:text-emerald-700">
                {t('form.terms') || 'Terms'}
              </Link>{' '}
              {t('form.and') || 'and'}{' '}
              <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700">
                {t('form.privacy') || 'Privacy Policy'}
              </Link>
            </p>
          </div> */}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}