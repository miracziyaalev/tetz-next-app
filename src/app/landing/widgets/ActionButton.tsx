"use client";
import React from "react";

interface ActionButtonProps {
    isLoading: boolean;
    onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
    isLoading,
    onClick
}) => {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className="group bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-lg md:text-xl px-12 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
        >
            {isLoading ? (
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Yükleniyor...</span>
                </div>
            ) : (
                <>
                    <svg
                        className="w-6 h-6 transform transition-transform group-hover:scale-110"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                        />
                    </svg>
                    <span>Yaka Kartı Oluştur</span>
                </>
            )}
        </button>
    );
};

export default ActionButton; 