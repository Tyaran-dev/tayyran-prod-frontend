'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import {
  FaPlane,
  FaKey,
  FaArrowRight,
  FaSync,
  FaSignInAlt
} from 'react-icons/fa';
import { useTranslations, useLocale } from 'next-intl';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import logo from "/public/assets/icons/logo.svg";
/* ---------------- Schema ---------------- */
const verifyCodeSchema = (t: (key: string) => string) =>
  z.object({
    code: z.string().min(6, t('codeError')),
  });

type VerifyCodeFormData = z.infer<ReturnType<typeof verifyCodeSchema>>;

function VerifyCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const t = useTranslations('verifyCode');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [apiError, setApiError] = useState('');

  const schema = verifyCodeSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyCodeFormData>({
    resolver: zodResolver(schema),
  });

  /* ---------------- Guard ---------------- */
  useEffect(() => {
    if (!email) {
      toast.error(t('emailRequired'));
      router.push('/auth/forgot-password');
    }
  }, [email, router, t]);

  /* ---------------- Verify Code ---------------- */
  const onSubmit = async (data: VerifyCodeFormData) => {
    setIsLoading(true);
    setApiError('');

    const loadingToast = toast.loading(t('verifying'));

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await axios.post(
        `${baseUrl}/auth/verifyResetCode`,
        { resetCode: data.code },
        {
          validateStatus: (status) => status >= 200 && status < 500,
        }
      );

      toast.dismiss(loadingToast);

      if (response.data.status === 'Success') {
        toast.success(t('codeVerified'));

        setTimeout(() => {
          router.push(
            `/reset-password?email=${encodeURIComponent(
              email!
            )}&code=${encodeURIComponent(data.code)}`
          );
        }, 1500);
      } else {
        const message = response.data?.message || t('invalidCode');
        setApiError(message);
        toast.error(message);
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);

      const message = error.request
        ? t('networkError')
        : t('unexpectedError');

      setApiError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- Resend Code ---------------- */
  const handleResendCode = async () => {
    setIsResending(true);
    setApiError('');

    const loadingToast = toast.loading(t('resending'));

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await axios.post(
        `${baseUrl}/auth/forgotPassword`,
        { email },
        {
          validateStatus: (status) => status >= 200 && status < 500,
        }
      );

      toast.dismiss(loadingToast);

      if (response.data.status === 'Success') {
        toast.success(t('codeResent'));
      } else {
        const message = response.data?.message || t('resendFailed');
        setApiError(message);
        toast.error(message);
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);

      const message = error.request
        ? t('networkError')
        : t('resendFailed');

      setApiError(message);
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      <div className="relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="relative z-10 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-4">
                <Image src={logo} alt="Logo" width={86} height={86} />
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">
                {t('pageTitle')}
              </h2>
              <p className="text-slate-600">{t('subtitle')}</p>
              <p className="text-emerald-600 font-semibold mt-1">{email}</p>
            </div>

            {/* Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8">

              {apiError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    {t('resetCode')}
                  </label>
                  <div className="relative">
                    <FaKey
                      className={`absolute ${isRTL ? 'right-3' : 'left-3'
                        } top-1/2 -translate-y-1/2 text-slate-400`}
                    />
                    <input
                      {...register('code')}
                      className={`w-full ${isRTL ? 'pr-10' : 'pl-10'
                        } h-12 bg-slate-50 border rounded-xl`}
                      placeholder={t('codePlaceholder')}
                    />
                  </div>
                  {errors.code && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.code.message}
                    </p>
                  )}
                </div>

                <button
                  disabled={isLoading}
                  className="w-full h-12 bg-greenGradient text-white rounded-xl flex items-center justify-center gap-2"
                >
                  {isLoading ? t('verifying') : t('verifyButton')}
                  <FaArrowRight className={isRTL ? 'rotate-180' : ''} />
                </button>
              </form>

              <button
                onClick={handleResendCode}
                disabled={isResending}
                className="w-full mt-4 h-12 bg-slate-100 rounded-xl flex items-center justify-center gap-2"
              >
                <FaSync />
                {isResending ? t('resending') : t('resendButton')}
              </button>

              <div className="text-center mt-6">
                <Link href="/auth/login" className="text-emerald-600 font-semibold">
                  <FaSignInAlt className="inline mr-1" />
                  {t('login')}
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- Suspense Wrapper ---------------- */
export default function VerifyCodePage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyCodeContent />
    </Suspense>
  );
}
