'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {
  FaPlane,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaKey
} from 'react-icons/fa';

// Define schema for form validation
const createResetPasswordSchema = (t: (key: string) => string) => z.object({
  password: z.string().min(6, t('formErrors.passwordMin')),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: t('formErrors.passwordMismatch'),
  path: ['confirm_password'],
});




type ResetPasswordFormData = z.infer<ReturnType<typeof createResetPasswordSchema>>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const t = useTranslations('ResetPassword');

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetPasswordSchema = createResetPasswordSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!email) {
      toast.error(t('emailRequired'), {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#fee2e2',
          color: '#991b1b',
          padding: '16px',
          borderRadius: '12px',
          fontWeight: '500',
          border: '2px solid #ef4444',
        },
      });
      router.push('forgot-password');
    }
  }, [email, router, t]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      const resetData = {
        email: email,
        newPassword: data.password,
      };

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // Show loading toast
      const loadingToastId = toast.loading(t('form.resettingPassword'), {
        style: {
          background: '#f0f9ff',
          color: '#0369a1',
          padding: '16px',
          borderRadius: '12px',
          fontWeight: '500',
        }
      });

      // Make the API call
      const response = await axios.post(`${baseUrl}/auth/resetPaassword`, resetData, {
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        }
      });

      console.log('API Response:', response); // Debug log

      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      // Check the response status and data
      if (response.data.status === 'Success' || response.status === 200) {
        // Show success toast
        toast.success(t('successMessage'), {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#d1fae5',
            color: '#065f46',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: '500',
            border: '2px solid #10b981',
          },
          icon: '✅',
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
        });

        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else if (response.data.status === 'fail') {
        // Server returned fail status
        const errorMessage = response.data?.message || t('invalidCodeMessage');
        
        // Show error toast
        toast.error(errorMessage, {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#fee2e2',
            color: '#991b1b',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: '500',
            border: '2px solid #ef4444',
          },
          icon: '❌',
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        });
      } else {
        // Handle other cases
        const errorMessage = response.data?.message || t('errorMessage');
        
        toast.error(errorMessage, {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#fee2e2',
            color: '#991b1b',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: '500',
            border: '2px solid #ef4444',
          },
        });
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      // Dismiss any existing loading toast
      toast.dismiss();
      
      // Handle network errors
      if (error.request) {
        // The request was made but no response was received
        toast.error(t('networkError'), {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#fef3c7',
            color: '#92400e',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: '500',
            border: '2px solid #f59e0b',
          },
          icon: '⚠️',
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error(t('errorMessage'), {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#fee2e2',
            color: '#991b1b',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: '500',
            border: '2px solid #ef4444',
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      
      <div className=" relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-[size:30px_30px]" />

        <div className="relative z-10  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-greenGradient shadow-lg mb-4 transform hover:scale-105 transition-transform duration-300">
                <FaPlane className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">
                {t('title')}
              </h2>
              <p className="text-slate-600 text-lg mb-1">
                {t('subtitle')}
              </p>
              <p className="text-emerald-600 font-semibold text-lg">
                {email}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    {t('form.newPassword')}
                  </label>
                  <div className="relative group">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-emerald-600 pointer-events-none" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      {...register('password')}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1 animate-in slide-in-from-top-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirm_password" className="block text-sm font-medium text-slate-700">
                    {t('form.confirmPassword')}
                  </label>
                  <div className="relative group">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-emerald-600 pointer-events-none" />
                    <input
                      id="confirm_password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      {...register('confirm_password')}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-xs text-red-500 mt-1 animate-in slide-in-from-top-1">{errors.confirm_password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-greenGradient text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('form.resettingPassword')}
                    </span>
                  ) : (
                    <>
                      {t('form.resetPassword')}
                      <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-600">
                  {t('form.rememberPassword')}{' '}
                  <Link
                    href="/auth/login"
                    className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                  >
                    {t('form.login')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  const t = useTranslations('ResetPassword');
  
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent" />
        <span className="ml-3 text-slate-600">{t('loading')}</span>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}