'use client';

import { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
    FaShieldAlt,
    FaArrowRight,
    FaRedo,
    FaExclamationCircle,
    FaCheckCircle,
    FaClock
} from 'react-icons/fa';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthContext } from "@/context/AuthContext";
import { getUserData } from '@/utils/auth';
import Image from 'next/image';
import logo from "/public/assets/icons/logo.svg";

function VerifyOTPContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const t = useTranslations('VerifyOTP');
    const { setUser } = useAuthContext();

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [resendDisabled, setResendDisabled] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

    const showInfoToast = (message: string) => {
        toast(message, {
            duration: 3000,
            position: 'top-center',
            icon: 'ℹ️',
            style: {
                background: '#eff6ff',
                color: '#1e40af',
                border: '1px solid #dbeafe',
            },
        });
    };

    // Timer countdown effect
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(interval);
                        setResendDisabled(false);
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [resendTimer]);

    // Format timer to MM:SS
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Start the 10-minute timer
    const startResendTimer = useCallback((minutes: number = 10) => {
        const seconds = minutes * 60;
        setResendTimer(seconds);
        setResendDisabled(true);
    }, []);

    // Check localStorage for existing timer on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedTimer = localStorage.getItem(`resendTimer_${email}`);
            const savedTimestamp = localStorage.getItem(`resendTimestamp_${email}`);

            if (savedTimer && savedTimestamp) {
                const elapsed = Math.floor((Date.now() - parseInt(savedTimestamp)) / 1000);
                const remaining = parseInt(savedTimer) - elapsed;

                if (remaining > 0) {
                    setResendTimer(remaining);
                    setResendDisabled(true);
                } else {
                    // Clear expired timers
                    localStorage.removeItem(`resendTimer_${email}`);
                    localStorage.removeItem(`resendTimestamp_${email}`);
                }
            }
        }
    }, [email]);

    // Save timer to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined' && email && resendTimer > 0) {
            localStorage.setItem(`resendTimer_${email}`, resendTimer.toString());
            localStorage.setItem(`resendTimestamp_${email}`, Date.now().toString());
        }
    }, [resendTimer, email]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.slice(0, 1);
        }

        if (!/^\d*$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpValue = otp.join('');

        if (otpValue.length !== 6) {
            showErrorToast(t('invalidOtp'));
            return;
        }

        setIsLoading(true);
        const verifyPromise = toast.promise(
            async () => {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await axios.post(
                    `${baseUrl}/auth/verifyEmail`,
                    { "verifyCode": otpValue },
                    {
                        headers: { 'Content-Type': 'application/json' },
                    }
                );

                return response.data;
            },
            {
                loading: t('verifying'),
                success: async (data) => {
                    // Save the access token to localStorage
                    localStorage.setItem("accessToken", data.accessToken);
                    // Clear timer from localStorage on successful verification
                    if (typeof window !== 'undefined' && email) {
                        localStorage.removeItem(`resendTimer_${email}`);
                        localStorage.removeItem(`resendTimestamp_${email}`);
                    };


                    // Fetch user immediately
                    const userData = await getUserData();

                    // 🔥 Update context
                    setUser(userData);

                    router.push('/');
                    return t('successMessage');
                },
                error: (err) => {
                    let errorMessage = t('errorMessage');

                    if (err.response?.data?.message) {
                        errorMessage = err.response.data.message;
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
            await verifyPromise;
        } catch (error) {
            // Error is already handled by toast.promise
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!email) {
            showErrorToast('Email is required');
            return;
        }

        if (resendDisabled) {
            showInfoToast(`Please wait ${formatTime(resendTimer)} before requesting a new code`);
            return;
        }

        setIsResending(true);

        const resendId = toast.loading(t('resending'), {
            duration: 10000,
            position: 'top-center',
        });

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;

            const reSendResponse = await axios.post(
                `${baseUrl}/auth/reSendVerificationCode`,
                { email: email }
            );

            // Success - start the timer
            startResendTimer(10);

            toast.success(t('resendSuccess'), {
                id: resendId,
                duration: 4000,
                position: 'top-center',
                icon: '✅',
            });

            // Clear OTP fields and focus on first input
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();

            // Show timer info
            toast.success(`New code sent! You can request another in 10:00`, {
                duration: 5000,
                position: 'top-center',
                icon: <FaClock className="text-blue-500" />,
                style: {
                    background: '#eff6ff',
                    color: '#1e40af',
                    border: '1px solid #dbeafe',
                },
            });

        } catch (error: any) {
            // Extract error message
            let errorMessage = t('resendFailed');

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;

                // Extract remaining time from backend error message if available
                const match = errorMessage.match(/(\d+)\s+minute/);
                if (match && match[1]) {
                    const minutes = parseInt(match[1]);
                    startResendTimer(minutes);
                }
            } else if (error.request) {
                errorMessage = 'No response from server. Please try again.';
            } else {
                errorMessage = error.message;
            }

            // Show error toast with specific styling for 429
            if (error.response?.status === 429) {
                toast.error(errorMessage, {
                    id: resendId,
                    duration: 6000,
                    position: 'top-center',
                    icon: '⏱️',
                    style: {
                        background: '#fffbeb',
                        color: '#92400e',
                        border: '1px solid #fde68a',
                    },
                });
            } else {
                toast.error(errorMessage, {
                    id: resendId,
                    duration: 5000,
                    position: 'top-center',
                });
            }

            console.error('Resend OTP Error:', error);

        } finally {
            setIsResending(false);
        }
    };

    // Auto-focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Auto-submit when all OTP digits are filled
    useEffect(() => {
        const otpValue = otp.join('');
        if (otpValue.length === 6 && !isLoading) {
            handleVerify();
        }
    }, [otp]);

    return (
        <div dir="ltr" className="relative overflow-hidden min-h-screen">
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

            <div className="absolute inset-0" />
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-[size:30px_30px]" />

            <div className="relative z-10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-4">
                            <Image src={logo} alt="Logo" width={86} height={86} />
                        </div>
                        <h2 className="text-4xl font-bold text-slate-900 mb-2">
                            {t('title')}
                        </h2>
                        <p className="text-slate-600 text-lg mb-1">
                            {t('instruction')}
                        </p>
                        <p className="text-emerald-600 font-semibold text-lg bg-emerald-50 px-4 py-2 rounded-lg inline-block mt-2">
                            {email}
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-slide-up">
                        <div className="space-y-6">
                            <div className="flex justify-center gap-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={(e) => {
                                            e.preventDefault();
                                            const pasteData = e.clipboardData.getData('text').slice(0, 6);
                                            if (/^\d+$/.test(pasteData)) {
                                                const newOtp = [...otp];
                                                pasteData.split('').forEach((char, idx) => {
                                                    if (idx < 6) newOtp[idx] = char;
                                                });
                                                setOtp(newOtp);
                                                inputRefs.current[Math.min(pasteData.length, 5)]?.focus();
                                            }
                                        }}
                                        className="w-12 h-14 text-center text-xl font-semibold border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-slate-50 hover:border-emerald-300"
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleVerify}
                                className="w-full h-12 bg-greenGradient text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                                disabled={isLoading || otp.join('').length !== 6}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                        {t('verifying')}
                                    </>
                                ) : (
                                    <>
                                        {t('verifyButton')}
                                        <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="text-center space-y-3 pt-4 border-t border-slate-200">
                                <p className="text-sm text-slate-600">
                                    {t('noCodeReceived')}
                                </p>

                                <div className="flex flex-col items-center gap-3">
                                    <button
                                        onClick={handleResendOTP}
                                        disabled={isLoading || isResending || resendDisabled}
                                        className={`font-semibold px-6 py-3 rounded-xl transition-all duration-300 inline-flex items-center gap-2 group min-w-[180px] justify-center
                                            ${resendDisabled
                                                ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 hover:shadow-md'
                                            }
                                            ${isResending ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        {isResending ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-600 border-t-transparent" />
                                                <span>{t('resending')}</span>
                                            </>
                                        ) : resendDisabled ? (
                                            <>
                                                <FaClock className="w-4 h-4 text-slate-500" />
                                                <span className="font-mono">{formatTime(resendTimer)}</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaRedo className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                                <span>{t('resendButton')}</span>
                                            </>
                                        )}
                                    </button>

                                    {resendDisabled ? (
                                        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-4 py-2 rounded-lg">
                                            <FaClock className="w-3 h-3" />
                                            <span>{t('resendIn')} {formatTime(resendTimer)}</span>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-500">
                                            {t('codeExpiresIn', { minutes: 10 })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timer progress bar */}
                    {/* {resendTimer > 0 && (
                        <div className="mt-6 bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <FaClock className="w-4 h-4 text-emerald-600" />
                                    <span className="text-sm font-medium text-slate-700">Next resend available in:</span>
                                </div>
                                <span className="font-mono font-bold text-lg text-emerald-700">
                                    {formatTime(resendTimer)}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-1000"
                                    style={{ 
                                        width: `${((10 * 60 - resendTimer) / (10 * 60)) * 100}%` 
                                    }}
                                />
                            </div>
                 
                        </div>
                    )} */}
                </div>
            </div>

            {/* Add some CSS animations */}
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
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
                
                .animate-slide-up {
                    animation: slide-up 0.5s ease-out;
                }
                
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
}

export default function VerifyOTPPage() {
    const t = useTranslations('VerifyOTP');

    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent" />
                <span className="ml-3 text-slate-600">{t('loading')}</span>
            </div>
        }>
            <VerifyOTPContent />
        </Suspense>
    );
}