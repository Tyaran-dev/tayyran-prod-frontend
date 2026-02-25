'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, LogOut } from 'lucide-react';
import { useAuthContext } from "@/context/AuthContext";

type ChatWindowProps = {
    onClose: () => void;
};

export function ChatWindow({ onClose }: ChatWindowProps) {
    const { user, logout } = useAuthContext();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    //   useEffect(() => {
    //     if (user) {
    //       loadMessages();
    //     }
    //   }, [user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };



    const generateBotResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return 'Hello! How can I assist you today?';
        } else if (lowerMessage.includes('help')) {
            return 'I\'m here to help! You can ask me questions about our services, features, or anything else you need assistance with.';
        } else if (lowerMessage.includes('thank')) {
            return 'You\'re welcome! Is there anything else I can help you with?';
        } else {
            return 'Thank you for your message. I\'m Tayyaran Assistant, and I\'m here to help you. How can I assist you today?';
        }
    };



    return (
        <div className="w-96 h-[500px] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                <h3 className="font-semibold text-lg">Tayyaran Assistant</h3>
                <div className="flex items-center gap-2">

                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-emerald-800 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="flex h-full flex-col justify-between ">
                {/* Messages Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
                >
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                            {!user && (
                                <p>
                                    please login first to use ai chat
                                </p>
                            )}
                            {user && (
                                <p>
                                    Start a conversation with Tayyaran Assistant
                                </p>
                            )}
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.is_bot ? 'justify-start' : 'justify-end'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.is_bot
                                    ? 'bg-white text-gray-800 border border-gray-200'
                                    : 'bg-emerald-600 text-white'
                                    }`}
                            >
                                <p className="text-sm break-words">{msg.message}</p>
                                <span className={`text-xs mt-1 block ${msg.is_bot ? 'text-gray-400' : 'text-emerald-100'
                                    }`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <form className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            disabled={loading || !user}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <button
                            type="submit"
                            disabled={loading || !newMessage.trim()}
                            className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            aria-label="Send message"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>

            </div>


        </div>
    );
}