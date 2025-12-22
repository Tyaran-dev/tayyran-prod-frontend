"use client";
import React from "react";

interface ModernLoadingProps {
  message?: string;
  variant?: "spinner" | "dots" | "pulse" | "bars" | "orbit" | "ripple";
}

const ModernLoading: React.FC<ModernLoadingProps> = ({
  message = "Checking authentication...",
  variant = "orbit"
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="text-center space-y-8">
        {/* Loading Animation Container */}
        <div className="relative flex items-center justify-center">
          {variant === "spinner" && <SpinnerLoader />}
          {variant === "dots" && <DotsLoader />}
          {variant === "pulse" && <PulseLoader />}
          {variant === "bars" && <BarsLoader />}
          {variant === "orbit" && <OrbitLoader />}
          {variant === "ripple" && <RippleLoader />}
        </div>

        {/* Message */}
        <div className="space-y-3">
          <p className="text-lg font-semibold text-gray-700 animate-pulse">
            {message}
          </p>

          {/* Animated Dots */}
          <div className="flex items-center justify-center gap-1.5">
            <span
              className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="w-64 mx-auto">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-full animate-progress-infinite" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Gradient Spinner Loader
const SpinnerLoader = () => (
  <div className="relative w-20 h-20">
    <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
    <div className="absolute inset-0 border-4 border-transparent border-t-emerald-600 border-r-emerald-600 rounded-full animate-spin" />
    <div className="absolute inset-3 border-4 border-transparent border-t-teal-500 border-r-teal-500 rounded-full animate-spin-slow" style={{ animationDirection: "reverse" }} />
  </div>
);

// Wave Dots Loader
const DotsLoader = () => (
  <div className="flex items-end gap-2 h-20">
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="w-3 h-12 bg-gradient-to-t from-emerald-600 to-teal-500 rounded-full animate-wave"
        style={{
          animationDelay: `${i * 0.1}s`,
        }}
      />
    ))}
  </div>
);

// Pulse Rings Loader
const PulseLoader = () => (
  <div className="relative w-24 h-24 flex items-center justify-center">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="absolute inset-0 border-4 border-emerald-500 rounded-full animate-ping"
        style={{
          animationDelay: `${i * 0.4}s`,
          opacity: 0.6 - i * 0.2
        }}
      />
    ))}
    <div className="relative w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full" />
  </div>
);

// Scale Bars Loader
const BarsLoader = () => (
  <div className="flex items-center gap-2 h-20">
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        className="w-2 bg-gradient-to-t from-emerald-600 to-teal-500 rounded-full animate-scale-y"
        style={{
          animationDelay: `${i * 0.15}s`,
        }}
      />
    ))}
  </div>
);

// Orbit Loader
const OrbitLoader = () => (
  <div className="relative w-24 h-24">
    {/* Center Circle */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full shadow-lg" />
    </div>

    {/* Orbiting Circles */}
    <div className="absolute inset-0 animate-spin">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-500 rounded-full shadow-md" />
    </div>
    <div className="absolute inset-0 animate-spin" style={{ animationDelay: "0.5s" }}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-teal-500 rounded-full shadow-md" />
    </div>
    <div className="absolute inset-0 animate-spin-slow">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full shadow-md" />
    </div>
    <div className="absolute inset-0 animate-spin-slow" style={{ animationDelay: "0.7s" }}>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-teal-400 rounded-full shadow-md" />
    </div>

    {/* Orbit Ring */}
    <div className="absolute inset-0 border-2 border-dashed border-emerald-300 rounded-full animate-spin-slow" style={{ animationDirection: "reverse" }} />
  </div>
);

// Ripple Loader
const RippleLoader = () => (
  <div className="relative w-24 h-24 flex items-center justify-center">
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        className="absolute inset-0 border-2 border-emerald-500 rounded-full animate-ripple"
        style={{
          animationDelay: `${i * 0.3}s`,
        }}
      />
    ))}
    <div className="relative w-6 h-6 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full shadow-lg animate-pulse" />
  </div>
);

export default ModernLoading;
