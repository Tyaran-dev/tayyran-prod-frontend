"use client";
import "./globals.css";
import AnimationProvider from "../components/provider/animation-provider";
import StoreProvider from '../components/provider/store-provider'
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { AuthProvider } from "@/context/AuthContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <StoreProvider>
                <AnimationProvider>
                    <NextIntlClientProvider>
                        {children}
                    </NextIntlClientProvider>
                </AnimationProvider>
            </StoreProvider>
        </AuthProvider>
    );
}
