"use client";

import { useEffect, useRef } from "react";

interface EnhancedIntroProps {
    onComplete: () => void;
}

export default function EnhancedIntro({ onComplete }: EnhancedIntroProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        
        const handleEnd = () => {
            onComplete();
        };

        const handleError = () => {
            onComplete();
        };

        if (video) {
            video.addEventListener('ended', handleEnd);
            video.addEventListener('error', handleError);
            video.play().catch(() => {});
        }

        const timer = setTimeout(() => {
            onComplete();
        }, 8000);

        return () => {
            if (video) {
                video.removeEventListener('ended', handleEnd);
                video.removeEventListener('error', handleError);
            }
            clearTimeout(timer);
        };
    }, [onComplete]);

    const skipIntro = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
        onComplete();
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black">
            {/* Video Container */}
            <div className="relative w-full h-full">
                <video
                    ref={videoRef}
                    src="/assets/video/intro-video.mp4"
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover md:object-contain lg:object-cover"
                />
                
                {/* Responsive Overlay */}
                <div className="absolute inset-0">
                    {/* Skip Button */}
                    <button
                        onClick={skipIntro}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-30 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/40 backdrop-blur-sm text-white text-xs sm:text-sm md:text-base rounded-full border border-white/20 hover:bg-black/60 transition-all duration-300"
                    >
                        Skip Intro
                    </button>

                    {/* Gradient for better text visibility on mobile */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden" />
                </div>
            </div>
        </div>
    );
}