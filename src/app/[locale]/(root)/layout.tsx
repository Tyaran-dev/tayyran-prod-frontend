'use client'
import React from 'react'
import Navbar from '../../components/shared/navbar'
import Footer from '../../components/shared/footer/Footer';
import { FloatingChatButton } from '@/app/components/shared/floating-chat/FloatingChatButton';
const Layout = ({ children }: { children: React.ReactNode; }) => {
    return (
        <div>
            {children}
        </div>
    )
}

export default Layout
