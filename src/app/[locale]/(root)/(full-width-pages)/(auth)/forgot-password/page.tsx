'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
    FaPlane,
    FaEnvelope,
    FaArrowRight,
    FaArrowLeft
} from 'react-icons/fa';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import logo from "/public/assets/icons/logo.svg";

// Define schema for form validation
const createForgotPasswordSchema = (t: (key: string) => string) => z.object({
    email: z.string().email(t('formErrors.invalidEmail')),
});

type ForgotPasswordFormData = z.infer<ReturnType<typeof createForgotPasswordSchema>>;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const t = useTranslations('ForgotPassword');
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string>('');
    const searchParams = useSearchParams();

    const forgotPasswordSchema = createForgotPasswordSchema(t);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        setApiError('');

        try {
            const resetData = {
                email: data.email,
            };

            const baseUrl = process.env.NEXT_PUBLIC_API_URL;

            // Show loading toast
            const loadingToastId = toast.loading(t('form.sending'), {
                style: {
                    background: '#f0f9ff',
                    color: '#0369a1',
                    padding: '16px',
                    borderRadius: '12px',
                    fontWeight: '500',
                }
            });

            // Make the API call
            const response = await axios.post(`${baseUrl}/auth/forgotPassword`, resetData, {
                // Don't throw error for non-2xx status codes
                validateStatus: function (status) {
                    return status >= 200 && status < 500; // Accept 2xx and 4xx responses
                }
            });

            // Dismiss loading toast
            toast.dismiss(loadingToastId);

            // Check the response status and data
            if (response.data.status === 'Success') {
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
                    router.push(`/verify-resetcode?email=${data.email}`);
                }, 2000);
            } else if (response.data.status === 'fail') {
                // Server returned fail status
                const errorMessage = response.data?.message || t('errorMessage');
                setApiError(errorMessage);

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
                setApiError(errorMessage);

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
            console.error('Forgot password error:', error);

            // Dismiss any existing loading toast
            toast.dismiss();

            // Handle network errors
            if (error.request) {
                // The request was made but no response was received
                const errorMsg = t('networkError');
                setApiError(errorMsg);

                toast.error(errorMsg, {
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
                const errorMsg = t('errorMessage');
                setApiError(errorMsg);

                toast.error(errorMsg, {
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

            <div className=" relative overflow-hidden ">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-[size:30px_30px]" />

                <div className="relative z-10  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-8">
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

                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                            {apiError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    {apiError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                                            className="w-full pl-10 h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                            {...register('email')}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs text-red-500 mt-1 animate-in slide-in-from-top-1">{errors.email.message}</p>
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
                                            {t('form.sending')}
                                        </span>
                                    ) : (
                                        <>
                                            {t('form.sendResetLink')}
                                            <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium transition-colors group"
                                >
                                    <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    {t('form.backToLogin')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}