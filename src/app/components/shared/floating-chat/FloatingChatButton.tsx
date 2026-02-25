'use client';

import { useState } from 'react';
import { useAuthContext } from "@/context/AuthContext";
import { ChatWindow } from './ChatWindow';
import { Bot } from 'lucide-react';

export function FloatingChatButton() {
    const [chatOpen, setChatOpen] = useState(false);
    const { user, logout } = useAuthContext();

    const handleClick = () => {
        setChatOpen(!chatOpen);
    };

    // You might not have a loading state in your auth context
    // If you don't, you can remove this check or adjust accordingly
    // if (loading) return null;

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
                {chatOpen && <ChatWindow onClose={() => setChatOpen(false)} />}

                {!chatOpen && (
                    <button
                        onClick={handleClick}
                        className="group relative bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, #2d3561 0%, #1e2341 100%)',
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative flex flex-col items-center gap-3">
                            <div className="bg-white rounded-full p-4 shadow-lg">
                                <Bot className="w-8 h-8 text-emerald-600" strokeWidth={2.5} />
                            </div>

                            <div className="bg-emerald-600 rounded-lg px-4 py-2 shadow-md">
                                <span className="text-white font-medium text-sm whitespace-nowrap">
                                    Tayyaran Assistant
                                </span>
                            </div>
                        </div>

                        {!user && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                                !
                            </div>
                        )}
                    </button>
                )}

            </div>

        </>
    );
}