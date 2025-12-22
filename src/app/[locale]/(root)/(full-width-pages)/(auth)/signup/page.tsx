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
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaExclamationCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthContext } from "@/context/AuthContext";
import { getUserData } from '@/utils/auth';
import Image from 'next/image';
import logo from "/public/assets/icons/logo.svg";

/* =======================
   Validation Schema
======================= */
const createSignUpSchema = (t: (key: string) => string) =>
  z
    .object({
      first_name: z.string().min(2, t('formErrors.firstNameMin')),
      last_name: z.string().min(2, t('formErrors.lastNameMin')),
      email: z.string().email(t('formErrors.invalidEmail')),
      password: z.string().min(6, t('formErrors.passwordMin')),
      confirm_password: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: t('formErrors.passwordMismatch'),
      path: ['confirm_password'],
    });

type SignUpFormData = z.infer<ReturnType<typeof createSignUpSchema>>;

export default function SignUpPage() {
  const router = useRouter();
  const t = useTranslations('SignUp');
  const { setUser } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signUpSchema = createSignUpSchema(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  /* =======================
     Submit Handler
  ======================= */
  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);

    const registerPromise = toast.promise(
      async () => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await axios.post(
          `${baseUrl}/auth/register`,
          {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password: data.password,
          },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );

        return response.data;
      },
      {
        loading: t('form.creatingAccount'),
        success: (data) => {
          if (data?.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
          }
          

          setTimeout(() => {
            router.push(
              `/verify-account?email=${encodeURIComponent(data.email)}`
            );
          }, 1000);

          return t('successMessage');
        },
        error: (err) => {
          let errorMessage = t('errorMessage');

          if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.response?.status === 409) {
            errorMessage = t('formErrors.emailAlreadyExists');
          } else if (err.response?.status === 400) {
            errorMessage = t('formErrors.invalidData');
          } else if (err.request) {
            errorMessage = t('formErrors.noConnection');
          } else if (err.message) {
            errorMessage = err.message;
          }

          return errorMessage;
        },
      }
    );

    try {
      await registerPromise;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Toaster
        toastOptions={{
          style: {
            fontFamily: 'inherit',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          },
        }}
      />

      <div className="relative z-10 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-4">
              <Image src={logo} alt="Logo" width={86} height={86} />
            </div>
            <h2 className="text-4xl font-bold text-slate-900">
              {t('title')}
            </h2>
            <p className="text-slate-600">{t('subtitle')}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                {['first_name', 'last_name'].map((field, i) => (
                  <div key={field} className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      {t(`form.${i === 0 ? 'firstName' : 'lastName'}`)}
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        disabled={isLoading}
                        placeholder={t(`form.${i === 0 ? 'firstNamePlaceholder' : 'lastNamePlaceholder'}`)}
                        {...register(field as 'first_name' | 'last_name')}
                        className="w-full pl-10 h-12 bg-slate-50 border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                      />
                    </div>
                    {errors[field as keyof SignUpFormData] && (
                      <p className="text-xs text-red-500">
                        {errors[field as keyof SignUpFormData]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  {t('form.email')}
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    disabled={isLoading}
                    placeholder={t('form.emailPlaceholder')}
                    {...register('email')}
                    className="w-full pl-10 h-12 bg-slate-50 border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  {t('form.password')}
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    disabled={isLoading}
                    placeholder="••••••••"
                    {...register('password')}
                    className="w-full pl-10 pr-12 h-12 bg-slate-50 border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400 placeholder:tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  {t('form.confirmPassword')}
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    disabled={isLoading}
                    placeholder="••••••••"
                    {...register('confirm_password')}
                    className="w-full pl-10 pr-12 h-12 bg-slate-50 border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400 placeholder:tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="text-xs text-red-500">
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>

              <button
                disabled={isLoading}
                className="w-full h-12 bg-greenGradient text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-blue-950 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  t('form.creatingAccount')
                ) : (
                  <>
                    {t('form.createAccount')}
                    <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center mt-6 text-slate-600">
              {t('form.alreadyHaveAccount')}{' '}
              <Link href="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                {t('form.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}